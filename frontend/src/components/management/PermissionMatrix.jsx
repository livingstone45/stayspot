import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const PermissionMatrix = ({
  roles = [],
  permissions = [],
  rolePermissions = {},
  onPermissionChange,
  onRoleSelect,
  selectedRoleId = null,
  readOnly = false,
  loading = false,
  showAdvanced = true,
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  
  // Default permissions structure
  const defaultPermissions = [
    // Property Management
    { id: 'property_view', name: 'View Properties', category: 'property', description: 'View property listings and details' },
    { id: 'property_create', name: 'Create Properties', category: 'property', description: 'Add new properties to the system' },
    { id: 'property_edit', name: 'Edit Properties', category: 'property', description: 'Modify existing property information' },
    { id: 'property_delete', name: 'Delete Properties', category: 'property', description: 'Remove properties from the system' },
    { id: 'property_upload', name: 'Bulk Upload Properties', category: 'property', description: 'Upload multiple properties via CSV/Excel' },
    { id: 'property_export', name: 'Export Properties', category: 'property', description: 'Export property data to external formats' },
    
    // Tenant Management
    { id: 'tenant_view', name: 'View Tenants', category: 'tenant', description: 'View tenant information and details' },
    { id: 'tenant_create', name: 'Create Tenants', category: 'tenant', description: 'Add new tenants to properties' },
    { id: 'tenant_edit', name: 'Edit Tenants', category: 'tenant', description: 'Modify tenant information' },
    { id: 'tenant_delete', name: 'Delete Tenants', category: 'tenant', description: 'Remove tenants from properties' },
    { id: 'tenant_screen', name: 'Screen Tenants', category: 'tenant', description: 'Perform background and credit checks' },
    { id: 'tenant_export', name: 'Export Tenant Data', category: 'tenant', description: 'Export tenant information to external formats' },
    
    // Lease Management
    { id: 'lease_view', name: 'View Leases', category: 'lease', description: 'View lease agreements and terms' },
    { id: 'lease_create', name: 'Create Leases', category: 'lease', description: 'Generate new lease agreements' },
    { id: 'lease_edit', name: 'Edit Leases', category: 'lease', description: 'Modify existing lease agreements' },
    { id: 'lease_terminate', name: 'Terminate Leases', category: 'lease', description: 'End lease agreements early' },
    { id: 'lease_renew', name: 'Renew Leases', category: 'lease', description: 'Renew existing lease agreements' },
    
    // Maintenance
    { id: 'maintenance_view', name: 'View Maintenance', category: 'maintenance', description: 'View maintenance requests and work orders' },
    { id: 'maintenance_create', name: 'Create Maintenance', category: 'maintenance', description: 'Submit new maintenance requests' },
    { id: 'maintenance_assign', name: 'Assign Maintenance', category: 'maintenance', description: 'Assign work orders to technicians' },
    { id: 'maintenance_update', name: 'Update Maintenance', category: 'maintenance', description: 'Update status and details of work orders' },
    { id: 'maintenance_approve', name: 'Approve Maintenance', category: 'maintenance', description: 'Approve maintenance costs and work' },
    { id: 'vendor_manage', name: 'Manage Vendors', category: 'maintenance', description: 'Add and manage vendor information' },
    
    // Financial
    { id: 'payment_view', name: 'View Payments', category: 'financial', description: 'View payment history and records' },
    { id: 'payment_create', name: 'Create Payments', category: 'financial', description: 'Record new payments' },
    { id: 'payment_edit', name: 'Edit Payments', category: 'financial', description: 'Modify payment records' },
    { id: 'payment_delete', name: 'Delete Payments', category: 'financial', description: 'Remove payment records' },
    { id: 'invoice_view', name: 'View Invoices', category: 'financial', description: 'View invoices and billing statements' },
    { id: 'invoice_create', name: 'Create Invoices', category: 'financial', description: 'Generate new invoices' },
    { id: 'invoice_send', name: 'Send Invoices', category: 'financial', description: 'Send invoices to tenants and owners' },
    { id: 'report_financial', name: 'View Financial Reports', category: 'financial', description: 'Access financial reports and analytics' },
    
    // Reporting
    { id: 'report_property', name: 'View Property Reports', category: 'reporting', description: 'Access property performance reports' },
    { id: 'report_occupancy', name: 'View Occupancy Reports', category: 'reporting', description: 'Access occupancy rate reports' },
    { id: 'report_maintenance', name: 'View Maintenance Reports', category: 'reporting', description: 'Access maintenance cost and efficiency reports' },
    { id: 'report_custom', name: 'Create Custom Reports', category: 'reporting', description: 'Generate custom reports with selected data' },
    { id: 'report_export', name: 'Export Reports', category: 'reporting', description: 'Export reports to PDF, Excel, or other formats' },
    
    // User Management
    { id: 'user_view', name: 'View Users', category: 'users', description: 'View user profiles and information' },
    { id: 'user_create', name: 'Create Users', category: 'users', description: 'Add new users to the system' },
    { id: 'user_edit', name: 'Edit Users', category: 'users', description: 'Modify user information and settings' },
    { id: 'user_delete', name: 'Delete Users', category: 'users', description: 'Remove users from the system' },
    { id: 'user_invite', name: 'Invite Users', category: 'users', description: 'Send invitations to new users' },
    { id: 'role_manage', name: 'Manage Roles', category: 'users', description: 'Create and manage user roles' },
    
    // System
    { id: 'settings_view', name: 'View Settings', category: 'system', description: 'View system configuration settings' },
    { id: 'settings_edit', name: 'Edit Settings', category: 'system', description: 'Modify system configuration' },
    { id: 'integration_manage', name: 'Manage Integrations', category: 'system', description: 'Configure third-party integrations' },
    { id: 'backup_manage', name: 'Manage Backups', category: 'system', description: 'Create and restore system backups' },
    { id: 'audit_view', name: 'View Audit Logs', category: 'system', description: 'Access system audit and activity logs' },
    
    // Communication
    { id: 'message_send', name: 'Send Messages', category: 'communication', description: 'Send messages to tenants and team members' },
    { id: 'notification_send', name: 'Send Notifications', category: 'communication', description: 'Send system-wide notifications' },
    { id: 'announcement_create', name: 'Create Announcements', category: 'communication', description: 'Create and post announcements' },
    { id: 'template_manage', name: 'Manage Templates', category: 'communication', description: 'Create and manage email/SMS templates' },
  ];
  
  // Category configuration
  const categories = {
    property: { name: 'Property Management', icon: '🏢', color: 'bg-blue-100 text-blue-800' },
    tenant: { name: 'Tenant Management', icon: '👥', color: 'bg-green-100 text-green-800' },
    lease: { name: 'Lease Management', icon: '📋', color: 'bg-purple-100 text-purple-800' },
    maintenance: { name: 'Maintenance', icon: '🔧', color: 'bg-orange-100 text-orange-800' },
    financial: { name: 'Financial', icon: '💰', color: 'bg-emerald-100 text-emerald-800' },
    reporting: { name: 'Reporting', icon: '📊', color: 'bg-indigo-100 text-indigo-800' },
    users: { name: 'User Management', icon: '👤', color: 'bg-pink-100 text-pink-800' },
    system: { name: 'System', icon: '⚙️', color: 'bg-gray-100 text-gray-800' },
    communication: { name: 'Communication', icon: '💬', color: 'bg-cyan-100 text-cyan-800' },
  };
  
  const displayPermissions = permissions.length > 0 ? permissions : defaultPermissions;
  const displayRoles = roles.length > 0 ? roles : [
    { id: 'system_admin', name: 'System Admin' },
    { id: 'company_admin', name: 'Company Admin' },
    { id: 'property_manager', name: 'Property Manager' },
    { id: 'leasing_specialist', name: 'Leasing Specialist' },
    { id: 'maintenance_supervisor', name: 'Maintenance Supervisor' },
    { id: 'financial_controller', name: 'Financial Controller' },
    { id: 'landlord', name: 'Landlord' },
    { id: 'tenant', name: 'Tenant' },
  ];
  
  useEffect(() => {
    // Filter permissions based on search query
    if (searchQuery.trim() === '') {
      setFilteredPermissions(displayPermissions);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPermissions(
        displayPermissions.filter(perm =>
          perm.name.toLowerCase().includes(query) ||
          perm.description.toLowerCase().includes(query) ||
          perm.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, displayPermissions]);
  
  useEffect(() => {
    // Initialize selected permissions from rolePermissions
    if (selectedRoleId && rolePermissions[selectedRoleId]) {
      setSelectedPermissions(rolePermissions[selectedRoleId]);
    } else {
      setSelectedPermissions({});
    }
  }, [selectedRoleId, rolePermissions]);
  
  const handlePermissionChange = (permissionId, isGranted) => {
    if (readOnly || !selectedRoleId) return;
    
    const newSelectedPermissions = {
      ...selectedPermissions,
      [permissionId]: isGranted,
    };
    
    setSelectedPermissions(newSelectedPermissions);
    
    if (onPermissionChange) {
      onPermissionChange(selectedRoleId, permissionId, isGranted);
    }
  };
  
  const handleCategoryToggle = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  
  const handleBulkSelectCategory = (category, grant) => {
    if (readOnly || !selectedRoleId) return;
    
    const categoryPermissions = displayPermissions
      .filter(perm => perm.category === category)
      .map(perm => perm.id);
    
    const newSelectedPermissions = { ...selectedPermissions };
    
    categoryPermissions.forEach(permId => {
      newSelectedPermissions[permId] = grant;
    });
    
    setSelectedPermissions(newSelectedPermissions);
    
    if (onPermissionChange) {
      categoryPermissions.forEach(permId => {
        onPermissionChange(selectedRoleId, permId, grant);
      });
    }
  };
  
  const handleSelectAll = (grant) => {
    if (readOnly || !selectedRoleId) return;
    
    const newSelectedPermissions = {};
    displayPermissions.forEach(perm => {
      newSelectedPermissions[perm.id] = grant;
    });
    
    setSelectedPermissions(newSelectedPermissions);
    
    if (onPermissionChange) {
      displayPermissions.forEach(perm => {
        onPermissionChange(selectedRoleId, perm.id, grant);
      });
    }
  };
  
  const getCategoryPermissions = (category) => {
    return filteredPermissions.filter(perm => perm.category === category);
  };
  
  const getPermissionStatus = (permissionId) => {
    if (!selectedRoleId) return false;
    return selectedPermissions[permissionId] || false;
  };
  
  const getRolePermissionsCount = (roleId) => {
    const permissions = rolePermissions[roleId];
    if (!permissions) return 0;
    
    return Object.values(permissions).filter(Boolean).length;
  };
  
  const getCategoryStatus = (category) => {
    const categoryPerms = getCategoryPermissions(category);
    if (categoryPerms.length === 0) return 'none';
    
    const grantedCount = categoryPerms.filter(perm => 
      getPermissionStatus(perm.id)
    ).length;
    
    if (grantedCount === 0) return 'none';
    if (grantedCount === categoryPerms.length) return 'all';
    return 'partial';
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
        <p className="text-gray-600 mt-1">
          Configure permissions for different user roles
        </p>
      </div>
      
      {/* Role Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Role to Configure
        </label>
        <div className="flex flex-wrap gap-3">
          {displayRoles.map(role => {
            const isSelected = selectedRoleId === role.id;
            const permissionCount = getRolePermissionsCount(role.id);
            
            return (
              <button
                key={role.id}
                onClick={() => onRoleSelect && onRoleSelect(role)}
                className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{role.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 ml-4" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Role Selection Required Message */}
      {!selectedRoleId && (
        <div className="mb-8 bg-yellow-50 rounded-lg p-6 text-center">
          <ShieldCheckIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-yellow-900 mb-2">Select a Role</h4>
          <p className="text-yellow-800">
            Please select a role from above to configure its permissions.
          </p>
        </div>
      )}
      
      {selectedRoleId && (
        <>
          {/* Header with Search and Bulk Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Configuring: {displayRoles.find(r => r.id === selectedRoleId)?.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.values(selectedPermissions).filter(Boolean).length} of {displayPermissions.length} permissions granted
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search permissions..."
                    className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={readOnly}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {!readOnly && (
                  <button
                    onClick={() => setBulkSelectMode(!bulkSelectMode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      bulkSelectMode
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {bulkSelectMode ? 'Exit Bulk Mode' : 'Bulk Select'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Bulk Action Bar */}
            {bulkSelectMode && !readOnly && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Bulk Permission Management</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Select multiple permissions quickly
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Grant All
                    </button>
                    <button
                      onClick={() => handleSelectAll(false)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Revoke All
                    </button>
                    <button
                      onClick={() => setBulkSelectMode(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Permission Categories */}
          <div className="space-y-4">
            {Object.entries(categories).map(([categoryKey, category]) => {
              const categoryPermissions = getCategoryPermissions(categoryKey);
              const isExpanded = expandedCategories[categoryKey] || false;
              const categoryStatus = getCategoryStatus(categoryKey);
              
              if (categoryPermissions.length === 0 && searchQuery) return null;
              
              return (
                <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleCategoryToggle(categoryKey)}
                          className="mr-3 text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="h-5 w-5" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5" />
                          )}
                        </button>
                        
                        <span className="mr-2">{category.icon}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                        
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${category.color}`}>
                          {categoryPermissions.length} permission{categoryPermissions.length !== 1 ? 's' : ''}
                        </span>
                        
                        {categoryStatus === 'all' && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            All Granted
                          </span>
                        )}
                        
                        {categoryStatus === 'partial' && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Partial
                          </span>
                        )}
                      </div>
                      
                      {!readOnly && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBulkSelectCategory(categoryKey, true)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            disabled={categoryStatus === 'all'}
                          >
                            Grant All
                          </button>
                          <button
                            onClick={() => handleBulkSelectCategory(categoryKey, false)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            disabled={categoryStatus === 'none'}
                          >
                            Revoke All
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Permissions List */}
                  {isExpanded && (
                    <div className="bg-white divide-y divide-gray-200">
                      {categoryPermissions.map(permission => {
                        const isGranted = getPermissionStatus(permission.id);
                        
                        return (
                          <div
                            key={permission.id}
                            className="p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start">
                                  {!readOnly ? (
                                    <button
                                      onClick={() => handlePermissionChange(permission.id, !isGranted)}
                                      className={`h-6 w-6 rounded border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                                        isGranted
                                          ? 'bg-green-500 border-green-500'
                                          : 'border-gray-300 hover:border-gray-400'
                                      }`}
                                    >
                                      {isGranted && (
                                        <CheckCircleIcon className="h-4 w-4 text-white" />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="mr-3 mt-0.5">
                                      {isGranted ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                      ) : (
                                        <XCircleIcon className="h-6 w-6 text-gray-300" />
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <h5 className="font-medium text-gray-900">{permission.name}</h5>
                                      {isGranted && (
                                        <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                          Granted
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs text-gray-500">
                                        ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{permission.id}</code>
                                      </span>
                                      <span className="mx-2 text-gray-300">•</span>
                                      <span className="text-xs text-gray-500">
                                        Category: {categories[permission.category]?.name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Quick toggle for bulk mode */}
                              {bulkSelectMode && !readOnly && (
                                <button
                                  onClick={() => handlePermissionChange(permission.id, !isGranted)}
                                  className={`ml-4 px-3 py-1 text-sm font-medium rounded ${
                                    isGranted
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {isGranted ? 'Revoke' : 'Grant'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* No Results Message */}
          {filteredPermissions.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No permissions found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Permission Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Permissions</p>
                <p className="text-2xl font-bold text-gray-900">{displayPermissions.length}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600">Granted</p>
                <p className="text-2xl font-bold text-green-700">
                  {Object.values(selectedPermissions).filter(Boolean).length}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600">Revoked</p>
                <p className="text-2xl font-bold text-red-700">
                  {displayPermissions.length - Object.values(selectedPermissions).filter(Boolean).length}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">Coverage</p>
                <p className="text-2xl font-bold text-blue-700">
                  {Math.round((Object.values(selectedPermissions).filter(Boolean).length / displayPermissions.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Inheritance
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={readOnly}
                  >
                    <option value="none">No inheritance</option>
                    <option value="parent">Inherit from parent role</option>
                    <option value="custom">Custom inheritance rules</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Configure how this role inherits permissions from other roles
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Overrides
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={readOnly}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Allow permission overrides by property
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={readOnly}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Allow time-based permission restrictions
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={readOnly}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Require approval for sensitive actions
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Actions */}
      {selectedRoleId && !readOnly && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={() => {
                // Reset to default
                const defaultPerms = {};
                displayPermissions.forEach(perm => {
                  defaultPerms[perm.id] = false;
                });
                setSelectedPermissions(defaultPerms);
              }}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Reset to Default
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Save as template
                  alert('Permission template saved');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Save as Template
              </button>
              
              <button
                onClick={() => {
                  // Apply to other roles
                  alert('Apply to other roles dialog would open here');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionMatrix;
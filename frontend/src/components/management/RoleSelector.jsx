import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const RoleSelector = ({
  roles = [],
  selectedRole,
  onRoleSelect,
  onRoleEdit,
  onRoleDelete,
  onRoleCreate,
  currentUserRole,
  showPermissions = true,
  readOnly = false,
  loading = false,
}) => {
  const [expandedRole, setExpandedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoles, setFilteredRoles] = useState(roles);
  const [permissionCategories, setPermissionCategories] = useState({});
  
  // Default roles if none provided
  const defaultRoles = [
    {
      id: 'system_admin',
      name: 'System Administrator',
      description: 'Full system access including user management, system settings, and all data.',
      permissions: ['all_permissions'],
      userCount: 1,
      isCustom: false,
      canEdit: false,
      canDelete: false,
      color: 'bg-red-100 text-red-800',
    },
    {
      id: 'company_admin',
      name: 'Company Administrator',
      description: 'Full company access including team management, financial data, and company settings.',
      permissions: [
        'manage_users',
        'manage_properties',
        'manage_tenants',
        'manage_finances',
        'view_reports',
        'manage_integrations',
        'manage_company_settings',
      ],
      userCount: 3,
      isCustom: false,
      canEdit: true,
      canDelete: false,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'property_manager',
      name: 'Property Manager',
      description: 'Manage properties, tenants, maintenance, and leasing operations.',
      permissions: [
        'manage_properties',
        'manage_tenants',
        'manage_maintenance',
        'manage_leasing',
        'view_financials',
        'view_reports',
      ],
      userCount: 12,
      isCustom: false,
      canEdit: true,
      canDelete: false,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'leasing_specialist',
      name: 'Leasing Specialist',
      description: 'Handle leasing operations including showings, applications, and lease generation.',
      permissions: [
        'view_properties',
        'manage_showings',
        'manage_applications',
        'generate_leases',
        'view_tenant_info',
      ],
      userCount: 8,
      isCustom: false,
      canEdit: true,
      canDelete: true,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 'maintenance_supervisor',
      name: 'Maintenance Supervisor',
      description: 'Oversee maintenance operations, assign work orders, and manage vendors.',
      permissions: [
        'view_properties',
        'manage_workorders',
        'assign_tasks',
        'manage_vendors',
        'view_maintenance_reports',
      ],
      userCount: 5,
      isCustom: false,
      canEdit: true,
      canDelete: true,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'maintenance_tech',
      name: 'Maintenance Technician',
      description: 'Perform maintenance tasks and update work order status.',
      permissions: [
        'view_assigned_tasks',
        'update_task_status',
        'log_work_hours',
        'view_property_info',
      ],
      userCount: 15,
      isCustom: false,
      canEdit: true,
      canDelete: true,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 'financial_controller',
      name: 'Financial Controller',
      description: 'Manage financial operations including payments, invoices, and reporting.',
      permissions: [
        'view_properties',
        'manage_payments',
        'manage_invoices',
        'view_financial_reports',
        'export_financial_data',
      ],
      userCount: 4,
      isCustom: false,
      canEdit: true,
      canDelete: true,
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'landlord',
      name: 'Property Owner',
      description: 'View and manage their own properties, tenants, and financial information.',
      permissions: [
        'view_own_properties',
        'view_own_tenants',
        'view_own_financials',
        'manage_own_maintenance',
        'view_own_reports',
      ],
      userCount: 25,
      isCustom: false,
      canEdit: false,
      canDelete: false,
      color: 'bg-gray-100 text-gray-800',
    },
    {
      id: 'tenant',
      name: 'Tenant',
      description: 'Access tenant portal for payments, maintenance requests, and communication.',
      permissions: [
        'view_own_lease',
        'make_payments',
        'submit_maintenance',
        'view_documents',
        'send_messages',
      ],
      userCount: 150,
      isCustom: false,
      canEdit: false,
      canDelete: false,
      color: 'bg-gray-100 text-gray-800',
    },
  ];
  
  // Permission categories for organization
  const permissionCategoryStructure = {
    property_management: {
      name: 'Property Management',
      icon: '🏢',
      permissions: [
        'manage_properties',
        'view_properties',
        'view_own_properties',
        'manage_property_documents',
        'manage_property_images',
      ],
    },
    tenant_management: {
      name: 'Tenant Management',
      icon: '👥',
      permissions: [
        'manage_tenants',
        'view_tenants',
        'view_own_tenants',
        'manage_leases',
        'view_leases',
      ],
    },
    maintenance: {
      name: 'Maintenance',
      icon: '🔧',
      permissions: [
        'manage_maintenance',
        'manage_workorders',
        'assign_tasks',
        'view_assigned_tasks',
        'update_task_status',
        'manage_vendors',
      ],
    },
    leasing: {
      name: 'Leasing',
      icon: '📋',
      permissions: [
        'manage_leasing',
        'manage_showings',
        'manage_applications',
        'generate_leases',
        'screen_tenants',
      ],
    },
    financial: {
      name: 'Financial',
      icon: '💰',
      permissions: [
        'manage_finances',
        'manage_payments',
        'manage_invoices',
        'view_financials',
        'view_own_financials',
        'export_financial_data',
      ],
    },
    reporting: {
      name: 'Reporting',
      icon: '📊',
      permissions: [
        'view_reports',
        'view_own_reports',
        'generate_reports',
        'export_data',
      ],
    },
    user_management: {
      name: 'User Management',
      icon: '👤',
      permissions: [
        'manage_users',
        'invite_users',
        'manage_roles',
        'view_user_activity',
      ],
    },
    system: {
      name: 'System',
      icon: '⚙️',
      permissions: [
        'manage_system_settings',
        'manage_company_settings',
        'manage_integrations',
        'view_audit_logs',
      ],
    },
    communication: {
      name: 'Communication',
      icon: '💬',
      permissions: [
        'send_messages',
        'send_notifications',
        'manage_announcements',
      ],
    },
  };
  
  const displayRoles = roles.length > 0 ? roles : defaultRoles;
  
  useEffect(() => {
    // Filter roles based on search query
    if (searchQuery.trim() === '') {
      setFilteredRoles(displayRoles);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRoles(
        displayRoles.filter(role =>
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query) ||
          role.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, displayRoles]);
  
  useEffect(() => {
    // Organize permissions by category for the expanded role
    if (expandedRole) {
      const role = displayRoles.find(r => r.id === expandedRole);
      if (role) {
        const categorized = {};
        
        Object.entries(permissionCategoryStructure).forEach(([category, data]) => {
          const categoryPermissions = role.permissions.filter(perm => 
            data.permissions.includes(perm) || perm === 'all_permissions'
          );
          
          if (categoryPermissions.length > 0) {
            categorized[category] = {
              ...data,
              permissions: categoryPermissions,
            };
          }
        });
        
        setPermissionCategories(categorized);
      }
    }
  }, [expandedRole, displayRoles]);
  
  const handleRoleSelect = (role) => {
    if (readOnly) return;
    
    if (onRoleSelect) {
      onRoleSelect(role);
    }
    
    if (expandedRole === role.id) {
      setExpandedRole(null);
    } else {
      setExpandedRole(role.id);
    }
  };
  
  const handleRoleEdit = (e, role) => {
    e.stopPropagation();
    if (onRoleEdit && role.canEdit) {
      onRoleEdit(role);
    }
  };
  
  const handleRoleDelete = (e, role) => {
    e.stopPropagation();
    if (onRoleDelete && role.canDelete) {
      onRoleDelete(role);
    }
  };
  
  const handleRoleCreate = () => {
    if (onRoleCreate) {
      onRoleCreate();
    }
  };
  
  const getPermissionDescription = (permission) => {
    const permissionDescriptions = {
      'all_permissions': 'Has access to all system features and data',
      'manage_properties': 'Can create, edit, and delete properties',
      'view_properties': 'Can view property details and listings',
      'view_own_properties': 'Can only view properties they own or manage',
      'manage_tenants': 'Can add, edit, and remove tenants',
      'view_tenants': 'Can view tenant information',
      'view_own_tenants': 'Can only view their own tenants',
      'manage_maintenance': 'Can create and manage maintenance requests',
      'manage_workorders': 'Can create and assign work orders',
      'assign_tasks': 'Can assign tasks to team members',
      'view_assigned_tasks': 'Can view tasks assigned to them',
      'update_task_status': 'Can update the status of assigned tasks',
      'manage_vendors': 'Can add and manage vendor information',
      'manage_leasing': 'Can manage all leasing operations',
      'manage_showings': 'Can schedule and manage property showings',
      'manage_applications': 'Can process rental applications',
      'generate_leases': 'Can create and send lease agreements',
      'screen_tenants': 'Can perform tenant screening and background checks',
      'manage_finances': 'Can manage all financial operations',
      'manage_payments': 'Can record and manage payments',
      'manage_invoices': 'Can create and send invoices',
      'view_financials': 'Can view financial reports and data',
      'view_own_financials': 'Can only view their own financial data',
      'export_financial_data': 'Can export financial data to external formats',
      'view_reports': 'Can view all system reports',
      'view_own_reports': 'Can only view reports related to their properties',
      'generate_reports': 'Can generate custom reports',
      'export_data': 'Can export data in various formats',
      'manage_users': 'Can add, edit, and remove system users',
      'invite_users': 'Can invite new users to the system',
      'manage_roles': 'Can create and manage user roles',
      'view_user_activity': 'Can view user activity logs',
      'manage_system_settings': 'Can configure system-wide settings',
      'manage_company_settings': 'Can configure company settings',
      'manage_integrations': 'Can manage third-party integrations',
      'view_audit_logs': 'Can view system audit logs',
      'send_messages': 'Can send messages to tenants and team members',
      'send_notifications': 'Can send system notifications',
      'manage_announcements': 'Can create and manage announcements',
    };
    
    return permissionDescriptions[permission] || 'System permission';
  };
  
  const canCreateRole = ['system_admin', 'company_admin'].includes(currentUserRole);
  const canEditRole = (role) => {
    if (['system_admin'].includes(currentUserRole)) return true;
    if (['company_admin'].includes(currentUserRole)) return role.canEdit !== false;
    return false;
  };
  
  const canDeleteRole = (role) => {
    if (['system_admin'].includes(currentUserRole)) return role.canDelete !== false;
    if (['company_admin'].includes(currentUserRole)) return role.canDelete === true;
    return false;
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
          <p className="text-gray-600 mt-1">
            Select and configure user roles with specific permissions
          </p>
        </div>
        
        {canCreateRole && !readOnly && (
          <button
            onClick={handleRoleCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Create New Role
          </button>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by name or description..."
            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={readOnly}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Role List */}
      <div className="space-y-4">
        {filteredRoles.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No roles found matching your search</p>
          </div>
        ) : (
          filteredRoles.map(role => {
            const isSelected = selectedRole?.id === role.id;
            const isExpanded = expandedRole === role.id;
            const canEdit = canEditRole(role);
            const canDelete = canDeleteRole(role);
            
            return (
              <div
                key={role.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Role Header */}
                <div
                  className={`p-4 cursor-pointer ${
                    isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.name}
                        </span>
                        
                        {role.isCustom && (
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            Custom
                          </span>
                        )}
                        
                        {!role.canDelete && (
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            System
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>{role.userCount || 0} users</span>
                        
                        <span className="mx-3">•</span>
                        
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        <span>{role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}</span>
                        
                        {role.permissions.includes('all_permissions') && (
                          <>
                            <span className="mx-3">•</span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                              Full Access
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                      
                      {!readOnly && canEdit && onRoleEdit && (
                        <button
                          onClick={(e) => handleRoleEdit(e, role)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit role"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      {!readOnly && canDelete && onRoleDelete && (
                        <button
                          onClick={(e) => handleRoleDelete(e, role)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete role"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Permissions View */}
                {isExpanded && showPermissions && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <LockClosedIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Role Permissions
                    </h4>
                    
                    {role.permissions.includes('all_permissions') ? (
                      <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-5 w-5 text-yellow-600 mr-3" />
                          <div>
                            <p className="font-medium text-yellow-900">Full System Access</p>
                            <p className="text-sm text-yellow-800 mt-1">
                              This role has access to all system features and data. Use with caution.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(permissionCategories).map(([category, data]) => (
                          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-white px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center">
                                <span className="mr-2">{data.icon}</span>
                                <span className="font-medium text-gray-900">{data.name}</span>
                                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {data.permissions.length} permission{data.permissions.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {data.permissions.map(permission => (
                                  <div
                                    key={permission}
                                    className="flex items-start p-3 bg-green-50 rounded-lg"
                                  >
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-green-900 capitalize">
                                        {permission.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-sm text-green-800 mt-1">
                                        {getPermissionDescription(permission)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <div>
                          <button
                            onClick={() => setExpandedRole(null)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                          >
                            Collapse Details
                          </button>
                        </div>
                        
                        <div className="flex space-x-3">
                          {!readOnly && canEdit && onRoleEdit && (
                            <button
                              onClick={(e) => handleRoleEdit(e, role)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit Role
                            </button>
                          )}
                          
                          <button
                            onClick={() => onRoleSelect && onRoleSelect(role)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            Select Role
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Role Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Role Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Roles</p>
            <p className="text-2xl font-bold text-gray-900">{displayRoles.length}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Custom Roles</p>
            <p className="text-2xl font-bold text-blue-700">
              {displayRoles.filter(r => r.isCustom).length}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Active Users</p>
            <p className="text-2xl font-bold text-green-700">
              {displayRoles.reduce((total, role) => total + (role.userCount || 0), 0)}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600">System Roles</p>
            <p className="text-2xl font-bold text-purple-700">
              {displayRoles.filter(r => !r.canDelete).length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      {!readOnly && (canCreateRole || canEditRole({}) || canDeleteRole({})) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            {canCreateRole && (
              <button
                onClick={handleRoleCreate}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Create New Role
              </button>
            )}
            
            <button
              onClick={() => {
                // Export roles functionality
                alert('Roles exported (this would generate a CSV/JSON file in production)');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Roles
            </button>
            
            <button
              onClick={() => {
                // Import roles functionality
                alert('Import roles dialog would open here');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import Roles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
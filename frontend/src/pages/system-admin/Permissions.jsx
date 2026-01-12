import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  Edit2,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', color: 'gray' },
    { id: 'system', name: 'System', color: 'red', icon: Shield },
    { id: 'user', name: 'User Management', color: 'blue', icon: Shield },
    { id: 'property', name: 'Property Management', color: 'green', icon: Shield },
    { id: 'financial', name: 'Financial', color: 'purple', icon: Shield },
    { id: 'audit', name: 'Audit & Security', color: 'yellow', icon: Shield },
    { id: 'integration', name: 'Integration', color: 'indigo', icon: Shield },
    { id: 'company', name: 'Company', color: 'pink', icon: Shield },
    { id: 'tenant', name: 'Tenant', color: 'orange', icon: Shield },
    { id: 'maintenance', name: 'Maintenance', color: 'cyan', icon: Shield },
  ];

  const samplePermissions = [
    {
      id: 'system.view',
      name: 'View System Dashboard',
      description: 'Access to system overview and performance metrics',
      category: 'system',
      type: 'read',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 1248,
      roles: ['system_admin', 'company_admin'],
      locked: false
    },
    {
      id: 'system.manage',
      name: 'Manage System Settings',
      description: 'Configure system-wide settings and configurations',
      category: 'system',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 45,
      roles: ['system_admin'],
      locked: true
    },
    {
      id: 'users.view',
      name: 'View Users',
      description: 'View all user accounts in the system',
      category: 'user',
      type: 'read',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 892,
      roles: ['system_admin', 'company_admin'],
      locked: false
    },
    {
      id: 'users.create',
      name: 'Create Users',
      description: 'Create new user accounts',
      category: 'user',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 124,
      roles: ['system_admin', 'company_admin'],
      locked: false
    },
    {
      id: 'users.edit',
      name: 'Edit Users',
      description: 'Modify user account information',
      category: 'user',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 567,
      roles: ['system_admin', 'company_admin'],
      locked: false
    },
    {
      id: 'users.delete',
      name: 'Delete Users',
      description: 'Permanently remove user accounts',
      category: 'user',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 89,
      roles: ['system_admin'],
      locked: true
    },
    {
      id: 'properties.view_all',
      name: 'View All Properties',
      description: 'View all properties across all companies',
      category: 'property',
      type: 'read',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 2145,
      roles: ['system_admin', 'company_admin'],
      locked: false
    },
    {
      id: 'properties.create',
      name: 'Create Properties',
      description: 'Add new properties to the system',
      category: 'property',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 892,
      roles: ['system_admin', 'company_admin', 'property_manager'],
      locked: false
    },
    {
      id: 'properties.edit_all',
      name: 'Edit All Properties',
      description: 'Modify any property in the system',
      category: 'property',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 567,
      roles: ['system_admin', 'company_admin'],
      locked: true
    },
    {
      id: 'financial.view_all',
      name: 'View All Financials',
      description: 'Access all financial data across the system',
      category: 'financial',
      type: 'read',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 124,
      roles: ['system_admin'],
      locked: true
    },
    {
      id: 'financial.process',
      name: 'Process Payments',
      description: 'Process rent payments and other transactions',
      category: 'financial',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 892,
      roles: ['system_admin', 'company_admin', 'property_manager'],
      locked: false
    },
    {
      id: 'audit.view',
      name: 'View Audit Logs',
      description: 'Access system audit logs and history',
      category: 'audit',
      type: 'read',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 45,
      roles: ['system_admin'],
      locked: true
    },
    {
      id: 'integrations.manage',
      name: 'Manage Integrations',
      description: 'Configure and manage third-party integrations',
      category: 'integration',
      type: 'write',
      status: 'active',
      createdAt: '2024-01-15',
      usageCount: 67,
      roles: ['system_admin'],
      locked: true
    },
  ];

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      // Use sample data for demo
      setPermissions(samplePermissions);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPermissions = async () => {
    setSyncing(true);
    try {
      await syncPermissions();
      loadPermissions();
    } catch (error) {
      console.error('Failed to sync permissions:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectPermission = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === filteredPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(filteredPermissions.map(p => p.id));
    }
  };

  const handleBulkAction = (action) => {
    // Handle bulk actions
    console.log(`Bulk ${action} for permissions:`, selectedPermissions);
    setSelectedPermissions([]);
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setShowEditModal(true);
  };

  const handleSavePermission = async (updatedPermission) => {
    try {
      await updatePermission(updatedPermission.id, updatedPermission);
      loadPermissions();
      setShowEditModal(false);
      setEditingPermission(null);
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        stats[cat.id] = permissions.filter(p => p.category === cat.id).length;
      }
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
              <p className="mt-2 text-gray-600">
                Manage system permissions and access controls
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleSyncPermissions}
                disabled={syncing}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Permissions'}
              </button>
              <button
                onClick={() => {/* Add new permission */}}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Permissions', value: permissions.length, color: 'blue' },
            { label: 'Active', value: permissions.filter(p => p.status === 'active').length, color: 'green' },
            { label: 'Locked', value: permissions.filter(p => p.locked).length, color: 'red' },
            { label: 'In Use', value: permissions.filter(p => p.usageCount > 0).length, color: 'purple' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-800 border border-${category.color}-300`
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name}
                {category.id !== 'all' && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    selectedCategory === category.id
                      ? `bg-${category.color}-200 text-${category.color}-900`
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {categoryStats[category.id] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1 max-w-lg mb-4 md:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search permissions by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPermissions.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">
                    {selectedPermissions.length} permission{selectedPermissions.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.length === filteredPermissions.length && filteredPermissions.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handleSelectPermission(permission.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            permission.category === 'system' ? 'bg-red-100' :
                            permission.category === 'user' ? 'bg-blue-100' :
                            permission.category === 'property' ? 'bg-green-100' :
                            permission.category === 'financial' ? 'bg-purple-100' :
                            permission.category === 'audit' ? 'bg-yellow-100' :
                            permission.category === 'integration' ? 'bg-indigo-100' :
                            'bg-gray-100'
                          }`}>
                            <Shield className={`w-4 h-4 ${
                              permission.category === 'system' ? 'text-red-600' :
                              permission.category === 'user' ? 'text-blue-600' :
                              permission.category === 'property' ? 'text-green-600' :
                              permission.category === 'financial' ? 'text-purple-600' :
                              permission.category === 'audit' ? 'text-yellow-600' :
                              permission.category === 'integration' ? 'text-indigo-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{permission.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{permission.description}</div>
                            <div className="text-xs text-gray-400 mt-1 font-mono">{permission.id}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.category === 'system' ? 'bg-red-100 text-red-800' :
                        permission.category === 'user' ? 'bg-blue-100 text-blue-800' :
                        permission.category === 'property' ? 'bg-green-100 text-green-800' :
                        permission.category === 'financial' ? 'bg-purple-100 text-purple-800' :
                        permission.category === 'audit' ? 'bg-yellow-100 text-yellow-800' :
                        permission.category === 'integration' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {permission.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.type === 'read' ? 'bg-blue-100 text-blue-800' :
                        permission.type === 'write' ? 'bg-green-100 text-green-800' :
                        permission.type === 'admin' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {permission.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{permission.usageCount}</div>
                      <div className="text-xs text-gray-500">
                        {permission.roles?.length || 0} roles
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {permission.status === 'active' ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-green-700">Active</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-red-700">Inactive</span>
                          </>
                        )}
                        {permission.locked && (
                          <Lock className="w-3 h-3 text-gray-400 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!permission.locked && (
                          <>
                            <button
                              onClick={() => handleEditPermission(permission)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setPermissionToDelete(permission);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No permissions have been configured yet'}
              </p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Permission Details
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPermission(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Name
                  </label>
                  <input
                    type="text"
                    value={editingPermission.name}
                    onChange={(e) => setEditingPermission({...editingPermission, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingPermission.description}
                    onChange={(e) => setEditingPermission({...editingPermission, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={editingPermission.category}
                      onChange={(e) => setEditingPermission({...editingPermission, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={editingPermission.type}
                      onChange={(e) => setEditingPermission({...editingPermission, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="read">Read</option>
                      <option value="write">Write</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingPermission.status}
                      onChange={(e) => setEditingPermission({...editingPermission, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lock Status
                    </label>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={editingPermission.locked}
                        onChange={(e) => setEditingPermission({...editingPermission, locked: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Locked (cannot be modified)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission ID
                  </label>
                  <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {editingPermission.id}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This ID is used internally and cannot be changed
                  </p>
                </div>

                {editingPermission.locked && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">System Permission</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This permission is locked because it's required by system functionality.
                          Some fields cannot be modified.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPermission(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePermission(editingPermission)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && permissionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Permission
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to delete the permission "{permissionToDelete.name}"?
              </p>
              {permissionToDelete.usageCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Warning</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This permission is used by {permissionToDelete.usageCount} role{permissionToDelete.usageCount !== 1 ? 's' : ''}. 
                        Deleting it may affect system functionality.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {permissionToDelete.locked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <Lock className="w-5 h-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm text-red-800 font-medium">System Permission</p>
                      <p className="text-sm text-red-700 mt-1">
                        This permission is locked and cannot be deleted because it's required by system functionality.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPermissionToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {!permissionToDelete.locked && (
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Permission
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAdminPermissions;
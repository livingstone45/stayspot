import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'custom',
    permissions: {}
  });

  const permissionCategories = [
    {
      name: 'System',
      permissions: [
        { id: 'system.view', name: 'View System Dashboard', description: 'Access to system overview and metrics' },
        { id: 'system.manage', name: 'Manage System Settings', description: 'Configure system-wide settings' },
        { id: 'system.backup', name: 'Perform Backups', description: 'Create and manage system backups' },
        { id: 'system.restore', name: 'Restore Backups', description: 'Restore system from backups' },
      ]
    },
    {
      name: 'User Management',
      permissions: [
        { id: 'users.view', name: 'View Users', description: 'View all user accounts' },
        { id: 'users.create', name: 'Create Users', description: 'Create new user accounts' },
        { id: 'users.edit', name: 'Edit Users', description: 'Edit user account details' },
        { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts' },
        { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend user accounts' },
      ]
    },
    {
      name: 'Role Management',
      permissions: [
        { id: 'roles.view', name: 'View Roles', description: 'View all roles and permissions' },
        { id: 'roles.create', name: 'Create Roles', description: 'Create new roles' },
        { id: 'roles.edit', name: 'Edit Roles', description: 'Edit role permissions' },
        { id: 'roles.delete', name: 'Delete Roles', description: 'Delete roles' },
        { id: 'roles.assign', name: 'Assign Roles', description: 'Assign roles to users' },
      ]
    },
    {
      name: 'Company Management',
      permissions: [
        { id: 'companies.view', name: 'View Companies', description: 'View all companies' },
        { id: 'companies.create', name: 'Create Companies', description: 'Create new companies' },
        { id: 'companies.edit', name: 'Edit Companies', description: 'Edit company details' },
        { id: 'companies.delete', name: 'Delete Companies', description: 'Delete companies' },
        { id: 'companies.billing', name: 'Manage Billing', description: 'Manage company billing and subscriptions' },
      ]
    },
    {
      name: 'Property Management',
      permissions: [
        { id: 'properties.view_all', name: 'View All Properties', description: 'View all properties across companies' },
        { id: 'properties.create', name: 'Create Properties', description: 'Create new properties' },
        { id: 'properties.edit_all', name: 'Edit All Properties', description: 'Edit any property' },
        { id: 'properties.delete', name: 'Delete Properties', description: 'Delete properties' },
        { id: 'properties.import', name: 'Import Properties', description: 'Import properties in bulk' },
        { id: 'properties.export', name: 'Export Properties', description: 'Export property data' },
      ]
    },
    {
      name: 'Financial',
      permissions: [
        { id: 'financial.view_all', name: 'View All Financials', description: 'View all financial data' },
        { id: 'financial.process', name: 'Process Payments', description: 'Process rent payments' },
        { id: 'financial.refund', name: 'Issue Refunds', description: 'Issue payment refunds' },
        { id: 'financial.reports', name: 'Generate Reports', description: 'Generate financial reports' },
        { id: 'financial.export', name: 'Export Financial Data', description: 'Export financial records' },
      ]
    },
    {
      name: 'Audit & Security',
      permissions: [
        { id: 'audit.view', name: 'View Audit Logs', description: 'View system audit logs' },
        { id: 'audit.export', name: 'Export Audit Logs', description: 'Export audit log data' },
        { id: 'security.settings', name: 'Security Settings', description: 'Configure security settings' },
        { id: 'security.monitor', name: 'Monitor Security', description: 'Monitor security events' },
        { id: 'security.alerts', name: 'Manage Security Alerts', description: 'Configure security alerts' },
      ]
    },
    {
      name: 'Integration',
      permissions: [
        { id: 'integrations.view', name: 'View Integrations', description: 'View all integrations' },
        { id: 'integrations.manage', name: 'Manage Integrations', description: 'Configure integrations' },
        { id: 'integrations.api', name: 'API Management', description: 'Manage API keys and access' },
        { id: 'integrations.webhooks', name: 'Webhook Management', description: 'Configure webhooks' },
      ]
    },
  ];

  const predefinedRoles = [
    {
      id: 'system_admin',
      name: 'System Administrator',
      description: 'Full system access with all permissions',
      userCount: 5,
      type: 'system',
      locked: true,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'company_admin',
      name: 'Company Administrator',
      description: 'Full access within assigned company',
      userCount: 124,
      type: 'company',
      locked: true,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'property_manager',
      name: 'Property Manager',
      description: 'Manage properties and tenants',
      userCount: 892,
      type: 'company',
      locked: true,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'landlord',
      name: 'Landlord',
      description: 'Manage own properties',
      userCount: 2145,
      type: 'user',
      locked: true,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'tenant',
      name: 'Tenant',
      description: 'Access tenant portal features',
      userCount: 45892,
      type: 'user',
      locked: true,
      color: 'bg-yellow-100 text-yellow-800'
    },
  ];

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (editingRole) {
      setFormData({
        name: editingRole.name,
        description: editingRole.description,
        type: editingRole.type || 'custom',
        permissions: editingRole.permissions || {}
      });
      setSelectedPermissions(editingRole.permissions || {});
    } else {
      resetForm();
    }
  }, [editingRole]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'custom',
      permissions: {}
    });
    setSelectedPermissions({});
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const handleSelectAllCategory = (category) => {
    const categoryPermissions = category.permissions.map(p => p.id);
    const allSelected = categoryPermissions.every(p => selectedPermissions[p]);
    
    const newPermissions = { ...selectedPermissions };
    categoryPermissions.forEach(permissionId => {
      newPermissions[permissionId] = !allSelected;
    });
    
    setSelectedPermissions(newPermissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const roleData = {
      ...formData,
      permissions: selectedPermissions
    };

    try {
      if (editingRole) {
        await updateRole(editingRole.id, roleData);
      } else {
        await createRole(roleData);
      }
      
      loadRoles();
      setShowRoleModal(false);
      setEditingRole(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    
    try {
      await deleteRole(roleToDelete.id);
      loadRoles();
      setShowDeleteModal(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleDuplicateRole = (role) => {
    setEditingRole(null);
    setFormData({
      name: `${role.name} (Copy)`,
      description: role.description,
      type: role.type,
      permissions: role.permissions
    });
    setSelectedPermissions(role.permissions || {});
    setShowRoleModal(true);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customRoles = filteredRoles.filter(role => role.type === 'custom');
  const systemRoles = filteredRoles.filter(role => role.type !== 'custom');

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
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-2 text-gray-600">
                Define and manage user roles and permissions across the platform
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => {
                  setEditingRole(null);
                  resetForm();
                  setShowRoleModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Role
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Roles', value: roles.length, icon: Shield, color: 'blue' },
            { label: 'Custom Roles', value: customRoles.length, icon: Edit2, color: 'green' },
            { label: 'Users with Roles', value: roles.reduce((sum, role) => sum + (role.userCount || 0), 0), icon: Users, color: 'purple' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 mr-4`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1 max-w-md mb-4 md:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles by name or description..."
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
        </div>

        {/* System Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${role.color} mr-3`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <div className="flex items-center mt-1">
                        {role.locked ? (
                          <Lock className="w-3 h-3 text-gray-400 mr-1" />
                        ) : (
                          <Unlock className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-500">
                          {role.locked ? 'System Role' : 'Custom Role'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {!role.locked && (
                      <>
                        <button
                          onClick={() => setEditingRole(role)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateRole(role)}
                          className="p-1 text-gray-400 hover:text-purple-600"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setRoleToDelete(role);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{role.userCount || 0} users</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {Object.keys(role.permissions || {}).length} permissions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Roles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Custom Roles</h2>
            <span className="text-sm text-gray-600">{customRoles.length} roles</span>
          </div>
          
          {customRoles.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${role.color || 'bg-gray-100'} mr-3`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{role.name}</div>
                            <div className="text-xs text-gray-500">{role.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{role.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{role.userCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {Object.keys(role.permissions || {}).filter(k => role.permissions[k]).length} enabled
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingRole(role)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingRole(role)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateRole(role)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setRoleToDelete(role);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom roles yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first custom role to define specific permission sets for your users.
              </p>
              <button
                onClick={() => {
                  setEditingRole(null);
                  resetForm();
                  setShowRoleModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Role
              </button>
            </div>
          )}
        </div>

        {/* Role Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingRole ? 'Edit Role' : 'Create New Role'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowRoleModal(false);
                      setEditingRole(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Basic Information */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Regional Manager, Finance Admin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="custom">Custom</option>
                          <option value="system">System</option>
                          <option value="company">Company</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the purpose and scope of this role..."
                      />
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Permissions</h4>
                      <div className="text-sm text-gray-600">
                        {Object.values(selectedPermissions).filter(v => v).length} permissions selected
                      </div>
                    </div>

                    <div className="space-y-6">
                      {permissionCategories.map((category) => {
                        const categoryPermissions = category.permissions.map(p => p.id);
                        const selectedCount = categoryPermissions.filter(p => selectedPermissions[p]).length;
                        const allSelected = selectedCount === categoryPermissions.length;
                        const someSelected = selectedCount > 0 && !allSelected;

                        return (
                          <div key={category.name} className="border border-gray-200 rounded-lg">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(input) => {
                                      if (input) {
                                        input.indeterminate = someSelected;
                                      }
                                    }}
                                    onChange={() => handleSelectAllCategory(category)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label className="ml-3 font-medium text-gray-900">
                                    {category.name}
                                  </label>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {selectedCount} of {categoryPermissions.length} selected
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {category.permissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className={`p-3 rounded-lg border ${
                                      selectedPermissions[permission.id]
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      <input
                                        type="checkbox"
                                        id={permission.id}
                                        checked={!!selectedPermissions[permission.id]}
                                        onChange={() => handlePermissionToggle(permission.id)}
                                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <div className="ml-3 flex-1">
                                        <label
                                          htmlFor={permission.id}
                                          className="text-sm font-medium text-gray-900 cursor-pointer"
                                        >
                                          {permission.name}
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleModal(false);
                      setEditingRole(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && roleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Role
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to delete the role "{roleToDelete.name}"?
              </p>
              {roleToDelete.userCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Warning</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This role is assigned to {roleToDelete.userCount} user{roleToDelete.userCount !== 1 ? 's' : ''}. 
                        Deleting it will remove their permissions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRoleToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRole}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAdminRoles;
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Copy, Zap, GitBranch, Activity, X, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const PermissionsAdvanced = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [], parent_role: '' });
  const [bulkData, setBulkData] = useState({ users: [], role: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'roles') fetchRoles();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'audit') fetchAuditLogs();
    fetchStats();
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }) });
      const res = await fetch(`/api/security/roles?${params}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch roles');
      const data = await res.json();
      setRoles(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }) });
      const res = await fetch(`/api/security/user-roles?${params}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/security/permissions', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch permissions');
      const data = await res.json();
      setPermissions(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/security/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/security/audit?limit=20', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const data = await res.json();
      setAuditLogs(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRole = async () => {
    if (!formData.name) {
      setError('Role name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const method = selectedRole ? 'PUT' : 'POST';
      const url = selectedRole ? `/api/security/roles/${selectedRole.id}` : '/api/security/roles';
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save role');
      setFormData({ name: '', description: '', permissions: [], parent_role: '' });
      setSelectedRole(null);
      setShowRoleModal(false);
      fetchRoles();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/security/roles/${roleId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to delete role');
      fetchRoles();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditRole = async (role) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/security/roles/${role.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch role');
      const data = await res.json();
      setFormData({
        name: data.data.name,
        description: data.data.description,
        permissions: data.data.permissions.map(p => p.id),
        parent_role: data.data.parent_role || ''
      });
      setSelectedRole(data.data);
      setShowRoleModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloneRole = async (role) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/security/roles/${role.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch role');
      const data = await res.json();
      setFormData({
        name: `${data.data.name} (Copy)`,
        description: data.data.description,
        permissions: data.data.permissions.map(p => p.id),
        parent_role: data.data.parent_role || ''
      });
      setSelectedRole(null);
      setShowRoleModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkData.role || selectedUsers.length === 0) {
      setError('Select users and role');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      for (const userId of selectedUsers) {
        await fetch('/api/security/user-roles/assign', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleId: bulkData.role })
        });
      }
      setSelectedUsers([]);
      setBulkData({ users: [], role: '' });
      setShowBulkModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'}`}>{error}</div>}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Permissions</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced role and access control management</p>
          </div>
          {activeTab === 'roles' && (
            <div className="flex gap-2">
              <button onClick={() => { setSelectedRole(null); setFormData({ name: '', description: '', permissions: [], parent_role: '' }); setShowRoleModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> New Role
              </button>
              <button onClick={() => setShowMatrixModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                <GitBranch className="w-5 h-5" /> Matrix
              </button>
            </div>
          )}
          {activeTab === 'users' && (
            <button onClick={() => setShowBulkModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <Zap className="w-5 h-5" /> Bulk Assign
            </button>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Roles</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total_roles}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Permissions</p>
              <p className="text-2xl font-bold text-green-600">{stats.total_permissions}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Users with Roles</p>
              <p className="text-2xl font-bold text-purple-600">{stats.users_with_roles}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Changes</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
          </div>
        )}

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex border-b overflow-x-auto">
            {['roles', 'users', 'audit'].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); setSearch(''); }} className={`flex-1 px-6 py-4 font-medium whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                {tab === 'roles' && <Shield className="w-5 h-5 inline mr-2" />}
                {tab === 'users' && <Users className="w-5 h-5 inline mr-2" />}
                {tab === 'audit' && <Activity className="w-5 h-5 inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input type="text" placeholder={activeTab === 'roles' ? 'Search roles...' : 'Search users...'} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'roles' ? (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{role.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{role.description}</p>
                      <div className="flex gap-2 mt-2">
                        {role.permissions && role.permissions.slice(0, 3).map((p, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{p.name}</span>
                        ))}
                        {role.permissions && role.permissions.length > 3 && <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800">+{role.permissions.length - 3}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleCloneRole(role)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                        <Copy className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEditRole(role)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteRole(role.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'users' ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3 flex-1">
                      <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={(e) => setSelectedUsers(e.target.checked ? [...selectedUsers, user.id] : selectedUsers.filter(id => id !== user.id))} className="w-4 h-4 rounded" />
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles ? user.roles.split(',').map((role, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{role}</span>
                      )) : <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No roles</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{log.action}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.resource_type} • {new Date(log.created_at).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${log.action.includes('create') ? 'bg-green-100 text-green-800' : log.action.includes('delete') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{log.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-start`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedRole ? 'Edit Role' : 'New Role'}</h2>
                <button onClick={() => setShowRoleModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Role name" className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows="2" className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} />
                <select value={formData.parent_role} onChange={(e) => setFormData({ ...formData, parent_role: e.target.value })} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                  <option value="">No parent role</option>
                  {roles.filter(r => r.id !== selectedRole?.id).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Permissions</label>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category}>
                        <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{category}</p>
                        <div className="space-y-2 ml-2">
                          {perms.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={formData.permissions.includes(perm.id)} onChange={(e) => setFormData({ ...formData, permissions: e.target.checked ? [...formData.permissions, perm.id] : formData.permissions.filter(p => p !== perm.id) })} className="w-4 h-4 rounded" />
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{perm.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3`}>
                <button onClick={handleSaveRole} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">Save Role</button>
                <button onClick={() => setShowRoleModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium`}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Assign Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-start`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bulk Assign Role</h2>
                <button onClick={() => setShowBulkModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Selected Users: {selectedUsers.length}</p>
                </div>
                <select value={bulkData.role} onChange={(e) => setBulkData({ ...bulkData, role: e.target.value })} className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                  <option value="">Select role to assign</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3`}>
                <button onClick={handleBulkAssign} className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium">Assign</button>
                <button onClick={() => setShowBulkModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium`}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsAdvanced;

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Copy, Zap, Activity, X, Shield, Users, Loader } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockUsers = [
  { id: 1, name: 'James Kipchoge', email: 'james@stayspot.com', roles: 'Admin, Manager' },
  { id: 2, name: 'Mary Wanjiru', email: 'mary@stayspot.com', roles: 'Editor' },
  { id: 3, name: 'Peter Omondi', email: 'peter@stayspot.com', roles: 'Viewer' }
];

const mockRoles = [
  { id: 1, name: 'Admin', description: 'Full system access', permissions: ['create', 'read', 'update', 'delete'] },
  { id: 2, name: 'Manager', description: 'Manage properties and users', permissions: ['create', 'read', 'update'] },
  { id: 3, name: 'Editor', description: 'Edit content', permissions: ['read', 'update'] }
];

const Permissions = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (activeTab === 'roles') {
        const response = await fetch('/api/security/roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data.data || []);
      } else if (activeTab === 'users') {
        const response = await fetch('/api/security/user-roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (err) {
      if (activeTab === 'roles') setRoles(mockRoles);
      else setUsers(mockUsers);
    } finally {
      setLoading(false);
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
      
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save role');
      setFormData({ name: '', description: '', permissions: [] });
      setSelectedRole(null);
      setShowRoleModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/security/roles/${roleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete role');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Permissions</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Manage roles and access control</p>
          </div>
          {activeTab === 'roles' && (
            <button
              onClick={() => { setSelectedRole(null); setFormData({ name: '', description: '', permissions: [] }); setShowRoleModal(true); }}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
            >
              <Plus className="w-5 h-5" /> New Role
            </button>
          )}
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
          <div className="flex border-b overflow-x-auto">
            {['roles', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(''); }}
                className={`flex-1 px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'roles' && <Shield className="w-5 h-5 inline mr-2" />}
                {tab === 'users' && <Users className="w-5 h-5 inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder={activeTab === 'roles' ? 'Search roles...' : 'Search users...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : activeTab === 'roles' ? (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{role.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{role.description}</p>
                      <div className="flex gap-2 mt-2">
                        {role.permissions && role.permissions.slice(0, 3).map((p, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">{p}</span>
                        ))}
                        {role.permissions && role.permissions.length > 3 && <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800">+{role.permissions.length - 3}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedRole(role); setFormData(role); setShowRoleModal(true); }} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-orange-400 hover:bg-slate-600' : 'text-orange-600 hover:bg-gray-100'}`}>
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteRole(role.id)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-red-400 hover:bg-slate-600' : 'text-red-600 hover:bg-gray-100'}`}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3 flex-1">
                      <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={(e) => setSelectedUsers(e.target.checked ? [...selectedUsers, user.id] : selectedUsers.filter(id => id !== user.id))} className="w-4 h-4 rounded" />
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles && user.roles.split(',').map((role, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{role.trim()}</span>
                      ))}
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
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{selectedRole ? 'Edit Role' : 'New Role'}</h2>
                <button onClick={() => setShowRoleModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Role name"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows="2"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={handleSaveRole}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Save Role
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Permissions;

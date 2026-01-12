import React, { useState } from 'react';
import { Users, Plus, Search, Filter, CheckCircle, AlertCircle, Clock, Eye, Edit, Download } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const UserVerification = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { label: 'Total Users', value: '45.2K', icon: '👥', color: 'blue' },
    { label: 'Verified', value: '43.8K', icon: '✅', color: 'green' },
    { label: 'Pending', value: '1.2K', icon: '⏳', color: 'yellow' },
    { label: 'Rejected', value: '200', icon: '❌', color: 'red' }
  ];

  const users = [
    { id: 'USR-001', name: 'John Smith', email: 'john@example.com', role: 'Tenant', status: 'verified', documents: 'ID, Proof of Income', date: '2024-01-10' },
    { id: 'USR-002', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Landlord', status: 'pending', documents: 'ID, Property Deed', date: '2024-01-14' },
    { id: 'USR-003', name: 'Mike Brown', email: 'mike@example.com', role: 'Property Manager', status: 'verified', documents: 'ID, License', date: '2024-01-08' },
    { id: 'USR-004', name: 'Emma Davis', email: 'emma@example.com', role: 'Tenant', status: 'pending', documents: 'ID', date: '2024-01-13' },
    { id: 'USR-005', name: 'Robert Wilson', email: 'robert@example.com', role: 'Landlord', status: 'rejected', documents: 'ID', date: '2024-01-05' }
  ];

  const getStatusIcon = (status) => {
    const icons = {
      verified: <CheckCircle className="w-5 h-5 text-green-600" />,
      pending: <Clock className="w-5 h-5 text-yellow-600" />,
      rejected: <AlertCircle className="w-5 h-5 text-red-600" />
    };
    return icons[status];
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      rejected: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getRoleColor = (role) => {
    const colors = {
      'Tenant': isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800',
      'Landlord': isDarkMode ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-100 text-purple-800',
      'Property Manager': isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800'
    };
    return colors[role] || colors['Tenant'];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>User Verification</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Verify tenants, landlords & property managers</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus className="w-5 h-5" /> Add User
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Roles</option>
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
              <option value="manager">Property Manager</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>User ID</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Name</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Email</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Role</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Documents</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{user.id}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.email}</td>
                    <td className={`px-6 py-4 text-sm`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.documents}</td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.date}</td>
                    <td className={`px-6 py-4 text-sm flex gap-2`}>
                      <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Verification Section */}
        <div className="mt-8">
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pending Verification Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.filter(u => u.status === 'pending').map((user, idx) => (
              <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Documents: <span className="font-semibold">{user.documents}</span></p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Submitted: <span className="font-semibold">{user.date}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                    Approve
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVerification;

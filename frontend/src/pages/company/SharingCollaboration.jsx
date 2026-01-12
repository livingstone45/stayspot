import React, { useState } from 'react';
import { Share2, Plus, Search, Copy, Eye, Edit, Trash2, Download, Users, Clock, Lock, Globe, CheckCircle, X } from 'lucide-react';
import Alert from '../../components/common/UI/Alert';
import { useTheme } from '../../contexts/ThemeContext';

const SharingCollaboration = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [shareForm, setShareForm] = useState({ name: '', type: 'report', permission: 'view' });
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'viewer' });

  const stats = [
    { label: 'Shared Reports', value: '24', icon: '📊' },
    { label: 'Active Collaborators', value: '12', icon: '👥' },
    { label: 'Shared Dashboards', value: '8', icon: '📈' },
    { label: 'Pending Invites', value: '3', icon: '📧' }
  ];

  const sharedItems = [
    { id: 'SHR-001', name: 'Monthly Revenue Report', type: 'report', sharedWith: 'Sarah Johnson, Mike Brown', permission: 'view', date: '2024-01-15', link: 'https://stayspot.com/share/abc123' },
    { id: 'SHR-002', name: 'Q1 Analytics Dashboard', type: 'dashboard', sharedWith: 'Finance Team (5)', permission: 'edit', date: '2024-01-14', link: 'https://stayspot.com/share/def456' },
    { id: 'SHR-003', name: 'Property Verification Data', type: 'data', sharedWith: 'Verification Team (3)', permission: 'view', date: '2024-01-13', link: 'https://stayspot.com/share/ghi789' }
  ];

  const teamMembers = [
    { id: 'TM-001', name: 'Sarah Johnson', email: 'sarah@stayspot.com', role: 'Finance Manager', status: 'active' },
    { id: 'TM-002', name: 'Mike Brown', email: 'mike@stayspot.com', role: 'Operations Lead', status: 'active' },
    { id: 'TM-003', name: 'Emma Davis', email: 'emma@stayspot.com', role: 'Support Manager', status: 'active' },
    { id: 'TM-004', name: 'Robert Wilson', email: 'robert@stayspot.com', role: 'Analyst', status: 'pending' }
  ];

  const getPermissionColor = (permission) => {
    const colors = {
      view: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      edit: isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      admin: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
    };
    return colors[permission];
  };

  const getTypeIcon = (type) => {
    const icons = { report: '📊', dashboard: '📈', data: '📁' };
    return icons[type] || '📄';
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShareSubmit = async () => {
    if (!shareForm.name) {
      setError('Please enter a name');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sharing/share', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(shareForm)
      });
      if (!response.ok) throw new Error('Failed to share');
      setShareForm({ name: '', type: 'report', permission: 'view' });
      setShowShareModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInviteSubmit = async () => {
    if (!inviteForm.email) {
      setError('Please enter an email');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sharing/invite', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });
      if (!response.ok) throw new Error('Failed to send invite');
      setInviteForm({ email: '', role: 'viewer' });
      setShowInviteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sharing & Collaboration</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Share reports and collaborate with team members</p>
              </div>
            </div>
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
              <Plus className="w-5 h-5" /> Share New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Shared Items Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shared Items</h2>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>

          {/* Search & Filter */}
          <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search shared items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Types</option>
                <option value="report">Reports</option>
                <option value="dashboard">Dashboards</option>
                <option value="data">Data</option>
              </select>
            </div>
          </div>

          {/* Shared Items Table */}
          <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Item</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Type</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Shared With</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Permission</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Date</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedItems.map((item, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-800'}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{item.sharedWith}</td>
                      <td className={`px-6 py-4 text-sm`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPermissionColor(item.permission)}`}>
                          {item.permission.charAt(0).toUpperCase() + item.permission.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{item.date}</td>
                      <td className={`px-6 py-4 text-sm flex gap-2`}>
                        <button
                          onClick={() => copyToClipboard(item.link, item.id)}
                          className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          {copied === item.id ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Team Members</h2>
            <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
              <Plus className="w-5 h-5" /> Invite Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{member.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active'
                      ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Role: <span className="font-semibold">{member.role}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Settings */}
        <div>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sharing Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Public Sharing</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Enable public sharing</span>
              </label>
            </div>

            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Password Protection</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>Enable password protection</span>
              </label>
            </div>

            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Link Expiration</h3>
              </div>
              <select className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                <option>Never expires</option>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>

            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Log</h3>
              </div>
              <button className={`w-full px-4 py-2 rounded-lg text-sm font-semibold ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Share New Item</h2>
              <button onClick={() => setShowShareModal(false)} className="text-orange-200 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                value={shareForm.name}
                onChange={(e) => setShareForm({ ...shareForm, name: e.target.value })}
                placeholder="Item name"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
              />
              <select
                value={shareForm.type}
                onChange={(e) => setShareForm({ ...shareForm, type: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <option value="report">Report</option>
                <option value="dashboard">Dashboard</option>
                <option value="data">Data</option>
              </select>
              <select
                value={shareForm.permission}
                onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <option value="view">View Only</option>
                <option value="edit">Edit</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
              <button
                onClick={handleShareSubmit}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
              >
                Share
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-orange-200 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="Email address"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
              />
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
              <button
                onClick={handleInviteSubmit}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharingCollaboration;

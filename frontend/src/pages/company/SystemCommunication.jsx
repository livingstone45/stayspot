import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, Send, Bell, Mail, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const SystemCommunication = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const stats = [
    { label: 'Unread Messages', value: '24', icon: '💬', color: 'blue' },
    { label: 'Active Announcements', value: '8', icon: '📢', color: 'orange' },
    { label: 'Pending Notifications', value: '156', icon: '🔔', color: 'red' },
    { label: 'Email Templates', value: '12', icon: '📧', color: 'green' }
  ];

  const messages = [
    { id: 'MSG-001', from: 'John Smith', subject: 'Payment Issue', type: 'message', status: 'unread', date: '2024-01-15 10:30 AM', preview: 'I have not received my payment yet...' },
    { id: 'MSG-002', from: 'Sarah Johnson', subject: 'Property Verification', type: 'message', status: 'read', date: '2024-01-15 09:15 AM', preview: 'Can you help me verify my property?' },
    { id: 'MSG-003', from: 'System', subject: 'Daily Report', type: 'notification', status: 'read', date: '2024-01-15 08:00 AM', preview: 'Daily system report generated' },
    { id: 'MSG-004', from: 'Mike Brown', subject: 'Feature Request', type: 'message', status: 'unread', date: '2024-01-14 04:45 PM', preview: 'Can we add dark mode to the app?' },
    { id: 'MSG-005', from: 'System', subject: 'Backup Complete', type: 'notification', status: 'read', date: '2024-01-14 02:30 PM', preview: 'Database backup completed successfully' }
  ];

  const announcements = [
    { id: 'ANN-001', title: 'System Maintenance', content: 'Scheduled maintenance on Jan 20, 2024', status: 'active', audience: 'All Users', date: '2024-01-15' },
    { id: 'ANN-002', title: 'New Feature Release', content: 'Transportation module now available', status: 'active', audience: 'Companies', date: '2024-01-14' },
    { id: 'ANN-003', title: 'Security Update', content: 'Important security patches released', status: 'archived', audience: 'All Users', date: '2024-01-10' },
    { id: 'ANN-004', title: 'API Rate Limit Changes', content: 'New rate limits effective immediately', status: 'active', audience: 'Developers', date: '2024-01-12' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      read: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800',
      unread: isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800',
      active: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      archived: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'
    };
    return colors[status];
  };

  const getTypeIcon = (type) => {
    const icons = {
      message: <Mail className="w-5 h-5 text-blue-600" />,
      notification: <Bell className="w-5 h-5 text-orange-600" />
    };
    return icons[type];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Communication</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage messages, announcements & notifications</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus className="w-5 h-5" /> New Announcement
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

        {/* Messages Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Messages & Notifications</h2>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>

          {/* Messages Search & Filter */}
          <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              >
                <option value="all">All Types</option>
                <option value="message">Messages</option>
                <option value="notification">Notifications</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'} transition cursor-pointer`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {getTypeIcon(msg.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{msg.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(msg.status)}`}>
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>From: {msg.from}</p>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{msg.preview}</p>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{msg.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Section */}
        <div>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Announcements</h2>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.filter(a => a.status === 'active').map((announcement, idx) => (
              <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{announcement.title}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Audience: {announcement.audience}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(announcement.status)}`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </span>
                </div>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{announcement.content}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{announcement.date}</p>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create New Announcement */}
          <div className={`rounded-xl shadow p-6 border mt-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create New Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Title</label>
                <input
                  type="text"
                  placeholder="Announcement title..."
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Content</label>
                <textarea
                  placeholder="Announcement content..."
                  rows="4"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Target Audience</label>
                <select className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                  <option>All Users</option>
                  <option>Companies</option>
                  <option>Tenants</option>
                  <option>Landlords</option>
                  <option>Developers</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold flex items-center justify-center gap-2">
                <Send className="w-5 h-5" /> Publish Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCommunication;

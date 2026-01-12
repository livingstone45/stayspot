import React, { useState } from 'react';
import { Headphones, Plus, Search, Filter, AlertCircle, CheckCircle, Clock, Eye, MessageSquare, Download } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const ClientSupport = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { label: 'Open Tickets', value: '24', icon: '🎫', color: 'red' },
    { label: 'In Progress', value: '12', icon: '⏳', color: 'yellow' },
    { label: 'Resolved', value: '1,240', icon: '✅', color: 'green' },
    { label: 'Avg Response', value: '2.5h', icon: '⚡', color: 'blue' }
  ];

  const tickets = [
    { id: 'TKT-001', subject: 'Payment not received', user: 'John Smith', priority: 'high', status: 'open', category: 'Payment', date: '2024-01-15' },
    { id: 'TKT-002', subject: 'Property verification issue', user: 'Sarah Johnson', priority: 'medium', status: 'in-progress', category: 'Property', date: '2024-01-14' },
    { id: 'TKT-003', subject: 'Cannot login to account', user: 'Mike Brown', priority: 'high', status: 'open', category: 'Account', date: '2024-01-13' },
    { id: 'TKT-004', subject: 'Booking cancellation request', user: 'Emma Davis', priority: 'low', status: 'in-progress', category: 'Booking', date: '2024-01-12' },
    { id: 'TKT-005', subject: 'Feature request - dark mode', user: 'Robert Wilson', priority: 'low', status: 'open', category: 'Feature', date: '2024-01-11' }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800',
      medium: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      low: isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
    };
    return colors[priority];
  };

  const getStatusColor = (status) => {
    const colors = {
      open: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800',
      'in-progress': isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      resolved: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: <AlertCircle className="w-5 h-5 text-red-600" />,
      'in-progress': <Clock className="w-5 h-5 text-yellow-600" />,
      resolved: <CheckCircle className="w-5 h-5 text-green-600" />
    };
    return icons[status];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Client Support</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage support tickets and resolve client issues</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus className="w-5 h-5" /> New Ticket
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
                placeholder="Search by ticket ID or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Ticket ID</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Subject</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>User</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Category</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Priority</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => (
                  <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{ticket.id}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ticket.subject}</td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{ticket.user}</td>
                    <td className={`px-6 py-4 text-sm`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'}`}>
                        {ticket.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{ticket.date}</td>
                    <td className={`px-6 py-4 text-sm flex gap-2`}>
                      <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Tickets Section */}
        <div className="mt-8">
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>High Priority Open Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.filter(t => t.priority === 'high' && t.status === 'open').map((ticket, idx) => (
              <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-red-700' : 'bg-white border-red-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ticket.subject}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>From: {ticket.user}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                    High Priority
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Category: <span className="font-semibold">{ticket.category}</span></p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Ticket ID: <span className="font-semibold">{ticket.id}</span></p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Created: <span className="font-semibold">{ticket.date}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Reply
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                    Resolve
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

export default ClientSupport;

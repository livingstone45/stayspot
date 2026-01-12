import React, { useState, useEffect } from 'react';
import { Search, Activity, BarChart3, Clock, User, Loader } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockLogs = [
  { id: 1, action: 'send', user_name: 'James Kipchoge', user_id: 'user-001', details: 'Message sent to Mary Wanjiru', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, action: 'publish', user_name: 'Admin', user_id: 'user-002', details: 'Announcement published: System Maintenance', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, action: 'delete', user_name: 'Mary Wanjiru', user_id: 'user-003', details: 'Template deleted: Old Email', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, action: 'update', user_name: 'Finance Team', user_id: 'user-004', details: 'Notification updated: Payment Reminder', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 5, action: 'send', user_name: 'Peter Omondi', user_id: 'user-005', details: 'Bulk message sent to 50 users', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 6, action: 'publish', user_name: 'Admin', user_id: 'user-002', details: 'Announcement published: New Features', created_at: new Date(Date.now() - 345600000).toISOString() }
];

const Logs = () => {
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [actionStats, setActionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchLogs();
    fetchStats();
    fetchActionStats();
  }, [action, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10, ...(action && { action }) });
      
      const response = await fetch(`/api/communication/logs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setLogs(mockLogs);
      setPagination({ page: 1, limit: 10, total: mockLogs.length });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/logs/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setStats({ total: mockLogs.length, actions: 4, users: 5 });
    }
  };

  const fetchActionStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/logs/stats/by-action', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch action stats');
      const data = await response.json();
      setActionStats(data.data || []);
    } catch (err) {
      setActionStats([
        { action: 'send', count: 3 },
        { action: 'publish', count: 2 },
        { action: 'delete', count: 1 },
        { action: 'update', count: 1 }
      ]);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      send: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      publish: isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      delete: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
      update: isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action) => {
    const icons = {
      send: '📤',
      publish: '📢',
      delete: '🗑️',
      update: '✏️'
    };
    return icons[action] || '📋';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Logs</h1>
          <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Track all communication activities</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Activities</p>
                  <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>
                <Activity className={`w-12 h-12 ${isDarkMode ? 'text-orange-600' : 'text-orange-500'} opacity-20`} />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Action Types</p>
                  <p className="text-3xl font-bold mt-2 text-orange-500">{stats.actions}</p>
                </div>
                <BarChart3 className={`w-12 h-12 ${isDarkMode ? 'text-orange-600' : 'text-orange-500'} opacity-20`} />
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Active Users</p>
                  <p className="text-3xl font-bold mt-2 text-orange-500">{stats.users}</p>
                </div>
                <User className={`w-12 h-12 ${isDarkMode ? 'text-orange-600' : 'text-orange-500'} opacity-20`} />
              </div>
            </div>
          </div>
        )}

        {/* Action Stats Chart */}
        {actionStats.length > 0 && (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border mb-8`}>
            <h2 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activities by Type</h2>
            <div className="space-y-3">
              {actionStats.map((stat) => {
                const maxCount = Math.max(...actionStats.map(s => s.count));
                const percentage = (stat.count / maxCount) * 100;
                
                return (
                  <div key={stat.action}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {getActionIcon(stat.action)} {stat.action}
                      </span>
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {stat.count}
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border mb-6`}>
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Actions</option>
            <option value="send">Send</option>
            <option value="publish">Publish</option>
            <option value="delete">Delete</option>
            <option value="update">Update</option>
          </select>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Action</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>User</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Details</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Timestamp</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {logs.map((log) => (
                    <tr key={log.id} className={isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)} {log.action}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        <div>
                          <p className="font-medium">{log.user_name}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{log.user_id?.slice(0, 8)}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        <p className="text-sm">{log.details || 'N/A'}</p>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center`}>
                <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white disabled:opacity-50 hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white disabled:opacity-50 hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;

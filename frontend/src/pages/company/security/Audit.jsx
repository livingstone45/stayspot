import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Activity, Users, Shield, Zap, Clock, Loader, X } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockAuditLogs = [
  { id: 1, action: 'create', user_name: 'James Kipchoge', resource_type: 'Property', ip_address: '192.168.1.1', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, action: 'update', user_name: 'Mary Wanjiru', resource_type: 'User', ip_address: '192.168.1.2', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, action: 'delete', user_name: 'Admin', resource_type: 'Payment', ip_address: '192.168.1.3', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, action: 'view', user_name: 'Peter Omondi', resource_type: 'Report', ip_address: '192.168.1.4', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 5, action: 'login', user_name: 'Grace Muthoni', resource_type: 'User', ip_address: '192.168.1.5', created_at: new Date(Date.now() - 259200000).toISOString() }
];

const Audit = () => {
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [action, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 20, ...(action && { action }) });
      
      const response = await fetch(`/api/security/audit?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      setLogs(data.data || []);
    } catch (err) {
      setLogs(mockAuditLogs);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/security/audit/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setStats({ total_logs: mockAuditLogs.length, active_users: 5, resource_types: 4, action_types: 5 });
    }
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const getActionColor = (action) => {
    const colors = {
      create: isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      update: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      delete: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
      view: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-800',
      login: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Audit Logs</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Track all system activities and changes</p>
          </div>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Logs</p>
                  <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total_logs}</p>
                </div>
                <Activity className="w-12 h-12 opacity-20" />
              </div>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Active Users</p>
                  <p className="text-3xl font-bold mt-2 text-orange-500">{stats.active_users}</p>
                </div>
                <Users className="w-12 h-12 opacity-20" />
              </div>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Resource Types</p>
                  <p className="text-3xl font-bold mt-2 text-orange-500">{stats.resource_types}</p>
                </div>
                <Shield className="w-12 h-12 opacity-20" />
              </div>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Action Types</p>
                  <p className="text-3xl font-bold mt-2 text-orange-500">{stats.action_types}</p>
                </div>
                <Zap className="w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border mb-8`}>
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="view">View</option>
            <option value="login">Login</option>
          </select>
        </div>

        {/* Audit Logs Table */}
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
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Date & Time</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>User</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Action</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Resource</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>IP Address</th>
                    <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {logs.map((log) => (
                    <tr key={log.id} className={isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {log.user_name || 'System'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {log.resource_type}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewLog(log)}
                          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-orange-400 hover:bg-slate-700' : 'text-orange-600 hover:bg-gray-100'}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Audit Log Details</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>User</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedLog.user_name || 'System'}</p>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Action</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Resource Type</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedLog.resource_type}</p>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>IP Address</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedLog.ip_address || 'N/A'}</p>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Timestamp</p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audit;

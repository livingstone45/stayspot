import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle, AlertCircle, Info, Zap, Loader } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockNotifications = [
  { id: 1, title: 'New Message', message: 'You have a new message from James Kipchoge', type: 'message', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, title: 'System Maintenance', message: 'Scheduled maintenance on Friday 10 PM - 2 AM', type: 'announcement', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, title: 'Payment Received', message: 'Payment of KES 5,000 received from tenant', type: 'alert', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, title: 'Property Update', message: 'Your property listing has been updated successfully', type: 'system', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 5, title: 'Booking Confirmed', message: 'Your booking for property #123 has been confirmed', type: 'message', is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() }
];

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('');
  const [read, setRead] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [type, read, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10, ...(type && { type }), ...(read && { read }) });
      
      const response = await fetch(`/api/communication/notifications?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setNotifications(mockNotifications);
      setPagination({ page: 1, limit: 10, total: mockNotifications.length });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/notifications/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setStats({ total: mockNotifications.length, unread: 2, types: 4 });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/communication/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to mark as read');
      fetchNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to mark all as read');
      fetchNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/communication/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete notification');
      fetchNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      message: <Bell className="w-5 h-5" />,
      announcement: <AlertCircle className="w-5 h-5" />,
      alert: <Zap className="w-5 h-5" />,
      system: <Info className="w-5 h-5" />
    };
    return icons[type] || <Bell className="w-5 h-5" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      message: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      announcement: isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      alert: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
      system: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIconColor = (type) => {
    const colors = {
      message: 'text-blue-500',
      announcement: 'text-yellow-500',
      alert: 'text-red-500',
      system: 'text-slate-500'
    };
    return colors[type] || 'text-slate-500';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Stay updated with your notifications</p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
          >
            <CheckCircle className="w-5 h-5" /> Mark All Read
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Unread</p>
              <p className="text-3xl font-bold mt-2 text-orange-500">{stats.unread}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Types</p>
              <p className="text-3xl font-bold mt-2 text-orange-500">{stats.types}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border mb-6 flex gap-4`}>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Types</option>
            <option value="message">Message</option>
            <option value="announcement">Announcement</option>
            <option value="alert">Alert</option>
            <option value="system">System</option>
          </select>

          <select
            value={read}
            onChange={(e) => { setRead(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border hover:shadow-lg transition-all ${
                  !notification.is_read ? (isDarkMode ? 'border-l-4 border-orange-500' : 'border-l-4 border-orange-500') : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <div className={getTypeIconColor(notification.type)}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.is_read && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800'}`}>New</span>
                        )}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mt-2`}>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-green-500' : 'hover:bg-gray-100 text-green-600'}`}
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-red-500' : 'hover:bg-gray-100 text-red-600'}`}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-12 rounded-xl shadow-sm border text-center`}>
            <Bell className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No notifications</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="mt-6 flex justify-between items-center">
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
    </div>
  );
};

export default Notifications;

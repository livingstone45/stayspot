import React, { useState } from 'react';
import { Bell, Trash2, Archive, Check, X, Search, Filter, AlertCircle, CheckCircle, Info, AlertTriangle, Clock, User } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'maintenance',
      title: 'Maintenance Request Completed',
      message: 'The plumbing repair in Unit 305 has been completed successfully.',
      timestamp: '2 minutes ago',
      read: false,
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Rent Payment Received',
      message: 'Payment of $1,500 received from John Smith for Apt 101.',
      timestamp: '1 hour ago',
      read: false,
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      type: 'lease',
      title: 'Lease Renewal Reminder',
      message: 'Lease for Sarah Johnson (Apt 202) expires in 30 days.',
      timestamp: '3 hours ago',
      read: true,
      icon: AlertCircle,
      color: 'blue'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Backup Completed',
      message: 'Daily system backup completed successfully at 2:00 AM.',
      timestamp: '5 hours ago',
      read: true,
      icon: Info,
      color: 'indigo'
    },
    {
      id: 5,
      type: 'tenant',
      title: 'New Tenant Inquiry',
      message: 'Michael Brown has inquired about Unit 104.',
      timestamp: '1 day ago',
      read: true,
      icon: User,
      color: 'purple'
    },
    {
      id: 6,
      type: 'maintenance',
      title: 'Maintenance Request Submitted',
      message: 'Emily Davis submitted a maintenance request for HVAC repair.',
      timestamp: '2 days ago',
      read: true,
      icon: AlertTriangle,
      color: 'orange'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead = filterRead === 'all' || (filterRead === 'unread' ? !notif.read : notif.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const stats = [
    { label: 'Total Notifications', value: notifications.length, color: 'blue' },
    { label: 'Unread', value: unreadCount, color: 'red' },
    { label: 'This Week', value: 4, color: 'purple' },
    { label: 'Archived', value: 2, color: 'gray' }
  ];

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
      gray: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with all your property management activities</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className={`rounded-lg p-4 border ${getColorClasses(stat.color)}`}>
                <p className="text-sm font-medium opacity-75">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            >
              <option value="all">All Types</option>
              <option value="maintenance">Maintenance</option>
              <option value="payment">Payment</option>
              <option value="lease">Lease</option>
              <option value="tenant">Tenant</option>
              <option value="system">System</option>
            </select>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`rounded-lg border p-4 transition-all ${
                    notif.read
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${getColorClasses(notif.color)}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-semibold ${notif.read ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'}`}>
                            {notif.title}
                          </h3>
                          <p className={`text-sm mt-1 ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {notif.timestamp}
                            </span>
                            {!notif.read && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleClearAll}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X, Search, Filter, Bell } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Maintenance Request Overdue', message: 'Unit 305 at Sunset Apartments has an overdue maintenance request', type: 'critical', property: 'Sunset Apartments', timestamp: '2024-01-15 10:30', read: false },
    { id: 2, title: 'Lease Expiring Soon', message: 'John Smith lease at Downtown Lofts expires in 15 days', type: 'warning', property: 'Downtown Lofts', timestamp: '2024-01-15 09:15', read: false },
    { id: 3, title: 'Rent Payment Overdue', message: 'Sarah Johnson has not paid rent for Unit 205', type: 'critical', property: 'Downtown Lofts', timestamp: '2024-01-14 14:45', read: true },
    { id: 4, title: 'Vacancy Alert', message: 'Unit 102 at Riverside Complex is now vacant', type: 'info', property: 'Riverside Complex', timestamp: '2024-01-14 11:20', read: true },
    { id: 5, title: 'Inspection Scheduled', message: 'Move-out inspection scheduled for Unit 401 on Jan 20', type: 'info', property: 'Downtown Lofts', timestamp: '2024-01-14 08:00', read: true },
    { id: 6, title: 'Tenant Complaint', message: 'New maintenance complaint from Unit 202 - Plumbing issue', type: 'warning', property: 'Sunset Apartments', timestamp: '2024-01-13 16:30', read: false },
    { id: 7, title: 'Budget Alert', message: 'Maintenance expenses exceeded budget for January', type: 'warning', property: 'All Properties', timestamp: '2024-01-13 12:00', read: true },
    { id: 8, title: 'System Update', message: 'New features available in property management system', type: 'info', property: 'System', timestamp: '2024-01-12 09:00', read: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const types = ['All', 'critical', 'warning', 'info'];

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || a.type === selectedType;
    const matchesRead = !showUnreadOnly || !a.read;
    return matchesSearch && matchesType && matchesRead;
  });

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setAlerts(alerts.map(a =>
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and track all property alerts</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{alerts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{alerts.filter(a => a.type === 'critical').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{alerts.filter(a => a.type === 'warning').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{unreadCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Unread Only</span>
            </label>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 transition-all ${getAlertColor(alert.type)} ${!alert.read ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(alert.type)}`}>
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </span>
                          {!alert.read && (
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{alert.property}</span>
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!alert.read && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No alerts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;

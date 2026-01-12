import React, { useState } from 'react';
import { Bell, X, AlertCircle, Info } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const NotificationBell = () => {
  const { isDark } = useThemeMode();
  const [showDropdown, setShowDropdown] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'error', title: 'Maintenance Request Urgent', message: 'Unit 305 has an urgent plumbing issue', time: '1 hour ago' },
    { id: 2, type: 'warning', title: 'Late Payment', message: 'Tenant in Unit 102 is 5 days late on rent', time: '2 hours ago' },
    { id: 3, type: 'info', title: 'Lease Renewal Reminder', message: 'Unit 201 lease expires in 30 days', time: '1 day ago' },
  ]);

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'error': return 'from-red-500 to-pink-500';
      case 'warning': return 'from-orange-500 to-amber-500';
      case 'info': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAlertBgColor = (type) => {
    switch(type) {
      case 'error': return isDark ? 'bg-red-900 bg-opacity-30 border-red-700' : 'bg-red-50 border-red-200';
      case 'warning': return isDark ? 'bg-orange-900 bg-opacity-30 border-orange-700' : 'bg-orange-50 border-orange-200';
      case 'info': return isDark ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200';
      default: return isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertTextColor = (type) => {
    switch(type) {
      case 'error': return isDark ? 'text-red-300' : 'text-red-800';
      case 'warning': return isDark ? 'text-orange-300' : 'text-orange-800';
      case 'info': return isDark ? 'text-blue-300' : 'text-blue-800';
      default: return isDark ? 'text-gray-300' : 'text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-xl transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
      >
        <Bell size={24} />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className={`absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl z-50 border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-black`}>🔔 Notifications</h3>
              <button onClick={() => setShowDropdown(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X size={20} />
              </button>
            </div>

            {alerts.length === 0 ? (
              <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No notifications</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border-2 ${getAlertBgColor(alert.type)}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${getAlertColor(alert.type)} text-white flex-shrink-0`}>
                        {alert.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>{alert.title}</p>
                        <p className={`${getAlertTextColor(alert.type)} text-xs mt-1`}>{alert.message}</p>
                        <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs mt-2`}>{alert.time}</p>
                      </div>
                      <button 
                        onClick={() => dismissAlert(alert.id)}
                        className={`flex-shrink-0 p-1 rounded-lg transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {alerts.length > 0 && (
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition text-sm">
                View All Alerts
              </button>
            )}
          </div>
        </div>
      )}

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;

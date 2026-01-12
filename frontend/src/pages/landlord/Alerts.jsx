import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alerts = () => {
  const { isDark } = useThemeMode();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'error', title: 'Maintenance Request Urgent', message: 'Unit 305 has an urgent plumbing issue', time: '1 hour ago' },
    { id: 2, type: 'warning', title: 'Late Payment', message: 'Tenant in Unit 102 is 5 days late on rent', time: '2 hours ago' },
    { id: 3, type: 'info', title: 'Lease Renewal Reminder', message: 'Unit 201 lease expires in 30 days', time: '1 day ago' },
  ]);

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-4`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const getAlertStyles = (type) => {
    switch(type) {
      case 'error':
        return isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return isDark ? 'bg-yellow-900 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return isDark ? 'bg-blue-900 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className={containerClasses}>
      <h1 className={titleClasses}>Alerts 🚨</h1>
      <p className={`${textClasses} mb-8`}>System alerts and notifications</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm mb-2`}>Urgent Issues</p>
          <p className={`${isDark ? 'text-red-400' : 'text-red-600'} text-2xl font-bold`}>{alerts.filter(a => a.type === 'error').length}</p>
        </div>
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm mb-2`}>Warnings</p>
          <p className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} text-2xl font-bold`}>{alerts.filter(a => a.type === 'warning').length}</p>
        </div>
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm mb-2`}>Info</p>
          <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>{alerts.filter(a => a.type === 'info').length}</p>
        </div>
      </div>

      <div className={cardClasses}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`border rounded-lg p-4 flex items-start gap-4 ${getAlertStyles(alert.type)}`}>
              <div className="mt-1">
                {alert.type === 'error' && <AlertCircle size={20} />}
                {alert.type === 'warning' && <AlertCircle size={20} />}
                {alert.type === 'info' && <Info size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{alert.title}</h3>
                <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                <p className="text-xs opacity-75">{alert.time}</p>
              </div>
              <button onClick={() => dismissAlert(alert.id)} className="flex-shrink-0 mt-1 hover:opacity-75 transition">
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;

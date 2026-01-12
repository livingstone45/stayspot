import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../hooks/useThemeMode';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Calendar, DollarSign, FileText, MessageSquare, Home, Settings, Zap } from 'lucide-react';

const DashboardImproved = () => {
  const { isDark, getClassNames } = useThemeMode();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    setDashboardData({
      rentStatus: 'Paid',
      rentDue: '$0',
      nextDueDate: 'Jan 1, 2025',
      maintenanceRequests: 3,
      unresolvedIssues: 1,
      messageCount: 7,
      unreadMessages: 2,
      documents: 12,
      leaseStatus: 'Active',
      leaseExpiresIn: '11 months',
      propertyName: 'Sunset Valley Apartments',
      unitNumber: '504',
      moveInDate: 'Jan 1, 2024',
      monthlyRent: '$2,500'
    });
  }, []);

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 hover:shadow-lg transition`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <div className={containerClasses}>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>Welcome back, {user.firstName}! 👋</h1>
        <p className={subtitleClasses}>
          {dashboardData?.propertyName} • Unit {dashboardData?.unitNumber}
        </p>
      </div>

      {/* Key Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Rent Status */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`${textClasses} text-sm font-medium mb-1`}>Rent Status</p>
              <p className={`${isDark ? 'text-green-400' : 'text-green-600'} text-2xl font-bold`}>
                {dashboardData?.rentStatus}
              </p>
            </div>
            <CheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={32} />
          </div>
          <p className={`${textClasses} text-xs`}>Next: {dashboardData?.nextDueDate}</p>
        </div>

        {/* Maintenance */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`${textClasses} text-sm font-medium mb-1`}>Maintenance</p>
              <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>
                {dashboardData?.maintenanceRequests}
              </p>
            </div>
            <Zap className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
          </div>
          <p className={`${textClasses} text-xs`}>{dashboardData?.unresolvedIssues} unresolved</p>
        </div>

        {/* Messages */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`${textClasses} text-sm font-medium mb-1`}>Messages</p>
              <p className={`${isDark ? 'text-purple-400' : 'text-purple-600'} text-2xl font-bold`}>
                {dashboardData?.messageCount}
              </p>
            </div>
            <MessageSquare className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
          </div>
          <p className={`${textClasses} text-xs`}>{dashboardData?.unreadMessages} unread</p>
        </div>

        {/* Documents */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`${textClasses} text-sm font-medium mb-1`}>Documents</p>
              <p className={`${isDark ? 'text-orange-400' : 'text-orange-600'} text-2xl font-bold`}>
                {dashboardData?.documents}
              </p>
            </div>
            <FileText className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} size={32} />
          </div>
          <p className={`${textClasses} text-xs`}>All files stored</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Property Information */}
        <div className={`lg:col-span-2 ${cardClasses}`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-6 flex items-center gap-2`}>
            <Home size={24} />
            Property Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={`${textClasses} text-sm font-medium mb-2`}>Property</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
                {dashboardData?.propertyName}
              </p>
            </div>
            <div>
              <p className={`${textClasses} text-sm font-medium mb-2`}>Unit Number</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
                #{dashboardData?.unitNumber}
              </p>
            </div>
            <div>
              <p className={`${textClasses} text-sm font-medium mb-2`}>Move-In Date</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
                {dashboardData?.moveInDate}
              </p>
            </div>
            <div>
              <p className={`${textClasses} text-sm font-medium mb-2`}>Monthly Rent</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
                {dashboardData?.monthlyRent}
              </p>
            </div>
          </div>
        </div>

        {/* Lease Status */}
        <div className={cardClasses}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold mb-4 flex items-center gap-2`}>
            <Calendar size={20} />
            Lease Status
          </h2>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
              <span className={`${isDark ? 'text-green-300' : 'text-green-700'} font-semibold`}>
                {dashboardData?.leaseStatus}
              </span>
            </div>
            <p className={`${textClasses} text-sm`}>
              Expires in {dashboardData?.leaseExpiresIn}
            </p>
          </div>
          <Link to="/tenant/lease" className={`w-full px-4 py-2 rounded-lg font-medium text-center transition ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            View Lease
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '💳', title: 'Pay Rent', desc: 'Make a payment', to: '/tenant/payments' },
            { icon: '🔧', title: 'Request Maintenance', desc: 'Report an issue', to: '/tenant/maintenance' },
            { icon: '💬', title: 'Send Message', desc: 'Contact support', to: '/tenant/messages' },
            { icon: '📄', title: 'View Documents', desc: 'My documents', to: '/tenant/documents' }
          ].map((action, idx) => (
            <Link key={idx} to={action.to} className={`${cardClasses} text-center hover:scale-105 transform transition`}>
              <div className="text-4xl mb-3">{action.icon}</div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>{action.title}</h3>
              <p className={`${textClasses} text-xs`}>{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={cardClasses}>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
          📋 Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { time: '2 hours ago', event: 'Rent payment received', status: 'success' },
            { time: '1 day ago', event: 'Maintenance request created', status: 'pending' },
            { time: '3 days ago', event: 'Message received from landlord', status: 'info' },
            { time: '5 days ago', event: 'Lease document uploaded', status: 'success' }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{item.event}</p>
                <p className={`${textClasses} text-xs`}>{item.time}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-semibold ${
                item.status === 'success' ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800' :
                item.status === 'pending' ? isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800' :
                isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.status === 'success' ? '✓ Done' : item.status === 'pending' ? '⏱ Pending' : 'ℹ️ Info'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardImproved;

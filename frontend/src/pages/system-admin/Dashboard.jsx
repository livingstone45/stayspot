import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Shield,
  Database,
  Globe,
  Cpu,
  Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    loadSystemStats();
  }, [timeRange]);

  const loadSystemStats = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const data = {
        totalUsers: 1250,
        totalCompanies: 45,
        totalProperties: 850,
        monthlyRevenue: 125000
      };
      setStats(data);
    } catch (error) {
      console.error('Failed to load system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const systemHealthMetrics = [
    { label: 'API Response Time', value: '45ms', status: 'good', icon: <Zap className="w-5 h-5" /> },
    { label: 'Database Latency', value: '12ms', status: 'good', icon: <Database className="w-5 h-5" /> },
    { label: 'Server Uptime', value: '99.98%', status: 'good', icon: <Activity className="w-5 h-5" /> },
    { label: 'Active Connections', value: '2,458', status: 'warning', icon: <Globe className="w-5 h-5" /> },
    { label: 'Memory Usage', value: '68%', status: 'good', icon: <Cpu className="w-5 h-5" /> },
    { label: 'Security Threats', value: '0', status: 'good', icon: <Shield className="w-5 h-5" /> },
  ];

  const recentActivities = [
    { user: 'Company ABC', action: 'Added 5 new properties', time: '2 minutes ago', type: 'success' },
    { user: 'System', action: 'Performed automated backup', time: '15 minutes ago', type: 'info' },
    { user: 'Admin User', action: 'Updated user permissions', time: '30 minutes ago', type: 'warning' },
    { user: 'Auto-scaling', action: 'Added 2 new server instances', time: '1 hour ago', type: 'success' },
    { user: 'Security System', action: 'Blocked suspicious login attempt', time: '2 hours ago', type: 'danger' },
  ];

  const quickActions = [
    { title: 'Run System Diagnostics', icon: <Activity className="w-5 h-5" />, color: 'blue' },
    { title: 'Update System Settings', icon: <Shield className="w-5 h-5" />, color: 'green' },
    { title: 'View Audit Logs', icon: <Database className="w-5 h-5" />, color: 'purple' },
    { title: 'Manage Integrations', icon: <Globe className="w-5 h-5" />, color: 'orange' },
    { title: 'System Backup', icon: <Database className="w-5 h-5" />, color: 'red' },
    { title: 'Performance Report', icon: <BarChart3 className="w-5 h-5" />, color: 'indigo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Administration Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.firstName}! Here's what's happening with your system.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <Clock className="w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm text-gray-700"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <button
                onClick={loadSystemStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,248</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">45,892</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$284.2K</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +23.1% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Issues</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                <p className="text-sm text-red-600 flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* System Health Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">System Health Metrics</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Good</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Warning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Critical</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {systemHealthMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${
                        metric.status === 'good' ? 'bg-green-100' :
                        metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <div className={`${
                          metric.status === 'good' ? 'text-green-600' :
                          metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metric.icon}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 bg-${action.color}-100`}>
                        <div className={`text-${action.color}-600`}>{action.icon}</div>
                      </div>
                      <span className="font-medium text-gray-900">{action.title}</span>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}this dashboard should work with database every information should come from database tables
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & System Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent System Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Activity
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    activity.type === 'success' ? 'bg-green-100' :
                    activity.type === 'warning' ? 'bg-yellow-100' :
                    activity.type === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <div className={`text-sm font-semibold ${
                      activity.type === 'success' ? 'text-green-600' :
                      activity.type === 'warning' ? 'text-yellow-600' :
                      activity.type === 'danger' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {activity.user.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activity.type === 'success' ? 'bg-green-100 text-green-800' :
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    activity.type === 'danger' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">System Performance</h2>
              <div className="text-sm text-gray-500">Last 24 hours</div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">API Requests</span>
                  <span className="text-sm font-bold text-gray-900">2.4M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Database Queries</span>
                  <span className="text-sm font-bold text-gray-900">8.7M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                  <span className="text-sm font-bold text-gray-900">1.2TB / 2TB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Network Throughput</span>
                  <span className="text-sm font-bold text-gray-900">4.2 Gbps</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-700 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Critical Alerts Requiring Attention
            </h2>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              View All Alerts
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Database replication lag detected</p>
                  <p className="text-sm text-gray-600">Primary-secondary replication is 45 seconds behind</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                Resolve
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">API response time slowing</p>
                  <p className="text-sm text-gray-600">Average response time increased by 35% in last hour</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
                Investigate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
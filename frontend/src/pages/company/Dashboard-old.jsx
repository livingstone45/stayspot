import React, { useState, useEffect } from 'react';
import { Building, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Calendar, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Settings, Download, Filter, Search, Globe, Zap, Shield, Activity } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { managementAPI } from '../../services/managementAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CompanyDashboard = () => {
  const { isDarkMode } = useThemeMode();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Fetch dashboard data on component mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [dashboardDataRes, metricsRes, activityRes] = await Promise.all([
        managementAPI.getDashboardStats(timeRange).catch(() => null),
        managementAPI.getKeyMetrics().catch(() => null),
        managementAPI.getRecentActivities(10).catch(() => null)
      ]);

      if (dashboardDataRes) {
        setDashboardData(dashboardDataRes);
      }
      if (metricsRes) {
        setMetrics(metricsRes);
      }
      if (activityRes) {
        setRecentActivity(Array.isArray(activityRes) ? activityRes : activityRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400'}`}>
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <p className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
    {
      label: 'Total Properties',
      value: 1240,
      change: '+8.5%',
      icon: Building,
      color: 'blue',
      trend: 'up',
      subtext: 'Across all companies'
    },
    {
      label: 'Active Users',
      value: '45.2K',
      change: '+12.3%',
      icon: Users,
      color: 'purple',
      trend: 'up',
      subtext: 'Property managers & tenants'
    },
    {
      label: 'Platform Revenue',
      value: '$2.45M',
      change: '+18.7%',
      icon: DollarSign,
      color: 'green',
      trend: 'up',
      subtext: 'Monthly recurring'
    },
    {
      label: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      icon: Zap,
      color: 'orange',
      trend: 'up',
      subtext: 'Uptime this month'
    }
  ];

  const topCompanies = [
    { id: 1, name: 'Premium Properties Inc', properties: 156, revenue: '$245,000', users: 2340, status: 'active' },
    { id: 2, name: 'Urban Rentals Co', properties: 98, revenue: '$187,500', users: 1850, status: 'active' },
    { id: 3, name: 'Coastal Homes Ltd', properties: 87, revenue: '$156,200', users: 1620, status: 'active' },
    { id: 4, name: 'Metro Management', properties: 72, revenue: '$134,800', users: 1340, status: 'active' },
    { id: 5, name: 'Suburban Properties', properties: 65, revenue: '$98,500', users: 980, status: 'active' }
  ];

  const systemMetrics = [
    { label: 'API Requests', value: '2.4B', change: '+15%', icon: '📡' },
    { label: 'Database Queries', value: '8.7M', change: '+22%', icon: '💾' },
    { label: 'Active Sessions', value: '12.5K', change: '+8%', icon: '👥' },
    { label: 'Data Processed', value: '450GB', change: '+31%', icon: '📊' }
  ];

  const revenueBreakdown = [
    { source: 'Subscription Plans', percentage: 65, amount: '$1.59M' },
    { source: 'Premium Features', percentage: 20, amount: '$490K' },
    { source: 'API Usage', percentage: 10, amount: '$245K' },
    { source: 'Support Services', percentage: 5, amount: '$122.5K' }
  ];

  const alerts = [
    { id: 1, type: 'critical', title: 'High API Usage', message: '3 companies exceeding rate limits', time: '5 min ago' },
    { id: 2, type: 'warning', title: 'Payment Failed', message: '2 companies with failed payments', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'New Signups', message: '12 new companies registered today', time: '2 hours ago' },
    { id: 4, type: 'success', title: 'System Update', message: 'Database optimization completed', time: '4 hours ago' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-purple-200/50 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>StaySpot Admin Dashboard</h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>System-wide analytics and management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-lg border font-semibold transition ${
                  isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-purple-200 bg-white text-slate-900'
                }`}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'}`}>
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              green: 'from-green-500 to-green-600',
              orange: 'from-orange-500 to-orange-600'
            };
            return (
              <div
                key={idx}
                className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm cursor-pointer transition hover:shadow-2xl ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-slate-600' : 'bg-white/80 border-purple-200/50 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${colorMap[stat.color]} rounded-lg shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className={`lg:col-span-2 rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trend</h2>
              </div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Last 6 months</span>
            </div>
            <div className="space-y-4">
              {[
                { month: 'Jan', value: 1800000, percent: 60 },
                { month: 'Feb', value: 1950000, percent: 65 },
                { month: 'Mar', value: 2100000, percent: 70 },
                { month: 'Apr', value: 2250000, percent: 75 },
                { month: 'May', value: 2350000, percent: 78 },
                { month: 'Jun', value: 2450000, percent: 82 }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.month}</span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${(item.value / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-orange-600" />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Mix</h2>
            </div>
            <div className="space-y-3">
              {revenueBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.source}</span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.amount}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, idx) => (
            <div key={idx} className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
              isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{metric.icon}</span>
                <span className="text-green-600 text-sm font-semibold">{metric.change}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{metric.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Top Companies & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Companies */}
          <div className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Top Companies</h2>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {topCompanies.map((company) => (
                <div key={company.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.name}</p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Properties:</span> <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.properties}</span></div>
                    <div><span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Revenue:</span> <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.revenue}</span></div>
                    <div><span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Users:</span> <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.users}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className={`rounded-2xl shadow-xl p-6 border backdrop-blur-sm ${
            isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/80 border-purple-200/50'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const alertColors = {
                  critical: isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400',
                  warning: isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-400',
                  info: isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400',
                  success: isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'
                };
                return (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alertColors[alert.type]}`}>
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{alert.title}</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{alert.message}</p>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{alert.time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

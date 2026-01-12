import React, { useState, useEffect } from 'react';
import { Building, Users, DollarSign, TrendingUp, RefreshCw, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeMode } from '../../hooks/useThemeMode';

const ManagementDashboard = () => {
  const { isDarkMode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [maintenancePriority, setMaintenancePriority] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topProperties, setTopProperties] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/management/dashboard?period=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      
      if (data.success && data.data) {
        setStats(data.data.overview);
        setRevenueData(data.data.revenue || []);
        setOccupancyData(data.data.occupancy || []);
        setPropertyStatus(data.data.propertyStatus || []);
        setTaskStatus(data.data.taskStatus || []);
        setMaintenancePriority(data.data.maintenancePriority || []);
        setRecentActivities(data.data.recentActivities || []);
        setTopProperties(data.data.topProperties || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultStats = [
    { label: 'Total Properties', value: stats?.totalProperties || '0', icon: Building, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Occupancy Rate', value: stats?.occupancyRate || '0%', icon: Users, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Monthly Revenue', value: stats?.monthlyRevenue || '$0', icon: DollarSign, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Active Tasks', value: stats?.activeTasks || '0', icon: Activity, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  const defaultRevenueData = [
    { month: 'Jan', revenue: 0, expenses: 0 },
    { month: 'Feb', revenue: 0, expenses: 0 },
    { month: 'Mar', revenue: 0, expenses: 0 },
    { month: 'Apr', revenue: 0, expenses: 0 },
    { month: 'May', revenue: 0, expenses: 0 },
    { month: 'Jun', revenue: 0, expenses: 0 },
  ];

  const defaultOccupancyData = [
    { month: 'Jan', occupancy: 0 },
    { month: 'Feb', occupancy: 0 },
    { month: 'Mar', occupancy: 0 },
    { month: 'Apr', occupancy: 0 },
    { month: 'May', occupancy: 0 },
    { month: 'Jun', occupancy: 0 },
  ];

  if (loading) {
    return (
      <div className={`w-screen min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-8`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }

const ManagementDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  const revenueData = [
    { month: 'Jan', revenue: 85000, expenses: 52000 },
    { month: 'Feb', revenue: 92000, expenses: 58000 },
    { month: 'Mar', revenue: 98000, expenses: 61000 },
    { month: 'Apr', revenue: 105000, expenses: 65000 },
    { month: 'May', revenue: 112000, expenses: 68000 },
    { month: 'Jun', revenue: 125000, expenses: 72000 },
  ];

  const occupancyData = [
    { month: 'Jan', occupancy: 88 },
    { month: 'Feb', occupancy: 90 },
    { month: 'Mar', occupancy: 92 },
    { month: 'Apr', occupancy: 94 },
    { month: 'May', occupancy: 95 },
    { month: 'Jun', occupancy: 96 },
  ];

  const propertyStatus = [
    { name: 'Occupied', value: 42, color: '#10b981' },
    { name: 'Vacant', value: 6, color: '#f59e0b' },
    { name: 'Maintenance', value: 2, color: '#ef4444' },
  ];

  const taskStatus = [
    { name: 'Completed', value: 145, color: '#06b6d4' },
    { name: 'In Progress', value: 63, color: '#3b82f6' },
    { name: 'Pending', value: 32, color: '#f59e0b' },
  ];

  const maintenancePriority = [
    { name: 'Emergency', value: 3, color: '#dc2626' },
    { name: 'Urgent', value: 12, color: '#f97316' },
    { name: 'Routine', value: 35, color: '#10b981' },
  ];

  const stats = [
    { label: 'Total Properties', value: '50', icon: Building, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Occupancy Rate', value: '96%', icon: Users, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Monthly Revenue', value: '$125K', icon: DollarSign, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Active Tasks', value: '95', icon: Activity, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className={`w-screen min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="w-full h-full px-0">
        {/* Header */}
        <div className="px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Management Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Here's your property overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button onClick={() => setLoading(!loading)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Revenue & Expenses</h2>
              <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.length > 0 ? revenueData : defaultRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
                <Legend />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy Trend */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Occupancy Trend</h2>
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData.length > 0 ? occupancyData : defaultOccupancyData}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
                <Line type="monotone" dataKey="occupancy" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts Row */}
        <div className="px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Property Status */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Property Status</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={propertyStatus.length > 0 ? propertyStatus : []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {(propertyStatus.length > 0 ? propertyStatus : []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {(propertyStatus.length > 0 ? propertyStatus : []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</span>
                  </div>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Status */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Task Status</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={taskStatus.length > 0 ? taskStatus : []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {(taskStatus.length > 0 ? taskStatus : []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {(taskStatus.length > 0 ? taskStatus : []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</span>
                  </div>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Priority */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Maintenance Priority</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={maintenancePriority.length > 0 ? maintenancePriority : []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {(maintenancePriority.length > 0 ? maintenancePriority : []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {(maintenancePriority.length > 0 ? maintenancePriority : []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</span>
                  </div>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Top Properties */}
        <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((activity, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.desc}</p>
                  </div>
                  <span className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.time}</span>
                </div>
              )) : (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No recent activities</p>
              )}
            </div>
          </div>

          {/* Top Properties */}
          <div className={`rounded-xl shadow-sm p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top Performing Properties</h2>
            <div className="space-y-4">
              {topProperties.length > 0 ? topProperties.map((prop, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{prop.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Occupancy: {prop.occupancy}%</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tenants: {prop.tenants}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{prop.revenue}</span>
                </div>
              )) : (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No properties data</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Avg Rent/Unit', value: '$2,350', change: '+5.2%', color: 'from-indigo-500 to-indigo-600' },
            { label: 'Collection Rate', value: '98.5%', change: '+2.1%', color: 'from-cyan-500 to-cyan-600' },
            { label: 'Maintenance Cost', value: '$1,250', change: '-3.4%', color: 'from-rose-500 to-rose-600' },
            { label: 'Tenant Satisfaction', value: '4.8/5', change: '+0.3', color: 'from-amber-500 to-amber-600' },
          ].map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metric.value}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">{metric.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;

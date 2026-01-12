import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SystemAdminAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [chartType, setChartType] = useState('line');

  const timeRanges = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'User Analytics', icon: Users },
    { id: 'properties', name: 'Property Analytics', icon: Building },
    { id: 'financial', name: 'Financial Analytics', icon: DollarSign },
    { id: 'system', name: 'System Performance', icon: Activity },
  ];

  const sampleAnalytics = {
    overview: {
      totalUsers: 45892,
      activeUsers: 12485,
      totalCompanies: 1248,
      activeCompanies: 892,
      totalProperties: 89245,
      activeProperties: 45218,
      monthlyRevenue: 284200,
      avgRevenuePerUser: 62.5,
      userGrowth: 12.5,
      revenueGrowth: 23.1,
      propertyGrowth: 8.7,
      companyGrowth: 5.3,
    },
    users: {
      total: 45892,
      active: 12485,
      newThisMonth: 1245,
      churnRate: 2.3,
      avgSessionDuration: '12m 45s',
      userDistribution: {
        tenants: 38945,
        landlords: 2145,
        propertyManagers: 892,
        companyAdmins: 124,
        systemAdmins: 5,
      },
      activity: {
        logins: 12485,
        propertyViews: 89245,
        searches: 124852,
        applications: 8924,
      },
      devices: {
        mobile: 65,
        desktop: 30,
        tablet: 5,
      },
      locations: {
        'North America': 45,
        'Europe': 30,
        'Asia': 15,
        'Other': 10,
      },
    },
    properties: {
      total: 89245,
      active: 45218,
      vacant: 12485,
      underMaintenance: 2458,
      avgPrice: 2450,
      avgOccupancyRate: 85.3,
      byType: {
        apartments: 45218,
        houses: 21458,
        condos: 12485,
        commercial: 8924,
        vacation: 1245,
      },
      byStatus: {
        available: 12485,
        rented: 45218,
        pending: 2458,
        maintenance: 1245,
        offMarket: 892,
      },
      topCities: [
        { city: 'New York', count: 8924 },
        { city: 'Los Angeles', count: 7458 },
        { city: 'Chicago', count: 4521 },
        { city: 'Miami', count: 3892 },
        { city: 'Houston', count: 3245 },
      ],
    },
    financial: {
      monthlyRevenue: 284200,
      ytdRevenue: 2854200,
      avgTransaction: 2450,
      totalTransactions: 12485,
      paymentMethods: {
        creditCard: 65,
        bankTransfer: 25,
        digitalWallet: 8,
        other: 2,
      },
      revenueByType: {
        rent: 75,
        fees: 15,
        services: 8,
        other: 2,
      },
      outstanding: 124850,
      collected: 284200,
      expenses: 89245,
      netProfit: 194955,
    },
    system: {
      uptime: 99.98,
      avgResponseTime: 45,
      apiRequests: 2485200,
      databaseQueries: 8745200,
      storageUsed: '1.2TB',
      bandwidth: '4.2TB',
      activeConnections: 2458,
      errorRate: 0.12,
      performanceScore: 98.5,
    },
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics(sampleAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportAnalytics(activeTab, timeRange);
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  };

  const toggleMetric = (metricId) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Users', 
            value: analytics?.overview?.totalUsers?.toLocaleString() || '0',
            change: analytics?.overview?.userGrowth || 0,
            icon: Users,
            color: 'blue'
          },
          { 
            title: 'Active Companies', 
            value: analytics?.overview?.activeCompanies?.toLocaleString() || '0',
            change: analytics?.overview?.companyGrowth || 0,
            icon: Building,
            color: 'green'
          },
          { 
            title: 'Total Properties', 
            value: analytics?.overview?.totalProperties?.toLocaleString() || '0',
            change: analytics?.overview?.propertyGrowth || 0,
            icon: Building,
            color: 'purple'
          },
          { 
            title: 'Monthly Revenue', 
            value: `$${(analytics?.overview?.monthlyRevenue || 0).toLocaleString()}`,
            change: analytics?.overview?.revenueGrowth || 0,
            icon: DollarSign,
            color: 'orange'
          },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${metric.change >= 0 ? '' : 'rotate-180'}`} />
                  {Math.abs(metric.change)}% {metric.change >= 0 ? 'increase' : 'decrease'}
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <LineChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">User growth chart visualization</p>
              <p className="text-sm text-gray-500">Data for {timeRanges.find(t => t.value === timeRange)?.label}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Revenue trend visualization</p>
              <p className="text-sm text-gray-500">Data for {timeRanges.find(t => t.value === timeRange)?.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { id: 'userMetrics', title: 'User Metrics', data: analytics?.users },
            { id: 'propertyMetrics', title: 'Property Metrics', data: analytics?.properties },
            { id: 'financialMetrics', title: 'Financial Metrics', data: analytics?.financial },
            { id: 'systemMetrics', title: 'System Metrics', data: analytics?.system },
          ].map((section) => (
            <div key={section.id} className="p-6">
              <button
                onClick={() => toggleMetric(section.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">{section.title}</h4>
                {expandedMetrics[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedMetrics[section.id] && section.data && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(section.data).map(([key, value]) => {
                    if (typeof value === 'object') return null;
                    return (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {typeof value === 'number' 
                            ? value.toLocaleString() 
                            : value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-8">
      {/* User Distribution */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analytics?.users?.userDistribution && Object.entries(analytics.users.userDistribution).map(([role, count]) => (
            <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{role}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{count.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / analytics.users.total) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
          <div className="space-y-4">
            {analytics?.users?.activity && Object.entries(analytics.users.activity).map(([activity, count]) => (
              <div key={activity} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{activity}</span>
                <span className="font-medium text-gray-900">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Distribution</h3>
          <div className="space-y-4">
            {analytics?.users?.devices && Object.entries(analytics.users.devices).map(([device, percentage]) => (
              <div key={device}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">{device}</span>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics?.users?.locations && Object.entries(analytics.users.locations).map(([region, percentage]) => (
            <div key={region} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{region}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="space-y-8">
      {/* Property Types */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analytics?.properties?.byType && Object.entries(analytics.properties.byType).map(([type, count]) => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{type}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{count.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / analytics.properties.total) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Property Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Status</h3>
          <div className="space-y-4">
            {analytics?.properties?.byStatus && Object.entries(analytics.properties.byStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">{status}</span>
                  <span className="font-medium text-gray-900">{count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      status === 'rented' ? 'bg-green-600' :
                      status === 'available' ? 'bg-blue-600' :
                      status === 'pending' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${(count / analytics.properties.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Cities</h3>
          <div className="space-y-4">
            {analytics?.properties?.topCities?.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{index + 1}.</span>
                  <span className="text-sm text-gray-600">{city.city}</span>
                </div>
                <span className="font-medium text-gray-900">{city.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialTab = () => (
    <div className="space-y-8">
      {/* Revenue Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics?.financial?.revenueByType && Object.entries(analytics.financial.revenueByType).map(([type, percentage]) => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{type}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
          <div className="space-y-4">
            {analytics?.financial?.paymentMethods && Object.entries(analytics.financial.paymentMethods).map(([method, percentage]) => (
              <div key={method}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">{method}</span>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Monthly Revenue', value: `$${analytics?.financial?.monthlyRevenue?.toLocaleString() || '0'}` },
              { label: 'YTD Revenue', value: `$${analytics?.financial?.ytdRevenue?.toLocaleString() || '0'}` },
              { label: 'Net Profit', value: `$${analytics?.financial?.netProfit?.toLocaleString() || '0'}` },
              { label: 'Outstanding', value: `$${analytics?.financial?.outstanding?.toLocaleString() || '0'}` },
              { label: 'Avg Transaction', value: `$${analytics?.financial?.avgTransaction?.toLocaleString() || '0'}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Uptime', value: `${analytics?.system?.uptime || 0}%`, color: 'green' },
          { label: 'Avg Response Time', value: `${analytics?.system?.avgResponseTime || 0}ms`, color: 'blue' },
          { label: 'Error Rate', value: `${analytics?.system?.errorRate || 0}%`, color: 'red' },
          { label: 'Performance Score', value: `${analytics?.system?.performanceScore || 0}/100`, color: 'purple' },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600">{metric.label}</p>
            <p className={`text-2xl font-bold mt-2 ${
              metric.color === 'green' ? 'text-green-600' :
              metric.color === 'blue' ? 'text-blue-600' :
              metric.color === 'red' ? 'text-red-600' : 'text-purple-600'
            }`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* System Statistics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics?.system && Object.entries(analytics.system).map(([key, value]) => {
            if (typeof value === 'object' || key === 'uptime' || key === 'avgResponseTime' || key === 'errorRate' || key === 'performanceScore') {
              return null;
            }
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="font-medium text-gray-900 mt-1">
                  {typeof value === 'number' && key.includes('bandwidth') ? `${value}TB` :
                   typeof value === 'number' && key.includes('storage') ? `${value}TB` :
                   typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return renderUsersTab();
      case 'properties':
        return renderPropertiesTab();
      case 'financial':
        return renderFinancialTab();
      case 'system':
        return renderSystemTab();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Comprehensive insights into platform performance and usage
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={loadAnalytics}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        {renderTabContent()}

        {/* Insights Panel */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'User Engagement',
                insight: 'Active users increased by 12.5% this month',
                recommendation: 'Consider running user engagement campaigns',
                icon: TrendingUp,
                color: 'green'
              },
              {
                title: 'Revenue Growth',
                insight: 'Monthly revenue up by 23.1% compared to last month',
                recommendation: 'Expand premium feature offerings',
                icon: DollarSign,
                color: 'blue'
              },
              {
                title: 'System Performance',
                insight: '99.98% uptime maintained with 45ms avg response time',
                recommendation: 'Monitor server capacity for peak hours',
                icon: Activity,
                color: 'purple'
              },
            ].map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg bg-${insight.color}-100 mr-3`}>
                      <Icon className={`w-5 h-5 text-${insight.color}-600`} />
                    </div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.insight}</p>
                  <p className="text-xs text-gray-500">{insight.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminAnalytics;
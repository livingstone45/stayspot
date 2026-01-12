import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, CreditCard, Wallet, Building, Users, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const RevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const revenueData = [
    { month: 'Jan', collected: 45000, pending: 2000, overdue: 500 },
    { month: 'Feb', collected: 48000, pending: 1500, overdue: 300 },
    { month: 'Mar', collected: 52000, pending: 2500, overdue: 200 },
    { month: 'Apr', collected: 50000, pending: 1800, overdue: 400 },
    { month: 'May', collected: 55000, pending: 1200, overdue: 100 },
    { month: 'Jun', collected: 54000, pending: 2000, overdue: 150 }
  ];

  const forecastData = [
    { month: 'Jun', actual: 54000, forecast: 54000 },
    { month: 'Jul', actual: null, forecast: 56000 },
    { month: 'Aug', actual: null, forecast: 57500 },
    { month: 'Sep', actual: null, forecast: 58000 },
    { month: 'Oct', actual: null, forecast: 59500 },
    { month: 'Nov', actual: null, forecast: 60000 }
  ];

  const paymentMethods = [
    { method: 'Bank Transfer', amount: 125000, percentage: 45, color: '#3b82f6' },
    { method: 'Credit Card', amount: 95000, percentage: 34, color: '#10b981' },
    { method: 'Check', amount: 35000, percentage: 13, color: '#f59e0b' },
    { method: 'Cash', amount: 20000, percentage: 8, color: '#8b5cf6' }
  ];

  const propertyRevenue = [
    { property: 'Downtown Apartments', revenue: 54000, growth: 12, tenants: 8, collection: 98 },
    { property: 'Riverside Complex', revenue: 48000, growth: 8, tenants: 6, collection: 95 },
    { property: 'Hillside Residences', revenue: 57600, growth: 15, tenants: 9, collection: 99 },
    { property: 'Garden Plaza', revenue: 54000, growth: 10, tenants: 8, collection: 96 }
  ];

  const paymentStatus = [
    { status: 'Collected', count: 285, amount: 275000, color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
    { status: 'Pending', count: 32, amount: 7200, color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
    { status: 'Overdue', count: 8, amount: 1750, color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' }
  ];

  const kpis = [
    { label: 'Total Revenue', value: '$275K', change: '+12%', trend: 'up', icon: DollarSign, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Collection Rate', value: '97.2%', change: '+2.1%', trend: 'up', icon: TrendingUp, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Avg Payment', value: '$964', change: '+5%', trend: 'up', icon: CreditCard, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Overdue Amount', value: '$1.75K', change: '-8%', trend: 'down', icon: TrendingDown, color: 'bg-red-100 dark:bg-red-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track and analyze your rental income</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 focus:outline-none"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className={`${kpi.color} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{kpi.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
                      <p className={`text-sm mt-2 flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {kpi.change} from last period
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="overdue" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Forecast */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Revenue Forecast
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payment Methods
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="amount">
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.method}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Status</h2>
            <div className="space-y-4">
              {paymentStatus.map((item, idx) => (
                <div key={idx} className={`${item.color} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.status}</p>
                      <p className="text-sm opacity-75 mt-1">{item.count} payments</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${item.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Revenue Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Building className="h-5 w-5" />
            Revenue by Property
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tenants</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Growth</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Collection Rate</th>
                </tr>
              </thead>
              <tbody>
                {propertyRevenue.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{prop.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{prop.tenants}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">${prop.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +{prop.growth}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: `${prop.collection}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{prop.collection}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;

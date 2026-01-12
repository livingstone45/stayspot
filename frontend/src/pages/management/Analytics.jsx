import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Home, Users, DollarSign, AlertCircle, Calendar, Filter, Download, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const occupancyData = [
    { month: 'Jan', occupancy: 92, target: 95 },
    { month: 'Feb', occupancy: 94, target: 95 },
    { month: 'Mar', occupancy: 96, target: 95 },
    { month: 'Apr', occupancy: 93, target: 95 },
    { month: 'May', occupancy: 97, target: 95 },
    { month: 'Jun', occupancy: 95, target: 95 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 8000, profit: 37000 },
    { month: 'Feb', revenue: 48000, expenses: 8500, profit: 39500 },
    { month: 'Mar', revenue: 52000, expenses: 9000, profit: 43000 },
    { month: 'Apr', revenue: 50000, expenses: 8800, profit: 41200 },
    { month: 'May', revenue: 55000, expenses: 9200, profit: 45800 },
    { month: 'Jun', revenue: 54000, expenses: 9000, profit: 45000 }
  ];

  const propertyPerformance = [
    { property: 'Downtown Apartments', occupancy: 100, revenue: 18000, maintenance: 500, tenants: 8 },
    { property: 'Riverside Complex', occupancy: 80, revenue: 14400, maintenance: 800, tenants: 6 },
    { property: 'Hillside Residences', occupancy: 100, revenue: 19200, maintenance: 600, tenants: 9 },
    { property: 'Garden Plaza', occupancy: 100, revenue: 18000, maintenance: 400, tenants: 8 }
  ];

  const categoryBreakdown = [
    { name: 'Maintenance', value: 2900, color: '#3b82f6' },
    { name: 'Utilities', value: 1200, color: '#10b981' },
    { name: 'Insurance', value: 1500, color: '#8b5cf6' },
    { name: 'Taxes', value: 2500, color: '#ef4444' },
    { name: 'Other', value: 900, color: '#f59e0b' }
  ];

  const tenantData = [
    { month: 'Jan', active: 28, new: 3, churned: 1 },
    { month: 'Feb', active: 30, new: 4, churned: 2 },
    { month: 'Mar', active: 32, new: 5, churned: 3 },
    { month: 'Apr', active: 31, new: 2, churned: 3 },
    { month: 'May', active: 33, new: 4, churned: 2 },
    { month: 'Jun', active: 35, new: 3, churned: 1 }
  ];

  const kpis = [
    { label: 'Total Properties', value: '4', change: '+2', trend: 'up', icon: Home, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Occupancy Rate', value: '95%', change: '+3%', trend: 'up', icon: Users, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Monthly Revenue', value: '$54K', change: '+8%', trend: 'up', icon: DollarSign, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Avg Maintenance', value: '$575', change: '-5%', trend: 'down', icon: AlertCircle, color: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your portfolio performance and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none"
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
          {/* Occupancy Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Occupancy Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="occupancy" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOccupancy)" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue vs Expenses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tenant Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tenant Growth
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tenantData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="churned" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Performance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Property Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tenants</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Occupancy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Maintenance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Net Income</th>
                </tr>
              </thead>
              <tbody>
                {propertyPerformance.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{prop.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{prop.tenants}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: `${prop.occupancy}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{prop.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">${prop.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${prop.maintenance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">${(prop.revenue - prop.maintenance).toLocaleString()}</td>
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

export default Analytics;

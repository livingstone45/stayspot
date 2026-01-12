import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Zap, AlertCircle, CheckCircle, Download, BarChart3, LineChart as LineChartIcon, Users, Home } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const performanceData = [
    { month: 'Jan', efficiency: 78, satisfaction: 82, retention: 88, roi: 12 },
    { month: 'Feb', efficiency: 81, satisfaction: 84, retention: 89, roi: 14 },
    { month: 'Mar', efficiency: 85, satisfaction: 86, retention: 91, roi: 16 },
    { month: 'Apr', efficiency: 83, satisfaction: 85, retention: 90, roi: 15 },
    { month: 'May', efficiency: 87, satisfaction: 88, retention: 92, roi: 18 },
    { month: 'Jun', efficiency: 89, satisfaction: 89, retention: 93, roi: 19 }
  ];

  const propertyComparison = [
    { property: 'Downtown Apartments', efficiency: 92, satisfaction: 91, retention: 95, roi: 22 },
    { property: 'Riverside Complex', efficiency: 78, satisfaction: 75, retention: 82, roi: 14 },
    { property: 'Hillside Residences', efficiency: 88, satisfaction: 87, retention: 90, roi: 20 },
    { property: 'Garden Plaza', efficiency: 85, satisfaction: 84, retention: 88, roi: 18 }
  ];

  const maintenanceMetrics = [
    { month: 'Jan', responseTime: 2.5, completionRate: 92, costPerUnit: 45 },
    { month: 'Feb', responseTime: 2.2, completionRate: 94, costPerUnit: 42 },
    { month: 'Mar', responseTime: 1.8, completionRate: 96, costPerUnit: 38 },
    { month: 'Apr', responseTime: 2.0, completionRate: 95, costPerUnit: 40 },
    { month: 'May', responseTime: 1.6, completionRate: 97, costPerUnit: 35 },
    { month: 'Jun', responseTime: 1.5, completionRate: 98, costPerUnit: 33 }
  ];

  const radarData = [
    { metric: 'Occupancy', value: 93 },
    { metric: 'Revenue', value: 88 },
    { metric: 'Maintenance', value: 85 },
    { metric: 'Tenant Satisfaction', value: 89 },
    { metric: 'Efficiency', value: 89 },
    { metric: 'ROI', value: 92 }
  ];

  const kpis = [
    { label: 'Overall Performance', value: '89%', change: '+4%', trend: 'up', icon: Target, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Tenant Satisfaction', value: '4.5/5', change: '+0.3', trend: 'up', icon: Users, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Retention Rate', value: '93%', change: '+2%', trend: 'up', icon: CheckCircle, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Maintenance Efficiency', value: '98%', change: '+5%', trend: 'up', icon: Zap, color: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  const performanceMetrics = [
    { metric: 'Response Time', current: '1.5 days', target: '2 days', status: 'excellent', value: 75 },
    { metric: 'Completion Rate', current: '98%', target: '95%', status: 'excellent', value: 98 },
    { metric: 'Cost Efficiency', current: '$33/unit', target: '$40/unit', status: 'excellent', value: 82 },
    { metric: 'Tenant Retention', current: '93%', target: '90%', status: 'excellent', value: 93 },
    { metric: 'Occupancy Rate', current: '93%', target: '90%', status: 'excellent', value: 93 },
    { metric: 'Revenue Growth', current: '+19%', target: '+15%', status: 'excellent', value: 126 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track key performance indicators and operational metrics</p>
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
          {/* Performance Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Performance Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                <PolarRadiusAxis stroke="#6b7280" domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance & ROI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Maintenance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Maintenance Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="completionRate" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROI Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ROI Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="roi" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {performanceMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{metric.metric}</h3>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.current}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Target: {metric.target}</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(metric.value, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{metric.value}% of target</p>
            </div>
          ))}
        </div>

        {/* Property Performance Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Performance Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Efficiency</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Satisfaction</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Retention</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">ROI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {propertyComparison.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{prop.property}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${prop.efficiency}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{prop.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${prop.satisfaction}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{prop.satisfaction}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${prop.retention}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{prop.retention}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">{prop.roi}%</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">Excellent</span>
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

export default PerformanceAnalytics;

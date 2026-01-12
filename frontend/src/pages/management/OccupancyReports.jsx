import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Home, Users, AlertCircle, Download, BarChart3, LineChart as LineChartIcon, Building } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const OccupancyReports = () => {
  const [timeRange, setTimeRange] = useState('month');

  const occupancyTrend = [
    { month: 'Jan', occupancy: 87, target: 90, vacant: 13 },
    { month: 'Feb', occupancy: 88, target: 90, vacant: 12 },
    { month: 'Mar', occupancy: 89, target: 90, vacant: 11 },
    { month: 'Apr', occupancy: 90, target: 90, vacant: 10 },
    { month: 'May', occupancy: 91, target: 90, vacant: 9 },
    { month: 'Jun', occupancy: 91, target: 90, vacant: 9 }
  ];

  const vacancyReasons = [
    { reason: 'Lease Ended', count: 5, percentage: 36 },
    { reason: 'Maintenance', count: 4, percentage: 29 },
    { reason: 'Renovations', count: 3, percentage: 21 },
    { reason: 'Other', count: 2, percentage: 14 }
  ];

  const unitTypeData = [
    { type: 'Studio', total: 28, occupied: 26, vacant: 2, occupancy: 93 },
    { type: '1 Bed', total: 52, occupied: 48, vacant: 4, occupancy: 92 },
    { type: '2 Bed', total: 48, occupied: 43, vacant: 5, occupancy: 89 },
    { type: '3 Bed', total: 28, occupied: 25, vacant: 3, occupancy: 89 }
  ];

  const leaseExpirations = [
    { month: 'Jul', count: 3, percentage: 2.1 },
    { month: 'Aug', count: 5, percentage: 3.5 },
    { month: 'Sep', count: 4, percentage: 2.8 },
    { month: 'Oct', count: 6, percentage: 4.2 },
    { month: 'Nov', count: 3, percentage: 2.1 },
    { month: 'Dec', count: 4, percentage: 2.8 }
  ];

  const propertyOccupancy = [
    { property: 'Downtown Apartments', total: 24, occupied: 23, vacant: 1, occupancy: 95, trend: 'up' },
    { property: 'Riverside Complex', total: 18, occupied: 16, vacant: 2, occupancy: 88, trend: 'down' },
    { property: 'Hillside Residences', total: 32, occupied: 29, vacant: 3, occupancy: 92, trend: 'up' },
    { property: 'Garden Plaza', total: 28, occupied: 25, vacant: 3, occupancy: 89, trend: 'stable' },
    { property: 'Lakeside Residences', total: 22, occupied: 21, vacant: 1, occupancy: 94, trend: 'up' },
    { property: 'Midtown Towers', total: 32, occupied: 27, vacant: 5, occupancy: 85, trend: 'down' }
  ];

  const vacancyColors = ['#f97316', '#06b6d4', '#8b5cf6', '#ec4899'];

  const kpis = [
    { label: 'Overall Occupancy', value: '91%', change: '+2%', trend: 'up', icon: Home, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Total Units', value: '156', change: '+0', trend: 'stable', icon: Building, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Occupied Units', value: '142', change: '+3', trend: 'up', icon: Users, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Vacant Units', value: '14', change: '-3', trend: 'down', icon: AlertCircle, color: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Occupancy Reports</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Detailed occupancy analysis and vacancy tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className={`${kpi.color} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{kpi.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
                      <p className={`text-sm mt-2 flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {kpi.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                        {kpi.trend === 'down' && <TrendingDown className="h-4 w-4" />}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Occupancy Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Lease Expirations
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaseExpirations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vacancy Reasons</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={vacancyReasons} cx="50%" cy="50%" outerRadius={100} dataKey="count">
                  {vacancyReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={vacancyColors[index % vacancyColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} units`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {vacancyReasons.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vacancyColors[idx] }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.reason}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Unit Type Breakdown</h2>
            <div className="space-y-4">
              {unitTypeData.map((unit, idx) => (
                <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{unit.type}</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{unit.occupancy}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${unit.occupancy}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{unit.occupied}/{unit.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Occupancy Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Units</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Occupied</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Vacant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Occupancy Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                </tr>
              </thead>
              <tbody>
                {propertyOccupancy.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{prop.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{prop.total}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{prop.occupied}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{prop.vacant}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${prop.occupancy}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{prop.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        prop.trend === 'up' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                        prop.trend === 'down' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {prop.trend === 'up' && '↑ Up'}
                        {prop.trend === 'down' && '↓ Down'}
                        {prop.trend === 'stable' && '→ Stable'}
                      </span>
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

export default OccupancyReports;

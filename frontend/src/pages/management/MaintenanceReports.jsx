import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wrench, AlertCircle, Download, BarChart3, LineChart as LineChartIcon, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MaintenanceReports = () => {
  const [timeRange, setTimeRange] = useState('month');

  const maintenanceTrend = [
    { month: 'Jan', completed: 12, pending: 3, overdue: 1 },
    { month: 'Feb', completed: 14, pending: 2, overdue: 0 },
    { month: 'Mar', completed: 16, pending: 2, overdue: 1 },
    { month: 'Apr', completed: 15, pending: 3, overdue: 0 },
    { month: 'May', completed: 18, pending: 1, overdue: 0 },
    { month: 'Jun', completed: 17, pending: 2, overdue: 1 }
  ];

  const costTrend = [
    { month: 'Jan', labor: 2400, materials: 1200, total: 3600 },
    { month: 'Feb', labor: 2200, materials: 1400, total: 3600 },
    { month: 'Mar', labor: 2600, materials: 1800, total: 4400 },
    { month: 'Apr', labor: 2400, materials: 1600, total: 4000 },
    { month: 'May', labor: 2800, materials: 1400, total: 4200 },
    { month: 'Jun', labor: 2600, materials: 1400, total: 4000 }
  ];

  const maintenanceTypes = [
    { type: 'Preventive', count: 45, percentage: 42 },
    { type: 'Corrective', count: 38, percentage: 35 },
    { type: 'Emergency', count: 15, percentage: 14 },
    { type: 'Routine', count: 9, percentage: 9 }
  ];

  const vendorPerformance = [
    { vendor: 'ABC Plumbing', jobs: 18, completed: 18, avgTime: 2.1, rating: 4.8 },
    { vendor: 'XYZ Electric', jobs: 15, completed: 14, avgTime: 2.5, rating: 4.6 },
    { vendor: 'Pro Maintenance', jobs: 22, completed: 21, avgTime: 1.9, rating: 4.9 },
    { vendor: 'Quick Repairs', jobs: 12, completed: 11, avgTime: 3.2, rating: 4.3 },
    { vendor: 'General Services', jobs: 20, completed: 19, avgTime: 2.3, rating: 4.7 }
  ];

  const workOrders = [
    { id: 'WO-001', property: 'Downtown Apartments', type: 'Plumbing', status: 'Completed', date: '2024-06-15', cost: 450, vendor: 'ABC Plumbing' },
    { id: 'WO-002', property: 'Riverside Complex', type: 'Electrical', status: 'In Progress', date: '2024-06-18', cost: 650, vendor: 'XYZ Electric' },
    { id: 'WO-003', property: 'Hillside Residences', type: 'HVAC', status: 'Pending', date: '2024-06-20', cost: 1200, vendor: 'Pro Maintenance' },
    { id: 'WO-004', property: 'Garden Plaza', type: 'Painting', status: 'Completed', date: '2024-06-12', cost: 800, vendor: 'General Services' },
    { id: 'WO-005', property: 'Lakeside Residences', type: 'Roof Repair', status: 'Completed', date: '2024-06-10', cost: 2500, vendor: 'Pro Maintenance' }
  ];

  const typeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const kpis = [
    { label: 'Total Work Orders', value: '107', change: '+8', trend: 'up', icon: Wrench, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Completion Rate', value: '96.3%', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Avg Response Time', value: '2.4 days', change: '-0.3', trend: 'down', icon: Clock, color: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Total Maintenance Cost', value: '$24.2K', change: '+5%', trend: 'up', icon: AlertCircle, color: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Reports</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Work order tracking and maintenance analytics</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Work Order Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="overdue" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Maintenance Cost Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="labor" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="materials" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Types</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={maintenanceTypes} cx="50%" cy="50%" outerRadius={100} dataKey="count">
                  {maintenanceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={typeColors[index % typeColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} jobs`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {maintenanceTypes.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[idx] }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.type}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Vendors</h2>
            <div className="space-y-3">
              {vendorPerformance.slice(0, 5).map((vendor, idx) => (
                <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{vendor.vendor}</span>
                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">★ {vendor.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{vendor.completed}/{vendor.jobs} completed</span>
                    <span>{vendor.avgTime} days avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Recent Work Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Work Order</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Vendor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{order.vendor}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">${order.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                        order.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                        'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {order.status}
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

export default MaintenanceReports;

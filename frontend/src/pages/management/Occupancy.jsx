import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Home, Users, AlertCircle, Calendar, Download } from 'lucide-react';

const Occupancy = () => {
  const { isDarkMode } = useThemeMode();
  const [timeRange, setTimeRange] = useState('6m');

  // Overall occupancy metrics
  const metrics = {
    totalUnits: 156,
    occupiedUnits: 142,
    vacantUnits: 14,
    occupancyRate: 91,
    avgOccupancyTrend: 2.5,
  };

  // Monthly occupancy trend
  const occupancyTrend = [
    { month: 'Jan', occupancy: 87, target: 90 },
    { month: 'Feb', occupancy: 88, target: 90 },
    { month: 'Mar', occupancy: 89, target: 90 },
    { month: 'Apr', occupancy: 90, target: 90 },
    { month: 'May', occupancy: 91, target: 90 },
    { month: 'Jun', occupancy: 91, target: 90 },
  ];

  // Property-level occupancy
  const propertyOccupancy = [
    { name: 'Westside Apartments', occupancy: 95, units: 24, occupied: 23, vacant: 1 },
    { name: 'Downtown Lofts', occupancy: 88, units: 18, occupied: 16, vacant: 2 },
    { name: 'Riverside Complex', occupancy: 92, units: 32, occupied: 29, vacant: 3 },
    { name: 'Midtown Towers', occupancy: 89, units: 28, occupied: 25, vacant: 3 },
    { name: 'Lakeside Residences', occupancy: 94, units: 22, occupied: 21, vacant: 1 },
    { name: 'Hillside Villas', occupancy: 85, units: 32, occupied: 27, vacant: 5 },
  ];

  // Occupancy by unit type
  const unitTypeData = [
    { name: 'Studio', value: 28, occupancy: 93 },
    { name: '1 Bed', value: 52, occupancy: 92 },
    { name: '2 Bed', value: 48, occupancy: 89 },
    { name: '3 Bed', value: 28, occupancy: 88 },
  ];

  // Vacancy reasons
  const vacancyReasons = [
    { reason: 'Maintenance', count: 4, percentage: 29 },
    { reason: 'Lease Ended', count: 5, percentage: 36 },
    { reason: 'Renovations', count: 3, percentage: 21 },
    { reason: 'Other', count: 2, percentage: 14 },
  ];

  const COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#ec4899'];

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>Occupancy Dashboard</h1>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Real-time occupancy metrics and analytics</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-4 py-2 border rounded-lg font-medium transition ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white hover:border-slate-500' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className={`rounded-xl shadow-sm p-6 border-l-4 border-orange-600 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupancy Rate</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{metrics.occupancyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-3">↑ {metrics.avgOccupancyTrend}% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-cyan-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Units</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.totalUnits}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Home className="text-cyan-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3">Across 6 properties</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Occupied</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.occupiedUnits}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3">Active leases</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Vacant</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.vacantUnits}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3">Available for lease</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Target Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">90%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-3">↑ 1% above target</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Occupancy Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Occupancy Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[80, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: '#f97316', strokeWidth: 2 }}
                />
                <Legend />
                <Line type="monotone" dataKey="occupancy" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Unit Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Occupancy by Unit Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={unitTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Vacancy Reasons */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Vacancy Reasons</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vacancyReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {vacancyReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Vacancy Breakdown</h2>
            <div className="space-y-4">
              {vacancyReasons.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="text-slate-700 font-medium">{item.reason}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">{item.count} units</span>
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%`, backgroundColor: COLORS[idx] }}
                      ></div>
                    </div>
                    <span className="text-slate-600 font-medium w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property-Level Occupancy Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Property-Level Occupancy</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Property</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Total Units</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Occupied</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Vacant</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Occupancy Rate</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {propertyOccupancy.map((property, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-4 px-4 text-slate-900 font-medium">{property.name}</td>
                    <td className="py-4 px-4 text-slate-700">{property.units}</td>
                    <td className="py-4 px-4 text-slate-700">{property.occupied}</td>
                    <td className="py-4 px-4 text-slate-700">{property.vacant}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-orange-600 transition-all"
                            style={{ width: `${property.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-900 font-semibold">{property.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.occupancy >= 90
                            ? 'bg-green-100 text-green-700'
                            : property.occupancy >= 85
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {property.occupancy >= 90 ? 'Excellent' : property.occupancy >= 85 ? 'Good' : 'Needs Attention'}
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

export default Occupancy;

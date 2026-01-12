import React, { useState, useEffect } from 'react';
import { Building, Users, DollarSign, AlertTriangle, TrendingUp, BarChart3, Home, Wrench, Clock, CheckCircle } from 'lucide-react';

const ManagementDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 8,
    occupiedUnits: 42,
    vacantUnits: 6,
    monthlyRevenue: 156800,
    maintenanceIssues: 5,
    pendingTasks: 12,
    collectionRate: 98.5,
    occupancyRate: 87.5
  });

  const [properties, setProperties] = useState([
    { id: 1, name: 'Sunset Apartments', address: '123 Main St', units: 8, occupied: 8, revenue: 25000 },
    { id: 2, name: 'Riverside Towers', address: '456 Oak Ave', units: 12, occupied: 10, revenue: 35000 },
    { id: 3, name: 'Downtown Lofts', address: '789 Pine Rd', units: 6, occupied: 4, revenue: 18000 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review lease for Unit 101', priority: 'high', status: 'pending', dueDate: '2025-12-25' },
    { id: 2, title: 'Collect rent from Unit 205', priority: 'urgent', status: 'pending', dueDate: '2025-12-24' },
    { id: 3, title: 'Schedule maintenance inspection', priority: 'medium', status: 'in-progress', dueDate: '2025-12-26' },
  ]);

  const [maintenance, setMaintenance] = useState([
    { id: 1, unit: '305', issue: 'Plumbing leak', priority: 'urgent', status: 'open', property: 'Sunset Apartments' },
    { id: 2, unit: '412', issue: 'HVAC repair', priority: 'high', status: 'in-progress', property: 'Riverside Towers' },
    { id: 3, unit: '208', issue: 'Door lock replacement', priority: 'medium', status: 'scheduled', property: 'Downtown Lofts' },
  ]);

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-2">↑ {trend}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Management Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your property management hub</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Building} 
            label="Total Properties" 
            value={stats.totalProperties}
            trend="+2 this year"
            color="blue"
          />
          <StatCard 
            icon={Users} 
            label="Occupied Units" 
            value={stats.occupiedUnits}
            trend="+5 this month"
            color="green"
          />
          <StatCard 
            icon={DollarSign} 
            label="Monthly Revenue" 
            value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}k`}
            trend="+12% growth"
            color="emerald"
          />
          <StatCard 
            icon={AlertTriangle} 
            label="Maintenance Issues" 
            value={stats.maintenanceIssues}
            trend="3 urgent"
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Properties Overview</h2>
            <div className="space-y-4">
              {properties.map(prop => (
                <div key={prop.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{prop.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{prop.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{prop.occupied}/{prop.units} units occupied</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${prop.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">Monthly Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 dark:text-gray-400">Collection Rate</span>
                  <span className="font-bold text-gray-900 dark:text-white">{stats.collectionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.collectionRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  Add Property
                </button>
                <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                  Collect Payments
                </button>
                <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium">
                  View Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks and Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Tasks</h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Maintenance Requests</h2>
            <div className="space-y-3">
              {maintenance.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Wrench className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.issue}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unit {item.unit} - {item.property}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        item.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;

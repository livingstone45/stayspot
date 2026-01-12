import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Download, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Financial = () => {
  const [filterMonth, setFilterMonth] = useState('all');

  const revenueData = [
    { month: 'Jan', collected: 12000, pending: 2000 },
    { month: 'Feb', collected: 13500, pending: 1500 },
    { month: 'Mar', collected: 14200, pending: 800 },
    { month: 'Apr', collected: 13800, pending: 2200 },
    { month: 'May', collected: 15000, pending: 1000 },
    { month: 'Jun', collected: 14500, pending: 1500 }
  ];

  const paymentStatus = [
    { name: 'Paid', value: 85, color: '#10b981' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Overdue', value: 3, color: '#ef4444' }
  ];

  const invoices = [
    { id: 1, tenant: 'John Smith', property: 'Apt 101', amount: 1500, dueDate: '2024-01-15', status: 'paid', date: '2024-01-01' },
    { id: 2, tenant: 'Sarah Johnson', property: 'Apt 202', amount: 1800, dueDate: '2024-01-15', status: 'pending', date: '2024-01-01' },
    { id: 3, tenant: 'Michael Brown', property: 'Apt 303', amount: 1600, dueDate: '2024-01-15', status: 'paid', date: '2024-01-01' },
    { id: 4, tenant: 'Emily Davis', property: 'Apt 104', amount: 1500, dueDate: '2024-01-15', status: 'overdue', date: '2023-12-15' }
  ];

  const stats = [
    { label: 'Total Revenue', value: '$82,500', change: '+12.5%', icon: DollarSign, color: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Collected This Month', value: '$14,500', change: '+8.2%', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Pending Payments', value: '$3,200', change: '-2.1%', icon: AlertCircle, color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Collection Rate', value: '94.2%', change: '+3.5%', icon: TrendingUp, color: 'bg-purple-100 dark:bg-purple-900/20' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track rent collection and payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${stat.color} rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" />
                <Bar dataKey="pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
            <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tenant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{invoice.tenant}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{invoice.property}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">${invoice.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium">View</button>
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

export default Financial;

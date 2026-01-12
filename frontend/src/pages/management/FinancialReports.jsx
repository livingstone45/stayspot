import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Download, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FinancialReports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('income');

  const incomeStatement = [
    { category: 'Rental Income', amount: 54000, percentage: 100 },
    { category: 'Late Fees', amount: 1200, percentage: 2.2 },
    { category: 'Parking Revenue', amount: 800, percentage: 1.5 },
    { category: 'Total Revenue', amount: 56000, percentage: 103.7, isBold: true }
  ];

  const expenses = [
    { category: 'Maintenance & Repairs', amount: 3200, percentage: 5.7 },
    { category: 'Property Management', amount: 2800, percentage: 5 },
    { category: 'Utilities', amount: 1500, percentage: 2.7 },
    { category: 'Insurance', amount: 1200, percentage: 2.1 },
    { category: 'Property Taxes', amount: 2500, percentage: 4.5 },
    { category: 'HOA Fees', amount: 800, percentage: 1.4 },
    { category: 'Advertising', amount: 600, percentage: 1.1 },
    { category: 'Total Expenses', amount: 12600, percentage: 22.5, isBold: true }
  ];

  const netIncome = [
    { category: 'Gross Profit', amount: 43400, percentage: 77.5, isBold: true },
    { category: 'Depreciation', amount: 1500, percentage: 2.7 },
    { category: 'Interest Expense', amount: 800, percentage: 1.4 },
    { category: 'Net Income', amount: 41100, percentage: 73.4, isBold: true, isHighlight: true }
  ];

  const cashFlowData = [
    { month: 'Jan', operating: 38000, investing: -5000, financing: -2000 },
    { month: 'Feb', operating: 40000, investing: -4500, financing: -2000 },
    { month: 'Mar', operating: 42000, investing: -6000, financing: -2000 },
    { month: 'Apr', operating: 41000, investing: -5500, financing: -2000 },
    { month: 'May', operating: 43000, investing: -4000, financing: -2000 },
    { month: 'Jun', operating: 41100, investing: -5500, financing: -2000 }
  ];

  const balanceSheet = [
    { item: 'Cash & Equivalents', amount: 25000 },
    { item: 'Accounts Receivable', amount: 8500 },
    { item: 'Prepaid Expenses', amount: 2000 },
    { item: 'Total Current Assets', amount: 35500, isBold: true },
    { item: 'Property & Equipment', amount: 450000 },
    { item: 'Accumulated Depreciation', amount: -45000 },
    { item: 'Net Fixed Assets', amount: 405000, isBold: true },
    { item: 'Total Assets', amount: 440500, isBold: true, isHighlight: true }
  ];

  const taxSummary = [
    { item: 'Gross Rental Income', amount: 54000 },
    { item: 'Deductible Expenses', amount: -12600 },
    { item: 'Depreciation', amount: -1500 },
    { item: 'Taxable Income', amount: 39900, isBold: true },
    { item: 'Estimated Tax (25%)', amount: 9975, isBold: true, isHighlight: true }
  ];

  const expenseBreakdown = [
    { name: 'Maintenance', value: 3200, color: '#3b82f6' },
    { name: 'Management', value: 2800, color: '#10b981' },
    { name: 'Taxes', value: 2500, color: '#f59e0b' },
    { name: 'Insurance', value: 1200, color: '#8b5cf6' },
    { name: 'Utilities', value: 1500, color: '#ef4444' },
    { name: 'Other', value: 800, color: '#06b6d4' }
  ];

  const propertyFinancials = [
    { property: 'Downtown Apartments', revenue: 18000, expenses: 4200, netIncome: 13800, roi: 22 },
    { property: 'Riverside Complex', revenue: 14400, expenses: 3800, netIncome: 10600, roi: 18 },
    { property: 'Hillside Residences', revenue: 19200, expenses: 2800, netIncome: 16400, roi: 24 },
    { property: 'Garden Plaza', revenue: 18000, expenses: 3200, netIncome: 14800, roi: 20 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive financial analysis and reporting</p>
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

          <div className="flex gap-2 flex-wrap">
            {['income', 'cashflow', 'balance', 'tax'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  reportType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {type === 'income' && 'Income Statement'}
                {type === 'cashflow' && 'Cash Flow'}
                {type === 'balance' && 'Balance Sheet'}
                {type === 'tax' && 'Tax Summary'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$56K</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +8% from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$12.6K</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              -3% from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Net Income</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$41.1K</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +12% from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Profit Margin</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">73.4%</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +5% from last month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cash Flow Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="operating" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="investing" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="financing" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {reportType === 'income' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Income Statement</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Revenue</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  {incomeStatement.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${item.isBold ? 'bg-gray-50 dark:bg-gray-700/50 font-semibold' : ''}`}>
                      <td className={`py-3 px-4 text-sm ${item.isBold ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.category}</td>
                      <td className={`py-3 px-4 text-right text-sm ${item.isBold ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Expenses</td>
                    <td className="py-3 px-4 text-right"></td>
                  </tr>
                  {expenses.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${item.isBold ? 'bg-gray-50 dark:bg-gray-700/50 font-semibold' : ''}`}>
                      <td className={`py-3 px-4 text-sm ${item.isBold ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.category}</td>
                      <td className={`py-3 px-4 text-right text-sm ${item.isBold ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>-${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {netIncome.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-200 dark:border-gray-700 ${item.isHighlight ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50'} font-semibold`}>
                      <td className={`py-3 px-4 text-sm ${item.isHighlight ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>{item.category}</td>
                      <td className={`py-3 px-4 text-right text-sm ${item.isHighlight ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'balance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Balance Sheet</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {balanceSheet.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${item.isBold ? 'bg-gray-50 dark:bg-gray-700/50 font-semibold' : ''} ${item.isHighlight ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <td className={`py-3 px-4 text-sm ${item.isBold || item.isHighlight ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.item}</td>
                      <td className={`py-3 px-4 text-right text-sm ${item.isBold || item.isHighlight ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'tax' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tax Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {taxSummary.map((item, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${item.isBold ? 'bg-gray-50 dark:bg-gray-700/50 font-semibold' : ''} ${item.isHighlight ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                      <td className={`py-3 px-4 text-sm ${item.isBold || item.isHighlight ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.item}</td>
                      <td className={`py-3 px-4 text-right text-sm ${item.isBold || item.isHighlight ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Property Financial Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Expenses</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Net Income</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">ROI</th>
                </tr>
              </thead>
              <tbody>
                {propertyFinancials.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{prop.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${prop.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${prop.expenses.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">${prop.netIncome.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-blue-600 dark:text-blue-400">{prop.roi}%</td>
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

export default FinancialReports;

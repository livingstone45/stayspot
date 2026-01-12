import React, { useState, useEffect } from 'react';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown,
  DollarSign, Users, Building, Calendar,
  Download, Printer, Filter, RefreshCw,
  ChevronDown, Eye, Share2, FileText
} from 'lucide-react';

const FinancialReport = ({ 
  data,
  onDateRangeChange,
  onExport,
  onPrint,
  onRefresh,
  isLoading = false
}) => {
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('summary');
  const [chartType, setChartType] = useState('bar');

  const dateRanges = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: DollarSign },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
    { id: 'properties', label: 'By Property', icon: Building },
    { id: 'tenants', label: 'By Tenant', icon: Users }
  ];

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', label: 'Pie Chart', icon: PieChart }
  ];

  // Mock data - replace with actual API data
  const mockData = {
    summary: {
      totalIncome: 125000,
      totalExpenses: 45000,
      netIncome: 80000,
      averageRent: 2500,
      occupancyRate: 92,
      collectionRate: 98
    },
    incomeByCategory: [
      { category: 'Rent', amount: 100000, percentage: 80 },
      { category: 'Late Fees', amount: 5000, percentage: 4 },
      { category: 'Application Fees', amount: 8000, percentage: 6.4 },
      { category: 'Other', amount: 12000, percentage: 9.6 }
    ],
    expensesByCategory: [
      { category: 'Maintenance', amount: 15000, percentage: 33.3 },
      { category: 'Utilities', amount: 8000, percentage: 17.8 },
      { category: 'Property Taxes', amount: 12000, percentage: 26.7 },
      { category: 'Insurance', amount: 5000, percentage: 11.1 },
      { category: 'Management Fees', amount: 3000, percentage: 6.7 },
      { category: 'Other', amount: 2000, percentage: 4.4 }
    ],
    monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      income: Math.floor(Math.random() * 15000) + 10000,
      expenses: Math.floor(Math.random() * 8000) + 4000
    })),
    propertyPerformance: [
      { name: 'Sunset Apartments', income: 45000, expenses: 18000, occupancy: 95 },
      { name: 'River View Condos', income: 35000, expenses: 12000, occupancy: 92 },
      { name: 'Downtown Lofts', income: 25000, expenses: 8000, occupancy: 88 },
      { name: 'Garden Villas', income: 20000, expenses: 7000, occupancy: 90 }
    ],
    topTenants: [
      { name: 'John Smith', property: 'Sunset A-205', paid: 12500, due: 0, status: 'current' },
      { name: 'Sarah Johnson', property: 'River View B-301', paid: 11500, due: 0, status: 'current' },
      { name: 'Mike Wilson', property: 'Downtown C-102', paid: 10500, due: 500, status: 'late' },
      { name: 'Emma Davis', property: 'Garden D-401', paid: 9500, due: 0, status: 'current' }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const renderSummaryTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.summary.totalIncome)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Compared to last period</p>
            <p className="text-sm font-medium text-green-600 mt-1">+12.5% increase</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.summary.totalExpenses)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Compared to last period</p>
            <p className="text-sm font-medium text-red-600 mt-1">+8.3% increase</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.summary.netIncome)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-sm font-medium text-blue-600 mt-1">
              {((mockData.summary.netIncome / mockData.summary.totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600">Avg. Rent</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(mockData.summary.averageRent)}</p>
          <p className="text-xs text-gray-500 mt-2">Per unit per month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{mockData.summary.occupancyRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Units occupied</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600">Collection Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{mockData.summary.collectionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Rent collected on time</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600">Cash Flow</p>
          <p className="text-2xl font-bold text-green-600 mt-2">+{formatCurrency(mockData.summary.netIncome)}</p>
          <p className="text-xs text-gray-500 mt-2">Monthly positive</p>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses Trend</h3>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Bar
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${chartType === 'pie' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setChartType('pie')}
            >
              <PieChart className="w-4 h-4 inline mr-1" />
              Pie
            </button>
          </div>
        </div>
        
        {/* Simple Chart Visualization */}
        <div className="h-64 flex items-end space-x-2 pt-8">
          {mockData.monthlyTrend.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex space-x-1 w-full justify-center">
                <div 
                  className="bg-green-500 rounded-t w-3/5"
                  style={{ height: `${(month.income / 25000) * 100}px` }}
                  title={`Income: ${formatCurrency(month.income)}`}
                ></div>
                <div 
                  className="bg-red-500 rounded-t w-3/5"
                  style={{ height: `${(month.expenses / 15000) * 100}px` }}
                  title={`Expenses: ${formatCurrency(month.expenses)}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{month.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeTab = () => (
    <div className="space-y-6">
      {/* Income Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Income Breakdown by Category</h3>
        <div className="space-y-4">
          {mockData.incomeByCategory.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{formatPercentage(category.percentage)}</span>
                  <span className="text-xs text-gray-500">
                    {((category.amount / mockData.summary.totalIncome) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Sources Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Income Sources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.incomeByCategory.map((category, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(category.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{formatPercentage(category.percentage)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+5.2%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExpensesTab = () => (
    <div className="space-y-6">
      {/* Expenses Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Expenses Breakdown by Category</h3>
        <div className="space-y-4">
          {mockData.expensesByCategory.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{formatPercentage(category.percentage)}</span>
                  <span className="text-xs text-gray-500">
                    {((category.amount / mockData.summary.totalExpenses) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="space-y-6">
      {/* Property Performance */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Property Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.propertyPerformance.map((property, index) => {
                const netIncome = property.income - property.expenses;
                const roi = ((netIncome / property.expenses) * 100).toFixed(1);
                return (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{property.name}</p>
                          <p className="text-xs text-gray-500">4 units</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(property.income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(property.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(netIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${property.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{property.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${parseFloat(roi) >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {roi}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary': return renderSummaryTab();
      case 'income': return renderIncomeTab();
      case 'expenses': return renderExpensesTab();
      case 'properties': return renderPropertiesTab();
      default: return renderSummaryTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-gray-600 mt-2">Comprehensive financial analysis and insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    onDateRangeChange && onDateRangeChange(e.target.value);
                  }}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onPrint}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={onExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        <div className="mb-6">
          {isLoading ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-500">Loading financial report...</p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>

        {/* Report Footer */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Report Generated</h3>
              <p className="text-gray-600 mt-1">Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}</p>
              <p className="text-sm text-gray-500 mt-2">This report includes all financial transactions for the selected period.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Generate PDF</span>
              </button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Disclaimer</h4>
            <p className="text-xs text-gray-500">
              This financial report is generated for informational purposes only. The data is based on recorded transactions
              and may not reflect real-time financial status. Please consult with a financial advisor for official reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  PieChart,
  BarChart3,
  RefreshCw,
  Eye,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Wallet,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BanknoteIcon,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FinancialChart from '../../../components/charts/FinancialChart';
import DateRangePicker from '../../../components/common/DateRangePicker';
import TransactionTable from '../../../components/financial/TransactionTable';

const Financials = () => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  const [viewMode, setViewMode] = useState('overview'); // overview, transactions, analytics
  const [currency, setCurrency] = useState('USD');
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionFilters, setTransactionFilters] = useState({
    type: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  const transactionTypes = [
    { id: 'rent', label: 'Rent Payment', color: 'bg-green-100 text-green-800' },
    { id: 'deposit', label: 'Security Deposit', color: 'bg-blue-100 text-blue-800' },
    { id: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'utility', label: 'Utility Bill', color: 'bg-purple-100 text-purple-800' },
    { id: 'management_fee', label: 'Management Fee', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
  ];

  const statusOptions = [
    { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { id: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  ];

  useEffect(() => {
    loadFinancialData();
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, transactionFilters]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const data = await getFinancials(dateRange);
      setFinancialData(data);
    } catch (error) {
      console.error('Failed to load financial data:', error);
      setFinancialData(generateSampleFinancialData());
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      // In a real app, this would be an API call
      setTransactions(generateSampleTransactions());
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const generateSampleFinancialData = () => {
    const totalRevenue = 2500000;
    const totalExpenses = 1500000;
    const netIncome = totalRevenue - totalExpenses;
    const operatingExpenses = 800000;
    const capitalExpenditures = 200000;
    const managementFees = 500000;
    
    return {
      summary: {
        totalRevenue,
        totalExpenses,
        netIncome,
        operatingExpenses,
        capitalExpenditures,
        managementFees,
        profitMargin: ((netIncome / totalRevenue) * 100).toFixed(1),
        operatingMargin: ((netIncome / operatingExpenses) * 100).toFixed(1),
        ebitda: netIncome + operatingExpenses + capitalExpenditures,
      },
      
      revenueBreakdown: [
        { category: 'Rent', amount: 1800000, percentage: 72 },
        { category: 'Late Fees', amount: 50000, percentage: 2 },
        { category: 'Amenity Fees', amount: 150000, percentage: 6 },
        { category: 'Parking Fees', amount: 200000, percentage: 8 },
        { category: 'Storage Fees', amount: 100000, percentage: 4 },
        { category: 'Other', amount: 200000, percentage: 8 },
      ],
      
      expenseBreakdown: [
        { category: 'Property Taxes', amount: 300000, percentage: 20 },
        { category: 'Insurance', amount: 200000, percentage: 13.3 },
        { category: 'Maintenance', amount: 250000, percentage: 16.7 },
        { category: 'Utilities', amount: 150000, percentage: 10 },
        { category: 'Staff Salaries', amount: 350000, percentage: 23.3 },
        { category: 'Marketing', amount: 50000, percentage: 3.3 },
        { category: 'Software & Tools', amount: 100000, percentage: 6.7 },
        { category: 'Other', amount: 100000, percentage: 6.7 },
      ],
      
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        revenue: Math.floor(Math.random() * 300000) + 180000,
        expenses: Math.floor(Math.random() * 200000) + 120000,
        netIncome: Math.floor(Math.random() * 150000) + 60000,
        occupancy: 85 + Math.random() * 12,
      })),
      
      portfolioPerformance: [
        { name: 'Urban Residential', revenue: 850000, expenses: 550000, noi: 300000, capRate: 6.2 },
        { name: 'Commercial Office', revenue: 950000, expenses: 600000, noi: 350000, capRate: 5.8 },
        { name: 'Luxury Properties', revenue: 450000, expenses: 250000, noi: 200000, capRate: 7.1 },
        { name: 'Affordable Housing', revenue: 250000, expenses: 100000, noi: 150000, capRate: 8.5 },
      ],
      
      kpis: [
        { name: 'Collection Rate', current: 98.5, target: 95, trend: 'up' },
        { name: 'Days Vacant', current: 7.2, target: 10, trend: 'down' },
        { name: 'Maintenance Response', current: 24, target: 48, trend: 'up' },
        { name: 'Tenant Satisfaction', current: 4.8, target: 4.5, trend: 'up' },
      ],
    };
  };

  const generateSampleTransactions = () => {
    const transactions = [];
    const tenants = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'Robert Brown'];
    const properties = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '101 Maple Dr', '202 Elm Blvd'];
    
    for (let i = 0; i < 50; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const amount = Math.floor(Math.random() * 5000) + 1000;
      const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      
      transactions.push({
        id: `txn-${i + 1}`,
        date: date.toISOString(),
        tenant: tenants[Math.floor(Math.random() * tenants.length)],
        property: properties[Math.floor(Math.random() * properties.length)],
        type: type.id,
        description: `${type.label} for ${date.toLocaleString('default', { month: 'long' })}`,
        amount,
        status: status.id,
        paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Bank Transfer',
        reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        portfolio: ['Urban Residential', 'Commercial Office', 'Luxury Properties', 'Affordable Housing'][
          Math.floor(Math.random() * 4)
        ],
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (selectedPortfolio !== 'all') {
      filtered = filtered.filter(txn => txn.portfolio === selectedPortfolio);
    }

    if (transactionFilters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type === transactionFilters.type);
    }

    if (transactionFilters.status !== 'all') {
      filtered = filtered.filter(txn => txn.status === transactionFilters.status);
    }

    if (transactionFilters.minAmount) {
      filtered = filtered.filter(txn => txn.amount >= parseFloat(transactionFilters.minAmount));
    }

    if (transactionFilters.maxAmount) {
      filtered = filtered.filter(txn => txn.amount <= parseFloat(transactionFilters.maxAmount));
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = async (format) => {
    try {
      await exportFinancials({
        format,
        dateRange,
        portfolio: selectedPortfolio,
        includeTransactions: true,
      });
    } catch (error) {
      console.error('Failed to export financial data:', error);
    }
  };

  const getCurrencySymbol = () => {
    const currencyObj = currencies.find(c => c.code === currency);
    return currencyObj ? currencyObj.symbol : '$';
  };

  const formatCurrency = (amount) => {
    const symbol = getCurrencySymbol();
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading || !financialData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
              <p className="mt-2 text-gray-600">
                View and manage financial performance across all portfolios
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Date Range and Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onChange={setDateRange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio
                </label>
                <select
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Portfolios</option>
                  <option value="Urban Residential">Urban Residential</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Luxury Properties">Luxury Properties</option>
                  <option value="Affordable Housing">Affordable Housing</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={loadFinancialData}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'transactions', 'analytics', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setViewMode(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    viewMode === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {viewMode === 'overview' && (
          <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(financialData.summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12.5% from last period</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(financialData.summary.totalExpenses)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Receipt className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+8.2% from last period</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Income</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(financialData.summary.netIncome)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BanknoteIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Profit Margin: {financialData.summary.profitMargin}%
                  </p>
                </div>
              </div>
            </div>

            {/* Charts and Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {financialData.revenueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm text-gray-700">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {financialData.expenseBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                        <span className="text-sm text-gray-700">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Performance Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <FinancialChart data={financialData.monthlyData} currency={currency} />
              </div>
            </div>

            {/* Portfolio Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Portfolio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NOI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cap Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {financialData.portfolioPerformance.map((portfolio, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {portfolio.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {formatCurrency(portfolio.revenue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {formatCurrency(portfolio.expenses)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(portfolio.noi)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {portfolio.capRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {viewMode === 'transactions' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Reconcile
                  </button>
                </div>
              </div>
            </div>
            
            {/* Transaction Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={transactionFilters.type}
                    onChange={(e) => setTransactionFilters({...transactionFilters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    {transactionTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={transactionFilters.status}
                    onChange={(e) => setTransactionFilters({...transactionFilters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    value={transactionFilters.minAmount}
                    onChange={(e) => setTransactionFilters({...transactionFilters, minAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    value={transactionFilters.maxAmount}
                    onChange={(e) => setTransactionFilters({...transactionFilters, maxAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>
            
            {/* Transactions Table */}
            <TransactionTable
              transactions={filteredTransactions}
              currency={currency}
              onRefresh={loadTransactions}
            />
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {financialData.kpis.map((kpi, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.current}</p>
                    </div>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    ) : (
                      <TrendingDown className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Target: {kpi.target}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Analytics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coming soon analytics components */}
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h4 className="mt-4 text-sm font-medium text-gray-900">Revenue Forecasting</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    AI-powered revenue predictions coming soon
                  </p>
                </div>
                
                <div className="text-center py-12">
                  <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h4 className="mt-4 text-sm font-medium text-gray-900">Expense Optimization</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Smart expense reduction recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Profit & Loss Statement', period: 'Monthly', icon: DollarSign },
                { title: 'Balance Sheet', period: 'Quarterly', icon: Wallet },
                { title: 'Cash Flow Statement', period: 'Monthly', icon: CreditCard },
                { title: 'Rent Roll Report', period: 'Weekly', icon: Building },
                { title: 'Expense Analysis', period: 'Monthly', icon: Receipt },
                { title: 'Tax Preparation', period: 'Annual', icon: BanknoteIcon },
              ].map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <report.icon className="w-8 h-8 text-blue-600 mb-3" />
                      <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{report.period} Report</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Generate
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Financials;
import React, { useState, useEffect } from 'react';
import {
  Filter, Search, Download, Printer, Eye,
  DollarSign, CreditCard, Bank, Wallet,
  Calendar, User, Building, CheckCircle,
  AlertCircle, Clock, ChevronDown, MoreVertical,
  ExternalLink, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const TransactionTable = ({ 
  transactions = [], 
  onViewDetails, 
  onFilterChange,
  onExport,
  onPrint,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    paymentMethod: 'all',
    dateRange: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 10;

  // Apply filters and search
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.tenantName.toLowerCase().includes(searchLower) ||
        transaction.propertyName.toLowerCase().includes(searchLower) ||
        transaction.referenceNumber.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;

    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;

    // Payment method filter
    if (filters.paymentMethod !== 'all' && transaction.paymentMethod !== filters.paymentMethod) return false;

    // Date range filter (simplified)
    if (filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }

      if (transactionDate < startDate) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedTransactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedTransactions.map(t => t.id));
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'green', icon: CheckCircle, text: 'Completed' },
      'pending': { color: 'yellow', icon: Clock, text: 'Pending' },
      'failed': { color: 'red', icon: AlertCircle, text: 'Failed' },
      'cancelled': { color: 'gray', icon: AlertCircle, text: 'Cancelled' },
      'refunded': { color: 'blue', icon: ArrowDownRight, text: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Type icon
  const getTypeIcon = (type) => {
    const typeIcons = {
      'rent': DollarSign,
      'deposit': Wallet,
      'late_fee': AlertCircle,
      'maintenance': Wrench,
      'utility': FileText,
      'refund': ArrowDownRight,
      'other': DollarSign
    };

    const Icon = typeIcons[type] || DollarSign;
    const typeColors = {
      'rent': 'text-green-600',
      'deposit': 'text-blue-600',
      'late_fee': 'text-red-600',
      'maintenance': 'text-orange-600',
      'utility': 'text-purple-600',
      'refund': 'text-blue-600',
      'other': 'text-gray-600'
    };

    return <Icon className={`w-4 h-4 ${typeColors[type]}`} />;
  };

  // Payment method icon
  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      'credit_card': CreditCard,
      'bank_transfer': Bank,
      'ach': Bank,
      'check': FileText,
      'cash': DollarSign,
      'mobile': Smartphone,
      'other': Wallet
    };

    const Icon = methodIcons[method] || Wallet;
    return <Icon className="w-4 h-4 text-gray-500" />;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Summary calculations
  const summary = {
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
    completed: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    failed: transactions.filter(t => t.status === 'failed').reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header with Filters and Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
            <p className="text-gray-600 mt-1">View and manage all financial transactions</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, status: e.target.value }));
                  onFilterChange && onFilterChange({ ...filters, status: e.target.value });
                }}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, type: e.target.value }));
                  onFilterChange && onFilterChange({ ...filters, type: e.target.value });
                }}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="deposit">Deposit</option>
                <option value="late_fee">Late Fee</option>
                <option value="maintenance">Maintenance</option>
                <option value="utility">Utility</option>
                <option value="refund">Refund</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <select
                value={filters.dateRange}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, dateRange: e.target.value }));
                  onFilterChange && onFilterChange({ ...filters, dateRange: e.target.value });
                }}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Total Amount</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(summary.total)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Completed</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(summary.completed)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-900">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{formatCurrency(summary.pending)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Failed</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(summary.failed)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Transaction ID</span>
                  {sortConfig.key === 'id' && (
                    <ChevronDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                  {sortConfig.key === 'date' && (
                    <ChevronDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant / Property
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {sortConfig.key === 'amount' && (
                    <ChevronDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type / Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="mt-2 text-gray-500">Loading transactions...</p>
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No transactions found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(transaction.id)}
                      onChange={() => toggleRowSelection(transaction.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{transaction.date}</span>
                      <span className="text-xs text-gray-400">{transaction.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(transaction.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.referenceNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">{transaction.tenantName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{transaction.propertyName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          transaction.type === 'rent' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'deposit' ? 'bg-blue-100 text-blue-800' :
                          transaction.type === 'late_fee' ? 'bg-red-100 text-red-800' :
                          transaction.type === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span>{transaction.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails && onViewDetails(transaction.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/transactions/${transaction.id}/receipt`, '_blank')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Receipt"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedTransactions.length)}
              </span>{' '}
              of <span className="font-medium">{sortedTransactions.length}</span> transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import missing icons
const FileText = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const Wrench = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M19 6.5a6.5 6.5 0 01-7.74 6.36L7.5 15.5 4 12l2.14-3.74A6.5 6.5 0 1119 6.5zM4.5 10a.5.5 0 00-.5.5v.5H3v-.5a.5.5 0 00-.5-.5H2v-1h.5a.5.5 0 00.5-.5V8h1v.5a.5.5 0 00.5.5h.5v1h-.5z" clipRule="evenodd" />
  </svg>
);

const Smartphone = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 2a2 2 0 012-2h6a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V2zm6 0H7v16h6V2z" clipRule="evenodd" />
  </svg>
);

export default TransactionTable;
import React, { useState, useEffect } from 'react';
import { History, Download, Filter, Search, Calendar, TrendingUp, ArrowUpRight, ArrowDownLeft, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PaymentHistory = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 15;

  useEffect(() => {
    fetchPayments();
  }, [filterStatus, page, dateRange]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      if (dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        if (dateRange === 'week') startDate.setDate(now.getDate() - 7);
        else if (dateRange === 'month') startDate.setMonth(now.getMonth() - 1);
        else if (dateRange === 'quarter') startDate.setMonth(now.getMonth() - 3);
        else if (dateRange === 'year') startDate.setFullYear(now.getFullYear() - 1);
        
        params.fromDate = startDate.toISOString();
        params.toDate = now.toISOString();
      }

      const response = await axios.get(`${API_URL}/payments`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        setPayments(response.data.data || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        // Calculate stats
        const completed = response.data.data.filter(p => p.status === 'completed');
        const totalAmount = completed.reduce((sum, p) => sum + (p.paidAmount || p.amount || 0), 0);
        const avgAmount = completed.length > 0 ? totalAmount / completed.length : 0;

        setStats({
          totalTransactions: response.data.data.length,
          totalAmount: totalAmount,
          avgAmount: avgAmount,
          completedCount: completed.length
        });
      }
    } catch (error) {
      console.log('Error fetching payments:', error.message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    return !searchTerm || 
      payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.company?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      failed: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800',
      overdue: isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800',
      partially_paid: isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800',
      cancelled: isDarkMode ? 'bg-slate-900/20 text-slate-400' : 'bg-slate-100 text-slate-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <ArrowDownLeft className="w-4 h-4" />;
    if (status === 'pending') return <ArrowUpRight className="w-4 h-4" />;
    return null;
  };

  const formatAmount = (amount) => {
    return `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment History</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>View all payment transactions</p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Transactions</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalTransactions}</p>
            </div>
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Amount</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Average Amount</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatAmount(stats.avgAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Completed</p>
              <p className={`text-3xl font-bold mt-2 text-green-600`}>{stats.completedCount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="overdue">Overdue</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading transactions...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-8 text-center">
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No transactions found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Date</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Transaction ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Company</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Amount</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Type</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Method</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        {formatDate(payment.paidDate || payment.dueDate || payment.createdAt)}
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        {payment.paymentNumber || payment.id?.slice(0, 8)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        {payment.company || payment.Property?.name || 'N/A'}
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatAmount(payment.paidAmount || payment.amount)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {payment.type || 'rent'}
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {payment.paymentMethod || 'N/A'}
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} disabled:opacity-50`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} disabled:opacity-50`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;

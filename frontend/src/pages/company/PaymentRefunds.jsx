import React, { useState, useEffect } from 'react';
import { RotateCcw, Download, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, Eye, MoreVertical } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PaymentRefunds = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 10;

  useEffect(() => {
    fetchRefunds();
  }, [filterStatus, page]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        type: 'refund',
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await axios.get(`${API_URL}/payments`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        const refundData = response.data.data || [];
        setRefunds(refundData);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        const completed = refundData.filter(r => r.status === 'completed');
        const pending = refundData.filter(r => r.status === 'pending');
        const failed = refundData.filter(r => r.status === 'failed');

        const totalRefunds = refundData.reduce((sum, r) => sum + (r.amount || 0), 0);
        const completedAmount = completed.reduce((sum, r) => sum + (r.amount || 0), 0);
        const pendingAmount = pending.reduce((sum, r) => sum + (r.amount || 0), 0);

        setStats({
          totalRefunds: refundData.length,
          totalAmount: totalRefunds,
          completedAmount,
          pendingAmount,
          failedCount: failed.length
        });
      }
    } catch (error) {
      console.log('Error fetching refunds:', error.message);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRefunds = refunds.filter(refund => {
    return !searchTerm || 
      refund.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.Tenant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.Tenant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      failed: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
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
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Refunds</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Track and manage all refund transactions</p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Refunds</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalRefunds}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Amount</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-green-600`}>Completed</p>
              <p className={`text-2xl font-bold mt-2 text-green-600`}>{formatAmount(stats.completedAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-yellow-600`}>Pending</p>
              <p className={`text-2xl font-bold mt-2 text-yellow-600`}>{formatAmount(stats.pendingAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-red-600`}>Failed</p>
              <p className={`text-3xl font-bold mt-2 text-red-600`}>{stats.failedCount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by refund ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
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
            </select>
            <button className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Filter className="w-5 h-5" /> More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading refunds...</p>
              </div>
            ) : filteredRefunds.length === 0 ? (
              <div className="p-12 text-center">
                <RotateCcw className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No refunds found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Date</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Refund ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Customer</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Amount</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Reason</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        {formatDate(refund.createdAt)}
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        {refund.paymentNumber || `REF-${refund.id?.slice(0, 8)}`}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        {refund.Tenant?.firstName} {refund.Tenant?.lastName}
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatAmount(refund.amount)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {refund.description || 'N/A'}
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(refund.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(refund.status)}`}>
                            {refund.status?.charAt(0).toUpperCase() + refund.status?.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <button className={`p-2 rounded-lg transition ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
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
          <div className="flex items-center justify-between mt-8">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
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

export default PaymentRefunds;

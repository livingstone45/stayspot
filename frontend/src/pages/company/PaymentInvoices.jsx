import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Eye, ChevronLeft, ChevronRight, Printer, Mail, Plus } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import GenerateInvoiceModal from '../../components/GenerateInvoiceModal';
import axios from 'axios';

const PaymentInvoices = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    tenantId: '',
    leaseId: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 12;

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus, page]);

  useEffect(() => {
    if (showGenerateModal) {
      fetchLeases();
    }
  }, [showGenerateModal]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        type: 'invoice',
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await axios.get(`${API_URL}/payments`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        const invoiceData = response.data.data || [];
        setInvoices(invoiceData);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        const paid = invoiceData.filter(i => i.status === 'completed');
        const pending = invoiceData.filter(i => i.status === 'pending');
        const overdue = invoiceData.filter(i => i.status === 'overdue');

        const totalAmount = invoiceData.reduce((sum, i) => sum + (i.amount || 0), 0);
        const paidAmount = paid.reduce((sum, i) => sum + (i.paidAmount || i.amount || 0), 0);
        const pendingAmount = pending.reduce((sum, i) => sum + (i.amount || 0), 0);

        setStats({
          totalInvoices: invoiceData.length,
          totalAmount,
          paidAmount,
          pendingAmount,
          overdueCount: overdue.length
        });
      }
    } catch (error) {
      console.log('Error fetching invoices:', error.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeases = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch tenants
      const tenantResponse = await axios.get(`${API_URL}/tenants`, {
        params: { limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (tenantResponse.data?.success) {
        const tenantsList = tenantResponse.data.data || [];
        setTenants(tenantsList);
        
        // Fetch leases for each tenant
        const allLeases = [];
        for (const tenant of tenantsList) {
          try {
            const leaseResponse = await axios.get(`${API_URL}/tenants/${tenant.id}/leases`, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
            if (leaseResponse.data?.success) {
              allLeases.push(...(leaseResponse.data.data || []));
            }
          } catch (err) {
            console.log(`Error fetching leases for tenant ${tenant.id}:`, err.message);
          }
        }
        setLeases(allLeases);
      }
    } catch (error) {
      console.log('Error fetching tenants:', error.message);
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/payments`, {
        ...formData,
        amount: parseFloat(formData.amount),
        type: 'invoice'
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        setMessage({ type: 'success', text: 'Invoice generated successfully' });
        setFormData({ tenantId: '', leaseId: '', amount: '', dueDate: '', description: '' });
        setTimeout(() => {
          setShowGenerateModal(false);
          setMessage(null);
          fetchInvoices();
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to generate invoice' });
    } finally {
      setGenerating(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    return !searchTerm || 
      invoice.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.Tenant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      overdue: isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800',
      draft: isDarkMode ? 'bg-slate-900/20 text-slate-400' : 'bg-slate-100 text-slate-800'
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
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Invoices</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage and track all invoices</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'}`}>
                <Download className="w-5 h-5" /> Export
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" /> Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Invoices</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalInvoices}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Amount</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-green-600`}>Paid</p>
              <p className={`text-2xl font-bold mt-2 text-green-600`}>{formatAmount(stats.paidAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-orange-600`}>Pending</p>
              <p className={`text-2xl font-bold mt-2 text-orange-600`}>{formatAmount(stats.pendingAmount)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide text-red-600`}>Overdue</p>
              <p className={`text-3xl font-bold mt-2 text-red-600`}>{stats.overdueCount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by invoice number or company..."
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
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Invoices Grid */}
        <div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className={`p-12 text-center rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <FileText className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No invoices found</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Create your first invoice to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvoices.map((invoice, idx) => (
                <div key={idx} className={`rounded-xl shadow border overflow-hidden transition ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-purple-600/50 hover:shadow-lg' : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg'}`}>
                  {/* Invoice Header */}
                  <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className={`text-xs font-mono font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {invoice.paymentNumber || `INV-${invoice.id?.slice(0, 8)}`}
                        </p>
                        <p className={`text-base font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {invoice.company || invoice.Property?.name || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(invoice.status)}`}>
                        {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {invoice.Tenant?.firstName} {invoice.Tenant?.lastName}
                    </p>
                  </div>

                  {/* Invoice Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Amount</span>
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatAmount(invoice.amount)}
                      </span>
                    </div>
                    
                    {invoice.paidAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Paid</span>
                        <span className="text-sm font-semibold text-green-600">
                          {formatAmount(invoice.paidAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Due Date</span>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {formatDate(invoice.dueDate || invoice.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Type</span>
                      <span className={`text-sm font-semibold capitalize ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {invoice.type || 'invoice'}
                      </span>
                    </div>
                  </div>

                  {/* Invoice Actions */}
                  <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'} flex gap-2`}>
                    <button className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
                      <Printer className="w-4 h-4" /> Print
                    </button>
                    <button className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
                      <Mail className="w-4 h-4" /> Send
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <GenerateInvoiceModal
        isDarkMode={isDarkMode}
        showModal={showGenerateModal}
        onClose={() => {
          setShowGenerateModal(false);
          setMessage(null);
        }}
        onSubmit={handleGenerateInvoice}
        generating={generating}
        message={message}
        formData={formData}
        setFormData={setFormData}
        tenants={tenants}
        leases={leases}
      />
    </div>
  );
};

export default PaymentInvoices;

import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Filter, Search, Eye, Edit, Trash2, Plus, TrendingUp, AlertCircle, CheckCircle, X, Calendar, Clock, FileText, DollarSign, User, Building2, Check } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PaymentManagement = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientType: 'landlord',
    recipient: '',
    amount: '',
    method: 'bank',
    description: '',
    dueDate: '',
    scheduleType: 'once',
    frequency: 'monthly',
    reference: '',
    notes: '',
    attachments: []
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/payments`, {
        params: { status: filterStatus !== 'all' ? filterStatus : undefined },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success && response.data?.data) {
        const paymentsData = response.data.data;
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        
        const completed = paymentsData.filter(p => p.status === 'completed');
        const pending = paymentsData.filter(p => p.status === 'pending');
        const failed = paymentsData.filter(p => p.status === 'failed');
        
        const totalRevenue = completed.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingAmount = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
        const failedAmount = failed.reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalRevenue: `$${(totalRevenue / 1000).toFixed(1)}K`,
          pendingPayments: `$${(pendingAmount / 1000).toFixed(1)}K`,
          failedPayments: `$${(failedAmount / 1000).toFixed(1)}K`,
          refunds: '$45K'
        });
      }
    } catch (error) {
      console.log('Error fetching payments:', error.message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const paymentStats = [
    { label: 'Total Revenue', value: stats?.totalRevenue || '$0', change: '+18.7%', icon: '💰' },
    { label: 'Pending Payments', value: stats?.pendingPayments || '$0', change: 'transactions', icon: '⏳' },
    { label: 'Failed Payments', value: stats?.failedPayments || '$0', change: 'transactions', icon: '❌' },
    { label: 'Refunds Issued', value: stats?.refunds || '$0', change: 'This month', icon: '↩️' }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleCreatePayment = () => {
    if (formData.recipient && formData.amount && formData.method) {
      setPayments([{
        id: 'TXN' + Date.now(),
        company: formData.recipient,
        amount: parseFloat(formData.amount),
        status: 'pending',
        method: formData.method,
        createdAt: new Date()
      }, ...payments]);
      setShowModal(false);
      setStep(1);
      setFormData({
        recipientType: 'landlord',
        recipient: '',
        amount: '',
        method: 'bank',
        description: '',
        dueDate: '',
        scheduleType: 'once',
        frequency: 'monthly',
        reference: '',
        notes: '',
        attachments: []
      });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setFormData({
      recipientType: 'landlord',
      recipient: '',
      amount: '',
      method: 'bank',
      description: '',
      dueDate: '',
      scheduleType: 'once',
      frequency: 'monthly',
      reference: '',
      notes: '',
      attachments: []
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Management</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Track and manage all platform payments</p>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              <Plus className="w-5 h-5" /> New Payment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paymentStats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs font-semibold text-green-600">{stat.change}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className={`rounded-xl shadow p-6 border mb-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by transaction ID or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading payments...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-8 text-center">
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No payments found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Transaction ID</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Company</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Amount</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Method</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Date</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, idx) => (
                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{payment.id}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{payment.company || 'N/A'}</td>
                      <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatAmount(payment.amount)}</td>
                      <td className={`px-6 py-4 text-sm`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{payment.method || 'N/A'}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{formatDate(payment.createdAt)}</td>
                      <td className={`px-6 py-4 text-sm flex gap-2`}>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded hover:bg-slate-700 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-orange-900/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">New Payment</h2>
              <button onClick={handleClose} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex gap-2 px-6 py-4 bg-slate-800/50 border-b border-orange-900/20">
              {[1, 2, 3].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-slate-700'}`}></div>
              ))}
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto text-slate-100">
              {/* Step 1: Recipient & Amount */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <User size={16} className="text-orange-500" /> Recipient Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['landlord', 'manager', 'vendor'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, recipientType: type})}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.recipientType === type
                              ? 'border-orange-500 bg-orange-900/30 text-orange-300'
                              : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-600/50'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Recipient Name</label>
                    <input type="text" placeholder="Enter recipient name" value={formData.recipient} onChange={(e) => setFormData({...formData, recipient: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <DollarSign size={16} className="text-orange-500" /> Amount (KES)
                    </label>
                    <input type="number" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Reference Number</label>
                    <input type="text" placeholder="e.g., INV-2024-001" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Payment Method</label>
                    <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Credit Card</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="check">Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" /> Due Date
                    </label>
                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-orange-500" /> Schedule Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['once', 'recurring'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, scheduleType: type})}
                          className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.scheduleType === type
                              ? 'border-orange-500 bg-orange-900/30 text-orange-300'
                              : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-600/50'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.scheduleType === 'recurring' && (
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Frequency</label>
                      <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Description</label>
                    <textarea placeholder="Enter payment description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows="2"></textarea>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-orange-400">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Recipient:</span><span className="text-slate-100 font-medium">{formData.recipient}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Type:</span><span className="text-slate-100 font-medium">{formData.recipientType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Amount:</span><span className="text-orange-400 font-bold">KES {parseFloat(formData.amount || 0).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Method:</span><span className="text-slate-100 font-medium">{formData.method}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Due Date:</span><span className="text-slate-100 font-medium">{formData.dueDate || 'Not set'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Schedule:</span><span className="text-slate-100 font-medium">{formData.scheduleType === 'recurring' ? `${formData.frequency}` : 'One-time'}</span></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-orange-500" /> Additional Notes
                    </label>
                    <textarea placeholder="Add any additional notes..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows="3"></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800/50 px-6 py-4 flex gap-3 border-t border-orange-900/20 rounded-b-2xl">
              <button onClick={() => step > 1 ? setStep(step - 1) : handleClose()} className="flex-1 px-4 py-2 border-2 border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={() => step < 3 ? setStep(step + 1) : handleCreatePayment()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all flex items-center justify-center gap-2"
              >
                {step === 3 ? <><Check size={18} /> Create Payment</> : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;

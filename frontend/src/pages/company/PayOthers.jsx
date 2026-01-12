import React, { useState } from 'react';
import { Send, Plus, Search, Filter, DollarSign, User, Mail, Phone, MapPin, CheckCircle, Clock, AlertCircle, CreditCard, Repeat2, Calendar, Edit2, Trash2, Check, X, ToggleRight, ToggleLeft } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const PayOthers = () => {
  const { isDarkMode } = useThemeMode();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [payments, setPayments] = useState([
    { id: 1, name: 'John Smith', role: 'Landlord', email: 'john@example.com', phone: '+1-555-0101', amount: 5000, status: 'pending', date: '2024-01-15', property: 'Sunset Apartments', method: 'bank_transfer', automatic: false, frequency: null },
    { id: 2, name: 'Sarah Johnson', role: 'Property Manager', email: 'sarah@example.com', phone: '+1-555-0102', amount: 3500, status: 'completed', date: '2024-01-14', property: 'Downtown Lofts', method: 'credit_card', automatic: true, frequency: 'monthly' },
    { id: 3, name: 'Mike Davis', role: 'Landlord', email: 'mike@example.com', phone: '+1-555-0103', amount: 2800, status: 'pending', date: '2024-01-13', property: 'Riverside Complex', method: 'check', automatic: false, frequency: null },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Landlord',
    email: '',
    phone: '',
    amount: '',
    property: '',
    description: '',
    method: 'bank_transfer',
    automatic: false,
    frequency: 'monthly'
  });

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
    { value: 'check', label: 'Check', icon: '✓' },
    { value: 'ach', label: 'ACH Transfer', icon: '📄' },
    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
    { value: 'mpesa', label: 'M-Pesa', icon: '📱' }
  ];

  const frequencies = [
    { value: 'once', label: 'One Time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  const roles = ['All', 'Landlord', 'Property Manager', 'Maintenance Staff', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: payments.length + 1,
      ...formData,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setPayments([newPayment, ...payments]);
    setFormData({ name: '', role: 'Landlord', email: '', phone: '', amount: '', property: '', description: '', method: 'bank_transfer', automatic: false, frequency: 'monthly' });
    setShowForm(false);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || p.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalAutomatic = payments.filter(p => p.automatic).reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleApprove = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'completed' } : p));
  };

  const handleReject = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'failed' } : p));
  };

  const handleDelete = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleEdit = (id) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setFormData(payment);
      setShowForm(true);
    }
  };

  const handleToggleAutomatic = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, automatic: !p.automatic } : p));
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pay Others</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage payments to landlords, managers, and other stakeholders</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Payment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Pending</p>
                <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${totalPending.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Completed</p>
                <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${totalCompleted.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Automatic Payments</p>
                <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${totalAutomatic.toLocaleString()}</p>
              </div>
              <Repeat2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className={`rounded-lg p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Recipients</p>
                <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{payments.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* New Payment Form */}
        {showForm && (
          <div className={`rounded-lg p-6 border mb-8 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create New Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    placeholder="Recipient name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                  >
                    {roles.filter(r => r !== 'All').map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Amount ($)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Property</label>
                  <input
                    type="text"
                    name="property"
                    value={formData.property}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    placeholder="Property name"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                  placeholder="Payment description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Payment Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    disabled={!formData.automatic}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:opacity-50`}
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className={`flex items-center gap-2 p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-300'} cursor-pointer`}>
                <input
                  type="checkbox"
                  name="automatic"
                  checked={formData.automatic}
                  onChange={(e) => setFormData(prev => ({ ...prev, automatic: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Enable Automatic Recurring Payment</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition"
                >
                  <Send className="w-4 h-4" />
                  Create Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'} transition`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-lg p-4 mb-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-600`}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Recipient</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Role</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Amount</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Method</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Frequency</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map(payment => (
                    <tr key={payment.id} className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition`}>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                        <div>
                          <p className="font-medium">{payment.name}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{payment.email}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{payment.role}</td>
                      <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>${payment.amount.toLocaleString()}</td>
                      <td className={`px-6 py-4`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{paymentMethods.find(m => m.value === payment.method)?.icon}</span>
                          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{paymentMethods.find(m => m.value === payment.method)?.label}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4`}>
                        {payment.automatic ? (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>
                            <Repeat2 className="w-3 h-3" />
                            {frequencies.find(f => f.value === payment.frequency)?.label}
                          </span>
                        ) : (
                          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>One-time</span>
                        )}
                      </td>
                      <td className={`px-6 py-4`}>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4`}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleAutomatic(payment.id)} className={`p-1 rounded ${payment.automatic ? 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`} title="Toggle Automatic">
                            {payment.automatic ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          {payment.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(payment.id)} className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded" title="Approve">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(payment.id)} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded" title="Reject">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleEdit(payment.id)} className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(payment.id)} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={`px-6 py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayOthers;

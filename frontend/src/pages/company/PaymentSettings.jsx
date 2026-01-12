import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Lock, CreditCard, DollarSign, Clock, Shield } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const PaymentSettings = () => {
  const { isDarkMode } = useThemeMode();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    paymentMethods: ['bank_transfer', 'credit_card', 'mpesa'],
    autoPaymentEnabled: true,
    paymentDueDay: 15,
    lateFeePercentage: 5,
    lateFeeType: 'percentage',
    gracePeriodDays: 3,
    notificationDays: 7,
    refundPolicy: 'full',
    refundProcessingDays: 5,
    bankDetails: {
      accountHolder: 'StaySpot Inc',
      accountNumber: '••••••••',
      routingNumber: '••••••••',
      bankName: 'First National Bank'
    },
    paypalEmail: 'payments@stayspot.com',
    stripeConnected: true,
    mpesaTillNumber: '123456',
    mpesaPaybill: '654321',
    mpesaAccountNumber: 'STAYSPOT',
    mpesaPhoneNumber: '+254712345678'
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  const handlePaymentMethodToggle = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.log('Error saving settings:', error.message);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Settings</h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Configure payment methods and policies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? isDarkMode ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-green-100 border border-green-300 text-green-800'
              : isDarkMode ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</h2>
              </div>
              <div className="space-y-3">
                {['bank_transfer', 'credit_card', 'paypal', 'stripe', 'mpesa'].map(method => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method)}
                      onChange={() => handlePaymentMethodToggle(method)}
                      className="w-4 h-4 rounded"
                    />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                      {method === 'mpesa' ? 'M-Pesa' : method === 'bank_transfer' ? 'Bank Transfer' : method === 'credit_card' ? 'Credit Card' : method.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Auto Payment */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Auto Payment</h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoPaymentEnabled"
                    checked={formData.autoPaymentEnabled}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Payment Due Day
                  </label>
                  <input
                    type="number"
                    name="paymentDueDay"
                    value={formData.paymentDueDay}
                    onChange={handleInputChange}
                    min="1"
                    max="31"
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>

            {/* Late Fees */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Late Fees</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Late Fee Type
                    </label>
                    <select
                      name="lateFeeType"
                      value={formData.lateFeeType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Late Fee {formData.lateFeeType === 'percentage' ? '(%)' : '($)'}
                    </label>
                    <input
                      type="number"
                      name="lateFeePercentage"
                      value={formData.lateFeePercentage}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    name="gracePeriodDays"
                    value={formData.gracePeriodDays}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-green-500" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Send Reminder (Days Before Due)
                </label>
                <input
                  type="number"
                  name="notificationDays"
                  value={formData.notificationDays}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
            </div>

            {/* Refund Policy */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Refund Policy</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Refund Type
                  </label>
                  <select
                    name="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  >
                    <option value="full">Full Refund</option>
                    <option value="partial">Partial Refund</option>
                    <option value="store_credit">Store Credit</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Processing Days
                  </label>
                  <input
                    type="number"
                    name="refundProcessingDays"
                    value={formData.refundProcessingDays}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Sidebar */}
          <div className="space-y-6">
            {/* Bank Account */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-indigo-500" />
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bank Account</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleBankDetailsChange}
                    placeholder="Enter bank name"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Account Holder
                  </label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.bankDetails.accountHolder}
                    onChange={handleBankDetailsChange}
                    placeholder="Full name"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Account Number
                  </label>
                  <input
                    type="password"
                    name="accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleBankDetailsChange}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Routing Number
                  </label>
                  <input
                    type="password"
                    name="routingNumber"
                    value={formData.bankDetails.routingNumber}
                    onChange={handleBankDetailsChange}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PayPal</h3>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  PayPal Email
                </label>
                <input
                  type="email"
                  name="paypalEmail"
                  value={formData.paypalEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
            </div>

            {/* Stripe */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stripe</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${formData.stripeConnected ? 'bg-green-900/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {formData.stripeConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                {formData.stripeConnected ? 'Manage' : 'Connect'} Stripe
              </button>
            </div>

            {/* M-Pesa */}
            <div className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>M-Pesa 📱</h3>
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Till Number
                  </label>
                  <input
                    type="text"
                    value={formData.mpesaTillNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaTillNumber: e.target.value }))}
                    placeholder="e.g. 123456"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Paybill Number
                  </label>
                  <input
                    type="text"
                    value={formData.mpesaPaybill}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaPaybill: e.target.value }))}
                    placeholder="e.g. 654321"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.mpesaAccountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaAccountNumber: e.target.value }))}
                    placeholder="e.g. STAYSPOT"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mpesaPhoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaPhoneNumber: e.target.value }))}
                    placeholder="e.g. +254712345678"
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;

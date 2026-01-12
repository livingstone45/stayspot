import React, { useState } from 'react';
import { CreditCard, Calendar, DollarSign, TrendingUp, Check, Eye, EyeOff, Download } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const PaymentsPage = () => {
  const { isDark, getClassNames } = useThemeMode();
  
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const [showBalance, setShowBalance] = useState(true);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'credit-card',
    notes: ''
  });

  const [paymentMethods] = useState([
    { id: 'credit-card', name: 'Credit Card', icon: '💳' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'check', name: 'Check', icon: '📄' }
  ]);

  const [payments] = useState([
    { id: 1, date: '2025-12-01', amount: 1500, method: 'Credit Card', status: 'completed', receipt: 'REC-001' },
    { id: 2, date: '2025-11-01', amount: 1500, method: 'Bank Transfer', status: 'completed', receipt: 'REC-002' },
    { id: 3, date: '2025-10-01', amount: 1500, method: 'Credit Card', status: 'completed', receipt: 'REC-003' },
    { id: 4, date: '2025-09-01', amount: 1500, method: 'Check', status: 'completed', receipt: 'REC-004' },
    { id: 5, date: '2025-08-01', amount: 1500, method: 'Credit Card', status: 'completed', receipt: 'REC-005' },
    { id: 6, date: '2025-07-01', amount: 1500, method: 'Bank Transfer', status: 'completed', receipt: 'REC-006' },
  ]);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert(`Payment of $${paymentForm.amount} submitted via ${paymentForm.method}`);
    setPaymentForm({ amount: '', method: 'credit-card', notes: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>💳 Payment & Billing</h1>
        <p className={subtitleClasses}>Manage your rent payments and billing</p>
      </div>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${textClasses}`}>Current Balance</p>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {showBalance ? '$1,500.00' : '••••••'}
          </p>
          <p className={`text-xs ${textClasses} mt-2`}>Due on Dec 1, 2025</p>
        </div>

        <div className={cardClasses}>
          <p className={`text-sm font-medium ${textClasses}`}>Next Payment</p>
          <p className={`text-3xl font-bold text-blue-600 mt-2`}>$1,500.00</p>
          <p className={`text-xs ${textClasses} mt-2`}>Due in 9 days</p>
        </div>

        <div className={cardClasses}>
          <p className={`text-sm font-medium ${textClasses}`}>Last Payment</p>
          <p className={`text-3xl font-bold text-green-600 mt-2`}>$1,500.00</p>
          <p className={`text-xs ${textClasses} mt-2`}>Nov 1, 2025</p>
        </div>
      </div>

      {/* Payment Form & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Payment Form */}
        <div className={cardClasses}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Make a Payment</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Amount</label>
              <input
                type="number"
                placeholder="1500.00"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Payment Method</label>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value={method.id}
                      checked={paymentForm.method === method.id}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${textClasses}`}>
                      {method.icon} {method.name}
                    </span>
                    {method.id === 'credit-card' && paymentForm.method === 'credit-card' && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textClasses}`}>Notes (Optional)</label>
              <textarea
                placeholder="Add any payment notes..."
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Submit Payment
            </button>
          </form>
        </div>

        {/* Payment Summary */}
        <div className={cardClasses}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className={textClasses}>Rent (Dec 2025)</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>$1,200.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={textClasses}>Utilities</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>$150.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={textClasses}>Parking</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>$100.00</span>
            </div>
            <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border-t border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <span className="font-semibold">Total Due</span>
              <span className="text-2xl font-bold text-blue-600">$1,450.00</span>
            </div>
            <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-700'}`}>
              ✓ On-time payment: No late fees applied
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className={cardClasses}>
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-semibold ${textClasses}`}>Date</th>
                <th className={`text-left py-3 px-4 font-semibold ${textClasses}`}>Amount</th>
                <th className={`text-left py-3 px-4 font-semibold ${textClasses}`}>Method</th>
                <th className={`text-left py-3 px-4 font-semibold ${textClasses}`}>Status</th>
                <th className={`text-left py-3 px-4 font-semibold ${textClasses}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition`}>
                  <td className={`py-3 px-4 ${textClasses}`}>{new Date(payment.date).toLocaleDateString()}</td>
                  <td className={`py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>${payment.amount.toFixed(2)}</td>
                  <td className={`py-3 px-4 ${textClasses}`}>{payment.method}</td>
                  <td className={`py-3 px-4`}>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className={`py-3 px-4`}>
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Download size={16} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className={cardClasses + ' text-center'}>
          <CreditCard className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} size={24} />
          <p className={`${textClasses} text-sm`}>Total Payments</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>6</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
          <p className={`${textClasses} text-sm`}>On Time Rate</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>100%</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <Check className="text-blue-600 mx-auto mb-2" size={24} />
          <p className={`${textClasses} text-sm`}>Payments Made</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>6</p>
        </div>
        <div className={cardClasses + ' text-center'}>
          <Calendar className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} size={24} />
          <p className={`${textClasses} text-sm`}>Days Until Due</p>
          <p className={`text-2xl font-bold text-orange-600`}>9</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;

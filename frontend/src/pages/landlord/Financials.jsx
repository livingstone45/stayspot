import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../hooks/useThemeMode';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Wallet, PieChart } from 'lucide-react';

const Financials = () => {
  const { user } = useAuth();
  const { isDark, resolvedTheme } = useThemeMode();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [themeKey, setThemeKey] = useState(0);
  const [showHiddenValues, setShowHiddenValues] = useState(true);
  const [financialData, setFinancialData] = useState({
    summary: {},
    transactions: [],
    projections: [],
    paymentStatus: [],
    budgetVsActual: []
  });

  useEffect(() => {
    const mockData = {
      summary: {
        totalRevenue: 56200,
        totalExpenses: 12400,
        netIncome: 43800,
        projectedIncome: 168600,
        outstanding: 4500,
        overdue: 1200,
        cashReserve: 125000,
        monthlyBudget: 50000
      },
      transactions: [
        { id: 1, date: '2024-12-20', desc: 'Rent payment - Unit 101', property: 'Sunset Apartments', amount: 2500, type: 'income', status: 'received', category: 'Rent' },
        { id: 2, date: '2024-12-19', desc: 'Maintenance - Plumbing', property: 'Riverside Towers', amount: -450, type: 'expense', status: 'paid', category: 'Maintenance' },
        { id: 3, date: '2024-12-18', desc: 'Rent payment - Unit 202', property: 'Downtown Complex', amount: 2500, type: 'income', status: 'received', category: 'Rent' },
        { id: 4, date: '2024-12-17', desc: 'Property Tax', property: 'Central Hub', amount: -2800, type: 'expense', status: 'paid', category: 'Tax' },
        { id: 5, date: '2024-12-16', desc: 'Rent payment - Unit 305', property: 'Hillside Residences', amount: 2300, type: 'income', status: 'received', category: 'Rent' },
        { id: 6, date: '2024-12-15', desc: 'Utilities', property: 'Sunset Apartments', amount: -1800, type: 'expense', status: 'paid', category: 'Utilities' },
        { id: 7, date: '2024-12-14', desc: 'Insurance Premium', property: 'All Properties', amount: -1800, type: 'expense', status: 'paid', category: 'Insurance' },
        { id: 8, date: '2024-12-13', desc: 'Rent payment - Unit 401', property: 'Downtown Complex', amount: 2300, type: 'income', status: 'received', category: 'Rent' },
      ],
      projections: [
        { month: 'Jan', revenue: 58000, expenses: 13200, net: 44800, budget: 50000 },
        { month: 'Feb', revenue: 60000, expenses: 13500, net: 46500, budget: 50000 },
        { month: 'Mar', revenue: 61500, expenses: 13800, net: 47700, budget: 50000 },
        { month: 'Apr', revenue: 62000, expenses: 14000, net: 48000, budget: 50000 },
        { month: 'May', revenue: 63500, expenses: 14200, net: 49300, budget: 50000 },
        { month: 'Jun', revenue: 65000, expenses: 14500, net: 50500, budget: 50000 },
      ],
      paymentStatus: [
        { tenant: 'John Doe', unit: '101', dueDate: '2024-12-25', amount: 1200, status: 'received' },
        { tenant: 'Jane Smith', unit: '201', dueDate: '2024-12-25', amount: 1500, status: 'received' },
        { tenant: 'Bob Wilson', unit: '301', dueDate: '2024-12-25', amount: 1350, status: 'pending' },
        { tenant: 'Alice Brown', unit: '401', dueDate: '2024-12-25', amount: 1400, status: 'overdue' },
      ],
      budgetVsActual: [
        { category: 'Maintenance', budget: 4000, actual: 3420, variance: 580 },
        { category: 'Utilities', budget: 2000, actual: 1800, variance: 200 },
        { category: 'Property Tax', budget: 3000, actual: 2800, variance: 200 },
        { category: 'Insurance', budget: 2000, actual: 1800, variance: 200 },
        { category: 'Management', budget: 2500, actual: 2000, variance: 500 },
      ]
    };
    setFinancialData(mockData);
  }, [selectedPeriod]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setThemeKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setThemeKey(prev => prev + 1);
  }, [resolvedTheme]);

  const formatCurrency = (value) => {
    if (!showHiddenValues && value > 0) return '••••••';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div key={themeKey} className={`${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} min-h-screen p-8`}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl font-black mb-2`}>Financials</h1>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'} text-base`}>Monitor your revenue, expenses & cash flow</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowHiddenValues(!showHiddenValues)}
              className={`p-3 rounded-xl transition-all ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'}`}
            >
              {showHiddenValues ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <button className={`px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'}`}>
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-3 flex-wrap">
          {['week', 'month', 'quarter', 'year'].map(period => (
            <button 
              key={period} 
              onClick={() => setSelectedPeriod(period)} 
              className={`px-5 py-2.5 text-sm rounded-xl font-bold transition-all cursor-pointer ${
                selectedPeriod === period 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' 
                  : (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm')
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards - Gradient Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <ArrowUpRight size={24} className="text-blue-200" />
          </div>
          <p className="text-4xl font-black mb-2">{formatCurrency(financialData.summary.totalRevenue)}</p>
          <p className="text-blue-100 text-sm">+12% vs last month</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-orange-100 text-xs font-bold uppercase tracking-wider">Total Expenses</span>
            <ArrowDownLeft size={24} className="text-orange-200" />
          </div>
          <p className="text-4xl font-black mb-2">{formatCurrency(financialData.summary.totalExpenses)}</p>
          <p className="text-orange-100 text-sm">22% of revenue</p>
        </div>

        {/* Net Income Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Net Income</span>
            <TrendingUp size={24} className="text-emerald-200" />
          </div>
          <p className="text-4xl font-black mb-2">{formatCurrency(financialData.summary.netIncome)}</p>
          <p className="text-emerald-100 text-sm">78% profit margin</p>
        </div>

        {/* Cash Reserve Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-100 text-xs font-bold uppercase tracking-wider">Cash Reserve</span>
            <Wallet size={24} className="text-purple-200" />
          </div>
          <p className="text-4xl font-black mb-2">{formatCurrency(financialData.summary.cashReserve)}</p>
          <p className="text-purple-100 text-sm">Liquid assets</p>
        </div>
      </div>

      {/* Payment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
          <p className="text-green-700 text-xs font-bold uppercase tracking-wider mb-3">Payments Received</p>
          <p className="text-green-600 text-4xl font-black mb-3">
            {financialData.paymentStatus.filter(p => p.status === 'received').length}/{financialData.paymentStatus.length}
          </p>
          <div className="w-full rounded-full h-3 bg-green-200">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
              style={{ width: `${(financialData.paymentStatus.filter(p => p.status === 'received').length / financialData.paymentStatus.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-md">
          <p className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">Pending Payments</p>
          <p className="text-amber-600 text-4xl font-black mb-3">
            {formatCurrency(financialData.paymentStatus.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
          </p>
          <p className="text-amber-600 text-sm font-semibold">{financialData.paymentStatus.filter(p => p.status === 'pending').length} tenants</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200 shadow-md">
          <p className="text-red-700 text-xs font-bold uppercase tracking-wider mb-3">Overdue Payments</p>
          <p className="text-red-600 text-4xl font-black mb-3">
            {formatCurrency(financialData.paymentStatus.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0))}
          </p>
          <p className="text-red-600 text-sm font-semibold">{financialData.paymentStatus.filter(p => p.status === 'overdue').length} tenant(s)</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Transactions */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-5`}>Recent Transactions</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {financialData.transactions.map((tx) => (
              <div key={tx.id} className={`p-4 rounded-xl flex justify-between items-center ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                <div>
                  <p className={isDark ? 'text-white' : 'text-gray-900'} style={{ fontWeight: '700' }}>{tx.desc}</p>
                  <div className="flex gap-3 mt-2">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tx.property}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tx.date}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                      tx.status === 'received' ? 'bg-green-100 text-green-700' :
                      tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className={`font-black text-lg ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Details */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-5`}>Payment Status</h2>
          <div className="space-y-3">
            {financialData.paymentStatus.map((payment, i) => (
              <div key={i} className={`p-4 rounded-xl ${
                payment.status === 'received' ? (isDark ? 'bg-green-900 bg-opacity-30' : 'bg-green-50') :
                payment.status === 'pending' ? (isDark ? 'bg-amber-900 bg-opacity-30' : 'bg-amber-50') :
                (isDark ? 'bg-red-900 bg-opacity-30' : 'bg-red-50')
              } border-l-4 ${
                payment.status === 'received' ? 'border-green-500' :
                payment.status === 'pending' ? 'border-amber-500' :
                'border-red-500'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{payment.tenant}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Unit {payment.unit}</p>
                  </div>
                  <span className={`font-black ${
                    payment.status === 'received' ? 'text-green-600' :
                    payment.status === 'pending' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{payment.status === 'overdue' ? '⚠ ' : ''}Due: {payment.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-5`}>Budget vs Actual</h2>
          <div className="space-y-5">
            {financialData.budgetVsActual.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-700'} style={{ fontWeight: '600' }}>{item.category}</span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-black text-sm`}>
                    ${item.actual.toLocaleString()} / ${item.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full rounded-full h-3 bg-gray-200">
                  <div 
                    className={`h-3 rounded-full ${item.variance > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                    style={{ width: `${(item.actual / item.budget) * 100}%` }}
                  ></div>
                </div>
                <p className={`text-xs font-semibold mt-2 ${item.variance > 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {item.variance > 0 ? '+' : ''}{item.variance > 0 ? 'Under' : 'Over'} by ${Math.abs(item.variance).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Month Forecast */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-black mb-5`}>6-Month Forecast</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'border-gray-700' : 'border-gray-200'}>
                  <th className={`text-left py-3 px-3 ${isDark ? 'text-gray-400' : 'text-gray-700'} font-bold border-b-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>Month</th>
                  <th className={`text-right py-3 px-3 ${isDark ? 'text-gray-400' : 'text-gray-700'} font-bold border-b-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>Net</th>
                </tr>
              </thead>
              <tbody>
                {financialData.projections.map((proj, i) => (
                  <tr key={i} className={isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}>
                    <td className={`py-3 px-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} font-semibold`}>{proj.month}</td>
                    <td className={`text-right py-3 px-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} text-emerald-600 font-black`}>
                      {formatCurrency(proj.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;

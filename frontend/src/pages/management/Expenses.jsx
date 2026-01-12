import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit, DollarSign, Calendar, Tag, TrendingDown, Eye, BarChart3, PieChart as PieChartIcon, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'maintenance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    property: '',
    status: 'pending',
    vendor: ''
  });

  const [expenses, setExpenses] = useState([
    { id: 1, description: 'HVAC Maintenance', category: 'maintenance', amount: 450, date: '2024-03-15', property: 'Downtown Apartments', status: 'paid', vendor: 'Cool Air Services' },
    { id: 2, description: 'Plumbing Repair', category: 'maintenance', amount: 320, date: '2024-03-14', property: 'Riverside Complex', status: 'paid', vendor: 'Quick Plumbing' },
    { id: 3, description: 'Property Insurance', category: 'insurance', amount: 1200, date: '2024-03-10', property: 'Hillside Residences', status: 'paid', vendor: 'SafeGuard Insurance' },
    { id: 4, description: 'Cleaning Service', category: 'utilities', amount: 280, date: '2024-03-12', property: 'Garden Plaza', status: 'pending', vendor: 'Sparkle Clean' },
    { id: 5, description: 'Landscaping', category: 'maintenance', amount: 350, date: '2024-03-08', property: 'Downtown Apartments', status: 'paid', vendor: 'Green Thumb Landscaping' },
    { id: 6, description: 'Property Tax', category: 'taxes', amount: 2500, date: '2024-03-01', property: 'Riverside Complex', status: 'paid', vendor: 'County Tax Office' },
    { id: 7, description: 'Pest Control', category: 'maintenance', amount: 150, date: '2024-02-28', property: 'Hillside Residences', status: 'paid', vendor: 'Pest Masters' },
    { id: 8, description: 'Utilities - Water', category: 'utilities', amount: 420, date: '2024-02-25', property: 'Garden Plaza', status: 'pending', vendor: 'City Water Dept' }
  ]);

  const categories = [
    { value: 'maintenance', label: 'Maintenance', color: '#3b82f6', icon: '🔧' },
    { value: 'utilities', label: 'Utilities', color: '#10b981', icon: '💡' },
    { value: 'insurance', label: 'Insurance', color: '#8b5cf6', icon: '🛡️' },
    { value: 'taxes', label: 'Taxes', color: '#ef4444', icon: '📋' },
    { value: 'other', label: 'Other', color: '#6b7280', icon: '📦' }
  ];

  const properties = ['Downtown Apartments', 'Riverside Complex', 'Hillside Residences', 'Garden Plaza'];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.property) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newExpense = {
      id: Math.max(...expenses.map(e => e.id), 0) + 1,
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    setExpenses([newExpense, ...expenses]);
    setFormData({
      description: '',
      category: 'maintenance',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      property: '',
      status: 'pending',
      vendor: ''
    });
    setShowModal(false);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, searchTerm, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const thisMonth = expenses.filter(exp => exp.date.startsWith('2024-03')).reduce((sum, exp) => sum + exp.amount, 0);
    const pending = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
    const paid = expenses.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0);
    
    return [
      { label: 'Total Expenses', value: `$${total.toLocaleString()}`, color: 'red', icon: DollarSign },
      { label: 'This Month', value: `$${thisMonth.toLocaleString()}`, color: 'orange', icon: Calendar },
      { label: 'Pending', value: `$${pending.toLocaleString()}`, color: 'yellow', icon: Tag },
      { label: 'Paid', value: `$${paid.toLocaleString()}`, color: 'green', icon: Eye }
    ];
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    expenses.forEach(exp => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return Object.entries(breakdown).map(([cat, amount]) => ({
      name: categories.find(c => c.value === cat)?.label || cat,
      value: amount,
      color: categories.find(c => c.value === cat)?.color || '#6b7280'
    }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const months = {};
    expenses.forEach(exp => {
      const month = exp.date.substring(0, 7);
      months[month] = (months[month] || 0) + exp.amount;
    });
    return Object.entries(months).sort().map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      amount
    }));
  }, [expenses]);

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const getCategoryColor = (category) => {
    return categories.find(c => c.value === category)?.color || '#6b7280';
  };

  const getCategoryLabel = (category) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCategoryIcon = (category) => {
    return categories.find(c => c.value === category)?.icon || '📦';
  };

  const StatCard = ({ label, value, color, icon: Icon }) => {
    const colorMap = {
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
    };

    return (
      <div className={`rounded-lg p-6 border ${colorMap[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          </div>
          <Icon className="h-8 w-8 opacity-50" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all property expenses</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-5 w-5" />
              Add Expense
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              By Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none transition-all"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Vendor</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: getCategoryColor(expense.category) + '20', color: getCategoryColor(expense.category) }}>
                          {getCategoryLabel(expense.category)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{expense.property}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{expense.vendor}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900 dark:text-white">${expense.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${expense.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
                          {expense.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(expense.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No expenses found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                  placeholder="e.g., HVAC Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property *</label>
                <select
                  required
                  value={formData.property}
                  onChange={(e) => setFormData({...formData, property: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                >
                  <option value="">Select a property</option>
                  {properties.map(prop => (
                    <option key={prop} value={prop}>{prop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                  placeholder="Vendor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;

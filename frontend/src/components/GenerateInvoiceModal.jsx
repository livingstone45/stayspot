import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const GenerateInvoiceModal = ({
  isDarkMode,
  showModal,
  onClose,
  onSubmit,
  generating,
  message,
  formData,
  setFormData,
  tenants,
  leases
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-8 border-b bg-gradient-to-r from-purple-600/10 to-purple-700/10 flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generate Invoice</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Create a new invoice for your tenant</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
              message.type === 'success'
                ? isDarkMode ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-300 text-green-800'
                : isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Tenant */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Select Tenant
              </label>
              <select
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-purple-500 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              >
                <option value="">Choose a tenant...</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.firstName} {tenant.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Lease */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Select Lease
              </label>
              <select
                value={formData.leaseId}
                onChange={(e) => setFormData({ ...formData, leaseId: e.target.value })}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-purple-500 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              >
                <option value="">Choose a lease...</option>
                {leases.map(lease => (
                  <option key={lease.id} value={lease.id}>
                    {lease.leaseNumber} - {lease.Property?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Amount */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Invoice Amount
              </label>
              <div className={`flex items-center rounded-lg border-2 transition focus-within:border-purple-500 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                <span className={`px-4 py-3 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  placeholder="0.00"
                  className={`flex-1 px-0 py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-purple-500 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Monthly rent for January 2024"
              rows="3"
              className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-purple-500 resize-none ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </span>
              ) : (
                'Generate Invoice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateInvoiceModal;

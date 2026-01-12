import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, Award, Plus, X } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const Compliance = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      if (modalType === 'standard') {
        endpoint = '/api/security/compliance/standards';
      } else if (modalType === 'certification') {
        endpoint = '/api/security/compliance/certifications';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create');
      setFormData({ name: '', description: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = [
    { label: 'Standards', value: '8', icon: '📋' },
    { label: 'Active Certifications', value: '5', icon: '🏆' },
    { label: 'Completed Audits', value: '12', icon: '✅' },
    { label: 'Open Violations', value: '2', icon: '⚠️' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Compliance Management</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Track standards, certifications, and audits</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl shadow p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
          <div className="flex border-b overflow-x-auto">
            {['overview', 'standards', 'certifications', 'audits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Compliance overview and status</p>
              </div>
            )}
            {activeTab === 'standards' && (
              <div className="space-y-4">
                <button
                  onClick={() => { setModalType('standard'); setShowModal(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition"
                >
                  <Plus className="w-5 h-5 inline mr-2" /> Add Standard
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No standards added yet</p>
              </div>
            )}
            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <button
                  onClick={() => { setModalType('certification'); setShowModal(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition"
                >
                  <Plus className="w-5 h-5 inline mr-2" /> Add Certification
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No certifications added yet</p>
              </div>
            )}
            {activeTab === 'audits' && (
              <div className="space-y-4">
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
                  <Plus className="w-5 h-5 inline mr-2" /> Create Audit
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No audits yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {modalType === 'standard' && 'Add Standard'}
                  {modalType === 'certification' && 'Add Certification'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compliance;

import React, { useState } from 'react';
import { Database, Download, Upload, Plus, X } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const Data = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupForm, setBackupForm] = useState({ backup_type: 'full', description: '' });

  const handleCreateBackup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/security/data/backups', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(backupForm)
      });
      if (!response.ok) throw new Error('Failed to create backup');
      setBackupForm({ backup_type: 'full', description: '' });
      setShowBackupModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = [
    { label: 'Total Users', value: '156', icon: '👥' },
    { label: 'Properties', value: '42', icon: '🏠' },
    { label: 'Storage Used', value: '2.4 GB', icon: '💾' },
    { label: 'Last Backup', value: '2 hours ago', icon: '⏱️' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Manage backups, exports, and data settings</p>
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
            {['overview', 'backups', 'exports'].map((tab) => (
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
                <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Data management overview and statistics</p>
                <button onClick={() => setShowBackupModal(true)} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
                  <Plus className="w-5 h-5 inline mr-2" /> Create Backup
                </button>
              </div>
            )}
            {activeTab === 'backups' && (
              <div className="space-y-4">
                <button onClick={() => setShowBackupModal(true)} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
                  <Plus className="w-5 h-5 inline mr-2" /> Create Backup
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No backups yet</p>
              </div>
            )}
            {activeTab === 'exports' && (
              <div className="space-y-4">
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition">
                  <Download className="w-5 h-5 inline mr-2" /> Export Data
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No exports yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Backup Modal */}
        {showBackupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-md w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Create Backup</h2>
                <button onClick={() => setShowBackupModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <select
                  value={backupForm.backup_type}
                  onChange={(e) => setBackupForm({ ...backupForm, backup_type: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                >
                  <option value="full">Full Backup</option>
                  <option value="incremental">Incremental Backup</option>
                </select>

                <textarea
                  value={backupForm.description}
                  onChange={(e) => setBackupForm({ ...backupForm, description: e.target.value })}
                  placeholder="Optional description"
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={handleCreateBackup}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowBackupModal(false)}
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

export default Data;

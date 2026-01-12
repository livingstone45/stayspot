import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Plus, Eye, Trash2, TrendingUp } from 'lucide-react';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Select from '../../components/common/UI/Select';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const SupportIssues = () => {
  const { isDarkMode } = useTheme();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchIssues();
  }, [search, severity, status]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ ...(search && { search }), ...(severity && { severity }), ...(status && { status }) });
      
      const response = await fetch(`/api/support/issues?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data.data || []);
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (sev) => {
    const colors = { critical: 'red', high: 'orange', medium: 'yellow', low: 'blue' };
    return colors[sev] || 'gray';
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textClass}`}>Support Issues</h1>
            <p className={`${textSecondaryClass}`}>Track and manage system issues</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Report Issue
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: AlertCircle },
            { label: 'Critical', value: stats.critical, icon: AlertCircle },
            { label: 'High', value: stats.high, icon: TrendingUp },
            { label: 'Medium', value: stats.medium, icon: AlertCircle },
            { label: 'Low', value: stats.low, icon: AlertCircle }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`${cardClass} p-4 rounded-lg shadow`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textSecondaryClass}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${textClass}`}>{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Filters */}
        <div className={`${cardClass} rounded-lg shadow p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Search</label>
              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Severity</label>
              <Select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                options={[
                  { value: '', label: 'All Severity' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ]}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Status</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'open', label: 'Open' },
                  { value: 'investigating', label: 'Investigating' },
                  { value: 'resolved', label: 'Resolved' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Issues Table */}
        {loading ? (
          <Loader />
        ) : issues.length > 0 ? (
          <div className={`${cardClass} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Title</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Severity</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Reported</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, idx) => (
                  <tr key={issue.id} className={idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{issue.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getSeverityColor(issue.severity)}-100 text-${getSeverityColor(issue.severity)}-800`}>
                        {issue.severity?.charAt(0).toUpperCase() + issue.severity?.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{issue.status}</td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setSelectedIssue(issue); setShowDetail(true); }}
                        className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`${cardClass} rounded-lg shadow p-12 text-center`}>
            <AlertCircle className={`w-12 h-12 ${textSecondaryClass} mx-auto mb-4`} />
            <p className={textSecondaryClass}>No issues found</p>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Issue Details">
        {selectedIssue && (
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Title</p>
              <p className={`font-medium ${textClass}`}>{selectedIssue.title}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Description</p>
              <p className={`${textClass} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded mt-1`}>
                {selectedIssue.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Severity</p>
                <p className={`font-medium ${textClass}`}>{selectedIssue.severity}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Status</p>
                <p className={`font-medium ${textClass}`}>{selectedIssue.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportIssues;

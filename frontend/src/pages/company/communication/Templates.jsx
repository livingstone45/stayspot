import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Copy, FileText, Loader, X } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockTemplates = [
  { id: 1, name: 'Welcome Email', type: 'email', subject: 'Welcome to StaySpot', content: 'Welcome to our platform! We are excited to have you on board.' },
  { id: 2, name: 'Payment Reminder', type: 'email', subject: 'Payment Due Reminder', content: 'This is a reminder that your payment is due on the specified date.' },
  { id: 3, name: 'Booking Confirmation', type: 'sms', subject: '', content: 'Your booking has been confirmed. Booking ID: {booking_id}' },
  { id: 4, name: 'Maintenance Alert', type: 'push', subject: '', content: 'Maintenance scheduled for your property on {date}' },
  { id: 5, name: 'Password Reset', type: 'email', subject: 'Reset Your Password', content: 'Click the link below to reset your password: {reset_link}' }
];

const Templates = () => {
  const { isDarkMode } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({ name: '', type: 'email', subject: '', content: '' });

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, [search, type, page]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }), ...(type && { type }) });
      
      const response = await fetch(`/api/communication/templates?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setTemplates(mockTemplates);
      setPagination({ page: 1, limit: 10, total: mockTemplates.length });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/templates/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setStats({ total: mockTemplates.length, types: 3 });
    }
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.content) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = selectedTemplate ? 'PUT' : 'POST';
      const url = selectedTemplate
        ? `/api/communication/templates/${selectedTemplate.id}`
        : '/api/communication/templates';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save template');
      setFormData({ name: '', type: 'email', subject: '', content: '' });
      setSelectedTemplate(null);
      setShowForm(false);
      fetchTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Delete this template?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/communication/templates/${templateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete template');
      fetchTemplates();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDuplicateTemplate = (template) => {
    setSelectedTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      type: template.type,
      subject: template.subject,
      content: template.content
    });
    setShowForm(true);
  };

  const getTypeColor = (type) => {
    const colors = {
      email: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      sms: isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      push: isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Templates</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Manage message templates</p>
          </div>
          <button
            onClick={() => { setSelectedTemplate(null); setFormData({ name: '', type: 'email', subject: '', content: '' }); setShowForm(true); }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
          >
            <Plus className="w-5 h-5" /> New Template
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Templates</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Types</p>
              <p className="text-3xl font-bold mt-2 text-orange-500">{stats.types}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border mb-6 flex gap-4`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
          </select>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => (
              <div key={template.id} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all`}>
                <div className={`p-4 bg-gradient-to-r from-orange-600 to-orange-700`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-white">{template.name}</h3>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                </div>

                <div className="p-4">
                  {template.subject && (
                    <div className="mb-3">
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Subject</p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>{template.subject}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Preview</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} line-clamp-2`}>{template.content}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTemplate(template)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 text-sm font-medium flex items-center justify-center gap-1 transition-all"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => { setSelectedTemplate(template); setFormData(template); setShowForm(true); }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'text-orange-400 hover:bg-slate-700' : 'text-orange-600 hover:bg-gray-100'}`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-12 rounded-xl shadow-sm border text-center`}>
            <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No templates found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white disabled:opacity-50 hover:from-orange-700 hover:to-orange-800 transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white disabled:opacity-50 hover:from-orange-700 hover:to-orange-800 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-2xl w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {selectedTemplate ? 'Edit Template' : 'New Template'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Template name"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </select>
                </div>

                {formData.type === 'email' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Email subject"
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                    />
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Template content"
                    rows="6"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-2xl w-full border`}>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                <button onClick={() => setShowModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Type</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getTypeColor(selectedTemplate.type)}`}>
                    {selectedTemplate.type}
                  </span>
                </div>

                {selectedTemplate.subject && (
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Subject</p>
                    <p className={`font-medium mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTemplate.subject}</p>
                  </div>
                )}

                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Content</p>
                  <div className={`p-4 rounded-lg mt-1 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} whitespace-pre-wrap`}>{selectedTemplate.content}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={() => { setShowModal(false); setSelectedTemplate(selectedTemplate); setFormData(selectedTemplate); setShowForm(true); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;

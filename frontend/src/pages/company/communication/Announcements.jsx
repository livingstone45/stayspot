import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Megaphone, AlertCircle, CheckCircle, Clock, User, X, Loader } from 'lucide-react';
import Alert from '../../../components/common/UI/Alert';
import { useTheme } from '../../../contexts/ThemeContext';

const mockAnnouncements = [
  { id: 1, title: 'System Maintenance', content: 'Scheduled maintenance on Friday 10 PM - 2 AM. Services will be unavailable during this period.', status: 'published', priority: 'high', author_name: 'Admin', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, title: 'New Payment Methods Available', content: 'We now support M-Pesa and PayPal for all transactions. Update your payment preferences in settings.', status: 'published', priority: 'medium', author_name: 'Finance Team', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, title: 'Q4 Performance Review', content: 'Quarterly performance reviews will be conducted next month. Please prepare your reports.', status: 'draft', priority: 'medium', author_name: 'HR', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 4, title: 'Security Update Required', content: 'Please update your password for enhanced security. Use the settings page to change your password.', status: 'published', priority: 'high', author_name: 'Security Team', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 5, title: 'New Feature: Real-time Tracking', content: 'Track your shipments in real-time with our new tracking feature. Available in the Tracking section.', status: 'published', priority: 'low', author_name: 'Product Team', created_at: new Date(Date.now() - 432000000).toISOString() }
];

const Announcements = () => {
  const { isDarkMode } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({ title: '', content: '', status: 'draft', priority: 'medium' });

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, [search, statusFilter, page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 12, ...(search && { search }), ...(statusFilter && { status: statusFilter }) });
      
      const response = await fetch(`/api/communication/announcements?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch announcements');
      const data = await response.json();
      setAnnouncements(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setAnnouncements(mockAnnouncements);
      setPagination({ page: 1, limit: 12, total: mockAnnouncements.length });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/communication/announcements/stats/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setStats({ total: mockAnnouncements.length, published: 4, draft: 1, high_priority: 2 });
    }
  };

  const handleViewAnnouncement = async (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setFormData(announcement);
    setSelectedAnnouncement(announcement);
    setShowFormModal(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = selectedAnnouncement ? 'PUT' : 'POST';
      const url = selectedAnnouncement
        ? `/api/communication/announcements/${selectedAnnouncement.id}`
        : '/api/communication/announcements';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save announcement');
      setFormData({ title: '', content: '', status: 'draft', priority: 'medium' });
      setSelectedAnnouncement(null);
      setShowFormModal(false);
      fetchAnnouncements();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/communication/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete announcement');
      fetchAnnouncements();
      fetchStats();
      setShowViewModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: { bg: isDarkMode ? 'bg-slate-700' : 'bg-gray-100', text: isDarkMode ? 'text-slate-300' : 'text-gray-700', badge: 'bg-slate-500' },
      published: { bg: isDarkMode ? 'bg-green-900' : 'bg-green-50', text: isDarkMode ? 'text-green-300' : 'text-green-700', badge: 'bg-green-500' },
      archived: { bg: isDarkMode ? 'bg-red-900' : 'bg-red-50', text: isDarkMode ? 'text-red-300' : 'text-red-700', badge: 'bg-red-500' }
    };
    return colors[status] || colors.draft;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      medium: isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      high: isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      published: <CheckCircle className="w-4 h-4" />,
      archived: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <Megaphone className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Announcements</h1>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Create and manage company announcements</p>
          </div>
          <button
            onClick={() => { setSelectedAnnouncement(null); setFormData({ title: '', content: '', status: 'draft', priority: 'medium' }); setShowFormModal(true); }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
          >
            <Plus className="w-5 h-5" /> New Announcement
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Published</p>
              <p className="text-3xl font-bold mt-2 text-green-500">{stats.published}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Drafts</p>
              <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.draft}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>High Priority</p>
              <p className="text-3xl font-bold mt-2 text-orange-500">{stats.high_priority}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-sm border mb-8 flex gap-4`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Announcements Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {announcements.map((announcement) => {
              const statusColor = getStatusColor(announcement.status);
              return (
                <div
                  key={announcement.id}
                  className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all group`}
                >
                  {/* Card Header */}
                  <div className={`p-6 ${statusColor.bg} border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Megaphone className={`w-5 h-5 ${statusColor.text}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColor.bg} ${statusColor.text}`}>
                        {getStatusIcon(announcement.status)}
                        {announcement.status}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold ${statusColor.text} line-clamp-2`}>{announcement.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className={`text-sm line-clamp-3 mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {announcement.content}
                    </p>

                    <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mb-4`}>
                      <User className="w-4 h-4" />
                      <span>{announcement.author_name}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewAnnouncement(announcement)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => handleEditAnnouncement(announcement)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-12 rounded-xl shadow-sm border text-center`}>
            <Megaphone className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>No announcements found</p>
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

        {/* View Modal */}
        {showViewModal && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto border`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-start bg-gradient-to-r from-orange-600 to-orange-700`}>
                <h2 className="text-2xl font-bold text-white">{selectedAnnouncement.title}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedAnnouncement.status).bg} ${getStatusColor(selectedAnnouncement.status).text}`}>
                    {selectedAnnouncement.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority}
                  </span>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Content</p>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} whitespace-pre-wrap`}>{selectedAnnouncement.content}</p>
                </div>

                <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Author</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAnnouncement.author_name}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Created</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(selectedAnnouncement.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={() => { handleEditAnnouncement(selectedAnnouncement); setShowViewModal(false); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} font-medium transition-all`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto border`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-start bg-gradient-to-r from-orange-600 to-orange-700`}>
                <h2 className="text-2xl font-bold text-white">
                  {selectedAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button onClick={() => setShowFormModal(false)} className="text-orange-200 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Announcement content"
                    rows="6"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
                <button
                  onClick={handleSaveAnnouncement}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-medium transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowFormModal(false)}
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

export default Announcements;

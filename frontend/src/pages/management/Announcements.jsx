import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit, Eye, Send, X, Calendar, Users, Clock, CheckCircle, AlertCircle, Megaphone, FileText } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Scheduled Maintenance',
      content: 'Building-wide water system maintenance on Jan 20th from 8 AM to 12 PM. Please ensure all windows are closed.',
      date: '2024-01-15',
      recipients: 'All Tenants',
      status: 'published',
      views: 245,
      createdBy: 'Admin',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Rent Payment Reminder',
      content: 'Reminder: Rent is due on the 1st of each month. Please submit payment by the due date to avoid late fees.',
      date: '2024-01-10',
      recipients: 'All Tenants',
      status: 'published',
      views: 512,
      createdBy: 'Admin',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'New Parking Rules',
      content: 'Updated parking regulations effective immediately. Please review the attached document for details.',
      date: '2024-01-05',
      recipients: 'All Tenants',
      status: 'draft',
      views: 0,
      createdBy: 'Admin',
      priority: 'low'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipients: 'All Tenants',
    priority: 'medium',
    status: 'draft'
  });

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ann.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        recipients: announcement.recipients,
        priority: announcement.priority,
        status: announcement.status
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        recipients: 'All Tenants',
        priority: 'medium',
        status: 'draft'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setAnnouncements(announcements.map(ann =>
        ann.id === editingId
          ? { ...ann, ...formData, date: new Date().toISOString().split('T')[0] }
          : ann
      ));
    } else {
      setAnnouncements([
        {
          id: Math.max(...announcements.map(a => a.id), 0) + 1,
          ...formData,
          date: new Date().toISOString().split('T')[0],
          views: 0,
          createdBy: 'Admin'
        },
        ...announcements
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
    }
  };

  const handlePublish = (id) => {
    setAnnouncements(announcements.map(ann =>
      ann.id === id ? { ...ann, status: 'published' } : ann
    ));
  };

  const stats = [
    { label: 'Total Announcements', value: announcements.length, icon: Megaphone, color: 'purple' },
    { label: 'Published', value: announcements.filter(a => a.status === 'published').length, icon: CheckCircle, color: 'indigo' },
    { label: 'Drafts', value: announcements.filter(a => a.status === 'draft').length, icon: FileText, color: 'violet' },
    { label: 'Total Views', value: announcements.reduce((sum, a) => sum + a.views, 0), icon: Eye, color: 'fuchsia' }
  ];

  const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      fuchsia: 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800'
    };

    return (
      <div className={`rounded-xl p-6 border ${colorMap[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <Icon className="h-8 w-8 opacity-40" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage tenant announcements</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              New Announcement
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        announcement.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        announcement.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : announcement.priority === 'medium'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{announcement.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {announcement.recipients}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {announcement.views} views
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {announcement.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(announcement.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
                      >
                        <Send className="h-4 w-4" />
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(announcement)}
                      className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No announcements found</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your first announcement to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {editingId ? 'Update your announcement details' : 'Share important information with your tenants'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all"
                  placeholder="e.g., Scheduled Maintenance"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all resize-none"
                  placeholder="Write your announcement message here..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Grid Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Recipients
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all"
                  >
                    <option>All Tenants</option>
                    <option>Specific Property</option>
                    <option>Specific Unit</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:outline-none transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  <span className="font-semibold">Note:</span> This announcement will be saved as a draft. You can publish it later or publish immediately after creation.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 rounded-b-2xl flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                {editingId ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;

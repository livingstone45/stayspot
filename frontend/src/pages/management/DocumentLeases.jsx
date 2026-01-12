import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Download, Search, Filter, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentLeases = () => {
  const [leases, setLeases] = useState([
    { id: 1, tenantName: 'John Smith', property: 'Sunset Apartments', unit: '101', startDate: '2023-01-15', endDate: '2025-01-14', status: 'active', rent: 1500, template: 'Standard Lease' },
    { id: 2, tenantName: 'Sarah Johnson', property: 'Downtown Lofts', unit: '205', startDate: '2023-06-01', endDate: '2024-05-31', status: 'expiring', rent: 2200, template: 'Premium Lease' },
    { id: 3, tenantName: 'Michael Chen', property: 'Sunset Apartments', unit: '305', startDate: '2024-03-01', endDate: '2026-02-28', status: 'active', rent: 1800, template: 'Standard Lease' },
    { id: 4, tenantName: 'Emma Davis', property: 'Riverside Complex', unit: '102', startDate: '2022-09-15', endDate: '2024-09-14', status: 'expired', rent: 1600, template: 'Standard Lease' },
    { id: 5, tenantName: 'Robert Wilson', property: 'Downtown Lofts', unit: '401', startDate: '2024-01-01', endDate: '2025-12-31', status: 'active', rent: 2500, template: 'Commercial Lease' },
    { id: 6, tenantName: 'Lisa Anderson', property: 'Sunset Apartments', unit: '202', startDate: '2023-11-01', endDate: '2025-10-31', status: 'active', rent: 1700, template: 'Standard Lease' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingLease, setEditingLease] = useState(null);
  const [formData, setFormData] = useState({ tenantName: '', property: '', unit: '', startDate: '', endDate: '', rent: '', template: '' });

  const statuses = ['All', 'active', 'expiring', 'expired'];
  const templates = ['Standard Lease', 'Premium Lease', 'Commercial Lease', 'Short-term Lease'];

  const filteredLeases = leases.filter(l => {
    const matchesSearch = l.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddLease = () => {
    setEditingLease(null);
    setFormData({ tenantName: '', property: '', unit: '', startDate: '', endDate: '', rent: '', template: '' });
    setShowModal(true);
  };

  const handleEditLease = (lease) => {
    setEditingLease(lease);
    setFormData({
      tenantName: lease.tenantName,
      property: lease.property,
      unit: lease.unit,
      startDate: lease.startDate,
      endDate: lease.endDate,
      rent: lease.rent,
      template: lease.template
    });
    setShowModal(true);
  };

  const handleSaveLease = () => {
    if (!formData.tenantName || !formData.property || !formData.unit) return;

    if (editingLease) {
      setLeases(leases.map(l =>
        l.id === editingLease.id
          ? { ...l, ...formData }
          : l
      ));
    } else {
      setLeases([...leases, {
        id: Math.max(...leases.map(l => l.id), 0) + 1,
        ...formData,
        status: 'active'
      }]);
    }
    setShowModal(false);
  };

  const handleDeleteLease = (id) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      setLeases(leases.filter(l => l.id !== id));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expiring':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'expiring':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lease Documents</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and track all tenant leases</p>
            </div>
            <button
              onClick={handleAddLease}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Lease
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leases</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{leases.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{leases.filter(l => l.status === 'active').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{leases.filter(l => l.status === 'expiring').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">${leases.reduce((sum, l) => sum + l.rent, 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tenant, property, or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leases Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Tenant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Lease Period</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeases.map(lease => (
                  <tr key={lease.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{lease.tenantName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lease.property}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lease.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {lease.startDate} to {lease.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${lease.rent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(lease.status)}`}>
                        {getStatusIcon(lease.status)}
                        {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditLease(lease)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLease(lease.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLeases.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No leases found</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingLease ? 'Edit Lease' : 'New Lease'}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter tenant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Property
                  </label>
                  <input
                    type="text"
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter unit number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Rent
                  </label>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter rent amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select template</option>
                    {templates.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLease}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLeases;

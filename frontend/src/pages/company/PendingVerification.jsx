import React, { useState, useEffect } from 'react';
import { Eye, Zap, Search, Download, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Select from '../../components/common/UI/Select';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const PendingVerification = () => {
  const { isDarkMode } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState({ total: 0, tenants: 0, landlords: 0, managers: 0 });
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchPendingItems();
  }, [search, type, page]);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 20, status: 'pending', ...(search && { search }), ...(type && { type }) });
      
      const [tenants, landlords, managers] = await Promise.all([
        fetch(`/api/management/tenants/verification?${params}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch(`/api/management/landlords/verification?${params}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch(`/api/management/managers/verification?${params}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
      ]);

      const allItems = [
        ...(tenants.data || []).map(t => ({ ...t, userType: 'tenant' })),
        ...(landlords.data || []).map(l => ({ ...l, userType: 'landlord' })),
        ...(managers.data || []).map(m => ({ ...m, userType: 'manager' }))
      ];

      setItems(allItems);
      setStats({
        total: allItems.length,
        tenants: (tenants.data || []).length,
        landlords: (landlords.data || []).length,
        managers: (managers.data || []).length
      });
      setPagination({ total: allItems.length, pages: Math.ceil(allItems.length / 20) });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = selectedItem.userType === 'tenant' ? 'tenants' : selectedItem.userType === 'landlord' ? 'landlords' : 'managers';
      
      const response = await fetch(`/api/management/${endpoint}/${selectedItem.id}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: actionType, notes, verifiedAt: new Date().toISOString() })
      });

      if (!response.ok) throw new Error('Failed to update verification');
      
      setSuccess(`${selectedItem.userType} ${actionType} successfully`);
      setShowAction(false);
      setActionType('');
      setNotes('');
      fetchPendingItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = { tenant: 'purple', landlord: 'blue', manager: 'green' };
    return colors[type] || 'gray';
  };

  const getTypeLabel = (type) => {
    const labels = { tenant: 'Tenant', landlord: 'Landlord', manager: 'Manager' };
    return labels[type] || type;
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Pending Verifications</h1>
        <p className={`${textSecondaryClass} mb-8`}>Review and verify pending applications</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Pending', value: stats.total, icon: Clock },
            { label: 'Tenants', value: stats.tenants, icon: Users },
            { label: 'Landlords', value: stats.landlords, icon: Users },
            { label: 'Managers', value: stats.managers, icon: Users }
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
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters */}
        <div className={`${cardClass} rounded-lg shadow p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Search</label>
              <input
                type="text"
                placeholder="Name, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Type</label>
              <Select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'tenant', label: 'Tenants' },
                  { value: 'landlord', label: 'Landlords' },
                  { value: 'manager', label: 'Managers' }
                ]}
              />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={() => window.location.href = `/api/management/pending/export?format=csv`} className="w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : items.length > 0 ? (
          <div className={`${cardClass} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Name</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Email</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Type</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Submitted</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 ${textClass}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-${getTypeColor(item.userType)}-500 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {item.firstName?.[0]}{item.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{item.firstName} {item.lastName}</p>
                          <p className={`text-sm ${textSecondaryClass}`}>{item.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getTypeColor(item.userType)}-100 text-${getTypeColor(item.userType)}-800`}>
                        {getTypeLabel(item.userType)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setShowDetail(true); }}
                          className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => { setSelectedItem(item); setShowAction(true); }}
                          className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <Zap className="w-4 h-4 text-orange-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className={`px-6 py-4 border-t ${borderClass} flex items-center justify-between`}>
                <p className={`text-sm ${textSecondaryClass}`}>Page {page} of {pagination.pages}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="secondary" onClick={() => setPage(Math.min(pagination.pages, page + 1))} disabled={page === pagination.pages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`${cardClass} rounded-lg shadow p-12 text-center`}>
            <CheckCircle className={`w-12 h-12 text-green-500 mx-auto mb-4`} />
            <p className={textSecondaryClass}>No pending verifications</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Verification Details">
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>First Name</p>
                <p className={`font-medium ${textClass}`}>{selectedItem.firstName}</p>
              </div>
              <div>
                <p className={`text-sm ${textSecondaryClass}`}>Last Name</p>
                <p className={`font-medium ${textClass}`}>{selectedItem.lastName}</p>
              </div>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Email</p>
              <p className={`font-medium ${textClass}`}>{selectedItem.email}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Phone</p>
              <p className={`font-medium ${textClass}`}>{selectedItem.phone}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Type</p>
              <p className={`font-medium ${textClass}`}>{getTypeLabel(selectedItem.userType)}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Submitted</p>
              <p className={`font-medium ${textClass}`}>{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal isOpen={showAction} onClose={() => setShowAction(false)} title="Verification Action">
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Action</label>
            <Select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              options={[
                { value: 'verified', label: 'Approve' },
                { value: 'rejected', label: 'Reject' },
                { value: 'under_review', label: 'Under Review' }
              ]}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className={`w-full border rounded-lg p-2 h-24 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowAction(false)}>Cancel</Button>
            <Button onClick={handleVerify} disabled={!actionType || loading}>{loading ? 'Processing...' : 'Confirm'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingVerification;

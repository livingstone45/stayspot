import React, { useState, useEffect } from 'react';
import { Eye, Zap, Search, Download } from 'lucide-react';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Select from '../../components/common/UI/Select';
import Alert from '../../components/common/UI/Alert';
import Loader from '../../components/common/UI/Loader';
import { useTheme } from '../../contexts/ThemeContext';

const VERIFICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'under_review', label: 'Under Review', color: 'blue' }
];

const VERIFICATION_TYPES = [
  { value: 'identity', label: 'Identity Verification' },
  { value: 'income', label: 'Income Verification' },
  { value: 'credit', label: 'Credit Check' },
  { value: 'background', label: 'Background Check' },
  { value: 'employment', label: 'Employment Verification' },
  { value: 'reference', label: 'Reference Check' }
];

const TenantVerification = () => {
  const { isDarkMode } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    underReview: 0
  });

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchTenants();
  }, [searchTerm, filterStatus]);

  const mockTenants = [
    { id: 1, firstName: 'John', lastName: 'Doe', user: { email: 'john@example.com' }, verificationStatus: 'pending', verificationType: 'identity', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
    { id: 2, firstName: 'Jane', lastName: 'Smith', user: { email: 'jane@example.com' }, verificationStatus: 'verified', verificationType: 'income', createdAt: new Date(Date.now() - 5*24*60*60*1000) },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', user: { email: 'mike@example.com' }, verificationStatus: 'under_review', verificationType: 'credit', createdAt: new Date(Date.now() - 1*24*60*60*1000) },
    { id: 4, firstName: 'Sarah', lastName: 'Williams', user: { email: 'sarah@example.com' }, verificationStatus: 'rejected', verificationType: 'background', createdAt: new Date(Date.now() - 10*24*60*60*1000) },
    { id: 5, firstName: 'Tom', lastName: 'Brown', user: { email: 'tom@example.com' }, verificationStatus: 'pending', verificationType: 'employment', createdAt: new Date(Date.now() - 3*24*60*60*1000) }
  ];

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        page: 1,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus && { status: filterStatus })
      });

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/management/tenants/verification?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const text = await response.text();
      
      if (!response.ok) {
        if (response.status === 403) {
          const filtered = mockTenants.filter(t => 
            (!searchTerm || t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || t.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!filterStatus || t.verificationStatus === filterStatus)
          );
          setTenants(filtered);
          setStats({
            total: mockTenants.length,
            pending: mockTenants.filter(t => t.verificationStatus === 'pending').length,
            verified: mockTenants.filter(t => t.verificationStatus === 'verified').length,
            rejected: mockTenants.filter(t => t.verificationStatus === 'rejected').length,
            underReview: mockTenants.filter(t => t.verificationStatus === 'under_review').length
          });
          setLoading(false);
          return;
        }
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || `HTTP ${response.status}`);
        } catch (e) {
          throw new Error(`HTTP ${response.status}: ${text || 'No response'}`);
        }
      }
      
      if (!text) {
        setTenants([]);
        setStats({ total: 0, pending: 0, verified: 0, rejected: 0, underReview: 0 });
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);
      setTenants(data.data || []);
      setStats(data.stats || { total: 0, pending: 0, verified: 0, rejected: 0, underReview: 0 });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `/api/management/tenants/${selectedTenant.id}/verify`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: actionType,
            notes: actionNotes,
            verifiedAt: new Date().toISOString()
          })
        }
      );

      const text = await response.text();
      
      if (!response.ok) {
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || 'Failed to update verification');
        } catch (e) {
          throw new Error('Failed to update verification');
        }
      }
      
      setSuccess(`Tenant ${actionType} successfully`);
      setShowActionModal(false);
      setActionNotes('');
      setActionType('');
      fetchTenants();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusObj = VERIFICATION_STATUS.find(s => s.value === status);
    const colors = {
      yellow: isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      green: isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
      red: isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
      blue: isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[statusObj?.color]}`}>
        {statusObj?.label}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textClass}`}>Tenant Verification</h1>
          <p className={textSecondaryClass}>Manage and verify tenant applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: isDarkMode ? 'bg-blue-900' : 'bg-blue-50' },
            { label: 'Pending', value: stats.pending, color: isDarkMode ? 'bg-yellow-900' : 'bg-yellow-50' },
            { label: 'Verified', value: stats.verified, color: isDarkMode ? 'bg-green-900' : 'bg-green-50' },
            { label: 'Rejected', value: stats.rejected, color: isDarkMode ? 'bg-red-900' : 'bg-red-50' },
            { label: 'Under Review', value: stats.underReview, color: isDarkMode ? 'bg-blue-900' : 'bg-blue-50' }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} p-4 rounded-lg`}>
              <p className={`text-sm font-medium ${textSecondaryClass}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${textClass}`}>{stat.value}</p>
            </div>
          ))}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textClass}`}>Status</label>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  ...VERIFICATION_STATUS
                ]}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : tenants.length > 0 ? (
          <div className={`${cardClass} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Tenant</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Type</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Applied</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant, idx) => (
                  <tr key={tenant.id} className={idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 ${textClass}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {tenant.firstName?.[0]}{tenant.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
                          <p className={`text-sm ${textSecondaryClass}`}>{tenant.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(tenant.verificationStatus)}</td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>
                      {VERIFICATION_TYPES.find(t => t.value === tenant.verificationType)?.label}
                    </td>
                    <td className={`px-6 py-4 text-sm ${textClass}`}>
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowDetailModal(true);
                          }}
                          className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        {tenant.verificationStatus === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setShowActionModal(true);
                            }}
                            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                          >
                            <Zap className="w-4 h-4 text-orange-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`${cardClass} rounded-lg shadow p-12 text-center`}>
            <p className={textSecondaryClass}>No tenants found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Tenant Details"
      >
        {selectedTenant && (
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Name</p>
              <p className={`font-medium ${textClass}`}>{selectedTenant.firstName} {selectedTenant.lastName}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Email</p>
              <p className={`font-medium ${textClass}`}>{selectedTenant.user?.email}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Status</p>
              <p className="mt-1">{getStatusBadge(selectedTenant.verificationStatus)}</p>
            </div>
            <div>
              <p className={`text-sm ${textSecondaryClass}`}>Type</p>
              <p className={`font-medium ${textClass}`}>
                {VERIFICATION_TYPES.find(t => t.value === selectedTenant.verificationType)?.label}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Verification Action"
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Action</label>
            <Select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              options={[
                { value: 'verified', label: 'Approve Verification' },
                { value: 'rejected', label: 'Reject Verification' },
                { value: 'under_review', label: 'Mark Under Review' }
              ]}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Notes</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Add notes..."
              className={`w-full border rounded-lg p-2 h-24 ${borderClass} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={!actionType || loading}>
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TenantVerification;

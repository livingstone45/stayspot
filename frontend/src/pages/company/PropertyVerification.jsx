import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, ChevronLeft, ChevronRight, MapPin, CheckCircle, AlertCircle, Clock, FileText, Download, Eye } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PropertyVerification = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 10;

  useEffect(() => {
    fetchProperties();
  }, [filterStatus, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        verificationStatus: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await axios.get(`${API_URL}/properties`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        const propertyData = response.data.data || [];
        setProperties(propertyData);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        const verified = propertyData.filter(p => p.verificationStatus === 'verified');
        const pending = propertyData.filter(p => p.verificationStatus === 'pending');
        const rejected = propertyData.filter(p => p.verificationStatus === 'rejected');

        setStats({
          totalProperties: propertyData.length,
          verifiedProperties: verified.length,
          pendingProperties: pending.length,
          rejectedProperties: rejected.length,
          verificationRate: propertyData.length > 0 ? Math.round((verified.length / propertyData.length) * 100) : 0
        });
      }
    } catch (error) {
      console.log('Error fetching properties:', error.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    return !searchTerm || 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    const colors = {
      verified: isDarkMode ? 'bg-green-900/20 text-green-400 border-green-700' : 'bg-green-100 text-green-800 border-green-300',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: isDarkMode ? 'bg-red-900/20 text-red-400 border-red-700' : 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/properties/${propertyId}/verify`, 
        { verificationStatus: 'verified', notes: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProperties(properties.map(p => 
        p.id === propertyId ? { ...p, verificationStatus: 'verified' } : p
      ));
      setShowModal(false);
      fetchProperties();
    } catch (error) {
      console.log('Error approving property:', error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (propertyId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/properties/${propertyId}/verify`, 
        { verificationStatus: 'rejected', notes: 'Rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProperties(properties.map(p => 
        p.id === propertyId ? { ...p, verificationStatus: 'rejected' } : p
      ));
      setShowModal(false);
      fetchProperties();
    } catch (error) {
      console.log('Error rejecting property:', error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Verification</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Verify and manage property documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Properties</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalProperties}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Verified</p>
              <p className={`text-3xl font-bold mt-2 text-green-600`}>{stats.verifiedProperties}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stats.verificationRate}% verified</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pending</p>
              <p className={`text-3xl font-bold mt-2 text-yellow-600`}>{stats.pendingProperties}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rejected</p>
              <p className={`text-3xl font-bold mt-2 text-red-600`}>{stats.rejectedProperties}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, address, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No properties found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Property</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Location</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Verified At</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50'} transition`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.name}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{property.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{property.city}, {property.state}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(property.verificationStatus)}`}>
                          {getStatusIcon(property.verificationStatus)}
                          {property.verificationStatus.charAt(0).toUpperCase() + property.verificationStatus.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {property.verifiedAt ? formatDate(property.verifiedAt) : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowModal(true);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${isDarkMode ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex items-center justify-between sticky top-0`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Address</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.address}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>City, State</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.city}, {selectedProperty.state}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Type</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Status</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.status}</p>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Current Status</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(selectedProperty.verificationStatus)}`}>
                      {getStatusIcon(selectedProperty.verificationStatus)}
                      {selectedProperty.verificationStatus.charAt(0).toUpperCase() + selectedProperty.verificationStatus.slice(1)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Verified At</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedProperty.verifiedAt ? formatDate(selectedProperty.verifiedAt) : 'Not verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`border-t ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex gap-3 justify-end sticky bottom-0`}>
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}
              >
                Close
              </button>
              {selectedProperty.verificationStatus !== 'verified' && (
                <button
                  onClick={() => handleApprove(selectedProperty.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Approving...' : 'Approve'}
                </button>
              )}
              {selectedProperty.verificationStatus !== 'rejected' && (
                <button
                  onClick={() => handleReject(selectedProperty.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyVerification;

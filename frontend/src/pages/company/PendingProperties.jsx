import React, { useState, useEffect } from 'react';
import { Clock, Search, ChevronLeft, ChevronRight, MapPin, AlertCircle, CheckCircle, FileText, Plus, Filter } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PendingProperties = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 10;

  useEffect(() => {
    fetchProperties();
  }, [filterType, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        verificationStatus: 'pending',
        type: filterType !== 'all' ? filterType : undefined
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

        const daysOld = propertyData.map(p => {
          const created = new Date(p.createdAt);
          const now = new Date();
          return Math.floor((now - created) / (1000 * 60 * 60 * 24));
        });

        setStats({
          totalPending: propertyData.length,
          avgDaysWaiting: propertyData.length > 0 ? Math.round(daysOld.reduce((a, b) => a + b) / daysOld.length) : 0,
          oldestDays: propertyData.length > 0 ? Math.max(...daysOld) : 0,
          newestDays: propertyData.length > 0 ? Math.min(...daysOld) : 0
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

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/properties/${propertyId}/verify`, 
        { verificationStatus: 'verified', notes: 'Approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProperties(properties.filter(p => p.id !== propertyId));
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
        { verificationStatus: 'rejected', notes: rejectionReason || 'Rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProperties(properties.filter(p => p.id !== propertyId));
      setShowModal(false);
      setRejectionReason('');
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

  const getDaysWaitingColor = (days) => {
    if (days > 14) return 'text-red-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pending Properties</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Review and approve pending property listings</p>
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
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pending Review</p>
              <p className={`text-3xl font-bold mt-2 text-yellow-600`}>{stats.totalPending}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Awaiting approval</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Days Waiting</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.avgDaysWaiting}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Average wait time</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Oldest Pending</p>
              <p className={`text-3xl font-bold mt-2 text-red-600`}>{stats.oldestDays}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Days waiting</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Newest Pending</p>
              <p className={`text-3xl font-bold mt-2 text-green-600`}>{stats.newestDays}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Days waiting</p>
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
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading pending properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No pending properties</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>All properties have been reviewed!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Property</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Location</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Type</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Submitted</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Days Waiting</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {filteredProperties.map((property) => {
                    const daysWaiting = Math.floor((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={property.id} className={`hover:${isDarkMode ? 'bg-slate-800/30' : 'bg-slate-50'} transition`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.name}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{property.address}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{property.city}, {property.state}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            {property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{formatDate(property.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm font-semibold ${getDaysWaitingColor(daysWaiting)}`}>{daysWaiting} days</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowModal(true);
                            }}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${isDarkMode ? 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Submitted</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatDate(selectedProperty.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Rejection Reason Form */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rejection Reason (Optional)</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason if rejecting this property..."
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                  rows="4"
                />
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Description</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProperty.description}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`border-t ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex gap-3 justify-end sticky bottom-0`}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedProperty.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => handleApprove(selectedProperty.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProperties;

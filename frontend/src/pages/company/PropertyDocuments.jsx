import React, { useState, useEffect } from 'react';
import { FileText, Upload, Search, Filter, ChevronLeft, ChevronRight, MapPin, Download, Trash2, Eye, Clock, User, File, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';

const PropertyDocuments = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    documentType: 'deed',
    description: '',
    file: null
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 10;

  const documentTypes = [
    { value: 'deed', label: 'Deed', icon: '📋' },
    { value: 'tax_certificate', label: 'Tax Certificate', icon: '🏛️' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'inspection', label: 'Inspection Report', icon: '🔍' },
    { value: 'title', label: 'Title', icon: '📜' },
    { value: 'mortgage', label: 'Mortgage', icon: '🏦' },
    { value: 'survey', label: 'Survey', icon: '📐' },
    { value: 'other', label: 'Other', icon: '📁' }
  ];

  useEffect(() => {
    fetchProperties();
  }, [filterType, filterStatus, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        type: filterType !== 'all' ? filterType : undefined
      };

      const response = await axios.get(`${API_URL}/properties`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        const propertyData = response.data.data || [];
        
        const propertiesWithDocs = propertyData.map(p => ({
          ...p,
          documents: [
            { id: '1', type: 'deed', name: 'Property Deed', uploadedAt: new Date(Date.now() - 30*24*60*60*1000), uploadedBy: 'Admin', size: 2.5, status: 'verified' },
            { id: '2', type: 'tax_certificate', name: 'Tax Certificate 2024', uploadedAt: new Date(Date.now() - 15*24*60*60*1000), uploadedBy: 'Manager', size: 1.2, status: 'verified' },
            { id: '3', type: 'insurance', name: 'Insurance Policy', uploadedAt: new Date(Date.now() - 7*24*60*60*1000), uploadedBy: 'Admin', size: 3.8, status: 'pending' },
            { id: '4', type: 'inspection', name: 'Inspection Report', uploadedAt: new Date(Date.now() - 2*24*60*60*1000), uploadedBy: 'Inspector', size: 5.1, status: 'verified' }
          ],
          totalDocuments: 4,
          verifiedDocuments: 3,
          pendingDocuments: 1
        }));

        setProperties(propertiesWithDocs);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        const totalDocs = propertiesWithDocs.reduce((sum, p) => sum + p.totalDocuments, 0);
        const verifiedDocs = propertiesWithDocs.reduce((sum, p) => sum + p.verifiedDocuments, 0);
        const pendingDocs = propertiesWithDocs.reduce((sum, p) => sum + p.pendingDocuments, 0);

        setStats({
          totalProperties: propertiesWithDocs.length,
          totalDocuments: totalDocs,
          verifiedDocuments: verifiedDocs,
          pendingDocuments: pendingDocs,
          verificationRate: totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !selectedProperty) return;

    try {
      setUploadLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('documentType', uploadForm.documentType);
      formData.append('description', uploadForm.description);

      await axios.post(
        `${API_URL}/properties/${selectedProperty.id}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadForm({ documentType: 'deed', description: '', file: null });
      setShowUploadModal(false);
      fetchProperties();
    } catch (error) {
      console.log('Error uploading document:', error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (type) => {
    const doc = documentTypes.find(d => d.value === type);
    return doc?.icon || '📁';
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: isDarkMode ? 'bg-green-900/20 text-green-400 border-green-700' : 'bg-green-100 text-green-800 border-green-300',
      pending: isDarkMode ? 'bg-yellow-900/20 text-yellow-400 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: isDarkMode ? 'bg-red-900/20 text-red-400 border-red-700' : 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Documents</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage and organize property documentation</p>
              </div>
            </div>
            <button
              onClick={() => setShowPropertySelector(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" /> Upload Document
            </button>
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
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Documents</p>
              <p className={`text-3xl font-bold mt-2 text-purple-600`}>{stats.totalDocuments}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Verified</p>
              <p className={`text-3xl font-bold mt-2 text-green-600`}>{stats.verifiedDocuments}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stats.verificationRate}% verified</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pending Review</p>
              <p className={`text-3xl font-bold mt-2 text-yellow-600`}>{stats.pendingDocuments}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search properties..."
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
            </select>
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
            </select>
          </div>
        </div>

        {/* Properties with Documents */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading documents...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className={`p-12 text-center rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <FileText className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No properties found</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.id} className={`rounded-xl shadow border overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Property Header */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{property.city}, {property.state}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{property.totalDocuments} documents</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowUploadModal(true);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                    >
                      <Upload className="w-4 h-4 inline mr-2" /> Upload
                    </button>
                  </div>
                </div>

                {/* Documents List */}
                <div className="p-6">
                  <div className="space-y-3">
                    {property.documents.map((doc) => (
                      <div key={doc.id} className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:border-purple-600/50' : 'bg-slate-50 border-slate-200 hover:border-purple-300'} transition`}>
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                          <div className="flex-1">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{formatDate(doc.uploadedAt)}</span>
                              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>by {doc.uploadedBy}</span>
                              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{formatFileSize(doc.size * 1024 * 1024)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${getStatusColor(doc.status)}`}>
                            {doc.status === 'verified' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </div>
                          <button className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
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

      {/* Property Selector Modal */}
      {showPropertySelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl max-w-2xl w-full ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-gradient-to-r from-purple-900/20 to-slate-900' : 'border-slate-200 bg-gradient-to-r from-purple-50 to-white'} p-6 flex items-center justify-between rounded-t-2xl`}>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Property</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Choose a property to upload documents</p>
              </div>
              <button onClick={() => setShowPropertySelector(false)} className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => {
                        setSelectedProperty(prop);
                        setShowPropertySelector(false);
                        setShowUploadModal(true);
                      }}
                      className={`text-left p-4 rounded-xl border-2 transition hover:shadow-lg ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-600 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:border-purple-400 hover:bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{prop.name}</p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{prop.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>{prop.city}, {prop.state}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${prop.status === 'active' ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : (isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700')}`}>{prop.status}</span>
                          </div>
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{prop.totalDocuments} documents</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No properties available</p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Add properties first to upload documents</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Upload Modal */}
      {showUploadModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-2xl w-full ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpload} className="p-6 space-y-6">
              {/* Property Info */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProperty.name}</p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}</p>
              </div>

              {/* Document Type */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Document Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {documentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setUploadForm({ ...uploadForm, documentType: type.value })}
                      className={`p-3 rounded-lg border text-center transition ${uploadForm.documentType === type.value ? isDarkMode ? 'bg-purple-900/20 border-purple-700 text-purple-400' : 'bg-purple-50 border-purple-300 text-purple-600' : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'}`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-semibold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Description (Optional)</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Add notes about this document..."
                  className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                  rows="3"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select File</label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${uploadForm.file ? isDarkMode ? 'bg-purple-900/10 border-purple-700' : 'bg-purple-50 border-purple-300' : isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-300 hover:border-slate-400'}`}>
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] })}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${uploadForm.file ? 'text-purple-600' : isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                    <p className={`font-semibold ${uploadForm.file ? 'text-purple-600' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading || !uploadForm.file}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;

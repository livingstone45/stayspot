import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter, ChevronLeft, ChevronRight, MapPin, Home, Grid3x3, List, Zap, TrendingUp, X } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import axios from 'axios';
import AddPropertyModal from '../../components/common/AddPropertyModal';

const Properties = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 12;

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
        status: filterStatus !== 'all' ? filterStatus : undefined
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

        const active = propertyData.filter(p => p.status === 'active');
        const inactive = propertyData.filter(p => p.status === 'inactive');
        const maintenance = propertyData.filter(p => p.status === 'maintenance');

        const totalUnits = propertyData.reduce((sum, p) => sum + (p.unitCount || 0), 0);
        const occupiedUnits = propertyData.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);
        const totalValue = propertyData.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

        setStats({
          totalProperties: propertyData.length,
          activeProperties: active.length,
          inactiveProperties: inactive.length,
          maintenanceProperties: maintenance.length,
          totalUnits,
          occupiedUnits,
          totalValue
        });
      }
    } catch (error) {
      console.log('Error fetching properties:', error.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getSortedProperties = () => {
    const sorted = [...filteredProperties];
    if (sortBy === 'value') {
      sorted.sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));
    } else if (sortBy === 'units') {
      sorted.sort((a, b) => (b.unitCount || 0) - (a.unitCount || 0));
    } else {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return sorted;
  };

  const filteredProperties = properties.filter(property => {
    return !searchTerm || 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    const colors = {
      active: isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800',
      inactive: isDarkMode ? 'bg-slate-900/20 text-slate-400' : 'bg-slate-100 text-slate-800',
      maintenance: isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.inactive;
  };

  const formatCurrency = (value) => {
    return `$${(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const sortedProperties = getSortedProperties();

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
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Properties</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage your property portfolio</p>
              </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-2 font-semibold">
              <Plus className="w-5 h-5" /> Add Property
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
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stats.activeProperties} active</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Units</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalUnits}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stats.occupiedUnits} occupied</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Portfolio Value</p>
              <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupancy Rate</p>
              <p className={`text-3xl font-bold mt-2 text-blue-600`}>{stats.totalUnits > 0 ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0}%</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="name">Sort by Name</option>
              <option value="value">Sort by Value</option>
              <option value="units">Sort by Units</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${viewMode === 'grid' ? isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-300 text-blue-600' : isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition ${viewMode === 'list' ? isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-300 text-blue-600' : isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties View */}
        <div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading properties...</p>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className={`p-12 text-center rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Building2 className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No properties found</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProperties.map((property, idx) => (
                <div key={idx} className={`rounded-xl shadow border overflow-hidden transition ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-blue-600/50 hover:shadow-lg' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg'}`}>
                  {viewMode === 'grid' ? (
                    <>
                      {/* Image */}
                      <div className={`h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative ${property.images?.length > 0 ? 'bg-cover bg-center' : ''}`} style={property.images?.length > 0 ? { backgroundImage: `url(${property.images[0]})` } : {}}>
                        {!property.images?.length && <Home className="w-12 h-12 text-white/50" />}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {property.status === 'active' && <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Active</span>}
                          {property.occupiedUnits === property.unitCount && property.unitCount > 0 && <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> Full</span>}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {property.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                              <MapPin className="w-4 h-4" />
                              {property.city}, {property.state}
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {property.address}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                          <div className="text-center">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Units</p>
                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {property.unitCount || 0}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupied</p>
                            <p className={`text-lg font-bold text-green-600`}>
                              {property.occupiedUnits || 0}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Value</p>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {formatCurrency(property.estimatedValue)}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className={`w-full px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                          View Details
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={`p-6 flex items-center justify-between`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {property.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-4 h-4" />
                            {property.address}, {property.city}, {property.state}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 ml-4">
                        <div className="text-center">
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Units</p>
                          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.unitCount || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupied</p>
                          <p className="text-xl font-bold text-green-600">{property.occupiedUnits || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Value</p>
                          <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(property.estimatedValue)}</p>
                        </div>
                        <button className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                          View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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

      <AddPropertyModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(data) => {
          setProperties([data, ...properties]);
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default Properties;

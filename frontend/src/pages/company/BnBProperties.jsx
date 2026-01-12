import React, { useState, useEffect } from 'react';
import { Home, Plus, Search, Filter, ChevronLeft, ChevronRight, MapPin, Star, DollarSign, Users, Calendar, Wifi, Coffee, Wind, Tv, Utensils, Bed, Bath, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const BnBProperties = () => {
  const { isDarkMode } = useThemeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const [formData, setFormData] = useState({ name: '', address: '', city: '', type: 'apartment', bedrooms: '', bathrooms: '', guests: '', pricePerNight: '', description: '', amenities: [], checkIn: '', checkOut: '', minStay: '', maxGuests: '', latitude: 51.505, longitude: -0.09 });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const limit = 12;

  useEffect(() => {
    fetchProperties();
  }, [filterStatus, filterType, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page,
        limit,
        type: filterType !== 'all' ? filterType : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await axios.get(`${API_URL}/properties`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      if (response.data?.success) {
        const propertyData = response.data.data || [];
        
        const bnbProperties = propertyData.map(p => ({
          ...p,
          rating: (Math.random() * 2 + 3.5).toFixed(1),
          reviews: Math.floor(Math.random() * 200) + 10,
          occupancyRate: Math.floor(Math.random() * 40) + 60,
          monthlyRevenue: Math.floor(Math.random() * 8000) + 2000,
          amenities: ['WiFi', 'Kitchen', 'AC', 'TV', 'Parking'],
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          guests: Math.floor(Math.random() * 6) + 2
        }));

        setProperties(bnbProperties);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }

        const active = bnbProperties.filter(p => p.status === 'active');
        const inactive = bnbProperties.filter(p => p.status === 'inactive');
        const totalRevenue = bnbProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
        const avgRating = (bnbProperties.reduce((sum, p) => sum + parseFloat(p.rating), 0) / bnbProperties.length).toFixed(1);

        setStats({
          totalProperties: bnbProperties.length,
          activeProperties: active.length,
          inactiveProperties: inactive.length,
          totalRevenue,
          avgRating,
          totalReviews: bnbProperties.reduce((sum, p) => sum + p.reviews, 0)
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

  const getSortedProperties = () => {
    const sorted = [...filteredProperties];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'revenue') {
      sorted.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
    } else if (sortBy === 'occupancy') {
      sorted.sort((a, b) => b.occupancyRate - a.occupancyRate);
    } else {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return sorted;
  };

  const formatCurrency = (value) => {
    return `$${(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const sortedProperties = getSortedProperties();

  const amenityIcons = {
    'WiFi': <Wifi className="w-4 h-4" />,
    'Kitchen': <Utensils className="w-4 h-4" />,
    'AC': <Wind className="w-4 h-4" />,
    'TV': <Tv className="w-4 h-4" />,
    'Parking': <Home className="w-4 h-4" />
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>BnB Properties</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage your short-term rental portfolio</p>
              </div>
            </div>
            <button onClick={() => {setShowAddModal(true); setStep(1); setImages([]);}} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition flex items-center gap-2 font-semibold">
              <Plus className="w-5 h-5" /> Add Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Properties</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalProperties}</p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stats.activeProperties} active</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Revenue</p>
              <p className={`text-2xl font-bold mt-2 text-green-600`}>{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.avgRating}</p>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Reviews</p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalReviews}</p>
            </div>
            <div className={`rounded-xl shadow p-5 border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Occupancy</p>
              <p className={`text-3xl font-bold mt-2 text-blue-600`}>72%</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className={`rounded-xl shadow p-6 border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            </select>
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="occupancy">Sort by Occupancy</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading properties...</p>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className={`p-12 text-center rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Home className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <div key={property.id} className={`rounded-xl shadow border overflow-hidden transition hover:shadow-lg ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-orange-600/50' : 'bg-white border-slate-200 hover:border-orange-300'}`}>
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative">
                    <Home className="w-12 h-12 text-white/50" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {property.status === 'active' && <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Active</span>}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{property.rating}</span>
                      <span className="text-xs text-gray-300">({property.reviews})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {property.city}, {property.state}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, idx) => (
                        <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          {amenityIcons[amenity] || <Coffee className="w-3 h-3" />}
                          {amenity}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                      <div className="text-center">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Guests</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{property.guests}</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupancy</p>
                        <p className="text-lg font-bold text-blue-600">{property.occupancyRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Revenue</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(property.monthlyRevenue)}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowModal(true);
                      }}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-orange-900/20 text-orange-400 hover:bg-orange-900/30' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                    >
                      View Details
                    </button>
                  </div>
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

      {/* Detail Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex items-center justify-between sticky top-0`}>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{selectedProperty.rating}</span>
                    <span className="text-sm text-slate-500">({selectedProperty.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Property Details */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Address</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.address}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>City</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.city}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Type</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bedrooms</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bathrooms</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.bathrooms}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Max Guests</p>
                    <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.guests}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(selectedProperty.monthlyRevenue)}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Occupancy Rate</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{selectedProperty.occupancyRate}%</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rating</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-2xl font-bold">{selectedProperty.rating}</p>
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProperty.amenities.map((amenity, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                      {amenityIcons[amenity] || <Coffee className="w-4 h-4" />}
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
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
              <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition">
                Edit Property
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Property Modal - Enhanced */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-orange-900/30">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Add BnB Property</h2>
              <button onClick={() => {setShowAddModal(false); setStep(1); setImages([]);}} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-2 px-6 py-4 bg-slate-800/50 border-b border-orange-900/20">
              {[1, 2, 3].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-slate-700'}`}></div>
              ))}
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto text-slate-100">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Property Photos</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt="property" className="w-full h-24 object-cover rounded-lg border border-orange-900/30" />
                          <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <label className="border-2 border-dashed border-orange-600/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-900/20 transition bg-slate-800/50">
                        <Plus className="text-orange-500 mb-1" size={20} />
                        <span className="text-xs font-medium text-orange-400">Add Photos</span>
                        <input type="file" multiple accept="image/*" onChange={(e) => Array.from(e.target.files).forEach(f => {const r = new FileReader(); r.onload = (ev) => setImages([...images, ev.target.result]); r.readAsDataURL(f);})} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Property Name</label>
                    <input type="text" placeholder="Enter property name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Description</label>
                    <textarea placeholder="Describe your property" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" rows="3"></textarea>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Address</label>
                    <input type="text" placeholder="Enter address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Latitude</label>
                      <input type="number" step="0.0001" placeholder="51.505" value={formData.latitude} onChange={(e) => {setFormData({...formData, latitude: parseFloat(e.target.value)}); setMapPosition([parseFloat(e.target.value), formData.longitude]);}} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Longitude</label>
                      <input type="number" step="0.0001" placeholder="-0.09" value={formData.longitude} onChange={(e) => {setFormData({...formData, longitude: parseFloat(e.target.value)}); setMapPosition([formData.latitude, parseFloat(e.target.value)]);}} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Map Location</label>
                    <div className="rounded-lg overflow-hidden border border-orange-900/30 h-48">
                      <MapContainer center={mapPosition} zoom={13} style={{height: '100%', width: '100%'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                        <Marker position={mapPosition}>
                          <Popup>{formData.address || 'Property Location'}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">City</label>
                      <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Type</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Bedrooms</label>
                      <input type="number" placeholder="0" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Bathrooms</label>
                      <input type="number" placeholder="0" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Guests</label>
                      <input type="number" placeholder="0" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Price/Night</label>
                      <input type="number" placeholder="0" value={formData.pricePerNight} onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
              )}}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Check-in Time</label>
                      <input type="time" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Check-out Time</label>
                      <input type="time" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Min Stay (nights)</label>
                      <input type="number" placeholder="1" value={formData.minStay} onChange={(e) => setFormData({...formData, minStay: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-orange-400 mb-2">Max Guests</label>
                      <input type="number" placeholder="0" value={formData.maxGuests} onChange={(e) => setFormData({...formData, maxGuests: e.target.value})} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-orange-400 mb-2">Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['WiFi', 'Kitchen', 'AC', 'TV', 'Parking', 'Pool', 'Gym', 'Washer'].map(a => (
                        <button key={a} onClick={() => setFormData({...formData, amenities: formData.amenities.includes(a) ? formData.amenities.filter(x => x !== a) : [...formData.amenities, a]})} className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${formData.amenities.includes(a) ? 'border-orange-500 bg-orange-900/30 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-600/50'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-slate-800/50 px-6 py-4 flex gap-3 border-t border-orange-900/20 rounded-b-2xl">
              <button onClick={() => step > 1 ? setStep(step - 1) : setShowAddModal(false)} className="flex-1 px-4 py-2 border-2 border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors">{step === 1 ? 'Cancel' : 'Back'}</button>
              <button onClick={() => step < 3 ? setStep(step + 1) : (setProperties([{id: Date.now(), name: formData.name, address: formData.address, city: formData.city, type: formData.type, bedrooms: parseInt(formData.bedrooms), bathrooms: parseInt(formData.bathrooms), guests: parseInt(formData.guests), status: 'active', rating: '4.5', reviews: 0, occupancyRate: 0, monthlyRevenue: 0, amenities: formData.amenities, image: images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop'}, ...properties]), setShowAddModal(false), setStep(1), setImages([]))} className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all">{step === 3 ? 'Add Property' : 'Next'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BnBProperties;

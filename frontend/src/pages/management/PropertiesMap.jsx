import React, { useState } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Home,
  DollarSign,
  Phone,
  Mail,
  Eye,
  Edit2,
  AlertCircle,
} from 'lucide-react';

const PropertiesMap = () => {
  const { isDarkMode } = useThemeMode();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    minRent: '',
    maxRent: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    { id: 1, address: 'Westlands, Nairobi', type: 'apartment', status: 'occupied', rent: 2500, bedrooms: 2, bathrooms: 1, tenants: 2, manager: 'John Smith', phone: '(254) 712-345-678', email: 'john@example.com', lat: -1.2921, lng: 36.8219 },
    { id: 2, address: 'Kilimani, Nairobi', type: 'house', status: 'vacant', rent: 3200, bedrooms: 3, bathrooms: 2, tenants: 0, manager: 'Sarah Johnson', phone: '(254) 722-456-789', email: 'sarah@example.com', lat: -1.2865, lng: 36.7648 },
    { id: 3, address: 'Karen, Nairobi', type: 'condo', status: 'occupied', rent: 2000, bedrooms: 1, bathrooms: 1, tenants: 1, manager: 'Mike Davis', phone: '(254) 733-567-890', email: 'mike@example.com', lat: -1.3521, lng: 36.6792 },
    { id: 4, address: 'Parklands, Nairobi', type: 'apartment', status: 'under_maintenance', rent: 1800, bedrooms: 2, bathrooms: 1, tenants: 0, manager: 'Emily Wilson', phone: '(254) 741-678-901', email: 'emily@example.com', lat: -1.2627, lng: 36.8025 },
    { id: 5, address: 'Mombasa, Coast', type: 'house', status: 'coming_soon', rent: 3500, bedrooms: 4, bathrooms: 3, tenants: 0, manager: 'Robert Brown', phone: '(254) 704-789-012', email: 'robert@example.com', lat: -4.0435, lng: 39.6682 },
    { id: 6, address: 'Kisumu, Lake Region', type: 'apartment', status: 'occupied', rent: 1500, bedrooms: 2, bathrooms: 1, tenants: 2, manager: 'James Ochieng', phone: '(254) 715-123-456', email: 'james@example.com', lat: -0.1022, lng: 34.7616 },
    { id: 7, address: 'Nakuru, Rift Valley', type: 'house', status: 'vacant', rent: 2200, bedrooms: 3, bathrooms: 2, tenants: 0, manager: 'Peter Kipchoge', phone: '(254) 723-234-567', email: 'peter@example.com', lat: -0.3031, lng: 34.7469 },
    { id: 8, address: 'Eldoret, Rift Valley', type: 'apartment', status: 'occupied', rent: 1600, bedrooms: 2, bathrooms: 1, tenants: 1, manager: 'David Kiplagat', phone: '(254) 741-345-678', email: 'david@example.com', lat: 0.5143, lng: 34.4397 },
    { id: 9, address: 'Kericho, Tea Country', type: 'house', status: 'occupied', rent: 1400, bedrooms: 2, bathrooms: 1, tenants: 2, manager: 'Grace Kipchoge', phone: '(254) 712-456-789', email: 'grace@example.com', lat: -0.3667, lng: 35.2753 },
    { id: 10, address: 'Kisii, Highlands', type: 'apartment', status: 'vacant', rent: 1300, bedrooms: 1, bathrooms: 1, tenants: 0, manager: 'Moses Nyambane', phone: '(254) 722-567-890', email: 'moses@example.com', lat: -0.6833, lng: 34.7667 },
    { id: 11, address: 'Nyeri, Central', type: 'house', status: 'occupied', rent: 1900, bedrooms: 3, bathrooms: 2, tenants: 2, manager: 'Samuel Mwangi', phone: '(254) 733-678-901', email: 'samuel@example.com', lat: -0.4155, lng: 36.9497 },
    { id: 12, address: 'Muranga, Central', type: 'apartment', status: 'coming_soon', rent: 1700, bedrooms: 2, bathrooms: 1, tenants: 0, manager: 'Joseph Kariuki', phone: '(254) 704-789-012', email: 'joseph@example.com', lat: -0.7333, lng: 37.1667 },
    { id: 13, address: 'Thika, Central', type: 'condo', status: 'occupied', rent: 1600, bedrooms: 1, bathrooms: 1, tenants: 1, manager: 'Lucy Wanjiru', phone: '(254) 712-890-123', email: 'lucy@example.com', lat: -1.0333, lng: 37.0833 },
    { id: 14, address: 'Machakos, Eastern', type: 'house', status: 'vacant', rent: 1500, bedrooms: 2, bathrooms: 1, tenants: 0, manager: 'Charles Mutua', phone: '(254) 722-901-234', email: 'charles@example.com', lat: -2.7167, lng: 37.2667 },
    { id: 15, address: 'Kitui, Eastern', type: 'apartment', status: 'occupied', rent: 1200, bedrooms: 1, bathrooms: 1, tenants: 1, manager: 'Francis Mwangi', phone: '(254) 733-012-345', email: 'francis@example.com', lat: -3.4, lng: 38.0167 },
    { id: 16, address: 'Malindi, Coast', type: 'house', status: 'occupied', rent: 2800, bedrooms: 3, bathrooms: 2, tenants: 2, manager: 'Hassan Ali', phone: '(254) 704-123-456', email: 'hassan@example.com', lat: -3.2167, lng: 40.1167 },
  ];

  const statusOptions = [
    { id: 'occupied', label: 'Occupied', color: 'bg-green-500' },
    { id: 'vacant', label: 'Vacant', color: 'bg-yellow-500' },
    { id: 'under_maintenance', label: 'Under Maintenance', color: 'bg-red-500' },
    { id: 'under_renovation', label: 'Under Renovation', color: 'bg-blue-500' },
    { id: 'coming_soon', label: 'Coming Soon', color: 'bg-purple-500' },
  ];

  const propertyTypes = [
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || property.status === filters.status;
    const matchesType = filters.type === 'all' || property.type === filters.type;
    const matchesMinRent = !filters.minRent || property.rent >= parseFloat(filters.minRent);
    const matchesMaxRent = !filters.maxRent || property.rent <= parseFloat(filters.maxRent);

    return matchesSearch && matchesStatus && matchesType && matchesMinRent && matchesMaxRent;
  });

  const getStatusLabel = (status) => {
    return statusOptions.find(s => s.id === status)?.label || status;
  };

  const getStatusColor = (status) => {
    return statusOptions.find(s => s.id === status)?.color || 'bg-gray-500';
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=35.5,-5,40.5,-0.5&layer=mapnik&marker=-1.2921,36.8219&marker=-1.2865,36.7648&marker=-1.3521,36.6792&marker=-1.2627,36.8025&marker=-4.0435,39.6682`;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Properties Map - Kenya</h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>View all your properties across Kenya on an interactive map</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative bg-gray-200">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=33,-5,42,5&layer=mapnik&marker=-1.2921,36.8219&marker=-1.2865,36.7648&marker=-1.3521,36.6792&marker=-1.2627,36.8025&marker=-4.0435,39.6682&marker=-0.1022,34.7616&marker=-0.3031,34.7469&marker=0.5143,34.4397&marker=-0.3667,35.2753&marker=-0.6833,34.7667&marker=-0.4155,36.9497&marker=-0.7333,37.1667&marker=-1.0333,37.0833&marker=-2.7167,37.2667&marker=-3.4,38.0167&marker=-3.2167,40.1167`}
            style={{ border: 0 }}
          />
        </div>

        {/* Sidebar */}
        <div className={`w-96 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-l flex flex-col overflow-hidden`}>
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent</label>
                    <input
                      type="number"
                      value={filters.minRent}
                      onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                      placeholder="$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent</label>
                    <input
                      type="number"
                      value={filters.maxRent}
                      onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                      placeholder="$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProperties.length === 0 ? (
              <div className="p-6 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No properties found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProperties.map(property => (
                  <button
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`w-full text-left p-4 hover:bg-orange-50 transition border-l-4 ${
                      selectedProperty?.id === property.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{property.address}</h3>
                      <span className={`${getStatusColor(property.status)} text-white text-xs px-2 py-1 rounded-full`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        <span>{property.bedrooms}bd / {property.bathrooms}ba</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>KES {property.rent}/mo</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          {selectedProperty && (
            <div className="border-t border-gray-200 p-4 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Property Details</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{selectedProperty.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rent</p>
                    <p className="font-semibold text-gray-900">KES {selectedProperty.rent}/mo</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Bedrooms</p>
                    <p className="font-semibold text-gray-900">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bathrooms</p>
                    <p className="font-semibold text-gray-900">{selectedProperty.bathrooms}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600">Tenants</p>
                  <p className="font-semibold text-gray-900">{selectedProperty.tenants} tenant(s)</p>
                </div>

                <div className="border-t border-orange-200 pt-3">
                  <p className="text-gray-600 mb-2">Manager</p>
                  <p className="font-semibold text-gray-900">{selectedProperty.manager}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">{selectedProperty.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs">{selectedProperty.email}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-medium">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesMap;

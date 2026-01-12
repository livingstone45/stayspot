import React, { useState, useEffect } from 'react';
import {
  Building,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit2,
  Eye,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  RefreshCw,
  Home,
  Building2,
  Warehouse,
  Store,
  Hotel
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PropertyList = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    dateAdded: 'all',
  });
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const propertyTypes = [
    { id: 'apartment', label: 'Apartment', icon: Building, color: 'blue' },
    { id: 'house', label: 'House', icon: Home, color: 'green' },
    { id: 'condo', label: 'Condo', icon: Building2, color: 'purple' },
    { id: 'townhouse', label: 'Townhouse', icon: Building, color: 'yellow' },
    { id: 'commercial', label: 'Commercial', icon: Store, color: 'red' },
    { id: 'vacation', label: 'Vacation Rental', icon: Hotel, color: 'pink' },
    { id: 'industrial', label: 'Industrial', icon: Warehouse, color: 'indigo' },
  ];

  const statusOptions = [
    { id: 'occupied', label: 'Occupied', color: 'bg-green-100 text-green-800' },
    { id: 'vacant', label: 'Vacant', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'under_maintenance', label: 'Under Maintenance', color: 'bg-red-100 text-red-800' },
    { id: 'under_renovation', label: 'Under Renovation', color: 'bg-blue-100 text-blue-800' },
    { id: 'coming_soon', label: 'Coming Soon', color: 'bg-purple-100 text-purple-800' },
  ];

  const sortOptions = [
    { id: 'dateAdded', label: 'Date Added' },
    { id: 'rent', label: 'Rent Amount' },
    { id: 'bedrooms', label: 'Bedrooms' },
    { id: 'squareFeet', label: 'Square Feet' },
    { id: 'lastInspection', label: 'Last Inspection' },
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, searchTerm, filters, sortBy, sortOrder]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties(generateSampleProperties(20));
    } finally {
      setLoading(false);
    }
  };

  const generateSampleProperties = (count) => {
    const properties = [];
    const cities = ['New York', 'Brooklyn', 'Queens', 'Manhattan', 'Bronx', 'Staten Island'];
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Elm Blvd', 'Cedar Ln'];
    
    for (let i = 0; i < count; i++) {
      const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const street = `${Math.floor(Math.random() * 1000) + 100} ${streets[Math.floor(Math.random() * streets.length)]}`;
      const bedrooms = Math.floor(Math.random() * 5) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      const rent = Math.floor(Math.random() * 5000) + 1000;
      
      properties.push({
        id: `property-${i + 1}`,
        address: `${street}, ${city}, NY`,
        type: type.id,
        status: status.id,
        bedrooms,
        bathrooms,
        squareFeet: Math.floor(Math.random() * 3000) + 500,
        rent,
        deposit: rent * 2,
        yearBuilt: Math.floor(Math.random() * 50) + 1970,
        amenities: ['Parking', 'Laundry', 'Gym', 'Pool'].slice(0, Math.floor(Math.random() * 4)),
        tenants: Math.floor(Math.random() * 4) + 1,
        lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        nextInspection: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        maintenanceRequests: Math.floor(Math.random() * 10),
        photos: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          id: `photo-${i}-${j}`,
          url: `https://via.placeholder.com/400x300?text=Property+${i + 1}`,
        })),
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
        owner: `Owner ${Math.floor(Math.random() * 5) + 1}`,
        manager: `Manager ${Math.floor(Math.random() * 3) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    return properties;
  };

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(property => property.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    // Rent range filter
    if (filters.minRent) {
      filtered = filtered.filter(property => property.rent >= parseFloat(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(property => property.rent <= parseFloat(filters.maxRent));
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms === parseInt(filters.bedrooms));
    }

    // Date filter
    if (filters.dateAdded !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateAdded) {
        case 'last7days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'last30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'last90days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case 'this_year':
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      filtered = filtered.filter(property => new Date(property.createdAt) >= cutoffDate);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'dateAdded':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'rent':
          aValue = a.rent;
          bValue = b.rent;
          break;
        case 'bedrooms':
          aValue = a.bedrooms;
          bValue = b.bedrooms;
          break;
        case 'squareFeet':
          aValue = a.squareFeet;
          bValue = b.squareFeet;
          break;
        case 'lastInspection':
          aValue = new Date(a.lastInspection).getTime();
          bValue = new Date(b.lastInspection).getTime();
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const handleSelectProperty = (propertyId) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === paginatedProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map(property => property.id));
    }
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      await deleteProperty(propertyToDelete.id);
      loadProperties();
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleExportProperties = async (format) => {
    try {
      await exportProperties({
        format,
        properties: selectedProperties.length > 0 ? selectedProperties : filteredProperties,
      });
    } catch (error) {
      console.error('Failed to export properties:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="mt-2 text-gray-600">
                Manage and view all your properties
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => handleExportProperties('csv')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => {/* Navigate to upload */}}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={() => {/* Navigate to create */}}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Properties', 
              value: properties.length,
              icon: Building,
              color: 'blue'
            },
            { 
              label: 'Occupied', 
              value: properties.filter(p => p.status === 'occupied').length,
              icon: Users,
              color: 'green'
            },
            { 
              label: 'Monthly Revenue', 
              value: `$${properties.reduce((sum, p) => sum + p.rent, 0).toLocaleString()}`,
              icon: DollarSign,
              color: 'purple'
            },
            { 
              label: 'Vacancy Rate', 
              value: `${((properties.filter(p => p.status === 'vacant').length / properties.length) * 100).toFixed(1)}%`,
              icon: Building,
              color: 'red'
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 mr-3`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by address, owner, or manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'map'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Map
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              
              <button
                onClick={() => handleSort(sortBy)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <PropertyFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => setFilters({
                  status: 'all',
                  type: 'all',
                  minRent: '',
                  maxRent: '',
                  bedrooms: '',
                  dateAdded: 'all',
                })}
              />
            </div>
          )}
        </div>

        {/* Selected Properties Actions */}
        {selectedProperties.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                <p className="text-sm font-medium text-blue-900">
                  {selectedProperties.length} properties selected
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Bulk Edit
                </button>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Bulk Delete
                </button>
                <button
                  onClick={() => setSelectedProperties([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Properties Display */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Properties Map</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              <PropertyMap properties={filteredProperties} />
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedProperties.map((property) => {
              const typeConfig = propertyTypes.find(t => t.id === property.type);
              const statusConfig = statusOptions.find(s => s.id === property.status);
              const TypeIcon = typeConfig?.icon || Building;
              
              return (
                <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200">
                    {property.photos && property.photos.length > 0 ? (
                      <img
                        src={property.photos[0].url}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig?.label || property.status}
                      </span>
                    </div>
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 right-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handleSelectProperty(property.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-300">
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {typeConfig?.label || property.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{property.address}</h3>
                        <div className="flex items-center mt-2">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{property.location?.address || 'Location not set'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${property.rent.toLocaleString()}/mo</p>
                        <p className="text-sm text-gray-600">Deposit: ${property.deposit?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Property Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-600">Bedrooms</p>
                          <p className="text-sm font-medium text-gray-900">{property.bedrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-600">Bathrooms</p>
                          <p className="text-sm font-medium text-gray-900">{property.bathrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-600">Square Feet</p>
                          <p className="text-sm font-medium text-gray-900">{property.squareFeet.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs text-gray-600">Tenants</p>
                          <p className="text-sm font-medium text-gray-900">{property.tenants}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              +{property.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPropertyToDelete(property);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed/Bath
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Inspection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProperties.map((property) => {
                    const typeConfig = propertyTypes.find(t => t.id === property.type);
                    const statusConfig = statusOptions.find(s => s.id === property.status);
                    
                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProperties.includes(property.id)}
                            onChange={() => handleSelectProperty(property.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {property.address.split(',')[0]}
                              </div>
                              <div className="text-sm text-gray-500">
                                {property.address.split(',').slice(1).join(',').trim()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig?.label || property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {typeConfig && (
                              <typeConfig.icon className={`w-4 h-4 text-${typeConfig.color}-600 mr-2`} />
                            )}
                            <span className="text-sm text-gray-900">{typeConfig?.label || property.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            ${property.rent.toLocaleString()}/mo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {property.bedrooms}bd / {property.bathrooms}ba
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(property.lastInspection).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setPropertyToDelete(property);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredProperties.length > itemsPerPage && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProperties.length)}</span>{' '}
                  of <span className="font-medium">{filteredProperties.length}</span> properties
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronUp className="h-5 w-5 rotate-90" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronUp className="h-5 w-5 -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')
                ? 'Try changing your search or filters'
                : 'Get started by adding your first property'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {/* Navigate to create */}}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && propertyToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Property</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Are you sure you want to delete "{propertyToDelete.address}"?
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    This action cannot be undone. All associated data including tenants, leases, and maintenance records will be permanently deleted.
                  </p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPropertyToDelete(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProperty}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
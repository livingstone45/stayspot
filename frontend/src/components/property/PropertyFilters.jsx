import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const PropertyFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  showSearch = true,
  showAdvanced = false,
  loading = false,
  propertyCount = 0,
  availableFilters = {
    propertyType: true,
    status: true,
    priceRange: true,
    bedrooms: true,
    bathrooms: true,
    amenities: true,
    location: true,
    dateRange: true,
  },
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    propertyType: [],
    status: [],
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    location: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'updated_at',
    sortOrder: 'desc',
    ...filters,
  });
  
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    status: true,
    price: true,
    specs: true,
    amenities: false,
    advanced: false,
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);
  
  // Property type options
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'Single Family House', icon: '🏠' },
    { value: 'condo', label: 'Condominium', icon: '🏘️' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏡' },
    { value: 'commercial', label: 'Commercial', icon: '🏢' },
    { value: 'vacation', label: 'Vacation Rental', icon: '🏖️' },
    { value: 'bnb', label: 'Bed & Breakfast', icon: '🛌' },
    { value: 'guest_house', label: 'Guest House', icon: '🏡' },
    { value: 'multifamily', label: 'Multi-Family', icon: '🏘️' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'listed', label: 'Listed', color: 'bg-blue-100 text-blue-800' },
    { value: 'occupied', label: 'Occupied', color: 'bg-green-100 text-green-800' },
    { value: 'vacant', label: 'Vacant', color: 'bg-red-100 text-red-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
    { value: 'unlisted', label: 'Unlisted', color: 'bg-gray-100 text-gray-800' },
    { value: 'sold', label: 'Sold', color: 'bg-purple-100 text-purple-800' },
  ];
  
  // Amenity options
  const amenityOptions = [
    'Air Conditioning', 'Heating', 'Washer/Dryer', 'Dishwasher', 'Parking',
    'Balcony/Patio', 'Garden', 'Swimming Pool', 'Gym', 'Pet Friendly',
    'Furnished', 'Wheelchair Access', 'Security System', 'Elevator',
    'Concierge', 'Storage', 'Garage', 'Fireplace', 'Hardwood Floors',
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'updated_at', label: 'Recently Updated' },
    { value: 'created_at', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'bedrooms', label: 'Bedrooms' },
    { value: 'square_feet', label: 'Square Footage' },
    { value: 'occupancy', label: 'Occupancy Rate' },
    { value: 'revenue', label: 'Monthly Revenue' },
  ];
  
  // Bedroom options
  const bedroomOptions = ['Any', '1', '2', '3', '4', '5+'];
  
  // Bathroom options
  const bathroomOptions = ['Any', '1', '1.5', '2', '2.5', '3', '3+'];
  
  useEffect(() => {
    if (onFilterChange) {
      const timeoutId = setTimeout(() => {
        onFilterChange(localFilters);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [localFilters, onFilterChange]);
  
  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleArrayFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };
  
  const handleReset = () => {
    const resetFilters = {
      search: '',
      propertyType: [],
      status: [],
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      location: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'updated_at',
      sortOrder: 'desc',
    };
    
    setLocalFilters(resetFilters);
    if (onReset) onReset(resetFilters);
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  const activeFilterCount = Object.entries(localFilters).reduce((count, [key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return count;
    
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    }
    
    return count + (value ? 1 : 0);
  }, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Properties</h3>
          {propertyCount !== null && (
            <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {propertyCount} properties
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {activeFilterCount > 0 && (
            <span className="text-sm text-gray-600">
              {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            Reset All
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search properties by name, address, or description..."
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Quick Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Property Type Quick Filters */}
          {availableFilters.propertyType && propertyTypes.slice(0, 4).map(type => (
            <button
              key={type.value}
              onClick={() => handleArrayFilterChange('propertyType', type.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                localFilters.propertyType.includes(type.value)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              {type.icon} {type.label}
            </button>
          ))}
          
          {/* Status Quick Filters */}
          {availableFilters.status && statusOptions.slice(0, 3).map(status => (
            <button
              key={status.value}
              onClick={() => handleArrayFilterChange('status', status.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                localFilters.status.includes(status.value)
                  ? status.color
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Filter Sections */}
      <div className="space-y-4">
        {/* Property Type Section */}
        {availableFilters.propertyType && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('type')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              disabled={loading}
            >
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="font-medium text-gray-900">Property Type</span>
              </div>
              {expandedSections.type ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.type && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {propertyTypes.map(type => (
                    <label
                      key={type.value}
                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.propertyType.includes(type.value)}
                        onChange={() => handleArrayFilterChange('propertyType', type.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type.icon} {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Status Section */}
        {availableFilters.status && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('status')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              disabled={loading}
            >
              <div className="flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="font-medium text-gray-900">Status</span>
              </div>
              {expandedSections.status ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.status && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleArrayFilterChange('status', status.value)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        localFilters.status.includes(status.value)
                          ? status.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={loading}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Price Range Section */}
        {availableFilters.priceRange && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('price')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              disabled={loading}
            >
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="font-medium text-gray-900">Price Range</span>
              </div>
              {expandedSections.price ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      value={localFilters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      value={localFilters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Price preset buttons */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {['$500', '$1000', '$2000', '$3000', '$5000'].map(price => (
                      <button
                        key={price}
                        onClick={() => handleFilterChange('maxPrice', price.replace('$', ''))}
                        className={`px-3 py-1.5 text-sm rounded ${
                          localFilters.maxPrice === price.replace('$', '')
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={loading}
                      >
                        Up to {price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Specifications Section */}
        {(availableFilters.bedrooms || availableFilters.bathrooms) && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('specs')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              disabled={loading}
            >
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="font-medium text-gray-900">Specifications</span>
              </div>
              {expandedSections.specs ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.specs && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  {availableFilters.bedrooms && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {bedroomOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => handleFilterChange('bedrooms', option === 'Any' ? '' : option)}
                            className={`px-3 py-1.5 rounded text-sm font-medium ${
                              localFilters.bedrooms === (option === 'Any' ? '' : option)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            disabled={loading}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {availableFilters.bathrooms && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {bathroomOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => handleFilterChange('bathrooms', option === 'Any' ? '' : option)}
                            className={`px-3 py-1.5 rounded text-sm font-medium ${
                              localFilters.bathrooms === (option === 'Any' ? '' : option)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            disabled={loading}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Amenities Section */}
        {availableFilters.amenities && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('amenities')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg"
              disabled={loading}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="font-medium text-gray-900">Amenities</span>
              </div>
              {expandedSections.amenities ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.amenities && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenityOptions.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.amenities.includes(amenity)}
                        onChange={() => handleArrayFilterChange('amenities', amenity)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-center py-3 text-sm font-medium text-blue-600 hover:text-blue-500"
          disabled={loading}
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
          {isAdvancedOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </button>
        
        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-gray-900">Advanced Filters</h4>
            
            {/* Location Filter */}
            {availableFilters.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City, state, or ZIP code"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
            )}
            
            {/* Date Range Filter */}
            {availableFilters.dateRange && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available To
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex items-center space-x-4">
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleFilterChange('sortOrder', localFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  disabled={loading}
                >
                  {localFilters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {/* Search filter */}
            {localFilters.search && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{localFilters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {/* Property type filters */}
            {localFilters.propertyType.map(type => {
              const typeInfo = propertyTypes.find(t => t.value === type);
              return (
                <span key={type} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800">
                  {typeInfo?.icon} {typeInfo?.label}
                  <button
                    onClick={() => handleArrayFilterChange('propertyType', type)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            
            {/* Status filters */}
            {localFilters.status.map(status => {
              const statusInfo = statusOptions.find(s => s.value === status);
              return (
                <span key={status} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-800">
                  {statusInfo?.label}
                  <button
                    onClick={() => handleArrayFilterChange('status', status)}
                    className="ml-2 text-green-600 hover:text-green-800"
                    disabled={loading}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            
            {/* Price range filter */}
            {(localFilters.minPrice || localFilters.maxPrice) && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800">
                Price: ${localFilters.minPrice || '0'} - ${localFilters.maxPrice || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', '');
                    handleFilterChange('maxPrice', '');
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                  disabled={loading}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {/* Bedrooms filter */}
            {localFilters.bedrooms && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-orange-100 text-orange-800">
                {localFilters.bedrooms} Bedrooms
                <button
                  onClick={() => handleFilterChange('bedrooms', '')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                  disabled={loading}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {/* Bathrooms filter */}
            {localFilters.bathrooms && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-pink-100 text-pink-800">
                {localFilters.bathrooms} Bathrooms
                <button
                  onClick={() => handleFilterChange('bathrooms', '')}
                  className="ml-2 text-pink-600 hover:text-pink-800"
                  disabled={loading}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {/* Clear all button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              disabled={loading}
            >
              Clear All
              <XMarkIcon className="h-3 w-3 ml-2" />
            </button>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Applying filters...</p>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
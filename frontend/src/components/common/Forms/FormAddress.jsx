import React, { useState, useEffect } from 'react';
import { MapPin, Search, Home, Building, Navigation } from 'lucide-react';
import Input from '../UI/Input';

const FormAddress = ({
  name,
  label,
  value = {},
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  showMap = true,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props
}) => {
  const [address, setAddress] = useState({
    street: value.street || '',
    city: value.city || '',
    state: value.state || '',
    postalCode: value.postalCode || '',
    country: value.country || '',
    latitude: value.latitude || '',
    longitude: value.longitude || '',
    unit: value.unit || '',
    building: value.building || ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const handleChange = (field, fieldValue) => {
    const newAddress = {
      ...address,
      [field]: fieldValue
    };
    setAddress(newAddress);
    onChange({
      target: {
        name,
        value: newAddress
      }
    });
  };

  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      // This would typically call your backend API which calls Google Maps API
      // For now, we'll use a mock implementation
      const mockSuggestions = [
        {
          id: 1,
          address: '123 Main St, New York, NY 10001, USA',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          id: 2,
          address: '456 Broadway, New York, NY 10013, USA',
          street: '456 Broadway',
          city: 'New York',
          state: 'NY',
          postalCode: '10013',
          country: 'USA',
          latitude: 40.7209,
          longitude: -74.0007
        }
      ];

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Address search failed:', error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddress({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      postalCode: suggestion.postalCode,
      country: suggestion.country,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      unit: address.unit,
      building: address.building
    });
    setShowSuggestions(false);
    onChange({
      target: {
        name,
        value: {
          ...address,
          ...suggestion
        }
      }
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newAddress = {
            ...address,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setAddress(newAddress);
          onChange({
            target: {
              name,
              value: newAddress
            }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Address Search */}
      <div className="mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search address..."
            value={address.street}
            onChange={(e) => {
              handleChange('street', e.target.value);
              handleSearch(e.target.value);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.address}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Address Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            label="Building/Complex Name"
            placeholder="Building name"
            value={address.building}
            onChange={(e) => handleChange('building', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            label="Unit/Apartment Number"
            placeholder="Unit number"
            value={address.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          label="City"
          placeholder="City"
          value={address.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required={required}
        />
        <Input
          label="State/Province"
          placeholder="State"
          value={address.state}
          onChange={(e) => handleChange('state', e.target.value)}
        />
        <Input
          label="Postal Code"
          placeholder="Postal code"
          value={address.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          required={required}
        />
      </div>

      <div className="mb-4">
        <Input
          label="Country"
          placeholder="Country"
          value={address.country}
          onChange={(e) => handleChange('country', e.target.value)}
          required={required}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Latitude"
          placeholder="Latitude"
          type="number"
          step="any"
          value={address.latitude}
          onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
        />
        <Input
          label="Longitude"
          placeholder="Longitude"
          type="number"
          step="any"
          value={address.longitude}
          onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
        />
      </div>

      {/* Location Actions */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
        >
          <Navigation className="h-4 w-4" />
          Use Current Location
        </button>
        <button
          type="button"
          onClick={() => setShowSuggestions(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
        >
          <MapPin className="h-4 w-4" />
          Search on Map
        </button>
      </div>

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormAddress;
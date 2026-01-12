import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  DocumentTextIcon,
  CogIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Input from '../common/UI/Input';
import Button from '../common/UI/Button';
import PropertyMap from './PropertyMap';

const PropertyForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  title = 'Add New Property',
  submitText = 'Save Property',
  showMap = true,
}) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: 'apartment',
    propertyStatus: 'listed',
    
    // Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    latitude: '',
    longitude: '',
    
    // Specifications
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: new Date().getFullYear(),
    floors: 1,
    units: 1,
    
    // Pricing
    rentAmount: '',
    securityDeposit: '',
    petDeposit: '',
    utilitiesIncluded: false,
    includedUtilities: [],
    
    // Features & Amenities
    features: [],
    amenities: [],
    
    // Images & Documents
    images: [],
    documents: [],
    
    // Additional Info
    tags: [],
    notes: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newTag, setNewTag] = useState('');
  const [utilities, setUtilities] = useState({
    water: false,
    electricity: false,
    gas: false,
    internet: false,
    trash: false,
    sewer: false,
  });

  // Property type options
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'Single Family House' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'vacation', label: 'Vacation Rental' },
    { value: 'bnb', label: 'Bed & Breakfast' },
    { value: 'guest_house', label: 'Guest House' },
    { value: 'multifamily', label: 'Multi-Family' },
    { value: 'student_housing', label: 'Student Housing' },
  ];

  // Property status options
  const propertyStatuses = [
    { value: 'listed', label: 'Listed for Rent' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'sold', label: 'Sold' },
  ];

  // State options (US states for now)
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  // Common features
  const commonFeatures = [
    'Air Conditioning', 'Heating', 'Hardwood Floors', 'Carpet', 'Tile Floors',
    'Washer/Dryer', 'Dishwasher', 'Refrigerator', 'Microwave', 'Oven',
    'Garbage Disposal', 'Walk-in Closet', 'Balcony/Patio', 'Fireplace',
    'Central Air', 'Ceiling Fans', 'Storage', 'Garage', 'Parking',
  ];

  // Common amenities
  const commonAmenities = [
    'Swimming Pool', 'Gym/Fitness Center', 'Clubhouse', 'Playground',
    'Business Center', 'Laundry Facility', 'Elevator', 'Security System',
    'Gated Community', 'Pet Friendly', 'Green Building', 'Smoke Free',
    'Wheelchair Access', 'On-site Management', 'Package Receiving',
  ];

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
      
      // Parse utilities if they exist
      if (initialData.includedUtilities) {
        const utilitiesState = {};
        ['water', 'electricity', 'gas', 'internet', 'trash', 'sewer'].forEach(util => {
          utilitiesState[util] = initialData.includedUtilities.includes(util);
        });
        setUtilities(utilitiesState);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUtilityChange = (utility) => {
    setUtilities(prev => ({
      ...prev,
      [utility]: !prev[utility],
    }));
    
    // Update form data
    const includedUtilities = Object.entries(utilities)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    
    setFormData(prev => ({
      ...prev,
      includedUtilities,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!formData.propertyStatus) newErrors.propertyStatus = 'Property status is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
        
      case 2:
        if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
        if (!formData.squareFeet) newErrors.squareFeet = 'Square footage is required';
        if (!formData.rentAmount) newErrors.rentAmount = 'Rent amount is required';
        break;
        
      case 3:
        // No validation needed for features/amenities
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Validate all steps
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }
    
    // Prepare final data
    const finalData = {
      ...formData,
      // Ensure numbers are properly formatted
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      squareFeet: Number(formData.squareFeet),
      rentAmount: Number(formData.rentAmount),
      securityDeposit: Number(formData.securityDeposit) || 0,
      petDeposit: Number(formData.petDeposit) || 0,
      // Include utilities from state
      includedUtilities: Object.entries(utilities)
        .filter(([_, value]) => value)
        .map(([key]) => key),
    };
    
    if (onSubmit) {
      onSubmit(finalData);
    }
  };

  const handleLocationSelect = (lat, lng, address) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address,
    }));
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: HomeIcon },
    { number: 2, title: 'Specifications & Pricing', icon: CogIcon },
    { number: 3, title: 'Features & Amenities', icon: BuildingOfficeIcon },
    { number: 4, title: 'Review & Submit', icon: DocumentTextIcon },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">
          Complete all sections to add a new property to your portfolio
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${
                    isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                {step.number < steps.length && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmitForm}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Property Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g., Ocean View Villa"
                required
                icon={HomeIcon}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.propertyType ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the property, its features, and any special notes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Status *
                </label>
                <select
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.propertyStatus ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select status</option>
                  {propertyStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.propertyStatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyStatus}</p>
                )}
              </div>
              
              <Input
                label="Year Built"
                name="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="e.g., 2020"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                Location Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Street Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="e.g., 123 Main St"
                  required
                />
                
                <Input
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="e.g., Los Angeles"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select state</option>
                    {usStates.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                
                <Input
                  label="ZIP Code *"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                  placeholder="e.g., 90001"
                  required
                />
                
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled
                />
              </div>
              
              {showMap && (
                <div className="mt-6">
                  <PropertyMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    address={formData.address}
                    onLocationSelect={handleLocationSelect}
                    height="300px"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Specifications & Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
                Property Specifications
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Input
                  label="Bedrooms *"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  error={errors.bedrooms}
                  placeholder="0"
                  min="0"
                  required
                  icon={UserIcon}
                />
                
                <Input
                  label="Bathrooms *"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  error={errors.bathrooms}
                  placeholder="0"
                  min="0"
                  step="0.5"
                  required
                />
                
                <Input
                  label="Square Feet *"
                  name="squareFeet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  error={errors.squareFeet}
                  placeholder="e.g., 1500"
                  min="0"
                  required
                />
                
                <Input
                  label="Lot Size (sq ft)"
                  name="lotSize"
                  type="number"
                  value={formData.lotSize}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Input
                  label="Number of Floors"
                  name="floors"
                  type="number"
                  value={formData.floors}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  min="1"
                />
                
                <Input
                  label="Number of Units"
                  name="units"
                  type="number"
                  value={formData.units}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  min="1"
                />
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-500" />
                Pricing Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Monthly Rent *"
                  name="rentAmount"
                  type="number"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  error={errors.rentAmount}
                  placeholder="e.g., 1500"
                  min="0"
                  required
                  prefix="$"
                />
                
                <Input
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="e.g., 1500"
                  min="0"
                  prefix="$"
                />
                
                <Input
                  label="Pet Deposit"
                  name="petDeposit"
                  type="number"
                  value={formData.petDeposit}
                  onChange={handleChange}
                  placeholder="e.g., 300"
                  min="0"
                  prefix="$"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Included Utilities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(utilities).map(([utility, isChecked]) => (
                    <label key={utility} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleUtilityChange(utility)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {utility}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="utilitiesIncluded"
                    checked={formData.utilitiesIncluded}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    All utilities included in rent
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Features & Amenities */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Features
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Property Features
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g., Hardwood Floors"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick add buttons */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick add common features:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonFeatures.slice(0, 8).map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => {
                          if (!formData.features.includes(feature)) {
                            setFormData(prev => ({
                              ...prev,
                              features: [...prev.features, feature],
                            }));
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + {feature}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Selected features */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Features ({formData.features.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                    {formData.features.length === 0 && (
                      <p className="text-sm text-gray-500">No features added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Community Amenities
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Community Amenities
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="e.g., Swimming Pool"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick add buttons */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quick add common amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonAmenities.slice(0, 8).map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          if (!formData.amenities.includes(amenity)) {
                            setFormData(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity],
                            }));
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + {amenity}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Selected amenities */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Amenities ({formData.amenities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                    {formData.amenities.length === 0 && (
                      <p className="text-sm text-gray-500">No amenities added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Tags
              </h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g., Luxury, Pet-friendly"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Selected tags */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Tags ({formData.tags.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-sm text-gray-500">No tags added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Submit</h3>
              <p className="text-blue-800">
                Review all property information before submitting. You can go back to any step to make changes.
              </p>
            </div>

            {/* Review Summary */}
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-semibold text-gray-900">Property Summary</h4>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-medium">{formData.title || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium capitalize">{formData.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium capitalize">{formData.propertyStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {[formData.address, formData.city, formData.state, formData.zipCode]
                          .filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Bed/Bath</p>
                      <p className="font-medium">
                        {formData.bedrooms || 0} bed, {formData.bathrooms || 0} bath
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Square Feet</p>
                      <p className="font-medium">
                        {formData.squareFeet ? formData.squareFeet.toLocaleString() : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Monthly Rent</p>
                    <p className="text-xl font-bold text-green-600">
                      ${formData.rentAmount ? formData.rentAmount.toLocaleString() : '0'}/month
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Features</p>
                    <p className="font-medium">
                      {formData.features.length > 0 
                        ? formData.features.slice(0, 3).join(', ') + (formData.features.length > 3 ? '...' : '')
                        : 'No features specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information or special instructions..."
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Property is active and visible in the system
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {submitText}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
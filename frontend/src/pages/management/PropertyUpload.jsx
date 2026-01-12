import React, { useState, useEffect } from 'react';
import {
  Upload,
  Building,
  MapPin,
  DollarSign,
  Users,
  Home,
  Bed,
  Bath,
  Ruler,
  Calendar,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  Download,
  Copy,
  Link,
  Globe,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Coffee,
  Dog,
  Cat,
  ParkingCircle,
  Thermometer,
  ShowerHead,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import MapInput from '../../../components/property/MapInput';
import ImageUpload from '../../../components/property/ImageUpload';
import DocumentUpload from '../../../components/property/DocumentUpload';

const PropertyUpload = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [propertyCode, setPropertyCode] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    documents: [],
    floorPlans: [],
  });
  const [formData, setFormData] = useState({
    // Basic Information
    propertyType: 'apartment',
    propertyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    coordinates: { lat: null, lng: null },
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    lotSize: '',
    floors: '',
    units: '',
    
    // Rental Information
    rentAmount: '',
    securityDeposit: '',
    lateFee: '',
    leaseTerm: '12',
    availableFrom: '',
    minimumStay: '',
    maximumStay: '',
    
    // Features & Amenities
    amenities: [],
    includedUtilities: [],
    petPolicy: 'no_pets',
    smokingPolicy: 'no_smoking',
    
    // Description
    description: '',
    highlights: [],
    
    // Ownership & Management
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    
    // Additional Information
    propertyStatus: 'available',
    listingType: 'rent',
    furnished: false,
    parkingSpaces: '',
    parkingType: 'none',
    hoaFees: '',
    propertyTaxes: '',
    insurance: '',
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'house', label: 'House', icon: Home },
    { value: 'condo', label: 'Condo', icon: Building },
    { value: 'townhouse', label: 'Townhouse', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Building },
    { value: 'vacation_rental', label: 'Vacation Rental', icon: Home },
    { value: 'student_housing', label: 'Student Housing', icon: Building },
    { value: 'senior_housing', label: 'Senior Housing', icon: Home },
  ];

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'pool', label: 'Pool', icon: Waves },
    { id: 'laundry', label: 'Laundry', icon: Thermometer },
    { id: 'ac', label: 'Air Conditioning', icon: Thermometer },
    { id: 'heating', label: 'Heating', icon: Thermometer },
    { id: 'dishwasher', label: 'Dishwasher', icon: ChefHat },
    { id: 'balcony', label: 'Balcony', icon: Globe },
    { id: 'garden', label: 'Garden', icon: Home },
    { id: 'elevator', label: 'Elevator', icon: Building },
    { id: 'security', label: 'Security System', icon: AlertTriangle },
    { id: 'concierge', label: 'Concierge', icon: Users },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: Dog },
    { id: 'furnished', label: 'Furnished', icon: Home },
    { id: 'utilities_included', label: 'Utilities Included', icon: DollarSign },
  ];

  const utilityOptions = [
    'Electricity',
    'Water',
    'Gas',
    'Internet',
    'Cable TV',
    'Trash Collection',
    'Sewer',
  ];

  const petPolicies = [
    { value: 'no_pets', label: 'No Pets Allowed' },
    { value: 'dogs_only', label: 'Dogs Only' },
    { value: 'cats_only', label: 'Cats Only' },
    { value: 'small_pets', label: 'Small Pets Only' },
    { value: 'all_pets', label: 'All Pets Allowed' },
    { value: 'case_by_case', label: 'Case by Case' },
  ];

  const smokingPolicies = [
    { value: 'no_smoking', label: 'No Smoking' },
    { value: 'outside_only', label: 'Outside Only' },
    { value: 'designated_areas', label: 'Designated Areas' },
    { value: 'allowed', label: 'Smoking Allowed' },
  ];

  const propertyStatuses = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'occupied', label: 'Occupied', color: 'blue' },
    { value: 'under_maintenance', label: 'Under Maintenance', color: 'yellow' },
    { value: 'coming_soon', label: 'Coming Soon', color: 'purple' },
    { value: 'off_market', label: 'Off Market', color: 'gray' },
  ];

  useEffect(() => {
    loadTemplates();
    generatePropertyCode().then(code => setPropertyCode(code));
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setTemplates([
        { id: 'template-1', name: 'Standard Apartment Template', type: 'apartment' },
        { id: 'template-2', name: 'Luxury House Template', type: 'house' },
        { id: 'template-3', name: 'Commercial Property Template', type: 'commercial' },
        { id: 'template-4', name: 'Vacation Rental Template', type: 'vacation_rental' },
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, itemId, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], itemId]
        : prev[field].filter(id => id !== itemId)
    }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      // In a real app, this would populate formData with template values
      console.log('Applying template:', template.name);
    }
  };

  const handleImageUpload = (files) => {
    setUploadedFiles(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleDocumentUpload = (files, type) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...files]
    }));
  };

  const handleRemoveFile = (type, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.propertyType && formData.address && formData.city && formData.state && formData.zipCode;
      case 2:
        return formData.bedrooms && formData.bathrooms && formData.squareFeet;
      case 3:
        return formData.rentAmount && formData.availableFrom;
      case 4:
        return uploadedFiles.images.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      alert('Please complete all required fields.');
      return;
    }

    setUploading(true);
    try {
      const propertyData = {
        ...formData,
        code: propertyCode,
        uploadedFiles,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };

      const result = await uploadProperty(propertyData);
      if (result.success) {
        alert('Property uploaded successfully!');
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Failed to upload property:', error);
      alert('Failed to upload property. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const draftData = {
        ...formData,
        code: propertyCode,
        uploadedFiles,
        status: 'draft',
        savedAt: new Date().toISOString(),
      };
      // Save draft logic
      console.log('Saving draft:', draftData);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = () => {
    // Generate preview logic
    console.log('Generating preview for property:', formData);
  };

  const handleCopyPropertyCode = () => {
    navigator.clipboard.writeText(propertyCode);
    alert('Property code copied to clipboard!');
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: Building },
    { number: 2, title: 'Property Details', icon: Home },
    { number: 3, title: 'Rental Information', icon: DollarSign },
    { number: 4, title: 'Features & Amenities', icon: CheckCircle },
    { number: 5, title: 'Photos & Documents', icon: Image },
    { number: 6, title: 'Review & Submit', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Property</h1>
              <p className="mt-2 text-gray-600">
                Add a new property to your portfolio
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handleGeneratePreview}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Property Code */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Property Code</p>
                <p className="text-lg font-mono font-bold text-blue-700">{propertyCode}</p>
              </div>
            </div>
            <button
              onClick={handleCopyPropertyCode}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-lg"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Use Template</h3>
              <p className="text-sm text-gray-600 mt-1">
                Start with a pre-configured template to save time
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useTemplate}
                onChange={(e) => setUseTemplate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {useTemplate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </option>
                ))}
              </select>
              
              {selectedTemplate && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <p className="text-sm text-green-800">
                      Template loaded. Some fields have been pre-filled for you.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => {
              const StepIcon = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <div key={stepItem.number} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-full mt-6 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('propertyType', type.value)}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
                        formData.propertyType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 ${
                        formData.propertyType === type.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="mt-2 text-sm font-medium text-gray-900">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => handleInputChange('propertyName', e.target.value)}
                  placeholder="e.g., Luxury Downtown Apartment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Location (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Click on the map or enter coordinates to set the exact location
                </p>
                <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                  <MapInput
                    coordinates={formData.coordinates}
                    onCoordinatesChange={(coords) => handleInputChange('coordinates', coords)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coordinates.lat || ''}
                      onChange={(e) => handleInputChange('coordinates', {
                        ...formData.coordinates,
                        lat: parseFloat(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coordinates.lng || ''}
                      onChange={(e) => handleInputChange('coordinates', {
                        ...formData.coordinates,
                        lng: parseFloat(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Details</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet *
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.squareFeet}
                      onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Size (sq ft)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.floors}
                    onChange={(e) => handleInputChange('floors', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units (for multi-unit properties)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.units}
                  onChange={(e) => handleInputChange('units', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Highlights
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {highlight}
                      <button
                        type="button"
                        onClick={() => handleInputChange('highlights', formData.highlights.filter((_, i) => i !== index))}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add a highlight (e.g., 'Recently renovated', 'Great views')"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleInputChange('highlights', [...formData.highlights, e.target.value.trim()]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        handleInputChange('highlights', [...formData.highlights, input.value.trim()]);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Rental Information */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rental Information</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.lateFee}
                    onChange={(e) => handleInputChange('lateFee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Term (months)
                  </label>
                  <select
                    value={formData.leaseTerm}
                    onChange={(e) => handleInputChange('leaseTerm', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stay
                  </label>
                  <select
                    value={formData.minimumStay}
                    onChange={(e) => handleInputChange('minimumStay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No minimum</option>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stay
                  </label>
                  <select
                    value={formData.maximumStay}
                    onChange={(e) => handleInputChange('maximumStay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No maximum</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Policy
                  </label>
                  <select
                    value={formData.petPolicy}
                    onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {petPolicies.map(policy => (
                      <option key={policy.value} value={policy.value}>{policy.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking Policy
                  </label>
                  <select
                    value={formData.smokingPolicy}
                    onChange={(e) => handleInputChange('smokingPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {smokingPolicies.map(policy => (
                      <option key={policy.value} value={policy.value}>{policy.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Features & Amenities */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Features & Amenities</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenitiesList.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity.id);
                    const Icon = amenity.icon;
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleArrayChange('amenities', amenity.id, !isSelected)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${
                          isSelected ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="text-xs font-medium text-gray-900">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Included Utilities</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {utilityOptions.map((utility) => {
                    const isSelected = formData.includedUtilities.includes(utility);
                    
                    return (
                      <label key={utility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleArrayChange('includedUtilities', utility, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{utility}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.parkingSpaces}
                    onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Type
                  </label>
                  <select
                    value={formData.parkingType}
                    onChange={(e) => handleInputChange('parkingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">No Parking</option>
                    <option value="street">Street Parking</option>
                    <option value="driveway">Driveway</option>
                    <option value="garage">Garage</option>
                    <option value="covered">Covered Parking</option>
                    <option value="assigned">Assigned Parking</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HOA Fees ($/month)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hoaFees}
                    onChange={(e) => handleInputChange('hoaFees', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Taxes ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.propertyTaxes}
                    onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance ($/year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => handleInputChange('furnished', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Property is furnished</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Photos & Documents */}
        {step === 5 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Photos & Documents</h3>
            
            <div className="space-y-8">
              {/* Property Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Property Images *</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Upload high-quality photos of the property (minimum 3, maximum 20)
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {uploadedFiles.images.length}/20 images
                  </span>
                </div>
                
                <ImageUpload
                  onUpload={handleImageUpload}
                  maxFiles={20}
                  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                />
                
                {uploadedFiles.images.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {uploadedFiles.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('images', index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Documents */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Documents</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Lease Agreement Templates</p>
                    <DocumentUpload
                      onUpload={(files) => handleDocumentUpload(files, 'documents')}
                      acceptedFormats={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                    />
                    {uploadedFiles.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('documents', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Floor Plans</p>
                    <DocumentUpload
                      onUpload={(files) => handleDocumentUpload(files, 'floorPlans')}
                      acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
                    />
                    {uploadedFiles.floorPlans.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.floorPlans.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Image className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('floorPlans', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Review & Submit</h3>
            
            <div className="space-y-8">
              {/* Summary Sections */}
              {[
                {
                  title: 'Basic Information',
                  fields: [
                    { label: 'Property Type', value: propertyTypes.find(t => t.value === formData.propertyType)?.label },
                    { label: 'Property Name', value: formData.propertyName },
                    { label: 'Address', value: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}` },
                  ]
                },
                {
                  title: 'Property Details',
                  fields: [
                    { label: 'Bedrooms', value: formData.bedrooms },
                    { label: 'Bathrooms', value: formData.bathrooms },
                    { label: 'Square Feet', value: formData.squareFeet?.toLocaleString() },
                    { label: 'Year Built', value: formData.yearBuilt },
                  ]
                },
                {
                  title: 'Rental Information',
                  fields: [
                    { label: 'Monthly Rent', value: `$${formData.rentAmount}` },
                    { label: 'Security Deposit', value: `$${formData.securityDeposit}` },
                    { label: 'Available From', value: formData.availableFrom },
                    { label: 'Lease Term', value: `${formData.leaseTerm} months` },
                  ]
                },
                {
                  title: 'Features & Amenities',
                  fields: [
                    { label: 'Amenities', value: formData.amenities.length > 0 
                      ? amenitiesList.filter(a => formData.amenities.includes(a.id)).map(a => a.label).join(', ')
                      : 'None'
                    },
                    { label: 'Pet Policy', value: petPolicies.find(p => p.value === formData.petPolicy)?.label },
                    { label: 'Smoking Policy', value: smokingPolicies.find(s => s.value === formData.smokingPolicy)?.label },
                  ]
                },
                {
                  title: 'Media',
                  fields: [
                    { label: 'Images Uploaded', value: `${uploadedFiles.images.length} images` },
                    { label: 'Documents Uploaded', value: `${uploadedFiles.documents.length + uploadedFiles.floorPlans.length} documents` },
                  ]
                }
              ].map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">{section.title}</h4>
                    <button
                      type="button"
                      onClick={() => setStep(index + 1)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex}>
                        <p className="text-xs text-gray-600">{field.label}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {field.value || 'Not specified'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Final Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Property Status</p>
                    <select
                      value={formData.propertyStatus}
                      onChange={(e) => handleInputChange('propertyStatus', e.target.value)}
                      className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {propertyStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={uploading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2 inline" />
                          Uploading...
                        </>
                      ) : (
                        'Publish Property'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
            >
              Previous
            </button>
          )}
          
          {step < 6 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Continue to {steps[step]?.title || 'Next Step'}
            </button>
          ) : (
            <div className="ml-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyUpload;
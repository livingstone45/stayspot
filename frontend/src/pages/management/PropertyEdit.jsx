import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  Building,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath,
  Ruler,
  Calendar,
  Image,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  Download,
  Copy,
  Link,
  Home,
  ChevronLeft,
  RefreshCw,
  Upload,
  Settings,
  History,
  BarChart3,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Share2,
  Printer,
  Archive,
  Unarchive,
  Lock,
  Globe,
  Wifi,
  Car,
  Dumbbell,
  Waves
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import MapInput from '../../../components/property/MapInput';
import ImageUpload from '../../../components/property/ImageUpload';
import DocumentUpload from '../../../components/property/DocumentUpload';
import HistoryTimeline from '../../../components/property/HistoryTimeline';
import UnitManagement from '../../../components/property/UnitManagement';
import MaintenanceHistory from '../../../components/property/MaintenanceHistory';
import FinancialOverview from '../../../components/property/FinancialOverview';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});
  const [changes, setChanges] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    documents: [],
    floorPlans: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [units, setUnits] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [financialData, setFinancialData] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'details', label: 'Details', icon: Settings },
    { id: 'units', label: 'Units', icon: Building },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'history', label: 'History', icon: History },
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'house', label: 'House', icon: Home },
    { value: 'condo', label: 'Condo', icon: Building },
    { value: 'townhouse', label: 'Townhouse', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Building },
    { value: 'vacation_rental', label: 'Vacation Rental', icon: Home },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'vacant', label: 'Vacant', color: 'yellow' },
    { value: 'under_maintenance', label: 'Under Maintenance', color: 'red' },
    { value: 'under_renovation', label: 'Under Renovation', color: 'blue' },
    { value: 'coming_soon', label: 'Coming Soon', color: 'purple' },
    { value: 'archived', label: 'Archived', color: 'gray' },
  ];

  useEffect(() => {
    if (id) {
      loadProperty();
      loadRelatedData();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await getProperty(id);
      setProperty(data);
      setFormData(data);
      
      // Simulate uploaded files from existing property
      if (data.photos) {
        setUploadedFiles(prev => ({
          ...prev,
          images: data.photos.map(photo => ({
            id: photo.id,
            url: photo.url,
            name: `photo-${photo.id}.jpg`,
            size: 1024 * 1024, // Simulated size
            type: 'image/jpeg'
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load property:', error);
      // Load sample data for demo
      setProperty(generateSampleProperty());
      setFormData(generateSampleProperty());
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedData = async () => {
    // Load related data
    setHistory(generateSampleHistory());
    setUnits(generateSampleUnits());
    setMaintenanceHistory(generateSampleMaintenance());
    setFinancialData(generateSampleFinancialData());
  };

  const generateSampleProperty = () => {
    return {
      id,
      code: 'PROP-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      name: 'Luxury Downtown Apartment',
      type: 'apartment',
      status: 'active',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      yearBuilt: 2015,
      lotSize: null,
      floors: 1,
      totalUnits: 1,
      rentAmount: 3500,
      securityDeposit: 7000,
      lateFee: 100,
      leaseTerm: 12,
      availableFrom: '2024-12-01',
      minimumStay: null,
      maximumStay: null,
      petPolicy: 'case_by_case',
      smokingPolicy: 'no_smoking',
      description: 'Beautiful luxury apartment in downtown with amazing views. Recently renovated with high-end finishes.',
      highlights: ['Recently renovated', 'Great views', 'Modern kitchen', 'Pet friendly'],
      amenities: ['wifi', 'parking', 'gym', 'laundry', 'ac'],
      includedUtilities: ['Water', 'Internet'],
      furnished: false,
      parkingSpaces: 1,
      parkingType: 'assigned',
      hoaFees: 250,
      propertyTaxes: 6000,
      insurance: 1200,
      ownerName: 'John Smith',
      ownerEmail: 'john@example.com',
      ownerPhone: '+1 (555) 123-4567',
      managerName: 'Sarah Johnson',
      managerEmail: 'sarah@example.com',
      managerPhone: '+1 (555) 987-6543',
      listingType: 'rent',
      propertyStatus: 'available',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-11-20T14:45:00Z',
      photos: [
        { id: 'photo-1', url: 'https://via.placeholder.com/800x600?text=Luxury+Apartment+1' },
        { id: 'photo-2', url: 'https://via.placeholder.com/800x600?text=Luxury+Apartment+2' },
        { id: 'photo-3', url: 'https://via.placeholder.com/800x600?text=Luxury+Apartment+3' },
      ],
      documents: [],
      floorPlans: [],
    };
  };

  const generateSampleHistory = () => {
    return [
      { id: 1, action: 'property_created', user: 'System', timestamp: '2024-01-15T10:30:00Z', details: 'Property created' },
      { id: 2, action: 'property_updated', user: 'John Doe', timestamp: '2024-03-20T14:20:00Z', details: 'Updated rent amount from $3200 to $3500' },
      { id: 3, action: 'maintenance_completed', user: 'Mike Wilson', timestamp: '2024-05-15T09:15:00Z', details: 'HVAC system maintenance completed' },
      { id: 4, action: 'tenant_moved_in', user: 'Sarah Johnson', timestamp: '2024-06-01T10:00:00Z', details: 'New tenant: Jane Smith moved in' },
      { id: 5, action: 'inspection_completed', user: 'Robert Brown', timestamp: '2024-09-10T13:45:00Z', details: 'Quarterly inspection completed' },
    ];
  };

  const generateSampleUnits = () => {
    return [
      { id: 'unit-1', name: 'Unit 1A', type: 'apartment', bedrooms: 3, bathrooms: 2, squareFeet: 1500, status: 'occupied', rent: 3500, tenant: 'Jane Smith' },
      { id: 'unit-2', name: 'Unit 1B', type: 'apartment', bedrooms: 2, bathrooms: 1, squareFeet: 1000, status: 'vacant', rent: 2800, tenant: null },
      { id: 'unit-3', name: 'Unit 1C', type: 'apartment', bedrooms: 1, bathrooms: 1, squareFeet: 800, status: 'occupied', rent: 2200, tenant: 'Robert Johnson' },
    ];
  };

  const generateSampleMaintenance = () => {
    return [
      { id: 1, issue: 'Plumbing leak', priority: 'emergency', status: 'completed', reportedDate: '2024-10-15', completedDate: '2024-10-16', cost: 450 },
      { id: 2, issue: 'HVAC maintenance', priority: 'routine', status: 'completed', reportedDate: '2024-09-20', completedDate: '2024-09-22', cost: 300 },
      { id: 3, issue: 'Appliance repair', priority: 'urgent', status: 'in_progress', reportedDate: '2024-11-18', estimatedCompletion: '2024-11-25', estimatedCost: 600 },
      { id: 4, issue: 'Painting', priority: 'routine', status: 'pending', reportedDate: '2024-11-20', estimatedCost: 1200 },
    ];
  };

  const generateSampleFinancialData = () => {
    return {
      monthlyRevenue: 3500,
      annualRevenue: 42000,
      expenses: {
        maintenance: 1350,
        propertyTaxes: 6000,
        insurance: 1200,
        hoaFees: 3000,
        utilities: 2400,
        managementFees: 2520,
      },
      netIncome: 26530,
      occupancyRate: 66.7,
      collectionRate: 100,
      paymentHistory: [
        { month: 'Jan', amount: 3500, status: 'paid' },
        { month: 'Feb', amount: 3500, status: 'paid' },
        { month: 'Mar', amount: 3500, status: 'paid' },
        { month: 'Apr', amount: 3500, status: 'paid' },
        { month: 'May', amount: 3500, status: 'paid' },
        { month: 'Jun', amount: 3500, status: 'paid' },
        { month: 'Jul', amount: 3500, status: 'paid' },
        { month: 'Aug', amount: 3500, status: 'paid' },
        { month: 'Sep', amount: 3500, status: 'paid' },
        { month: 'Oct', amount: 3500, status: 'paid' },
        { month: 'Nov', amount: 3500, status: 'paid' },
        { month: 'Dec', amount: 3500, status: 'pending' },
      ],
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setChanges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, itemId, checked) => {
    const newArray = checked
      ? [...(formData[field] || []), itemId]
      : (formData[field] || []).filter(id => id !== itemId);
    
    handleInputChange(field, newArray);
  };

  const handleFileUpload = (files, type) => {
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

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      alert('No changes to save');
      return;
    }

    setSaving(true);
    try {
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString(),
        uploadedFiles,
      };

      await updateProperty(id, updatedData);
      setChanges({});
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Failed to update property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id);
      setShowDeleteModal(false);
      navigate('/management/properties');
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleArchive = async () => {
    try {
      if (property.status === 'archived') {
        await restoreProperty(id);
      } else {
        await archiveProperty(id);
      }
      setShowArchiveModal(false);
      loadProperty();
    } catch (error) {
      console.error('Failed to archive property:', error);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/properties/${id}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const hasChanges = Object.keys(changes).length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Property not found</h3>
          <p className="mt-1 text-sm text-gray-500">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/management/properties')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </button>
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
            <div className="flex items-center">
              <button
                onClick={() => navigate('/management/properties')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusOptions.find(s => s.value === property.status)?.color === 'green' ? 'bg-green-100 text-green-800' :
                    statusOptions.find(s => s.value === property.status)?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    statusOptions.find(s => s.value === property.status)?.color === 'red' ? 'bg-red-100 text-red-800' :
                    statusOptions.find(s => s.value === property.status)?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    statusOptions.find(s => s.value === property.status)?.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {statusOptions.find(s => s.value === property.status)?.label || property.status}
                  </span>
                  <span className="font-mono text-sm text-gray-500">{property.code}</span>
                </div>
                <div className="flex items-center mt-2">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-600">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              {hasChanges && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Property Status Banner */}
        {property.status === 'archived' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Archive className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-yellow-900">Property is archived</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This property is not visible in searches and cannot be rented. Restore it to make it active again.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowArchiveModal(true)}
                className="flex items-center px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100 rounded-lg border border-yellow-300"
              >
                <Unarchive className="w-4 h-4 mr-2" />
                Restore Property
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Property Images */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    <Eye className="w-4 h-4 mr-1 inline" />
                    View Gallery
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {uploadedFiles.images.slice(0, 3).map((file, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={file.url || URL.createObjectURL(file)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          Cover Photo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        ${property.rentAmount?.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {units.filter(u => u.status === 'occupied').length}/{units.length}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Maintenance</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {maintenanceHistory.filter(m => m.status === 'pending' || m.status === 'in_progress').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {financialData?.collectionRate || 100}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Description and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h3>
                  <p className="text-gray-600">{property.description}</p>
                  
                  {property.highlights && property.highlights.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Property Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.highlights.map((highlight, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Property Type</span>
                      <span className="text-sm font-medium text-gray-900">
                        {propertyTypes.find(t => t.value === property.type)?.label || property.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bedrooms</span>
                      <span className="text-sm font-medium text-gray-900">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bathrooms</span>
                      <span className="text-sm font-medium text-gray-900">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Square Feet</span>
                      <span className="text-sm font-medium text-gray-900">{property.squareFeet?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Year Built</span>
                      <span className="text-sm font-medium text-gray-900">{property.yearBuilt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available From</span>
                      <span className="text-sm font-medium text-gray-900">
                        {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'Immediately'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Owner</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{property.ownerName}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <a href={`mailto:${property.ownerEmail}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {property.ownerEmail}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <a href={`tel:${property.ownerPhone}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {property.ownerPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Manager</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{property.managerName}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <a href={`mailto:${property.managerEmail}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {property.managerEmail}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <a href={`tel:${property.managerPhone}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {property.managerPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Property Details</h3>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type *
                        </label>
                        <select
                          value={formData.type || ''}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status *
                        </label>
                        <select
                          value={formData.status || ''}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Listing Type
                        </label>
                        <select
                          value={formData.listingType || ''}
                          onChange={(e) => handleInputChange('listingType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="rent">For Rent</option>
                          <option value="sale">For Sale</option>
                          <option value="both">Both Rent & Sale</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={formData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.state || ''}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode || ''}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          value={formData.country || 'United States'}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Specifications */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Specifications</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.bedrooms || ''}
                          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formData.bathrooms || ''}
                          onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Square Feet *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.squareFeet || ''}
                          onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year Built
                        </label>
                        <input
                          type="number"
                          min="1800"
                          max={new Date().getFullYear()}
                          value={formData.yearBuilt || ''}
                          onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Units
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.totalUnits || 1}
                          onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Floors
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.floors || 1}
                          onChange={(e) => handleInputChange('floors', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Description</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Units Tab */}
          {activeTab === 'units' && (
            <UnitManagement
              propertyId={id}
              units={units}
              onUnitsUpdate={(updatedUnits) => setUnits(updatedUnits)}
            />
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <FinancialOverview
              propertyId={id}
              financialData={financialData}
              onFinancialUpdate={(updatedData) => setFinancialData(updatedData)}
            />
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <MaintenanceHistory
              propertyId={id}
              maintenanceHistory={maintenanceHistory}
              onMaintenanceUpdate={(updatedHistory) => setMaintenanceHistory(updatedHistory)}
            />
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Documents</h3>
                
                {/* Image Upload */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Property Images</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload or update property images (max 20 images)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {uploadedFiles.images.length}/20 images
                    </span>
                  </div>
                  
                  <ImageUpload
                    onUpload={(files) => handleFileUpload(files, 'images')}
                    maxFiles={20}
                    acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                  />
                  
                  {uploadedFiles.images.length > 0 && (
                    <div className="mt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {uploadedFiles.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={file.url || URL.createObjectURL(file)}
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
                            <button
                              type="button"
                              onClick={() => {
                                // Set as cover image
                                const newImages = [...uploadedFiles.images];
                                const [coverImage] = newImages.splice(index, 1);
                                newImages.unshift(coverImage);
                                setUploadedFiles(prev => ({ ...prev, images: newImages }));
                              }}
                              className="absolute bottom-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100"
                            >
                              Set Cover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Document Upload */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Property Documents</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Lease Agreements & Legal Documents</p>
                      <DocumentUpload
                        onUpload={(files) => handleFileUpload(files, 'documents')}
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
                                    {(file.size / 1024).toFixed(2)} KB • Uploaded {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveFile('documents', index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Floor Plans & Layouts</p>
                      <DocumentUpload
                        onUpload={(files) => handleFileUpload(files, 'floorPlans')}
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
                                    {(file.size / 1024).toFixed(2)} KB • Uploaded {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveFile('floorPlans', index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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

          {/* History Tab */}
          {activeTab === 'history' && (
            <HistoryTimeline history={history} />
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-900">
                  {property.status === 'archived' ? 'Restore Property' : 'Archive Property'}
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {property.status === 'archived'
                    ? 'Restore this property to make it active and visible again.'
                    : 'Archive this property to hide it from searches and listings.'}
                </p>
              </div>
              <button
                onClick={() => setShowArchiveModal(true)}
                className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                  property.status === 'archived'
                    ? 'text-green-700 hover:bg-green-50 border border-green-300'
                    : 'text-yellow-700 hover:bg-yellow-50 border border-yellow-300'
                }`}
              >
                {property.status === 'archived' ? (
                  <>
                    <Unarchive className="w-4 h-4 mr-2" />
                    Restore Property
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Property
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-900">Delete Property</p>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete this property and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Property
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">Reset Property Data</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Reset all property data to default values. This will clear all custom settings.
                </p>
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100 rounded-lg border border-yellow-300">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Data
              </button>
            </div>
          </div>
        </div>

        {/* Archive/Restore Modal */}
        {showArchiveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <Archive className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {property.status === 'archived' ? 'Restore Property' : 'Archive Property'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {property.status === 'archived'
                        ? 'Are you sure you want to restore this property?'
                        : 'Are you sure you want to archive this property?'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    {property.status === 'archived'
                      ? 'This property will become active and visible in searches and listings.'
                      : 'This property will be hidden from searches and listings. Existing tenants will not be affected.'}
                  </p>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowArchiveModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleArchive}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                  >
                    {property.status === 'archived' ? 'Restore Property' : 'Archive Property'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
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
                      Are you sure you want to delete "{property.name}"?
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    Warning: This action cannot be undone. All associated data including:
                  </p>
                  <ul className="text-sm text-red-800 list-disc list-inside mt-2 ml-2">
                    <li>Property details and photos</li>
                    <li>Tenant information and leases</li>
                    <li>Maintenance records</li>
                    <li>Financial transactions</li>
                    <li>All documents and files</li>
                  </ul>
                  <p className="text-sm text-red-800 mt-2">will be permanently deleted.</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
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

export default PropertyEdit;
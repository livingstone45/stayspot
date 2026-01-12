import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  HomeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Input from '../common/UI/Input';
import Button from '../common/UI/Button';

const LeaseForm = ({
  initialData = {},
  tenants = [],
  properties = [],
  units = [],
  onSubmit,
  onCancel,
  loading = false,
  title = 'Create New Lease',
  submitText = 'Save Lease',
  isRenewal = false,
  isAmendment = false,
}) => {
  const [formData, setFormData] = useState({
    // Basic Information
    leaseType: 'standard', // standard, corporate, short_term, month_to_month
    leaseNumber: `LEASE-${Date.now().toString().slice(-6)}`,
    
    // Parties
    tenantId: '',
    coTenants: [],
    propertyId: '',
    unitId: '',
    
    // Terms
    startDate: '',
    endDate: '',
    rentAmount: '',
    paymentDueDay: 1,
    securityDeposit: '',
    petDeposit: '',
    
    // Payment Settings
    paymentMethod: 'auto_pay',
    lateFeeType: 'percentage', // percentage, fixed
    lateFeeAmount: 5, // percentage or fixed amount
    gracePeriod: 5, // days
    
    // Utilities
    utilitiesIncluded: [],
    utilityResponsibility: 'tenant', // tenant, landlord, split
    
    // Rules & Policies
    petsAllowed: false,
    smokingAllowed: false,
    maxOccupants: 1,
    
    // Additional Terms
    specialTerms: '',
    attachments: [],
    
    // Status
    status: 'draft', // draft, pending, active, expired, terminated
    signedDate: '',
    executedBy: '',
    
    // Renewal/Amendment Info
    previousLeaseId: '',
    amendmentReason: '',
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [filteredUnits, setFilteredUnits] = useState(units);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [coTenantEmail, setCoTenantEmail] = useState('');
  
  // Lease type options
  const leaseTypes = [
    { value: 'standard', label: 'Standard Lease (12 months)', description: 'Standard 12-month residential lease' },
    { value: 'corporate', label: 'Corporate Lease', description: 'Lease for corporate housing or relocations' },
    { value: 'short_term', label: 'Short-term Lease', description: 'Lease for less than 12 months' },
    { value: 'month_to_month', label: 'Month-to-Month', description: 'Flexible monthly lease agreement' },
    { value: 'student', label: 'Student Housing', description: 'Academic year lease for students' },
    { value: 'senior', label: 'Senior Housing', description: 'Lease for senior living communities' },
  ];
  
  // Payment method options
  const paymentMethods = [
    { value: 'auto_pay', label: 'Auto-pay (ACH/Bank Transfer)' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'other', label: 'Other' },
  ];
  
  // Utility options
  const utilityOptions = [
    { id: 'water', label: 'Water' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'gas', label: 'Natural Gas' },
    { id: 'internet', label: 'Internet' },
    { id: 'cable', label: 'Cable TV' },
    { id: 'trash', label: 'Trash Removal' },
    { id: 'sewer', label: 'Sewer' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
    { value: 'terminated', label: 'Terminated', color: 'bg-gray-100 text-gray-800' },
  ];
  
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
      
      // Set selected tenant and property
      if (initialData.tenantId) {
        const tenant = tenants.find(t => t.id === initialData.tenantId);
        setSelectedTenant(tenant);
      }
      
      if (initialData.propertyId) {
        const property = properties.find(p => p.id === initialData.propertyId);
        setSelectedProperty(property);
        filterUnitsByProperty(initialData.propertyId);
      }
    }
  }, [initialData, tenants, properties]);
  
  useEffect(() => {
    if (formData.propertyId) {
      filterUnitsByProperty(formData.propertyId);
    }
  }, [formData.propertyId, units]);
  
  const filterUnitsByProperty = (propertyId) => {
    if (!propertyId) {
      setFilteredUnits([]);
      return;
    }
    
    const filtered = units.filter(unit => unit.propertyId === propertyId);
    setFilteredUnits(filtered);
  };
  
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
    
    // Handle property change
    if (name === 'propertyId') {
      setSelectedProperty(properties.find(p => p.id === value));
      setFormData(prev => ({ ...prev, unitId: '' })); // Reset unit when property changes
    }
    
    // Handle tenant change
    if (name === 'tenantId') {
      const tenant = tenants.find(t => t.id === value);
      setSelectedTenant(tenant);
    }
  };
  
  const handleUtilityToggle = (utilityId) => {
    setFormData(prev => {
      const currentUtilities = prev.utilitiesIncluded || [];
      const newUtilities = currentUtilities.includes(utilityId)
        ? currentUtilities.filter(id => id !== utilityId)
        : [...currentUtilities, utilityId];
      return { ...prev, utilitiesIncluded: newUtilities };
    });
  };
  
  const addCoTenant = () => {
    if (coTenantEmail.trim() && !formData.coTenants.includes(coTenantEmail.trim())) {
      setFormData(prev => ({
        ...prev,
        coTenants: [...prev.coTenants, coTenantEmail.trim()],
      }));
      setCoTenantEmail('');
    }
  };
  
  const removeCoTenant = (email) => {
    setFormData(prev => ({
      ...prev,
      coTenants: prev.coTenants.filter(e => e !== email),
    }));
  };
  
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.tenantId) newErrors.tenantId = 'Primary tenant is required';
        if (!formData.propertyId) newErrors.propertyId = 'Property is required';
        if (!formData.unitId) newErrors.unitId = 'Unit is required';
        if (!formData.startDate) newErrors.startDate = 'Lease start date is required';
        if (!formData.endDate) newErrors.endDate = 'Lease end date is required';
        
        if (formData.startDate && formData.endDate) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          if (end <= start) {
            newErrors.endDate = 'End date must be after start date';
          }
        }
        break;
        
      case 2:
        if (!formData.rentAmount) newErrors.rentAmount = 'Rent amount is required';
        if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';
        if (formData.paymentDueDay < 1 || formData.paymentDueDay > 31) {
          newErrors.paymentDueDay = 'Payment due day must be between 1 and 31';
        }
        break;
        
      case 3:
        // No validation needed for utilities and rules
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }
    
    // Prepare final data
    const leaseData = {
      ...formData,
      // Ensure numbers are properly formatted
      rentAmount: Number(formData.rentAmount),
      securityDeposit: Number(formData.securityDeposit) || 0,
      petDeposit: Number(formData.petDeposit) || 0,
      lateFeeAmount: Number(formData.lateFeeAmount),
      gracePeriod: Number(formData.gracePeriod),
      maxOccupants: Number(formData.maxOccupants) || 1,
      // Set dates
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      signedDate: formData.signedDate ? new Date(formData.signedDate).toISOString() : null,
    };
    
    if (onSubmit) {
      onSubmit(leaseData);
    }
  };
  
  const calculateLeaseTerm = () => {
    if (!formData.startDate || !formData.endDate) return 'N/A';
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths < 1) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
    }
  };
  
  const calculateTotalDeposit = () => {
    const security = Number(formData.securityDeposit) || 0;
    const pet = Number(formData.petDeposit) || 0;
    return security + pet;
  };
  
  const steps = [
    { number: 1, title: 'Basic Information', icon: DocumentTextIcon },
    { number: 2, title: 'Financial Terms', icon: CurrencyDollarIcon },
    { number: 3, title: 'Rules & Utilities', icon: LockClosedIcon },
    { number: 4, title: 'Review & Sign', icon: CheckCircleIcon },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">
              {isRenewal ? 'Renew an existing lease' : isAmendment ? 'Amend an existing lease' : 'Create a new lease agreement'}
            </p>
          </div>
          
          {formData.leaseNumber && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Lease Number</p>
              <p className="font-mono font-bold text-gray-900">{formData.leaseNumber}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem) => {
            const Icon = stepItem.icon;
            const isActive = stepItem.number === step;
            const isCompleted = stepItem.number < step;
            
            return (
              <div key={stepItem.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${
                    isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
                
                {stepItem.number < steps.length && (
                  <div className={`flex-1 h-1 mx-4 ${
                    stepItem.number < step ? 'bg-green-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Type & Parties</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Type
                  </label>
                  <select
                    name="leaseType"
                    value={formData.leaseType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {leaseTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-600">
                    {leaseTypes.find(t => t.value === formData.leaseType)?.description}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                Tenant Information
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Tenant *
                </label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tenantId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a tenant</option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName} - {tenant.email}
                    </option>
                  ))}
                </select>
                {errors.tenantId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantId}</p>
                )}
                
                {selectedTenant && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">
                          {selectedTenant.firstName} {selectedTenant.lastName}
                        </p>
                        <p className="text-sm text-blue-700">{selectedTenant.email}</p>
                        <p className="text-sm text-blue-700">{selectedTenant.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Tenants (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={coTenantEmail}
                    onChange={(e) => setCoTenantEmail(e.target.value)}
                    placeholder="Enter co-tenant email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoTenant())}
                  />
                  <Button type="button" onClick={addCoTenant}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.coTenants.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Co-tenants added:</p>
                    {formData.coTenants.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeCoTenant(email)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
                Property Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property *
                  </label>
                  <select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.propertyId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select a property</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.address}
                      </option>
                    ))}
                  </select>
                  {errors.propertyId && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.unitId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    disabled={!formData.propertyId || filteredUnits.length === 0}
                  >
                    <option value="">Select a unit</option>
                    {filteredUnits.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        Unit {unit.number} - {unit.type} ({unit.squareFeet} sq ft)
                      </option>
                    ))}
                  </select>
                  {errors.unitId && (
                    <p className="mt-1 text-sm text-red-600">{errors.unitId}</p>
                  )}
                  
                  {formData.propertyId && filteredUnits.length === 0 && (
                    <p className="mt-2 text-sm text-yellow-600">
                      No units available for this property. Please add units first.
                    </p>
                  )}
                </div>
              </div>
              
              {selectedProperty && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <HomeIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{selectedProperty.title}</p>
                      <p className="text-sm text-green-700">{selectedProperty.address}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full mr-2">
                          {selectedProperty.propertyType}
                        </span>
                        <span className="text-xs text-green-700">
                          ${selectedProperty.rentAmount}/month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                Lease Term
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Start Date *"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                
                <Input
                  label="End Date *"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
              </div>
              
              {formData.startDate && formData.endDate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Lease Term: {calculateLeaseTerm()}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    From {new Date(formData.startDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {' to '}
                    {new Date(formData.endDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Financial Terms */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-500" />
                Rent & Deposits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Monthly Rent *"
                  name="rentAmount"
                  type="number"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  error={errors.rentAmount}
                  required
                  min="0"
                  step="0.01"
                  prefix="$"
                />
                
                <Input
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  error={errors.securityDeposit}
                  min="0"
                  step="0.01"
                  prefix="$"
                />
                
                <Input
                  label="Pet Deposit"
                  name="petDeposit"
                  type="number"
                  value={formData.petDeposit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  prefix="$"
                />
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Total Deposit Required</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${calculateTotalDeposit().toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  This amount will be due before move-in and held until the end of the lease term.
                </p>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Due Day *
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-700">Day</span>
                    <input
                      type="number"
                      name="paymentDueDay"
                      value={formData.paymentDueDay}
                      onChange={handleChange}
                      min="1"
                      max="31"
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.paymentDueDay ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    <span className="ml-2 text-gray-700">of each month</span>
                  </div>
                  {errors.paymentDueDay && (
                    <p className="mt-1 text-sm text-red-600">{errors.paymentDueDay}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-600">
                    Rent is due on this day each month
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Late Fees & Grace Period</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Fee Type
                  </label>
                  <select
                    name="lateFeeType"
                    value={formData.lateFeeType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Percentage of Rent</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <Input
                  label={formData.lateFeeType === 'percentage' ? 'Late Fee Percentage' : 'Late Fee Amount'}
                  name="lateFeeAmount"
                  type="number"
                  value={formData.lateFeeAmount}
                  onChange={handleChange}
                  min="0"
                  step={formData.lateFeeType === 'percentage' ? '0.1' : '1'}
                  suffix={formData.lateFeeType === 'percentage' ? '%' : '$'}
                />
                
                <Input
                  label="Grace Period (days)"
                  name="gracePeriod"
                  type="number"
                  value={formData.gracePeriod}
                  onChange={handleChange}
                  min="0"
                  max="30"
                />
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">
                  Late Fee Calculation:
                </p>
                <p className="text-xs text-yellow-800 mt-1">
                  {formData.lateFeeType === 'percentage' 
                    ? `${formData.lateFeeAmount}% of monthly rent ($${((formData.rentAmount || 0) * (formData.lateFeeAmount || 0) / 100).toFixed(2)})`
                    : `$${formData.lateFeeAmount} fixed fee`
                  } will be applied after {formData.gracePeriod} day grace period.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Rules & Utilities */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilities</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which utilities are included in the rent?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {utilityOptions.map(utility => {
                    const isIncluded = formData.utilitiesIncluded.includes(utility.id);
                    return (
                      <label
                        key={utility.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          isIncluded
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => handleUtilityToggle(utility.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {utility.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Utility Responsibility
                </label>
                <select
                  name="utilityResponsibility"
                  value={formData.utilityResponsibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tenant">Tenant pays all utilities</option>
                  <option value="landlord">Landlord pays all utilities</option>
                  <option value="split">Split responsibility</option>
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.utilityResponsibility === 'tenant' && 'Tenant will be responsible for setting up and paying all utilities.'}
                  {formData.utilityResponsibility === 'landlord' && 'Utilities are included in the rent. Landlord will handle all utility bills.'}
                  {formData.utilityResponsibility === 'split' && 'Some utilities are included, others are the tenant\'s responsibility.'}
                </p>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="petsAllowed"
                    checked={formData.petsAllowed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Pets allowed (additional deposit may apply)
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Smoking allowed (subject to property rules)
                  </span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Occupants
                  </label>
                  <input
                    type="number"
                    name="maxOccupants"
                    value={formData.maxOccupants}
                    onChange={handleChange}
                    min="1"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Maximum number of people allowed to live in the unit
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Terms</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Terms & Conditions
                </label>
                <textarea
                  name="specialTerms"
                  value={formData.specialTerms}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any special terms, conditions, or notes for this lease agreement..."
                />
                <p className="mt-2 text-sm text-gray-600">
                  These terms will be included in the lease agreement document.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Review & Sign */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Ready to Create Lease</h3>
                  <p className="text-blue-800 mt-1">
                    Review all lease details before finalizing the agreement
                  </p>
                </div>
              </div>
            </div>
            
            {/* Lease Summary */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h4 className="font-semibold text-gray-900">Lease Agreement Summary</h4>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Parties */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Parties</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tenant</p>
                      <p className="font-medium">
                        {selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : 'Not selected'}
                      </p>
                      {selectedTenant && (
                        <p className="text-sm text-gray-600">{selectedTenant.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Property</p>
                      <p className="font-medium">
                        {selectedProperty ? selectedProperty.title : 'Not selected'}
                      </p>
                      {selectedProperty && (
                        <p className="text-sm text-gray-600">
                          Unit {units.find(u => u.id === formData.unitId)?.number || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Term */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Lease Term</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{formatDate(formData.startDate)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(formData.endDate)}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Lease Duration</p>
                      <p className="font-medium">{calculateLeaseTerm()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Financial */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Financial Terms</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="text-xl font-bold text-green-600">
                        ${formData.rentAmount ? Number(formData.rentAmount).toLocaleString() : '0'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="font-medium">
                        ${formData.securityDeposit ? Number(formData.securityDeposit).toLocaleString() : '0'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Total Deposit</p>
                      <p className="font-medium">
                        ${calculateTotalDeposit().toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="text-sm text-gray-600">Payment Due</p>
                      <p className="font-medium">
                        Day {formData.paymentDueDay} of each month
                        {formData.gracePeriod > 0 && ` (${formData.gracePeriod} day grace period)`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Utilities & Rules */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Utilities & Rules</h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Included Utilities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.utilitiesIncluded.length > 0 ? (
                          formData.utilitiesIncluded.map(utilId => {
                            const util = utilityOptions.find(u => u.id === utilId);
                            return util ? (
                              <span key={util.id} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {util.label}
                              </span>
                            ) : null;
                          })
                        ) : (
                          <span className="text-sm text-gray-500">No utilities included</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Pets Allowed</p>
                        <p className="font-medium">{formData.petsAllowed ? 'Yes' : 'No'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Smoking Allowed</p>
                        <p className="font-medium">{formData.smokingAllowed ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Special Terms */}
                {formData.specialTerms && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Special Terms</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.specialTerms}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Digital Signature */}
            <div className="border rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Digital Signature</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signed Date
                  </label>
                  <input
                    type="date"
                    name="signedDate"
                    value={formData.signedDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Executed By (Your Name)
                  </label>
                  <input
                    type="text"
                    name="executedBy"
                    value={formData.executedBy}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    By entering your name, you digitally sign this lease agreement.
                  </p>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                    I agree that this constitutes a legally binding lease agreement between the landlord and tenant.
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {step > 1 && (
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
            
            {step < steps.length ? (
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

export default LeaseForm;
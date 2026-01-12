import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Input from '../common/UI/Input';
import Button from '../common/UI/Button';
import PropertyFilters from '../property/PropertyFilters';

const InvitationForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  title = 'Invite Team Members',
  submitText = 'Send Invitations',
  loading = false,
  availableRoles = [],
  availableProperties = [],
  currentUserRole,
}) => {
  const [formData, setFormData] = useState({
    // Single invitation mode
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    permissions: [],
    assignedProperties: [],
    message: '',
    
    // Bulk invitation mode
    emails: [''],
    bulkRole: '',
    bulkProperties: [],
    bulkMessage: '',
    
    // Settings
    invitationMode: 'single', // 'single' or 'bulk'
    sendEmail: true,
    sendSMS: false,
    expiresIn: 7, // days
    allowSelfRegistration: false,
  });
  
  const [errors, setErrors] = useState({});
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState(availableProperties);
  
  // Role options based on current user's permissions
  const defaultRoles = [
    { value: 'property_manager', label: 'Property Manager', description: 'Manage properties, tenants, and maintenance' },
    { value: 'leasing_specialist', label: 'Leasing Specialist', description: 'Handle leasing, showings, and applications' },
    { value: 'maintenance_supervisor', label: 'Maintenance Supervisor', description: 'Oversee maintenance operations and technicians' },
    { value: 'maintenance_tech', label: 'Maintenance Technician', description: 'Perform maintenance and repairs' },
    { value: 'marketing_specialist', label: 'Marketing Specialist', description: 'Manage property marketing and listings' },
    { value: 'financial_controller', label: 'Financial Controller', description: 'Handle finances, payments, and reporting' },
    { value: 'company_admin', label: 'Company Administrator', description: 'Full company access and team management' },
  ];
  
  // Filter roles based on current user's permissions
  const getAvailableRoles = () => {
    if (currentUserRole === 'system_admin') {
      return [
        ...defaultRoles,
        { value: 'system_admin', label: 'System Administrator', description: 'Full system access and configuration' },
      ];
    }
    
    if (currentUserRole === 'company_admin') {
      return defaultRoles.filter(role => role.value !== 'system_admin');
    }
    
    // Property managers can only invite maintenance and leasing roles
    if (currentUserRole === 'property_manager') {
      return defaultRoles.filter(role => 
        ['leasing_specialist', 'maintenance_supervisor', 'maintenance_tech'].includes(role.value)
      );
    }
    
    return [];
  };
  
  const roles = availableRoles.length > 0 ? availableRoles : getAvailableRoles();
  
  // Department options
  const departments = [
    { value: 'operations', label: 'Operations' },
    { value: 'leasing', label: 'Leasing' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'admin', label: 'Administration' },
    { value: 'owner', label: 'Ownership' },
  ];
  
  // Permission options based on role
  const getPermissionOptions = (role) => {
    const basePermissions = [
      'view_properties',
      'view_tenants',
      'view_financials',
    ];
    
    const roleBasedPermissions = {
      property_manager: [
        ...basePermissions,
        'manage_properties',
        'manage_tenants',
        'manage_maintenance',
        'invite_users',
        'view_reports',
      ],
      leasing_specialist: [
        ...basePermissions,
        'manage_applications',
        'manage_showings',
        'generate_leases',
      ],
      maintenance_supervisor: [
        ...basePermissions,
        'manage_workorders',
        'assign_tasks',
        'manage_vendors',
        'view_maintenance_reports',
      ],
      maintenance_tech: [
        'view_assigned_tasks',
        'update_task_status',
        'log_work_hours',
      ],
      marketing_specialist: [
        ...basePermissions,
        'manage_listings',
        'manage_marketing',
        'view_analytics',
      ],
      financial_controller: [
        ...basePermissions,
        'manage_payments',
        'manage_invoices',
        'view_financial_reports',
        'export_financial_data',
      ],
      company_admin: [
        'all_company_permissions',
      ],
      system_admin: [
        'all_system_permissions',
      ],
    };
    
    return roleBasedPermissions[role] || basePermissions;
  };
  
  // Expiration options
  const expirationOptions = [
    { value: 1, label: '1 day' },
    { value: 3, label: '3 days' },
    { value: 7, label: '1 week' },
    { value: 14, label: '2 weeks' },
    { value: 30, label: '1 month' },
    { value: 60, label: '2 months' },
    { value: 90, label: '3 months' },
  ];
  
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);
  
  useEffect(() => {
    // Update permissions when role changes
    if (formData.role) {
      const permissions = getPermissionOptions(formData.role);
      setFormData(prev => ({
        ...prev,
        permissions: permissions.includes('all_company_permissions') || permissions.includes('all_system_permissions')
          ? permissions
          : [...permissions],
      }));
    }
  }, [formData.role]);
  
  useEffect(() => {
    // Filter properties based on search query
    if (searchQuery.trim() === '') {
      setFilteredProperties(availableProperties);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProperties(
        availableProperties.filter(property =>
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, availableProperties]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleArrayChange = (name, value) => {
    setFormData(prev => {
      const currentArray = prev[name] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };
  
  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };
  
  const addEmailField = () => {
    setFormData(prev => ({ ...prev, emails: [...prev.emails, ''] }));
  };
  
  const removeEmailField = (index) => {
    if (formData.emails.length > 1) {
      const newEmails = formData.emails.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, emails: newEmails }));
    }
  };
  
  const handlePropertySelect = (property) => {
    if (!formData.assignedProperties.includes(property.id)) {
      setFormData(prev => ({
        ...prev,
        assignedProperties: [...prev.assignedProperties, property.id],
      }));
    }
  };
  
  const handlePropertyRemove = (propertyId) => {
    setFormData(prev => ({
      ...prev,
      assignedProperties: prev.assignedProperties.filter(id => id !== propertyId),
    }));
  };
  
  const handleBulkPropertySelect = (property) => {
    if (!formData.bulkProperties.includes(property.id)) {
      setFormData(prev => ({
        ...prev,
        bulkProperties: [...prev.bulkProperties, property.id],
      }));
    }
  };
  
  const handleBulkPropertyRemove = (propertyId) => {
    setFormData(prev => ({
      ...prev,
      bulkProperties: prev.bulkProperties.filter(id => id !== propertyId),
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.invitationMode === 'single') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.role) {
        newErrors.role = 'Role is required';
      }
    } else {
      // Validate bulk emails
      const validEmails = formData.emails.filter(email => email.trim() && /\S+@\S+\.\S+/.test(email));
      if (validEmails.length === 0) {
        newErrors.emails = 'At least one valid email is required';
      }
      
      if (!formData.bulkRole) {
        newErrors.bulkRole = 'Role is required for all invitations';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const invitationData = {
      mode: formData.invitationMode,
      sendEmail: formData.sendEmail,
      sendSMS: formData.sendSMS,
      expiresInDays: formData.expiresIn,
      allowSelfRegistration: formData.allowSelfRegistration,
    };
    
    if (formData.invitationMode === 'single') {
      invitationData.singleInvitation = {
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
        department: formData.department,
        permissions: formData.permissions,
        assignedProperties: formData.assignedProperties,
        message: formData.message.trim(),
      };
    } else {
      invitationData.bulkInvitations = {
        emails: formData.emails.filter(email => email.trim()).map(email => email.trim()),
        role: formData.bulkRole,
        department: formData.department,
        permissions: formData.permissions,
        assignedProperties: formData.bulkProperties,
        message: formData.bulkMessage.trim(),
      };
    }
    
    if (onSubmit) {
      onSubmit(invitationData);
    }
  };
  
  const getSelectedProperties = () => {
    const mode = formData.invitationMode;
    const propertyIds = mode === 'single' ? formData.assignedProperties : formData.bulkProperties;
    
    return availableProperties.filter(property => 
      propertyIds.includes(property.id)
    );
  };
  
  const selectedPropertiesList = getSelectedProperties();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">
          Invite team members to collaborate on property management
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Invitation Mode Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Invitation Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, invitationMode: 'single' }))}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                formData.invitationMode === 'single'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <UserIcon className={`h-5 w-5 mr-2 ${
                  formData.invitationMode === 'single' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">Single Invitation</span>
              </div>
              <p className="text-sm text-gray-600">
                Invite one person with customized settings
              </p>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, invitationMode: 'bulk' }))}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                formData.invitationMode === 'bulk'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <UserGroupIcon className={`h-5 w-5 mr-2 ${
                  formData.invitationMode === 'bulk' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">Bulk Invitation</span>
              </div>
              <p className="text-sm text-gray-600">
                Invite multiple people with same settings
              </p>
            </button>
          </div>
        </div>
        
        {/* Single Invitation Form */}
        {formData.invitationMode === 'single' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="team.member@example.com"
                required
                icon={EnvelopeIcon}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
                
                {formData.role && (
                  <p className="mt-2 text-sm text-gray-600">
                    {roles.find(r => r.value === formData.role)?.description}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Bulk Invitation Form */}
        {formData.invitationMode === 'bulk' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email Addresses *
              </label>
              <div className="space-y-3">
                {formData.emails.map((email, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="team.member@example.com"
                      className="flex-1"
                      error={errors.emails && index === 0 ? errors.emails : ''}
                    />
                    {formData.emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addEmailField}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add another email
                </button>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> You can paste a list of emails separated by commas, spaces, or line breaks.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const emails = prompt('Paste email addresses (separated by commas, spaces, or line breaks):');
                      if (emails) {
                        const emailList = emails.split(/[,\s\n]+/).filter(e => e.trim() && /\S+@\S+\.\S+/.test(e.trim()));
                        if (emailList.length > 0) {
                          setFormData(prev => ({ ...prev, emails: emailList }));
                        }
                      }
                    }}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Paste email list
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role for All Invitations *
                </label>
                <select
                  name="bulkRole"
                  value={formData.bulkRole}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bulkRole ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.bulkRole && (
                  <p className="mt-1 text-sm text-red-600">{errors.bulkRole}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department for All
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Assigned Properties */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
            Assign Properties (Optional)
          </h3>
          <p className="text-gray-600 mb-6">
            Assign specific properties that this team member can access and manage.
            Leave empty to grant access to all properties.
          </p>
          
          {/* Property Search and Selection */}
          <div className="mb-6">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties by name or address..."
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            
            {/* Selected Properties */}
            {selectedPropertiesList.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Properties ({selectedPropertiesList.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPropertiesList.map(property => (
                    <span
                      key={property.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {property.title}
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.invitationMode === 'single') {
                            handlePropertyRemove(property.id);
                          } else {
                            handleBulkPropertyRemove(property.id);
                          }
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available Properties List */}
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {filteredProperties.length === 0 ? (
                <div className="p-8 text-center">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No properties available</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProperties.map(property => {
                    const isSelected = formData.invitationMode === 'single'
                      ? formData.assignedProperties.includes(property.id)
                      : formData.bulkProperties.includes(property.id);
                    
                    return (
                      <div
                        key={property.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          if (formData.invitationMode === 'single') {
                            if (isSelected) {
                              handlePropertyRemove(property.id);
                            } else {
                              handlePropertySelect(property);
                            }
                          } else {
                            if (isSelected) {
                              handleBulkPropertyRemove(property.id);
                            } else {
                              handleBulkPropertySelect(property);
                            }
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{property.title}</h4>
                            <p className="text-sm text-gray-600">{property.address}</p>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                property.status === 'occupied'
                                  ? 'bg-green-100 text-green-800'
                                  : property.status === 'vacant'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {property.status}
                              </span>
                              <span className="ml-3 text-sm text-gray-600">
                                ${property.rentAmount}/month
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="assignAllProperties"
              checked={
                formData.invitationMode === 'single'
                  ? formData.assignedProperties.length === 0
                  : formData.bulkProperties.length === 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  if (formData.invitationMode === 'single') {
                    setFormData(prev => ({ ...prev, assignedProperties: [] }));
                  } else {
                    setFormData(prev => ({ ...prev, bulkProperties: [] }));
                  }
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="assignAllProperties" className="ml-2 text-sm text-gray-700">
              Grant access to all properties (recommended for managers)
            </label>
          </div>
        </div>
        
        {/* Permissions Preview */}
        {formData.role && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Based on the selected role, this team member will have the following permissions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Message */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Message (Optional)</h3>
          <textarea
            name={formData.invitationMode === 'single' ? 'message' : 'bulkMessage'}
            value={formData.invitationMode === 'single' ? formData.message : formData.bulkMessage}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a personal message to include in the invitation email..."
          />
          <p className="mt-2 text-sm text-gray-500">
            This message will be included in the invitation email sent to the team member(s).
          </p>
        </div>
        
        {/* Invitation Settings */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Expires In
              </label>
              <select
                name="expiresIn"
                value={formData.expiresIn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {expirationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Notification Methods
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendEmail"
                    checked={formData.sendEmail}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send email invitation</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendSMS"
                    checked={formData.sendSMS}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send SMS notification (if phone number is available)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowSelfRegistration"
                    checked={formData.allowSelfRegistration}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow self-registration with invitation code</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary and Actions */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Invitation Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • {formData.invitationMode === 'single' ? '1 person' : `${formData.emails.filter(e => e.trim()).length} people`} will be invited
              </p>
              <p>
                • Role: {formData.invitationMode === 'single' 
                  ? roles.find(r => r.value === formData.role)?.label || 'Not selected'
                  : roles.find(r => r.value === formData.bulkRole)?.label || 'Not selected'
                }
              </p>
              <p>
                • Access to {formData.invitationMode === 'single'
                  ? formData.assignedProperties.length === 0 ? 'all properties' : `${formData.assignedProperties.length} specific properties`
                  : formData.bulkProperties.length === 0 ? 'all properties' : `${formData.bulkProperties.length} specific properties`
                }
              </p>
              <p>
                • Invitation expires in {expirationOptions.find(o => o.value === formData.expiresIn)?.label.toLowerCase()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div>
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
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Save as draft functionality
                  alert('Draft saved (this would save to backend in production)');
                }}
                disabled={loading}
              >
                Save as Draft
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {submitText}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvitationForm;
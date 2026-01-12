import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Wrench, AlertTriangle, Calendar, User,
  MapPin, DollarSign, Camera, Paperclip,
  X, Upload, Clock, CheckCircle
} from 'lucide-react';

const workOrderSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().required('Priority is required'),
  category: yup.string().required('Category is required'),
  propertyId: yup.string().required('Property is required'),
  unitId: yup.string().required('Unit is required'),
  tenantId: yup.string().required('Tenant is required'),
  scheduledDate: yup.date().nullable(),
  estimatedCost: yup.number().positive().nullable(),
  estimatedHours: yup.number().positive().nullable(),
  assignedToId: yup.string().nullable(),
  vendorId: yup.string().nullable(),
  internalNotes: yup.string(),
  requiresApproval: yup.boolean(),
  approvalAmount: yup.number().when('requiresApproval', {
    is: true,
    then: yup.number().positive().required('Approval amount is required'),
    otherwise: yup.number().nullable()
  })
});

const WorkOrderForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  properties = [],
  tenants = [],
  vendors = [],
  staff = []
}) => {
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(initialData.requiresApproval || false);
  const [selectedProperty, setSelectedProperty] = useState(initialData.propertyId || '');
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(workOrderSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      priority: initialData.priority || 'medium',
      category: initialData.category || '',
      propertyId: initialData.propertyId || '',
      unitId: initialData.unitId || '',
      tenantId: initialData.tenantId || '',
      scheduledDate: initialData.scheduledDate || null,
      estimatedCost: initialData.estimatedCost || null,
      estimatedHours: initialData.estimatedHours || null,
      assignedToId: initialData.assignedToId || '',
      vendorId: initialData.vendorId || '',
      internalNotes: initialData.internalNotes || '',
      requiresApproval: initialData.requiresApproval || false,
      approvalAmount: initialData.approvalAmount || null
    }
  });

  const categories = [
    'Plumbing', 'Electrical', 'HVAC', 'Appliances', 
    'Carpentry', 'Painting', 'Cleaning', 'Landscaping',
    'Pest Control', 'Security', 'Windows/Doors', 'Flooring',
    'Roofing', 'General Maintenance', 'Emergency', 'Other'
  ];

  const priorities = [
    { value: 'emergency', label: 'Emergency', color: 'red', description: 'Immediate attention required' },
    { value: 'high', label: 'High', color: 'orange', description: 'Resolve within 24 hours' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Resolve within 3 days' },
    { value: 'low', label: 'Low', color: 'green', description: 'Resolve within 7 days' }
  ];

  // Filter units and tenants based on selected property
  useEffect(() => {
    if (selectedProperty) {
      const property = properties.find(p => p.id === selectedProperty);
      if (property) {
        setFilteredUnits(property.units || []);
        setFilteredTenants(tenants.filter(t => t.propertyId === selectedProperty));
      }
    } else {
      setFilteredUnits([]);
      setFilteredTenants([]);
    }
  }, [selectedProperty, properties, tenants]);

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'photos') {
      setPhotos(prev => [...prev, ...files]);
    } else {
      setDocuments(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index, type) => {
    if (type === 'photos') {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Append files
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      documents.forEach(doc => {
        formData.append('documents', doc);
      });

      // Add metadata
      formData.append('createdBy', 'current-user-id'); // Replace with actual user ID
      formData.append('createdAt', new Date().toISOString());
      formData.append('status', 'pending');

      await onSubmit(formData);
      reset();
      setPhotos([]);
      setDocuments([]);
    } catch (error) {
      console.error('Work order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Wrench className="w-6 h-6" />
          <span>{initialData.id ? 'Edit Work Order' : 'Create New Work Order'}</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Fill in all required details to create a maintenance work order
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Kitchen sink leak repair"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the issue in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Priority</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {priorities.map(priority => (
              <label
                key={priority.value}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  watch('priority') === priority.value
                    ? `border-${priority.color}-500 bg-${priority.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={priority.value}
                  {...register('priority')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${priority.color}-500`}></div>
                  <div>
                    <span className="font-medium text-gray-900">{priority.label}</span>
                    <p className="text-sm text-gray-600 mt-1">{priority.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        {/* Property & Tenant Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Location & Tenant</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Property *
              </label>
              <select
                {...register('propertyId')}
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                  setValue('propertyId', e.target.value);
                  setValue('unitId', '');
                  setValue('tenantId', '');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.address}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                {...register('unitId')}
                disabled={!selectedProperty}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="">Select unit</option>
                {filteredUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.number} - {unit.type}
                  </option>
                ))}
              </select>
              {errors.unitId && (
                <p className="mt-1 text-sm text-red-600">{errors.unitId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Tenant *
              </label>
              <select
                {...register('tenantId')}
                disabled={!selectedProperty}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="">Select tenant</option>
                {filteredTenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} - {tenant.phone}
                  </option>
                ))}
              </select>
              {errors.tenantId && (
                <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scheduling & Assignment */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Scheduling & Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Scheduled Date
              </label>
              <input
                type="datetime-local"
                {...register('scheduledDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Estimated Hours
              </label>
              <input
                type="number"
                {...register('estimatedHours')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2"
                step="0.5"
                min="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Estimated Cost
              </label>
              <input
                type="number"
                {...register('estimatedCost')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 150"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Staff
              </label>
              <select
                {...register('assignedToId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select staff member</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Vendor
              </label>
              <select
                {...register('vendorId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} - {vendor.service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Approval Requirements */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Approval Requirements</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => {
                  setRequiresApproval(e.target.checked);
                  setValue('requiresApproval', e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Requires Approval</span>
            </label>
          </div>
          {requiresApproval && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Amount *
              </label>
              <input
                type="number"
                {...register('approvalAmount')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount requiring approval"
                step="0.01"
                min="0"
              />
              {errors.approvalAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.approvalAmount.message}</p>
              )}
            </div>
          )}
        </div>

        {/* File Uploads */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
          
          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Camera className="inline w-4 h-4 mr-1" />
              Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload Photos
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    JPG, PNG up to 10MB each
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'photos')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"][accept="image/*"]').click()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Photos
                  </button>
                </label>
              </div>
            </div>
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'photos')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Paperclip className="inline w-4 h-4 mr-1" />
              Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload Documents
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    PDF, DOC, DOCX up to 25MB each
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'documents')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"][accept=".pdf,.doc,.docx"]').click()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Documents
                  </button>
                </label>
              </div>
            </div>
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'documents')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
          <textarea
            {...register('internalNotes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any internal notes or instructions..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{initialData.id ? 'Update Work Order' : 'Create Work Order'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkOrderForm;
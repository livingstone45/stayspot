import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User, Wrench, Calendar, Clock, DollarSign,
  AlertCircle, CheckCircle, X, Search,
  Building, MapPin, Phone, Mail,
  ChevronDown, Filter, Users
} from 'lucide-react';

const assignmentSchema = yup.object({
  workOrderId: yup.string().required('Work order is required'),
  assigneeId: yup.string().required('Assignee is required'),
  assigneeType: yup.string().required('Assignee type is required'),
  priority: yup.string().required('Priority is required'),
  scheduledDate: yup.date().required('Scheduled date is required'),
  scheduledTime: yup.string().required('Scheduled time is required'),
  estimatedHours: yup.number().positive().required('Estimated hours are required'),
  notes: yup.string(),
  notifyAssignee: yup.boolean(),
  notifyTenant: yup.boolean(),
  requireConfirmation: yup.boolean(),
  budget: yup.number().positive().nullable()
});

const AssignmentForm = ({ 
  workOrders = [],
  staffMembers = [],
  vendors = [],
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [assigneeType, setAssigneeType] = useState(initialData.assigneeType || 'staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [filteredAssignees, setFilteredAssignees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(assignmentSchema),
    defaultValues: {
      workOrderId: initialData.workOrderId || '',
      assigneeId: initialData.assigneeId || '',
      assigneeType: initialData.assigneeType || 'staff',
      priority: initialData.priority || 'medium',
      scheduledDate: initialData.scheduledDate || '',
      scheduledTime: initialData.scheduledTime || '09:00',
      estimatedHours: initialData.estimatedHours || 2,
      notes: initialData.notes || '',
      notifyAssignee: initialData.notifyAssignee !== undefined ? initialData.notifyAssignee : true,
      notifyTenant: initialData.notifyTenant !== undefined ? initialData.notifyTenant : true,
      requireConfirmation: initialData.requireConfirmation !== undefined ? initialData.requireConfirmation : true,
      budget: initialData.budget || null
    }
  });

  // Filter assignees based on type and search query
  useEffect(() => {
    let assignees = assigneeType === 'staff' ? staffMembers : vendors;
    
    if (searchQuery) {
      assignees = assignees.filter(assignee =>
        assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assignee.role && assignee.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (assignee.specialization && assignee.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredAssignees(assignees);
  }, [assigneeType, searchQuery, staffMembers, vendors]);

  // Update selected work order when workOrderId changes
  useEffect(() => {
    const workOrderId = watch('workOrderId');
    if (workOrderId) {
      const workOrder = workOrders.find(wo => wo.id === workOrderId);
      setSelectedWorkOrder(workOrder);
    } else {
      setSelectedWorkOrder(null);
    }
  }, [watch('workOrderId'), workOrders]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare assignment data
      const assignmentData = {
        ...data,
        assignedAt: new Date().toISOString(),
        assignedBy: 'current-user-id', // Replace with actual user ID
        status: 'assigned',
        workOrderDetails: selectedWorkOrder
      };

      await onSubmit(assignmentData);
      reset();
      setSelectedWorkOrder(null);
    } catch (error) {
      console.error('Assignment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorities = [
    { value: 'emergency', label: 'Emergency', color: 'red', description: 'Immediate response required' },
    { value: 'high', label: 'High', color: 'orange', description: 'Within 4 hours' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Within 24 hours' },
    { value: 'low', label: 'Low', color: 'green', description: 'Within 3 days' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Users className="w-6 h-6" />
          <span>Assign Work Order</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Assign maintenance work to staff members or vendors
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Work Order Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Work Order Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Work Order *
            </label>
            <div className="relative">
              <select
                {...register('workOrderId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select a work order...</option>
                {workOrders.map(workOrder => (
                  <option key={workOrder.id} value={workOrder.id}>
                    #{workOrder.id} - {workOrder.title} ({workOrder.propertyName})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.workOrderId && (
              <p className="mt-1 text-sm text-red-600">{errors.workOrderId.message}</p>
            )}
          </div>

          {/* Work Order Details Preview */}
          {selectedWorkOrder && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-900">{selectedWorkOrder.title}</h4>
                  <p className="text-sm text-blue-700 mt-1">{selectedWorkOrder.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedWorkOrder.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                      selectedWorkOrder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      selectedWorkOrder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedWorkOrder.priority} priority
                    </span>
                    <span className="text-xs text-blue-600">{selectedWorkOrder.category}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{selectedWorkOrder.propertyName} - {selectedWorkOrder.unit}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-700">
                    <User className="w-4 h-4 mr-2" />
                    <span>{selectedWorkOrder.tenantName}</span>
                  </div>
                  {selectedWorkOrder.estimatedCost && (
                    <div className="flex items-center text-sm text-blue-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Est. Cost: ${selectedWorkOrder.estimatedCost}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assignee Selection */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Assignee</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="staff"
                  checked={assigneeType === 'staff'}
                  onChange={(e) => {
                    setAssigneeType(e.target.value);
                    setValue('assigneeType', e.target.value);
                    setValue('assigneeId', '');
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Staff</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="vendor"
                  checked={assigneeType === 'vendor'}
                  onChange={(e) => {
                    setAssigneeType(e.target.value);
                    setValue('assigneeType', e.target.value);
                    setValue('assigneeId', '');
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Vendor</span>
              </label>
            </div>
          </div>

          <input type="hidden" {...register('assigneeType')} />

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${assigneeType === 'staff' ? 'staff members' : 'vendors'}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Assignee Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
            {filteredAssignees.map(assignee => (
              <label
                key={assignee.id}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  watch('assigneeId') === assignee.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={assignee.id}
                  {...register('assigneeId')}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{assignee.name}</p>
                        <p className="text-sm text-gray-600">{assignee.role || assignee.specialization}</p>
                      </div>
                      {assignee.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">{assignee.rating.toFixed(1)}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-2" />
                        <span>{assignee.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-3 h-3 mr-2" />
                        <span>{assignee.email}</span>
                      </div>
                      {assignee.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-2" />
                          <span>{assignee.location}</span>
                        </div>
                      )}
                    </div>
                    {assignee.availability && (
                      <div className="mt-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          assignee.availability === 'available' ? 'bg-green-100 text-green-800' :
                          assignee.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assignee.availability}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.assigneeId && (
            <p className="mt-1 text-sm text-red-600">{errors.assigneeId.message}</p>
          )}
          {filteredAssignees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto text-gray-300" />
              <p className="mt-2">No {assigneeType === 'staff' ? 'staff members' : 'vendors'} found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Scheduling & Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Scheduling & Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Scheduled Date *
              </label>
              <input
                type="date"
                {...register('scheduledDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Scheduled Time *
              </label>
              <input
                type="time"
                {...register('scheduledTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.scheduledTime && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledTime.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Estimated Hours *
              </label>
              <input
                type="number"
                {...register('estimatedHours')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.5"
                min="0.5"
                max="24"
              />
              {errors.estimatedHours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>
              )}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full bg-${priority.color}-500 mx-auto mb-2`}></div>
                    <span className="font-medium text-gray-900 block">{priority.label}</span>
                    <p className="text-xs text-gray-600 mt-1">{priority.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Budget (Optional)
            </label>
            <input
              type="number"
              {...register('budget')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter budget amount"
              step="0.01"
              min="0"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any specific instructions or notes for the assignee..."
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                {...register('notifyAssignee')}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Notify Assignee</span>
                <p className="text-sm text-gray-600 mt-1">
                  Send email and SMS notification to the assigned person
                </p>
              </div>
            </label>
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                {...register('notifyTenant')}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Notify Tenant</span>
                <p className="text-sm text-gray-600 mt-1">
                  Inform tenant about the scheduled maintenance
                </p>
              </div>
            </label>
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                {...register('requireConfirmation')}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Require Confirmation</span>
                <p className="text-sm text-gray-600 mt-1">
                  Assignee must confirm acceptance of the assignment
                </p>
              </div>
            </label>
          </div>
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
                <span>Create Assignment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Star component for ratings
const Star = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default AssignmentForm;
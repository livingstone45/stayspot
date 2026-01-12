import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Calendar, Clock, Tag, User, Building,
  AlertCircle, Paperclip, Plus, X,
  CheckCircle, DollarSign, MessageSquare,
  ChevronDown, Search, MapPin, Bell
} from 'lucide-react';

const taskSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
  category: yup.string().required('Category is required'),
  dueDate: yup.date().required('Due date is required'),
  dueTime: yup.string(),
  estimatedHours: yup.number().positive().nullable(),
  assigneeId: yup.string().nullable(),
  propertyId: yup.string().nullable(),
  unitId: yup.string().nullable(),
  tenantId: yup.string().nullable(),
  budget: yup.number().positive().nullable(),
  tags: yup.array().of(yup.string()),
  subtasks: yup.array().of(
    yup.object({
      title: yup.string().required('Subtask title is required'),
      completed: yup.boolean()
    })
  ),
  notes: yup.string(),
  sendNotifications: yup.boolean(),
  recurring: yup.object({
    enabled: yup.boolean(),
    frequency: yup.string(),
    interval: yup.number(),
    endDate: yup.date()
  })
});

const TaskForm = ({ 
  initialData = {},
  assignees = [],
  properties = [],
  tenants = [],
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [attachments, setAttachments] = useState([]);
  const [subtasks, setSubtasks] = useState(initialData.subtasks || []);
  const [tags, setTags] = useState(initialData.tags || []);
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(initialData.propertyId || '');
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [recurringEnabled, setRecurringEnabled] = useState(initialData.recurring?.enabled || false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      priority: initialData.priority || 'medium',
      status: initialData.status || 'pending',
      category: initialData.category || '',
      dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
      dueTime: initialData.dueTime || '09:00',
      estimatedHours: initialData.estimatedHours || null,
      assigneeId: initialData.assigneeId || '',
      propertyId: initialData.propertyId || '',
      unitId: initialData.unitId || '',
      tenantId: initialData.tenantId || '',
      budget: initialData.budget || null,
      tags: initialData.tags || [],
      subtasks: initialData.subtasks || [],
      notes: initialData.notes || '',
      sendNotifications: initialData.sendNotifications !== undefined ? initialData.sendNotifications : true,
      recurring: initialData.recurring || {
        enabled: false,
        frequency: 'weekly',
        interval: 1,
        endDate: null
      }
    }
  });

  const categories = [
    'Maintenance', 'Inspection', 'Cleaning', 'Administrative',
    'Marketing', 'Financial', 'Legal', 'Customer Service',
    'Renovation', 'Emergency', 'Preventive', 'Other'
  ];

  const priorities = [
    { value: 'critical', label: 'Critical', color: 'red', description: 'Immediate attention required' },
    { value: 'high', label: 'High', color: 'orange', description: 'Complete within 24 hours' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Complete within 3 days' },
    { value: 'low', label: 'Low', color: 'green', description: 'Complete within 7 days' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' }
  ];

  const recurringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj = {
        title: newSubtask.trim(),
        completed: false
      };
      const updatedSubtasks = [...subtasks, newSubtaskObj];
      setSubtasks(updatedSubtasks);
      setValue('subtasks', updatedSubtasks);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
    setValue('subtasks', updatedSubtasks);
  };

  const toggleSubtaskCompletion = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
    setValue('subtasks', updatedSubtasks);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        if (key === 'tags' || key === 'subtasks') {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'recurring') {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Append attachments
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      // Add metadata
      formData.append('createdBy', 'current-user-id'); // Replace with actual user ID
      formData.append('createdAt', new Date().toISOString());

      await onSubmit(formData);
      reset();
      setAttachments([]);
      setSubtasks([]);
      setTags([]);
    } catch (error) {
      console.error('Task submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update task details' : 'Fill in all required details to create a new task'}
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
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the task in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Priority & Status */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Priority & Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority *
              </label>
              <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {statuses.map(status => (
                  <label
                    key={status.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      watch('status') === status.value
                        ? `border-${status.color}-500 bg-${status.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={status.value}
                      {...register('status')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-3 h-3 rounded-full bg-${status.color}-500 mx-auto mb-2`}></div>
                      <span className="font-medium text-gray-900 block">{status.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Scheduling</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Due Time
              </label>
              <input
                type="time"
                {...register('dueTime')}
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
          </div>

          {/* Recurring Task */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={recurringEnabled}
                onChange={(e) => {
                  setRecurringEnabled(e.target.checked);
                  setValue('recurring.enabled', e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Recurring Task</span>
            </label>
            
            {recurringEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <div className="relative">
                    <select
                      {...register('recurring.frequency')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      {recurringOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval
                  </label>
                  <input
                    type="number"
                    {...register('recurring.interval')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('recurring.endDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment & Location */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Assignment & Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Assign To
              </label>
              <div className="relative">
                <select
                  {...register('assigneeId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name} - {assignee.role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Budget (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  {...register('budget')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Property
              </label>
              <div className="relative">
                <select
                  {...register('propertyId')}
                  onChange={(e) => {
                    setSelectedProperty(e.target.value);
                    setValue('propertyId', e.target.value);
                    setValue('unitId', '');
                    setValue('tenantId', '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <div className="relative">
                <select
                  {...register('unitId')}
                  disabled={!selectedProperty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                >
                  <option value="">Select unit</option>
                  {filteredUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.number} - {unit.type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Tenant
              </label>
              <div className="relative">
                <select
                  {...register('tenantId')}
                  disabled={!selectedProperty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                >
                  <option value="">Select tenant</option>
                  {filteredTenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              Add Tags
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subtasks */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Subtasks</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Subtasks
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subtask and press Enter"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {subtasks.length > 0 && (
              <div className="mt-4 space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtaskCompletion(index)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload Files
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  PDF, JPG, PNG, DOC up to 25MB each
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Select Files
                </button>
              </label>
            </div>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
              {attachments.map((file, index) => (
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
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
          
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes or instructions..."
          />
        </div>

        {/* Notifications */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          
          <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              {...register('sendNotifications')}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Send Notifications</span>
              <p className="text-sm text-gray-600 mt-1">
                Notify assignee and related parties about this task
              </p>
            </div>
          </label>
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
                <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
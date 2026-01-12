import React, { useState } from 'react';
import { X, Wrench, AlertCircle } from 'lucide-react';

const WorkOrderForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property: '',
    unit: '',
    priority: 'medium',
    category: 'plumbing',
    assignedTo: '',
    dueDate: '',
    estimatedCost: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.property.trim()) newErrors.property = 'Property is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      property: '',
      unit: '',
      priority: 'medium',
      category: 'plumbing',
      assignedTo: '',
      dueDate: '',
      estimatedCost: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 px-8 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl"></div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Work Order</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-96 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Work order title"
              className={`w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-all ${
                errors.title ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description"
              rows="3"
              className={`w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-all resize-none ${
                errors.description ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
          </div>

          {/* Property & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Property *</label>
              <input
                type="text"
                name="property"
                value={formData.property}
                onChange={handleChange}
                placeholder="Property name"
                className={`w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-all ${
                  errors.property ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                }`}
              />
              {errors.property && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.property}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Unit number"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="painting">Painting</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date & Estimated Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none transition-all ${
                  errors.dueDate ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Estimated Cost</label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                placeholder="$0.00"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Assign To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Vendor or staff name"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderForm;

/**
 * Task Validation Schemas
 * Joi-based schemas for task and maintenance validation
 */

const Joi = require('joi');

/**
 * Task Creation Schema
 * Validates task creation request data
 */
const taskCreateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(10)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 5000 characters',
      'any.required': 'Description is required'
    }),
  type: Joi.string()
    .valid('maintenance', 'inspection', 'leasing', 'administrative', 'financial', 'marketing', 'legal', 'emergency', 'routine', 'follow_up')
    .required()
    .messages({
      'any.required': 'Task type is required'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent', 'emergency')
    .default('medium')
    .optional(),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'overdue', 'scheduled', 'waiting_approval')
    .default('pending')
    .optional(),
  propertyId: Joi.string()
    .optional(),
  assignedTo: Joi.string()
    .optional()
    .messages({
      'string.guid': 'Invalid assignee ID'
    }),
  createdBy: Joi.string()
    .optional(),
  startDate: Joi.date()
    .optional(),
  dueDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Due date is required'
    }),
  completionDate: Joi.date()
    .optional(),
  estimatedHours: Joi.number()
    .positive()
    .optional(),
  actualHours: Joi.number()
    .positive()
    .optional(),
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
  attachments: Joi.array()
    .items(Joi.string().uri())
    .optional(),
  customFields: Joi.object().optional()
});

/**
 * Task Update Schema
 * Validates task update request data
 */
const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .optional(),
  description: Joi.string()
    .min(10)
    .max(5000)
    .optional(),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'overdue', 'scheduled', 'waiting_approval')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent', 'emergency')
    .optional(),
  assignedTo: Joi.string()
    .optional(),
  dueDate: Joi.date()
    .optional(),
  completionDate: Joi.date()
    .optional(),
  estimatedHours: Joi.number()
    .positive()
    .optional(),
  actualHours: Joi.number()
    .positive()
    .optional(),
  tags: Joi.array()
    .items(Joi.string())
    .optional(),
  attachments: Joi.array()
    .items(Joi.string().uri())
    .optional(),
  customFields: Joi.object().optional()
}).min(1);

/**
 * Task Query Filter Schema
 * Validates task query filters
 */
const taskQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional(),
  search: Joi.string()
    .max(255)
    .optional(),
  type: Joi.string().optional(),
  status: Joi.string().optional(),
  priority: Joi.string().optional(),
  assignedTo: Joi.string().optional(),
  propertyId: Joi.string().optional(),
  createdBy: Joi.string().optional(),
  sortBy: Joi.string()
    .default('dueDate')
    .optional(),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  overdue: Joi.boolean().optional(),
  dueSoon: Joi.boolean().optional()
});

/**
 * Maintenance Request Schema
 * Validates maintenance request submission
 */
const maintenanceRequestSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'any.required': 'Description is required'
    }),
  category: Joi.string()
    .valid('plumbing', 'electrical', 'hvac', 'appliances', 'flooring', 'painting', 'carpentry', 'roofing', 'landscaping', 'cleaning', 'pest_control', 'security', 'general')
    .required()
    .messages({
      'any.required': 'Category is required'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent', 'emergency')
    .default('medium')
    .optional(),
  requestType: Joi.string()
    .valid('repair', 'replacement', 'installation', 'inspection', 'preventive', 'emergency', 'cosmetic', 'safety')
    .default('repair')
    .optional(),
  preferredDate: Joi.date().optional(),
  notes: Joi.string()
    .max(1000)
    .optional(),
  requestedBy: Joi.string().optional(),
  photos: Joi.array()
    .items(Joi.string().uri())
    .optional()
});

/**
 * Work Order Creation Schema
 * Validates work order creation
 */
const workOrderCreateSchema = Joi.object({
  taskId: Joi.string()
    .optional(),
  maintenanceRequestId: Joi.string()
    .optional(),
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  vendorId: Joi.string()
    .optional(),
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'any.required': 'Description is required'
    }),
  category: Joi.string()
    .valid('plumbing', 'electrical', 'hvac', 'appliances', 'flooring', 'painting', 'carpentry', 'roofing', 'landscaping', 'cleaning', 'pest_control', 'security', 'general')
    .required()
    .messages({
      'any.required': 'Category is required'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent', 'emergency')
    .default('medium')
    .optional(),
  status: Joi.string()
    .valid('created', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold', 'waiting_parts', 'quality_check')
    .default('created')
    .optional(),
  estimatedCost: Joi.number()
    .positive()
    .optional(),
  actualCost: Joi.number()
    .positive()
    .optional(),
  estimatedHours: Joi.number()
    .positive()
    .optional(),
  actualHours: Joi.number()
    .positive()
    .optional(),
  scheduledDate: Joi.date().optional(),
  completionDate: Joi.date().optional(),
  notes: Joi.string()
    .max(2000)
    .optional(),
  photos: Joi.array()
    .items(Joi.string().uri())
    .optional()
});

/**
 * Work Order Update Schema
 * Validates work order updates
 */
const workOrderUpdateSchema = Joi.object({
  status: Joi.string()
    .valid('created', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold', 'waiting_parts', 'quality_check')
    .optional(),
  vendorId: Joi.string()
    .optional(),
  actualCost: Joi.number()
    .positive()
    .optional(),
  actualHours: Joi.number()
    .positive()
    .optional(),
  completionDate: Joi.date().optional(),
  notes: Joi.string()
    .max(2000)
    .optional(),
  photos: Joi.array()
    .items(Joi.string().uri())
    .optional(),
  quality: Joi.string()
    .valid('poor', 'fair', 'good', 'excellent')
    .optional()
}).min(1);

/**
 * Task Comment Schema
 * Validates task comment submission
 */
const taskCommentSchema = Joi.object({
  taskId: Joi.string()
    .required()
    .messages({
      'any.required': 'Task ID is required'
    }),
  comment: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Comment cannot be empty',
      'string.max': 'Comment must not exceed 2000 characters',
      'any.required': 'Comment is required'
    }),
  attachments: Joi.array()
    .items(Joi.string().uri())
    .optional()
});

/**
 * Recurring Task Schema
 * Validates recurring task creation
 */
const recurringTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(5000)
    .optional(),
  type: Joi.string()
    .valid('maintenance', 'inspection', 'administrative', 'cleaning', 'general')
    .required()
    .messages({
      'any.required': 'Task type is required'
    }),
  recurrencePattern: Joi.string()
    .valid('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually')
    .required()
    .messages({
      'any.required': 'Recurrence pattern is required'
    }),
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date is required'
    }),
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium')
    .optional(),
  propertyId: Joi.string().optional(),
  assignedTo: Joi.string().optional(),
  estimatedHours: Joi.number()
    .positive()
    .optional(),
  daysOfWeek: Joi.array()
    .items(Joi.number().min(0).max(6))
    .when('recurrencePattern', { is: 'weekly', then: Joi.required() })
    .optional(),
  dayOfMonth: Joi.number()
    .min(1)
    .max(31)
    .when('recurrencePattern', { is: 'monthly', then: Joi.optional() })
    .optional()
});

/**
 * Task Bulk Update Schema
 * Validates bulk task updates
 */
const taskBulkUpdateSchema = Joi.object({
  taskIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'any.required': 'Task IDs are required'
    }),
  updates: Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled', 'on_hold').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent', 'emergency').optional(),
    assignedTo: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }).min(1).required()
});

module.exports = {
  taskCreateSchema,
  taskUpdateSchema,
  taskQuerySchema,
  maintenanceRequestSchema,
  workOrderCreateSchema,
  workOrderUpdateSchema,
  taskCommentSchema,
  recurringTaskSchema,
  taskBulkUpdateSchema
};

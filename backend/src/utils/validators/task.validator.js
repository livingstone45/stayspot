const Joi = require('joi');
const { TaskPriority, TaskStatus, TaskType } = require('../constants/status');

const taskSchema = Joi.object({
  title: Joi.string().required().min(3).max(200)
    .messages({
      'string.empty': 'Task title is required',
      'string.min': 'Task title must be at least 3 characters',
      'string.max': 'Task title cannot exceed 200 characters'
    }),
  
  description: Joi.string().required().min(10).max(2000)
    .messages({
      'string.empty': 'Task description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 2000 characters'
    }),
  
  type: Joi.string().valid(...Object.values(TaskType)).required()
    .messages({
      'any.only': `Task type must be one of: ${Object.values(TaskType).join(', ')}`
    }),
  
  priority: Joi.string().valid(...Object.values(TaskPriority)).default(TaskPriority.MEDIUM)
    .messages({
      'any.only': `Priority must be one of: ${Object.values(TaskPriority).join(', ')}`
    }),
  
  status: Joi.string().valid(...Object.values(TaskStatus)).default(TaskStatus.PENDING)
    .messages({
      'any.only': `Status must be one of: ${Object.values(TaskStatus).join(', ')}`
    }),
  
  assigneeId: Joi.number().integer().min(1),
  
  propertyId: Joi.number().integer().min(1).required(),
  
  unitId: Joi.number().integer().min(1),
  
  dueDate: Joi.date().greater('now').required()
    .messages({
      'date.greater': 'Due date must be in the future'
    }),
  
  estimatedHours: Joi.number().min(0.5).max(100),
  
  category: Joi.string().valid('maintenance', 'cleaning', 'inspection', 'administrative', 'marketing', 'financial'),
  
  subcategory: Joi.string(),
  
  dependencies: Joi.array().items(Joi.number().integer().min(1)),
  
  checklist: Joi.array().items(Joi.object({
    item: Joi.string().required(),
    completed: Joi.boolean().default(false),
    completedAt: Joi.date(),
    completedBy: Joi.number().integer().min(1)
  })),
  
  attachments: Joi.array().items(Joi.object({
    url: Joi.string().uri().required(),
    type: Joi.string().valid('image', 'document', 'video'),
    name: Joi.string().required()
  })),
  
  metadata: Joi.object()
});

const taskUpdateSchema = taskSchema.fork(
  ['title', 'description', 'type', 'propertyId', 'dueDate'],
  (schema) => schema.optional()
);

const taskAssignmentSchema = Joi.object({
  taskId: Joi.number().integer().min(1).required(),
  assigneeId: Joi.number().integer().min(1).required(),
  dueDate: Joi.date().greater('now'),
  notes: Joi.string().max(500)
});

const taskBulkCreateSchema = Joi.array().items(
  taskSchema.keys({
    assigneeId: Joi.number().integer().min(1).required()
  })
).min(1).max(50);

const validateTask = (data) => {
  return taskSchema.validate(data, { abortEarly: false });
};

const validateTaskUpdate = (data) => {
  return taskUpdateSchema.validate(data, { abortEarly: false });
};

const validateTaskAssignment = (data) => {
  return taskAssignmentSchema.validate(data, { abortEarly: false });
};

const validateTaskBulkCreate = (data) => {
  return taskBulkCreateSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateTask,
  validateTaskUpdate,
  validateTaskAssignment,
  validateTaskBulkCreate,
  taskSchema
};
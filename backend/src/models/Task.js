const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  task_type: {
    type: DataTypes.ENUM(
      'property_upload',
      'property_inspection',
      'tenant_screening',
      'lease_preparation',
      'maintenance',
      'financial',
      'marketing',
      'compliance',
      'reporting',
      'other'
    ),
    defaultValue: 'other',
  },
  priority: {
    type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'assigned',
      'in_progress',
      'completed',
      'cancelled',
      'on_hold',
      'overdue'
    ),
    defaultValue: 'pending',
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estimated_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  actual_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  property_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'properties',
      key: 'id',
    },
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'units',
      key: 'id',
    },
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tenants',
      key: 'id',
    },
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  portfolio_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'portfolios',
      key: 'id',
    },
  },
  assignee_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigner_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of the team this task belongs to',
  },
  checklist: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of checklist items',
  },
  completed_checklist_items: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of attachment objects',
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tag strings',
  },
  dependencies: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of task IDs this task depends on',
  },
  recurrence_pattern: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'For recurring tasks',
  },
  next_recurrence_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  time_entries: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of time entry objects',
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of comment objects',
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  completion_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quality_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  quality_feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['assignee_id', 'status'],
    },
    {
      fields: ['due_date'],
    },
    {
      fields: ['task_type'],
    },
    {
      fields: ['property_id'],
    },
    {
      fields: ['company_id'],
    },
  ],
  hooks: {
    beforeUpdate: (task) => {
      task.updated_at = new Date();
    },
  },
});

module.exports = Task;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  task_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id',
    },
  },
  assignee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  accepted_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejected_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completion_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      'assigned',
      'accepted',
      'in_progress',
      'completed',
      'rejected',
      'cancelled'
    ),
    defaultValue: 'assigned',
  },
  estimated_completion_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  priority_level: {
    type: DataTypes.ENUM('normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resources: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of resource objects',
  },
  constraints: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Constraints for the assignment',
  },
  performance_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  performance_feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  time_spent_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'assignments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['task_id', 'assignee_id'],
      unique: true,
    },
    {
      fields: ['assignee_id', 'status'],
    },
    {
      fields: ['assigner_id'],
    },
    {
      fields: ['status'],
    },
  ],
  hooks: {
    beforeUpdate: (assignment) => {
      assignment.updated_at = new Date();
    },
  },
});

module.exports = Assignment;
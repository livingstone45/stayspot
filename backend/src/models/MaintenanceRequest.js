const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  property_id: {
    type: DataTypes.UUID,
    allowNull: false,
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
  request_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'plumbing',
      'electrical',
      'hvac',
      'appliance',
      'structural',
      'pest_control',
      'cleaning',
      'landscaping',
      'security',
      'other'
    ),
    defaultValue: 'other',
  },
  priority: {
    type: DataTypes.ENUM('emergency', 'urgent', 'normal', 'low'),
    defaultValue: 'normal',
  },
  status: {
    type: DataTypes.ENUM(
      'submitted',
      'assigned',
      'in_progress',
      'completed',
      'cancelled',
      'on_hold'
    ),
    defaultValue: 'submitted',
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of photo URLs',
  },
  access_instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferred_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  preferred_time_slot: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  actual_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  approval_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completion_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completion_photos: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  tenant_feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tenant_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurrence_pattern: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Recurrence pattern for recurring maintenance',
  },
  next_recurrence_date: {
    type: DataTypes.DATE,
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
  tableName: 'maintenance_requests',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['request_number'],
    },
    {
      fields: ['property_id', 'status'],
    },
    {
      fields: ['tenant_id', 'status'],
    },
    {
      fields: ['assigned_to', 'status'],
    },
    {
      fields: ['priority', 'status'],
    },
    {
      fields: ['category'],
    },
  ],
  hooks: {
    beforeUpdate: (request) => {
      request.updated_at = new Date();
    },
  },
});

module.exports = MaintenanceRequest;
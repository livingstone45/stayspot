const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const WorkOrder = sequelize.define('WorkOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  maintenance_request_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'maintenance_requests',
      key: 'id',
    },
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
  work_order_number: {
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
  work_type: {
    type: DataTypes.ENUM(
      'repair',
      'replacement',
      'installation',
      'inspection',
      'preventive',
      'emergency',
      'renovation',
      'cleaning'
    ),
    defaultValue: 'repair',
  },
  priority: {
    type: DataTypes.ENUM('emergency', 'high', 'medium', 'low'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'assigned',
      'scheduled',
      'in_progress',
      'completed',
      'cancelled',
      'on_hold'
    ),
    defaultValue: 'draft',
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  scheduled_start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  scheduled_end_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  actual_start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actual_end_time: {
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
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  actual_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of material objects',
  },
  labor_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  material_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  vendor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendors',
      key: 'id',
    },
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assigned_by: {
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
  quality_check_passed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  quality_check_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quality_check_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  quality_check_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  invoice_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  invoice_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  invoice_paid_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  warranty_period_days: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  warranty_expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  safety_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  special_instructions: {
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
  tableName: 'work_orders',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['work_order_number'],
    },
    {
      fields: ['property_id', 'status'],
    },
    {
      fields: ['vendor_id', 'status'],
    },
    {
      fields: ['assigned_to', 'status'],
    },
    {
      fields: ['scheduled_date', 'status'],
    },
    {
      fields: ['work_type'],
    },
  ],
  hooks: {
    beforeUpdate: (workOrder) => {
      workOrder.updated_at = new Date();
    },
  },
});

module.exports = WorkOrder;
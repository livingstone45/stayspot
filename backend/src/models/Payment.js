const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  paymentNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  type: {
    type: DataTypes.ENUM(
      'rent',
      'deposit',
      'fee',
      'refund',
      'maintenance',
      'utility',
      'other'
    ),
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM(
      'credit_card',
      'debit_card',
      'bank_transfer',
      'ach',
      'check',
      'cash',
      'paypal',
      'other'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded'
    ),
    defaultValue: 'pending',
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'properties',
      key: 'id',
    },
  },
  unitId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'units',
      key: 'id',
    },
  },
  leaseId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'leases',
      key: 'id',
    },
  },
  payerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  externalId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  processingFee: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  lateFee: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  receiptUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['property_id'],
    },
    {
      fields: ['unit_id'],
    },
    {
      fields: ['lease_id'],
    },
    {
      fields: ['payer_id'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['due_date'],
    },
  ],
});

module.exports = Payment;
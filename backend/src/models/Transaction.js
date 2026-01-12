const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'rent',
      'deposit',
      'fee',
      'maintenance',
      'utility',
      'insurance',
      'tax',
      'management_fee',
      'marketing',
      'legal',
      'other'
    ),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
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
  paymentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id',
    },
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendors',
      key: 'id',
    },
  },
  reference: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  receiptUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  taxDeductible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['type'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['date'],
    },
    {
      fields: ['property_id'],
    },
    {
      fields: ['company_id'],
    },
  ],
});

module.exports = Transaction;
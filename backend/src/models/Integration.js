const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Integration = sequelize.define('Integration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'payment',
      'accounting',
      'marketing',
      'communication',
      'analytics',
      'crm',
      'calendar',
      'document',
      'other'
    ),
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'error', 'pending'),
    defaultValue: 'pending',
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  credentials: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  lastSyncAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  syncFrequency: {
    type: DataTypes.ENUM('manual', 'hourly', 'daily', 'weekly', 'monthly'),
    defaultValue: 'manual',
  },
  errorCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastError: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'integrations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['company_id'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['provider'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = Integration;
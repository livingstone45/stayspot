const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  resource: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  resourceId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  oldValues: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  newValues: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  changes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['action'],
    },
    {
      fields: ['resource'],
    },
    {
      fields: ['resource_id'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

module.exports = AuditLog;
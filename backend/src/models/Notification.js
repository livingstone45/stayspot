const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'system',
      'maintenance',
      'payment',
      'lease',
      'task',
      'message',
      'reminder',
      'alert',
      'info'
    ),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'archived'),
    defaultValue: 'unread',
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  actionText: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
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
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  relatedType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  channels: {
    type: DataTypes.JSON,
    defaultValue: ['web'],
  },
  sentChannels: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

module.exports = Notification;
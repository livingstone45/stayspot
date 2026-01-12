const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'direct',
      'broadcast',
      'notification',
      'system',
      'maintenance',
      'payment',
      'lease'
    ),
    defaultValue: 'direct',
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'archived'),
    defaultValue: 'sent',
  },
  readAt: {
    type: DataTypes.DATE,
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
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id',
    },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['sender_id'],
    },
    {
      fields: ['receiver_id'],
    },
    {
      fields: ['conversation_id'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = Message;
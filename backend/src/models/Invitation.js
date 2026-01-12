const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  inviter_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
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
  property_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'properties',
      key: 'id',
    },
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Additional permissions beyond role permissions',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'expired', 'revoked', 'declined'),
    defaultValue: 'pending',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  accepted_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  revoker_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  revoked_reason: {
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
  tableName: 'invitations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['token'],
      unique: true,
    },
    {
      fields: ['email', 'status'],
    },
    {
      fields: ['inviter_id'],
    },
    {
      fields: ['company_id'],
    },
    {
      fields: ['expires_at'],
    },
  ],
  hooks: {
    beforeUpdate: (invitation) => {
      invitation.updated_at = new Date();
    },
  },
});

module.exports = Invitation;
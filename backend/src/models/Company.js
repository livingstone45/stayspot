const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  legalName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      'property_management',
      'real_estate',
      'investment',
      'development',
      'other'
    ),
    defaultValue: 'property_management',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  taxId: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  licenseNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  employeeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  propertyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'basic', 'professional', 'enterprise'),
    defaultValue: 'free',
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'cancelled'),
    defaultValue: 'active',
  },
  subscriptionExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  billingInfo: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'companies',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['owner_id'],
    },
    {
      fields: ['email'],
    },
    {
      fields: ['is_active'],
    },
  ],
});

module.exports = Company;
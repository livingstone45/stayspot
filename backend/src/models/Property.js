const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      'apartment',
      'house',
      'condo',
      'townhouse',
      'commercial',
      'land',
      'other'
    ),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  yearBuilt: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalUnits: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  lotSize: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  parkingSpaces: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  utilities: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  petPolicy: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  smokingPolicy: {
    type: DataTypes.ENUM('allowed', 'not_allowed', 'designated_areas'),
    defaultValue: 'not_allowed',
  },
  accessibility: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'sold', 'rented'),
    defaultValue: 'active',
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ownerId: {
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
  portfolioId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'portfolios',
      key: 'id',
    },
  },
  managerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
  },
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'properties',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['latitude', 'longitude'],
    },
    {
      fields: ['city', 'state'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['verificationStatus'],
    },
  ],
});

module.exports = Property;

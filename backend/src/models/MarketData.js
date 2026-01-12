const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const MarketData = sequelize.define('MarketData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  location: {
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
    allowNull: true,
  },
  propertyType: {
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
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bathrooms: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
  },
  averageRent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  medianRent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  minRent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  maxRent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  averagePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  medianPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  pricePerSqft: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  rentPerSqft: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
  },
  occupancyRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  vacancyRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  daysOnMarket: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  inventory: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  newListings: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  soldListings: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  priceChange: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  rentChange: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dataDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'market_data',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['city', 'state'],
    },
    {
      fields: ['zip_code'],
    },
    {
      fields: ['property_type'],
    },
    {
      fields: ['data_date'],
    },
    {
      fields: ['source'],
    },
  ],
});

module.exports = MarketData;
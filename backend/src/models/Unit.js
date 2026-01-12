const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'properties',
      key: 'id',
    },
  },
  unitNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'studio',
      '1br',
      '2br',
      '3br',
      '4br',
      '5br',
      'penthouse',
      'loft',
      'other'
    ),
    allowNull: false,
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bathrooms: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: false,
    defaultValue: 1.0,
  },
  area: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
  },
  rent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  balcony: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  parking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  storage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  furnished: {
    type: DataTypes.ENUM('unfurnished', 'semi_furnished', 'fully_furnished'),
    defaultValue: 'unfurnished',
  },
  appliances: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'reserved'),
    defaultValue: 'available',
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentTenantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tenants',
      key: 'id',
    },
  },
  currentLeaseId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'leases',
      key: 'id',
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'units',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['property_id', 'unit_number'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['type'],
    },
  ],
});

module.exports = Unit;
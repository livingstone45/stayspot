const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const PropertyImage = sequelize.define('PropertyImage', {
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
  unitId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'units',
      key: 'id',
    },
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM(
      'exterior',
      'interior',
      'kitchen',
      'bathroom',
      'bedroom',
      'living_room',
      'amenity',
      'other'
    ),
    defaultValue: 'other',
  },
  caption: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  altText: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'property_images',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['property_id'],
    },
    {
      fields: ['unit_id'],
    },
    {
      fields: ['category'],
    },
  ],
});

module.exports = PropertyImage;
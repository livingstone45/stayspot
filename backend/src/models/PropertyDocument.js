const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const PropertyDocument = sequelize.define('PropertyDocument', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      'deed',
      'insurance',
      'inspection',
      'lease_template',
      'certificate',
      'permit',
      'tax_document',
      'financial',
      'maintenance',
      'other'
    ),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
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
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'property_documents',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['property_id'],
    },
    {
      fields: ['type'],
    },
  ],
});

module.exports = PropertyDocument;
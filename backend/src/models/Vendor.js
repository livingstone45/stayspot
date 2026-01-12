const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contact_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address_line1: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  address_line2: {
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
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'US',
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tax_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  business_license: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  insurance_provider: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  insurance_policy_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  insurance_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  services: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of service categories',
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of specialty areas',
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of certification objects',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5,
    },
  },
  total_ratings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  response_time_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Average response time in hours',
  },
  completion_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentage of completed jobs',
  },
  pricing_tier: {
    type: DataTypes.ENUM('budget', 'standard', 'premium'),
    defaultValue: 'standard',
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  emergency_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  weekend_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  payment_terms: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  preferred_payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  bank_account_details: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  availability: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Availability schedule',
  },
  service_radius_miles: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verification_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_blacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  blacklist_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
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
  tableName: 'vendors',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['company_name'],
    },
    {
      fields: ['email'],
    },
    {
      fields: ['services'],
      type: 'FULLTEXT',
    },
    {
      fields: ['is_verified'],
    },
    {
      fields: ['is_blacklisted'],
    },
  ],
  hooks: {
    beforeUpdate: (vendor) => {
      vendor.updated_at = new Date();
    },
  },
});

module.exports = Vendor;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    unique: true,
  },
  emergency_contact_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  emergency_contact_relationship: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  employment_status: {
    type: DataTypes.ENUM(
      'employed',
      'self-employed',
      'unemployed',
      'student',
      'retired',
      'other'
    ),
    allowNull: true,
  },
  employer_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  job_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  monthly_income: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  credit_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  credit_score_last_updated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  has_pets: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pets_details: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of pet objects',
  },
  has_vehicles: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  vehicles_details: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of vehicle objects',
  },
  special_requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Tenant preferences for future rentals',
  },
  rental_history: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of previous rental history',
  },
  references: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of reference objects',
  },
  insurance_policy_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  insurance_provider: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  insurance_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  background_check_status: {
    type: DataTypes.ENUM(
      'pending',
      'approved',
      'rejected',
      'expired',
      'not_required'
    ),
    defaultValue: 'pending',
  },
  background_check_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  background_check_details: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  is_vip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  vip_reason: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  communication_preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      email: true,
      sms: false,
      phone: false,
      push: true,
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
  tableName: 'tenants',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (tenant) => {
      tenant.updated_at = new Date();
    },
  },
});

module.exports = Tenant;
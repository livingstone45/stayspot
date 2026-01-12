const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  portfolio_type: {
    type: DataTypes.ENUM(
      'residential',
      'commercial',
      'mixed_use',
      'vacation',
      'corporate',
      'specialized'
    ),
    defaultValue: 'residential',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    defaultValue: 'active',
  },
  total_properties: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_units: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  monthly_revenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  occupancy_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  average_rent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  performance_metrics: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Various performance metrics',
  },
  goals: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Portfolio goals and targets',
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'portfolios',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['company_id'],
    },
    {
      fields: ['manager_id'],
    },
    {
      fields: ['portfolio_type'],
    },
    {
      fields: ['status'],
    },
  ],
  hooks: {
    beforeUpdate: (portfolio) => {
      portfolio.updated_at = new Date();
    },
  },
});

module.exports = Portfolio;
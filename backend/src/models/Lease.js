const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Lease = sequelize.define('Lease', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'units',
      key: 'id',
    },
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
  },
  lease_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'pending',
      'active',
      'expired',
      'terminated',
      'renewed',
      'cancelled'
    ),
    defaultValue: 'draft',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  actual_move_in_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  actual_move_out_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  monthly_rent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  security_deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  security_deposit_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  security_deposit_refunded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  security_deposit_refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  security_deposit_refund_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  late_fee_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  grace_period_days: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  utilities_responsibility: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Which utilities tenant is responsible for',
  },
  pet_deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  pet_fee_monthly: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  parking_fee_monthly: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  other_fees: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of other fee objects',
  },
  renewal_option: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  renewal_notice_days: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  termination_notice_days: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  early_termination_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  subletting_allowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  guests_policy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  special_terms: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  document_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  e_signature_status: {
    type: DataTypes.ENUM('pending', 'signed', 'expired', 'cancelled'),
    defaultValue: 'pending',
  },
  signed_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  signed_by_tenant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  signed_by_landlord: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  notes: {
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
  tableName: 'leases',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['lease_number'],
    },
    {
      fields: ['unit_id', 'status'],
    },
    {
      fields: ['tenant_id', 'status'],
    },
    {
      fields: ['start_date', 'end_date'],
    },
    {
      fields: ['e_signature_status'],
    },
  ],
  hooks: {
    beforeUpdate: (lease) => {
      lease.updated_at = new Date();
    },
  },
});

module.exports = Lease;
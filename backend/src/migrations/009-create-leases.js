'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leases', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      property_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      unit_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'units',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lease_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      monthly_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      security_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      pet_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      late_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      grace_period: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 5,
        comment: 'Grace period in days'
      },
      rent_due_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Day of month rent is due'
      },
      lease_type: {
        type: Sequelize.ENUM('fixed', 'month_to_month', 'periodic'),
        defaultValue: 'fixed'
      },
      renewal_terms: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          auto_renew: false,
          notice_period: 30,
          rent_increase: 0
        }
      },
      utilities_included: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      pet_policy: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          allowed: false,
          types: [],
          deposit: 0,
          monthly_fee: 0
        }
      },
      occupants: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      special_terms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'expired', 'terminated', 'renewed'),
        defaultValue: 'draft'
      },
      signed_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      move_in_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      move_out_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      termination_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      termination_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      renewal_notice_sent: {
        type: Sequelize.DATE,
        allowNull: true
      },
      renewal_response_due: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      external_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Lease Documents table
    await queryInterface.createTable('lease_documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      lease_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'leases',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('lease_agreement', 'addendum', 'amendment', 'notice', 'inspection_report', 'other'),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      is_signed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      signed_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('leases', ['property_id']);
    await queryInterface.addIndex('leases', ['unit_id']);
    await queryInterface.addIndex('leases', ['tenant_id']);
    await queryInterface.addIndex('leases', ['company_id']);
    await queryInterface.addIndex('leases', ['lease_number']);
    await queryInterface.addIndex('leases', ['status']);
    await queryInterface.addIndex('leases', ['start_date']);
    await queryInterface.addIndex('leases', ['end_date']);
    await queryInterface.addIndex('leases', ['move_in_date']);
    await queryInterface.addIndex('leases', ['move_out_date']);
    await queryInterface.addIndex('leases', ['created_by']);
    await queryInterface.addIndex('leases', ['external_id']);
    await queryInterface.addIndex('leases', ['deleted_at']);
    
    await queryInterface.addIndex('lease_documents', ['lease_id']);
    await queryInterface.addIndex('lease_documents', ['type']);
    await queryInterface.addIndex('lease_documents', ['is_signed']);
    await queryInterface.addIndex('lease_documents', ['uploaded_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lease_documents');
    await queryInterface.dropTable('leases');
  }
};

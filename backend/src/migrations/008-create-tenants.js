'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      ssn_last_four: {
        type: Sequelize.STRING(4),
        allowNull: true
      },
      employment_status: {
        type: Sequelize.ENUM('employed', 'self_employed', 'unemployed', 'retired', 'student'),
        allowNull: true
      },
      employer: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      job_title: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      monthly_income: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      previous_address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      emergency_contact: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          name: null,
          relationship: null,
          phone: null,
          email: null
        }
      },
      references: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      background_check: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          status: 'pending',
          completed_at: null,
          results: null
        }
      },
      credit_score: {
        type: Sequelize.INTEGER,
        allowNull: true
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
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending', 'blacklisted'),
        defaultValue: 'pending'
      },
      move_in_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      move_out_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Tenant Applications table
    await queryInterface.createTable('tenant_applications', {
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
        allowNull: true,
        references: {
          model: 'tenants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      desired_move_in: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lease_term: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Lease term in months'
      },
      monthly_income: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      employment_info: {
        type: Sequelize.JSON,
        allowNull: true
      },
      rental_history: {
        type: Sequelize.JSON,
        allowNull: true
      },
      references: {
        type: Sequelize.JSON,
        allowNull: true
      },
      pets: {
        type: Sequelize.JSON,
        allowNull: true
      },
      additional_occupants: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'under_review', 'approved', 'rejected', 'withdrawn'),
        defaultValue: 'pending'
      },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
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
      }
    });

    // Tenant Documents table
    await queryInterface.createTable('tenant_documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('id', 'income_proof', 'employment_letter', 'bank_statement', 'reference_letter', 'other'),
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
    await queryInterface.addIndex('tenants', ['user_id']);
    await queryInterface.addIndex('tenants', ['email']);
    await queryInterface.addIndex('tenants', ['company_id']);
    await queryInterface.addIndex('tenants', ['status']);
    await queryInterface.addIndex('tenants', ['first_name', 'last_name']);
    await queryInterface.addIndex('tenants', ['external_id']);
    await queryInterface.addIndex('tenants', ['deleted_at']);
    
    await queryInterface.addIndex('tenant_applications', ['property_id']);
    await queryInterface.addIndex('tenant_applications', ['unit_id']);
    await queryInterface.addIndex('tenant_applications', ['tenant_id']);
    await queryInterface.addIndex('tenant_applications', ['status']);
    await queryInterface.addIndex('tenant_applications', ['email']);
    await queryInterface.addIndex('tenant_applications', ['reviewed_by']);
    
    await queryInterface.addIndex('tenant_documents', ['tenant_id']);
    await queryInterface.addIndex('tenant_documents', ['type']);
    await queryInterface.addIndex('tenant_documents', ['uploaded_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tenant_documents');
    await queryInterface.dropTable('tenant_applications');
    await queryInterface.dropTable('tenants');
  }
};

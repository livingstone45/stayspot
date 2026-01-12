'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      legal_name: {
        type: Sequelize.STRING(200),
        allowNull: true
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
      website: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'United States'
      },
      tax_id: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      license_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('property_management', 'real_estate', 'individual', 'corporation'),
        defaultValue: 'property_management'
      },
      size: {
        type: Sequelize.ENUM('small', 'medium', 'large', 'enterprise'),
        defaultValue: 'small'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended', 'pending'),
        defaultValue: 'pending'
      },
      subscription_plan: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'basic'
      },
      subscription_status: {
        type: Sequelize.ENUM('active', 'inactive', 'trial', 'expired', 'cancelled'),
        defaultValue: 'trial'
      },
      subscription_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      billing_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      billing_address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      settings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          timezone: 'America/New_York',
          currency: 'USD',
          date_format: 'MM/DD/YYYY',
          notifications: {
            email: true,
            sms: false
          }
        }
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          max_properties: 10,
          max_users: 5,
          integrations: false,
          advanced_reporting: false
        }
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

    // Add indexes
    await queryInterface.addIndex('companies', ['name']);
    await queryInterface.addIndex('companies', ['email']);
    await queryInterface.addIndex('companies', ['status']);
    await queryInterface.addIndex('companies', ['subscription_status']);
    await queryInterface.addIndex('companies', ['type']);
    await queryInterface.addIndex('companies', ['created_at']);
    await queryInterface.addIndex('companies', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('companies');
  }
};

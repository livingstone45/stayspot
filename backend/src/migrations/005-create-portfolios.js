'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('portfolios', {
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
      description: {
        type: Sequelize.TEXT,
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
      manager_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.ENUM('residential', 'commercial', 'mixed', 'industrial'),
        defaultValue: 'residential'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'archived'),
        defaultValue: 'active'
      },
      total_properties: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_units: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      monthly_revenue: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      occupancy_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      settings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          auto_assign_tasks: false,
          notification_preferences: {
            maintenance_requests: true,
            lease_expiry: true,
            payment_overdue: true
          }
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
    await queryInterface.addIndex('portfolios', ['company_id']);
    await queryInterface.addIndex('portfolios', ['manager_id']);
    await queryInterface.addIndex('portfolios', ['status']);
    await queryInterface.addIndex('portfolios', ['type']);
    await queryInterface.addIndex('portfolios', ['name']);
    await queryInterface.addIndex('portfolios', ['created_at']);
    await queryInterface.addIndex('portfolios', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('portfolios');
  }
};

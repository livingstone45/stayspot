'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('webhooks', {
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
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      events: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      secret: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'failed'),
        defaultValue: 'active'
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
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      last_triggered: {
        type: Sequelize.DATE,
        allowNull: true
      },
      failure_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
      }
    });

    // Webhook Logs table
    await queryInterface.createTable('webhook_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      webhook_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'webhooks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      event_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      payload: {
        type: Sequelize.JSON,
        allowNull: false
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      response_body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      attempt_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'retrying'),
        defaultValue: 'pending'
      },
      error_message: {
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

    // Add indexes
    await queryInterface.addIndex('webhooks', ['company_id']);
    await queryInterface.addIndex('webhooks', ['created_by']);
    await queryInterface.addIndex('webhooks', ['status']);
    
    await queryInterface.addIndex('webhook_logs', ['webhook_id']);
    await queryInterface.addIndex('webhook_logs', ['event_type']);
    await queryInterface.addIndex('webhook_logs', ['status']);
    await queryInterface.addIndex('webhook_logs', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('webhook_logs');
    await queryInterface.dropTable('webhooks');
  }
};
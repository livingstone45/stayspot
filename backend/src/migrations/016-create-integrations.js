'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('integrations', {
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
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      config: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'error', 'pending'),
        defaultValue: 'pending'
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sync_frequency: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'daily'
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
      error_log: {
        type: Sequelize.JSON,
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
      }
    });

    // Add indexes
    await queryInterface.addIndex('integrations', ['company_id']);
    await queryInterface.addIndex('integrations', ['type']);
    await queryInterface.addIndex('integrations', ['provider']);
    await queryInterface.addIndex('integrations', ['status']);
    await queryInterface.addIndex('integrations', ['created_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('integrations');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assignments', {
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
      task_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      assignment_type: {
        type: Sequelize.ENUM('role_based', 'user_specific', 'round_robin', 'workload_based'),
        allowNull: false
      },
      criteria: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      target_role: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      target_user: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.addIndex('assignments', ['task_type']);
    await queryInterface.addIndex('assignments', ['assignment_type']);
    await queryInterface.addIndex('assignments', ['target_role']);
    await queryInterface.addIndex('assignments', ['target_user']);
    await queryInterface.addIndex('assignments', ['company_id']);
    await queryInterface.addIndex('assignments', ['created_by']);
    await queryInterface.addIndex('assignments', ['is_active']);
    await queryInterface.addIndex('assignments', ['priority']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assignments');
  }
};

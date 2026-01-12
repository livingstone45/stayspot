'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('maintenance_requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'emergency'),
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'open'
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
      assigned_to: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      preferred_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      scheduled_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completed_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      estimated_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      actual_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
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

    // Add indexes
    await queryInterface.addIndex('maintenance_requests', ['property_id']);
    await queryInterface.addIndex('maintenance_requests', ['unit_id']);
    await queryInterface.addIndex('maintenance_requests', ['tenant_id']);
    await queryInterface.addIndex('maintenance_requests', ['assigned_to']);
    await queryInterface.addIndex('maintenance_requests', ['created_by']);
    await queryInterface.addIndex('maintenance_requests', ['company_id']);
    await queryInterface.addIndex('maintenance_requests', ['category']);
    await queryInterface.addIndex('maintenance_requests', ['priority']);
    await queryInterface.addIndex('maintenance_requests', ['status']);
    await queryInterface.addIndex('maintenance_requests', ['scheduled_date']);
    await queryInterface.addIndex('maintenance_requests', ['created_at']);
    await queryInterface.addIndex('maintenance_requests', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('maintenance_requests');
  }
};
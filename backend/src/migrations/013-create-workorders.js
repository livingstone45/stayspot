'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('work_orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      work_order_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      maintenance_request_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'maintenance_requests',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      vendor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'scheduled', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'emergency'),
        defaultValue: 'medium'
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
      estimated_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      actual_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      completion_notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
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
    await queryInterface.addIndex('work_orders', ['work_order_number']);
    await queryInterface.addIndex('work_orders', ['maintenance_request_id']);
    await queryInterface.addIndex('work_orders', ['vendor_id']);
    await queryInterface.addIndex('work_orders', ['property_id']);
    await queryInterface.addIndex('work_orders', ['unit_id']);
    await queryInterface.addIndex('work_orders', ['created_by']);
    await queryInterface.addIndex('work_orders', ['assigned_to']);
    await queryInterface.addIndex('work_orders', ['company_id']);
    await queryInterface.addIndex('work_orders', ['status']);
    await queryInterface.addIndex('work_orders', ['priority']);
    await queryInterface.addIndex('work_orders', ['scheduled_date']);
    await queryInterface.addIndex('work_orders', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('work_orders');
  }
};

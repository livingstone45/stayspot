'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendors', {
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
      business_name: {
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
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      services: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
      },
      license_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      insurance_info: {
        type: Sequelize.JSON,
        allowNull: true
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0
      },
      total_jobs: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
      },
      availability: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        }
      },
      emergency_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addIndex('vendors', ['name']);
    await queryInterface.addIndex('vendors', ['email']);
    await queryInterface.addIndex('vendors', ['company_id']);
    await queryInterface.addIndex('vendors', ['category']);
    await queryInterface.addIndex('vendors', ['status']);
    await queryInterface.addIndex('vendors', ['rating']);
    await queryInterface.addIndex('vendors', ['emergency_available']);
    await queryInterface.addIndex('vendors', ['external_id']);
    await queryInterface.addIndex('vendors', ['deleted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendors');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('units', {
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
      unit_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('studio', '1br', '2br', '3br', '4br', '5br', 'penthouse', 'loft', 'other'),
        allowNull: false
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bathrooms: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 1.0
      },
      area: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        comment: 'Area in square feet'
      },
      rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      balcony: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      parking: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      storage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      furnished: {
        type: Sequelize.ENUM('unfurnished', 'semi_furnished', 'fully_furnished'),
        defaultValue: 'unfurnished'
      },
      appliances: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      utilities_included: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      status: {
        type: Sequelize.ENUM('available', 'occupied', 'maintenance', 'reserved'),
        defaultValue: 'available'
      },
      availability_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_renovated: {
        type: Sequelize.DATE,
        allowNull: true
      },
      condition: {
        type: Sequelize.ENUM('excellent', 'good', 'fair', 'poor'),
        defaultValue: 'good'
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

    // Unit Images table
    await queryInterface.createTable('unit_images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      unit_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'units',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('main', 'kitchen', 'bathroom', 'bedroom', 'living_room', 'balcony', 'other'),
        defaultValue: 'other'
      },
      caption: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.addIndex('units', ['property_id']);
    await queryInterface.addIndex('units', ['unit_number']);
    await queryInterface.addIndex('units', ['property_id', 'unit_number'], { unique: true });
    await queryInterface.addIndex('units', ['type']);
    await queryInterface.addIndex('units', ['status']);
    await queryInterface.addIndex('units', ['bedrooms']);
    await queryInterface.addIndex('units', ['bathrooms']);
    await queryInterface.addIndex('units', ['rent']);
    await queryInterface.addIndex('units', ['availability_date']);
    await queryInterface.addIndex('units', ['external_id']);
    await queryInterface.addIndex('units', ['deleted_at']);
    
    await queryInterface.addIndex('unit_images', ['unit_id']);
    await queryInterface.addIndex('unit_images', ['type']);
    await queryInterface.addIndex('unit_images', ['display_order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('unit_images');
    await queryInterface.dropTable('units');
  }
};

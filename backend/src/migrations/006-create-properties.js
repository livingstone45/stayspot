'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('properties', {
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
      type: {
        type: Sequelize.ENUM('apartment', 'house', 'condo', 'townhouse', 'commercial', 'land', 'other'),
        allowNull: false
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
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
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
      portfolio_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'portfolios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      year_built: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_units: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      total_area: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Total area in square feet'
      },
      lot_size: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Lot size in square feet'
      },
      parking_spaces: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      purchase_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      current_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      monthly_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      security_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      amenities: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      utilities: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          electricity: 'tenant',
          gas: 'tenant',
          water: 'owner',
          internet: 'tenant',
          trash: 'owner'
        }
      },
      pet_policy: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          allowed: false,
          deposit: 0,
          monthly_fee: 0,
          restrictions: []
        }
      },
      smoking_policy: {
        type: Sequelize.ENUM('allowed', 'not_allowed', 'designated_areas'),
        defaultValue: 'not_allowed'
      },
      accessibility: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          wheelchair_accessible: false,
          features: []
        }
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'maintenance', 'sold', 'rented'),
        defaultValue: 'active'
      },
      listing_status: {
        type: Sequelize.ENUM('draft', 'published', 'unpublished', 'archived'),
        defaultValue: 'draft'
      },
      occupancy_status: {
        type: Sequelize.ENUM('vacant', 'occupied', 'partially_occupied'),
        defaultValue: 'vacant'
      },
      occupancy_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      last_inspection: {
        type: Sequelize.DATE,
        allowNull: true
      },
      next_inspection: {
        type: Sequelize.DATE,
        allowNull: true
      },
      insurance_policy: {
        type: Sequelize.JSON,
        allowNull: true
      },
      tax_info: {
        type: Sequelize.JSON,
        allowNull: true
      },
      external_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'External system ID for integrations'
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

    // Property Images table
    await queryInterface.createTable('property_images', {
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
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('main', 'exterior', 'interior', 'kitchen', 'bathroom', 'bedroom', 'living_room', 'amenity', 'other'),
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
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Property Documents table
    await queryInterface.createTable('property_documents', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('deed', 'insurance', 'inspection', 'lease', 'permit', 'tax', 'other'),
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
    await queryInterface.addIndex('properties', ['company_id']);
    await queryInterface.addIndex('properties', ['portfolio_id']);
    await queryInterface.addIndex('properties', ['owner_id']);
    await queryInterface.addIndex('properties', ['manager_id']);
    await queryInterface.addIndex('properties', ['type']);
    await queryInterface.addIndex('properties', ['status']);
    await queryInterface.addIndex('properties', ['listing_status']);
    await queryInterface.addIndex('properties', ['city', 'state']);
    await queryInterface.addIndex('properties', ['zip_code']);
    await queryInterface.addIndex('properties', ['latitude', 'longitude']);
    await queryInterface.addIndex('properties', ['external_id']);
    await queryInterface.addIndex('properties', ['created_at']);
    await queryInterface.addIndex('properties', ['deleted_at']);
    
    await queryInterface.addIndex('property_images', ['property_id']);
    await queryInterface.addIndex('property_images', ['type']);
    await queryInterface.addIndex('property_images', ['display_order']);
    await queryInterface.addIndex('property_images', ['is_featured']);
    
    await queryInterface.addIndex('property_documents', ['property_id']);
    await queryInterface.addIndex('property_documents', ['type']);
    await queryInterface.addIndex('property_documents', ['uploaded_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('property_documents');
    await queryInterface.dropTable('property_images');
    await queryInterface.dropTable('properties');
  }
};

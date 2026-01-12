'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('market_data', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      property_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      average_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      median_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      vacancy_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      price_trend: {
        type: Sequelize.ENUM('up', 'down', 'stable'),
        allowNull: true
      },
      market_score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      data_source: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      raw_data: {
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
    await queryInterface.addIndex('market_data', ['zip_code']);
    await queryInterface.addIndex('market_data', ['property_type']);
    await queryInterface.addIndex('market_data', ['zip_code', 'property_type']);
    await queryInterface.addIndex('market_data', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('market_data');
  }
};

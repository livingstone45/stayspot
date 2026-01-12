'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('system_config', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      value: {
        type: Sequelize.JSON,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'general'
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_editable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.addIndex('system_config', ['key']);
    await queryInterface.addIndex('system_config', ['category']);
    await queryInterface.addIndex('system_config', ['is_public']);

    // Insert default system configurations
    await queryInterface.bulkInsert('system_config', [
      {
        id: Sequelize.UUIDV4,
        key: 'app_name',
        value: '"StaySpot"',
        description: 'Application name',
        category: 'general',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        key: 'app_version',
        value: '"1.0.0"',
        description: 'Application version',
        category: 'general',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        key: 'maintenance_mode',
        value: 'false',
        description: 'System maintenance mode',
        category: 'system',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        key: 'max_file_size',
        value: '10485760',
        description: 'Maximum file upload size in bytes (10MB)',
        category: 'uploads',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: Sequelize.UUIDV4,
        key: 'allowed_file_types',
        value: '["jpg", "jpeg", "png", "pdf", "doc", "docx"]',
        description: 'Allowed file upload types',
        category: 'uploads',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('system_config');
  }
};
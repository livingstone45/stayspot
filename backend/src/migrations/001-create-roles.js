'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Role hierarchy level (1=lowest, 10=highest)'
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'System roles cannot be deleted'
      },
      is_active: {
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
    await queryInterface.addIndex('roles', ['name']);
    await queryInterface.addIndex('roles', ['level']);
    await queryInterface.addIndex('roles', ['is_active']);

    // Insert default roles
    await queryInterface.bulkInsert('roles', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'system_admin',
        display_name: 'System Administrator',
        description: 'Full system access and management',
        level: 10,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'company_admin',
        display_name: 'Company Administrator',
        description: 'Company-wide management access',
        level: 9,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'portfolio_manager',
        display_name: 'Portfolio Manager',
        description: 'Multi-property portfolio management',
        level: 8,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'property_manager',
        display_name: 'Property Manager',
        description: 'Individual property management',
        level: 7,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        name: 'leasing_specialist',
        display_name: 'Leasing Specialist',
        description: 'Tenant acquisition and leasing',
        level: 6,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000006',
        name: 'maintenance_supervisor',
        display_name: 'Maintenance Supervisor',
        description: 'Maintenance coordination and oversight',
        level: 5,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000007',
        name: 'landlord',
        display_name: 'Landlord',
        description: 'Property owner access',
        level: 4,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000008',
        name: 'tenant',
        display_name: 'Tenant',
        description: 'Resident access and services',
        level: 3,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000009',
        name: 'vendor',
        display_name: 'Vendor',
        description: 'Service provider access',
        level: 2,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '00000000-0000-0000-0000-000000000010',
        name: 'inspector',
        display_name: 'Inspector',
        description: 'Property inspection access',
        level: 2,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};

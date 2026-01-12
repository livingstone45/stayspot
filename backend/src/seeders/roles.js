module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      {
        id: '330e8400-e29b-41d4-a716-446655440001',
        name: 'system_admin',
        display_name: 'System Administrator',
        description: 'Full system access and platform management',
        level: 1,
        permissions: ['*'],
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440002',
        name: 'company_admin',
        display_name: 'Company Administrator',
        description: 'Company-wide management and oversight',
        level: 2,
        permissions: ['company.*', 'property.*', 'user.manage'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440003',
        name: 'company_owner',
        display_name: 'Company Owner',
        description: 'Company ownership and business decisions',
        level: 2,
        permissions: ['company.*', 'property.*', 'financial.*'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440004',
        name: 'portfolio_manager',
        display_name: 'Portfolio Manager',
        description: 'Multi-property portfolio management',
        level: 3,
        permissions: ['property.manage', 'tenant.manage', 'maintenance.manage'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440005',
        name: 'property_manager',
        display_name: 'Property Manager',
        description: 'Individual property management',
        level: 4,
        permissions: ['property.view', 'tenant.manage', 'maintenance.manage'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440006',
        name: 'landlord',
        display_name: 'Landlord',
        description: 'Property owner with rental management',
        level: 5,
        permissions: ['property.own', 'tenant.view', 'financial.view'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440007',
        name: 'tenant',
        display_name: 'Tenant',
        description: 'Property resident with limited access',
        level: 6,
        permissions: ['tenant.self', 'maintenance.request', 'payment.make'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440008',
        name: 'leasing_specialist',
        display_name: 'Leasing Specialist',
        description: 'Tenant acquisition and leasing',
        level: 7,
        permissions: ['tenant.manage', 'lease.manage', 'application.manage'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440009',
        name: 'maintenance_supervisor',
        display_name: 'Maintenance Supervisor',
        description: 'Maintenance coordination and oversight',
        level: 7,
        permissions: ['maintenance.manage', 'vendor.manage', 'workorder.manage'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '330e8400-e29b-41d4-a716-446655440010',
        name: 'financial_controller',
        display_name: 'Financial Controller',
        description: 'Financial oversight and reporting',
        level: 7,
        permissions: ['financial.manage', 'payment.manage', 'report.generate'],
        is_system: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('roles', roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
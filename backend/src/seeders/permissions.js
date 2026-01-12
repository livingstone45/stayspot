module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      // System permissions
      { id: '220e8400-e29b-41d4-a716-446655440001', name: 'system.admin', description: 'Full system administration', category: 'system', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440002', name: 'system.settings', description: 'Manage system settings', category: 'system', created_at: new Date(), updated_at: new Date() },
      
      // Company permissions
      { id: '220e8400-e29b-41d4-a716-446655440003', name: 'company.create', description: 'Create companies', category: 'company', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440004', name: 'company.manage', description: 'Manage company settings', category: 'company', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440005', name: 'company.view', description: 'View company information', category: 'company', created_at: new Date(), updated_at: new Date() },
      
      // User permissions
      { id: '220e8400-e29b-41d4-a716-446655440006', name: 'user.create', description: 'Create users', category: 'user', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440007', name: 'user.manage', description: 'Manage users', category: 'user', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440008', name: 'user.view', description: 'View users', category: 'user', created_at: new Date(), updated_at: new Date() },
      
      // Property permissions
      { id: '220e8400-e29b-41d4-a716-446655440009', name: 'property.create', description: 'Create properties', category: 'property', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440010', name: 'property.manage', description: 'Manage properties', category: 'property', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440011', name: 'property.view', description: 'View properties', category: 'property', created_at: new Date(), updated_at: new Date() },
      
      // Tenant permissions
      { id: '220e8400-e29b-41d4-a716-446655440012', name: 'tenant.create', description: 'Create tenants', category: 'tenant', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440013', name: 'tenant.manage', description: 'Manage tenants', category: 'tenant', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440014', name: 'tenant.view', description: 'View tenants', category: 'tenant', created_at: new Date(), updated_at: new Date() },
      
      // Maintenance permissions
      { id: '220e8400-e29b-41d4-a716-446655440015', name: 'maintenance.create', description: 'Create maintenance requests', category: 'maintenance', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440016', name: 'maintenance.manage', description: 'Manage maintenance requests', category: 'maintenance', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440017', name: 'maintenance.view', description: 'View maintenance requests', category: 'maintenance', created_at: new Date(), updated_at: new Date() },
      
      // Financial permissions
      { id: '220e8400-e29b-41d4-a716-446655440018', name: 'financial.manage', description: 'Manage financial data', category: 'financial', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440019', name: 'financial.view', description: 'View financial data', category: 'financial', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440020', name: 'payment.process', description: 'Process payments', category: 'financial', created_at: new Date(), updated_at: new Date() },
      
      // Task permissions
      { id: '220e8400-e29b-41d4-a716-446655440021', name: 'task.create', description: 'Create tasks', category: 'task', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440022', name: 'task.manage', description: 'Manage tasks', category: 'task', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440023', name: 'task.view', description: 'View tasks', category: 'task', created_at: new Date(), updated_at: new Date() },
      
      // Report permissions
      { id: '220e8400-e29b-41d4-a716-446655440024', name: 'report.generate', description: 'Generate reports', category: 'report', created_at: new Date(), updated_at: new Date() },
      { id: '220e8400-e29b-41d4-a716-446655440025', name: 'report.view', description: 'View reports', category: 'report', created_at: new Date(), updated_at: new Date() }
    ];

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
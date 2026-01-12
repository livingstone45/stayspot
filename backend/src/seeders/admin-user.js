const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      id: '440e8400-e29b-41d4-a716-446655440001',
      first_name: 'System',
      last_name: 'Administrator',
      email: 'admin@stayspot.com',
      password: hashedPassword,
      phone: '(555) 000-0001',
      status: 'active',
      email_verified: true,
      email_verified_at: new Date(),
      profile: {
        bio: 'System administrator with full platform access',
        avatar: null,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    await queryInterface.bulkInsert('users', [adminUser]);

    // Assign system_admin role
    const adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'system_admin' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (adminRole.length > 0) {
      await queryInterface.bulkInsert('user_roles', [{
        id: '770e8400-e29b-41d4-a716-446655440001',
        user_id: adminUser.id,
        role_id: adminRole[0].id,
        assigned_by: adminUser.id,
        assigned_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', {
      user_id: '440e8400-e29b-41d4-a716-446655440001'
    });
    await queryInterface.bulkDelete('users', {
      email: 'admin@stayspot.com'
    });
  }
};
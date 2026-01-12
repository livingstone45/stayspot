const { Company, User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const companies = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Sunset Property Management',
        type: 'property_management',
        description: 'Full-service property management company specializing in residential rentals',
        email: 'info@sunsetpm.com',
        phone: '(555) 123-4567',
        website: 'https://sunsetpm.com',
        address: '123 Main St, Suite 100',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        country: 'US',
        status: 'active',
        settings: {
          auto_rent_collection: true,
          maintenance_notifications: true,
          tenant_portal_enabled: true
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Downtown Realty Group',
        type: 'real_estate',
        description: 'Commercial and residential real estate investment company',
        email: 'contact@downtownrealty.com',
        phone: '(555) 987-6543',
        website: 'https://downtownrealty.com',
        address: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'US',
        status: 'active',
        settings: {
          auto_rent_collection: false,
          maintenance_notifications: true,
          tenant_portal_enabled: true
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Green Valley Apartments',
        type: 'apartment_complex',
        description: 'Luxury apartment complex with modern amenities',
        email: 'leasing@greenvalley.com',
        phone: '(555) 456-7890',
        website: 'https://greenvalley.com',
        address: '789 Valley Road',
        city: 'Austin',
        state: 'TX',
        zip_code: '73301',
        country: 'US',
        status: 'active',
        settings: {
          auto_rent_collection: true,
          maintenance_notifications: true,
          tenant_portal_enabled: true
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('companies', companies);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
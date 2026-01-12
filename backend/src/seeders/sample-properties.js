module.exports = {
  up: async (queryInterface, Sequelize) => {
    const properties = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        name: 'Sunset Apartments',
        type: 'apartment',
        description: 'Modern apartment complex with pool and fitness center',
        address: '123 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90028',
        country: 'US',
        latitude: 34.0928,
        longitude: -118.3287,
        total_units: 24,
        occupied_units: 22,
        monthly_rent: 2500,
        property_size: 15000,
        year_built: 2018,
        amenities: ['pool', 'gym', 'parking', 'laundry'],
        status: 'active',
        company_id: '550e8400-e29b-41d4-a716-446655440001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        name: 'Downtown Loft Complex',
        type: 'loft',
        description: 'Urban loft spaces in the heart of downtown',
        address: '456 Downtown Ave',
        city: 'New York',
        state: 'NY',
        zip_code: '10013',
        country: 'US',
        latitude: 40.7589,
        longitude: -73.9851,
        total_units: 18,
        occupied_units: 16,
        monthly_rent: 3200,
        property_size: 12000,
        year_built: 2020,
        amenities: ['rooftop', 'concierge', 'parking'],
        status: 'active',
        company_id: '550e8400-e29b-41d4-a716-446655440002',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'Green Valley Residences',
        type: 'townhouse',
        description: 'Family-friendly townhouses with private yards',
        address: '789 Valley Road',
        city: 'Austin',
        state: 'TX',
        zip_code: '78704',
        country: 'US',
        latitude: 30.2672,
        longitude: -97.7431,
        total_units: 12,
        occupied_units: 11,
        monthly_rent: 1800,
        property_size: 8000,
        year_built: 2019,
        amenities: ['yard', 'garage', 'playground'],
        status: 'active',
        company_id: '550e8400-e29b-41d4-a716-446655440003',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('properties', properties);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('properties', null, {});
  }
};
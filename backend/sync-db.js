const { sequelize } = require('./src/models');

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
}

syncDatabase();

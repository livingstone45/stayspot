const { Sequelize } = require('sequelize')
require('dotenv').config()

// Database configuration
const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stayspot_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+00:00',
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_TEST || 'stayspot_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    timezone: '+00:00',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      typeCast: true,
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    timezone: '+00:00',
  },
}

const environment = process.env.NODE_ENV || 'development'
const dbConfig = config[environment]

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define,
    dialectOptions: dbConfig.dialectOptions,
    timezone: dbConfig.timezone,
    
    // Additional options
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      max: 3,
    },
    
    // Hooks for connection events
    hooks: {
      afterConnect: (connection, config) => {
        console.log('✅ Database connection established successfully')
      },
    },
  }
)

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection has been established successfully.')
    return true
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message)
    return false
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    // Test connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error('Failed to establish database connection')
    }

    // Sync models in development
    if (environment === 'development') {
      console.log('🔄 Synchronizing database models...')
      await sequelize.sync({ alter: true })
      console.log('✅ Database models synchronized successfully')
    }

    // Run migrations in production
    if (environment === 'production') {
      console.log('🔄 Running database migrations...')
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)
      
      try {
        await execAsync('npx sequelize-cli db:migrate')
        console.log('✅ Database migrations completed successfully')
      } catch (migrationError) {
        console.error('❌ Migration error:', migrationError.message)
        throw migrationError
      }
    }

    return sequelize
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    throw error
  }
}

// Close database connection
async function closeDatabase() {
  try {
    await sequelize.close()
    console.log('✅ Database connection closed successfully')
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message)
    throw error
  }
}

// Database health check
async function healthCheck() {
  try {
    await sequelize.authenticate()
    
    // Get connection info
    const [results] = await sequelize.query(`
      SELECT 
        CONNECTION_ID() as connection_id,
        DATABASE() as database_name,
        USER() as user,
        VERSION() as version,
        NOW() as current_time
    `)
    
    return {
      status: 'healthy',
      connection: results[0],
      pool: {
        total: sequelize.connectionManager.pool.size,
        used: sequelize.connectionManager.pool.used,
        waiting: sequelize.connectionManager.pool.pending,
      },
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    }
  }
}

// Get database statistics
async function getDatabaseStats() {
  try {
    const [tableStats] = await sequelize.query(`
      SELECT 
        table_name,
        table_rows,
        data_length,
        index_length,
        (data_length + index_length) as total_size
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      ORDER BY total_size DESC
    `)

    const [dbSize] = await sequelize.query(`
      SELECT 
        SUM(data_length + index_length) as total_size,
        COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `)

    return {
      tables: tableStats,
      summary: dbSize[0],
    }
  } catch (error) {
    console.error('Error getting database stats:', error.message)
    return null
  }
}

// Backup database (development only)
async function backupDatabase() {
  if (environment === 'production') {
    throw new Error('Database backup should be handled by production infrastructure')
  }

  try {
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)
    const path = require('path')
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(__dirname, '../../database/backups', `backup-${timestamp}.sql`)
    
    const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.username} ${dbConfig.password ? `-p${dbConfig.password}` : ''} ${dbConfig.database} > ${backupFile}`
    
    await execAsync(command)
    console.log(`✅ Database backup created: ${backupFile}`)
    
    return backupFile
  } catch (error) {
    console.error('❌ Database backup failed:', error.message)
    throw error
  }
}

module.exports = {
  sequelize,
  config,
  testConnection,
  initializeDatabase,
  closeDatabase,
  healthCheck,
  getDatabaseStats,
  backupDatabase,
}
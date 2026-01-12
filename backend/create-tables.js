const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'stayspot_db',
    });

    console.log('Creating tables...');

    // Create roles table first
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id CHAR(36) BINARY PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        level INT DEFAULT 10,
        is_active BOOLEAN DEFAULT true,
        is_system BOOLEAN DEFAULT false,
        company_id CHAR(36) BINARY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ roles table created');

    // Create companies table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS companies (
        id CHAR(36) BINARY PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        settings JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ companies table created');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) BINARY PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar VARCHAR(500),
        date_of_birth DATE,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires DATETIME,
        two_factor_enabled BOOLEAN DEFAULT false,
        two_factor_secret VARCHAR(255),
        last_login_at DATETIME,
        last_activity_at DATETIME,
        login_attempts INT DEFAULT 0,
        lock_until DATETIME,
        company_id CHAR(36) BINARY,
        portfolio_ids JSON DEFAULT '[]',
        property_ids JSON DEFAULT '[]',
        preferences JSON DEFAULT '{}',
        api_key VARCHAR(255) UNIQUE,
        api_usage_count INT DEFAULT 0,
        last_api_access_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `);
    console.log('✅ users table created');

    // Create user_roles table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id CHAR(36) BINARY PRIMARY KEY,
        user_id CHAR(36) BINARY NOT NULL,
        role_id CHAR(36) BINARY NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (role_id) REFERENCES roles(id),
        UNIQUE KEY unique_user_role (user_id, role_id)
      )
    `);
    console.log('✅ user_roles table created');

    // Create audit_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id CHAR(36) BINARY PRIMARY KEY,
        user_id CHAR(36) BINARY,
        action VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        company_id CHAR(36) BINARY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `);
    console.log('✅ audit_logs table created');

    // Create default roles
    const roles = ['tenant', 'landlord', 'company_admin', 'admin'];
    for (const role of roles) {
      await connection.execute(
        `INSERT IGNORE INTO roles (id, name, level) VALUES (UUID(), ?, ?)`,
        [role, role === 'admin' ? 1 : role === 'company_admin' ? 5 : 10]
      );
    }
    console.log('✅ Default roles created');

    await connection.end();
    console.log('\n✅ Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
}

createTables();

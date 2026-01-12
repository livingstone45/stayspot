/**
 * Database initialization script
 * Run this once to create the stayspot database
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    // Create connection without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'stayspot';

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' is ready.`);

    // Select the database
    await connection.execute(`USE ${dbName}`);

    // Close connection
    await connection.end();
    console.log('✅ Database initialization successful.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Make sure MySQL is running and credentials in .env are correct.');
    process.exit(1);
  }
}

initializeDatabase();

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUser() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'stayspot_db',
    });

    const [rows] = await connection.execute(
      'SELECT id, email, first_name, last_name FROM users WHERE email = ?',
      ['alice@test.com']
    );

    if (rows.length > 0) {
      console.log('✅ User found in database:');
      console.log(rows[0]);
    } else {
      console.log('❌ User not found');
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();

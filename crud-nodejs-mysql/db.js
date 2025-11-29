const mysql = require('mysql2/promise');

// Values will come from Docker Compose environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydb'
});

module.exports = pool;

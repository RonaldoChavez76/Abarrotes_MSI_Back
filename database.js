"use strict";

const mysql = require('mysql2/promise');

// Crear la conexión usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('DB is connected');
        connection.release();
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
})();

module.exports = pool;

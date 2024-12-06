"use strict";

const mysql = require('mysql2/promise'); // Usamos mysql2 con soporte para promesas
const keys = require('./keys'); // Importamos la configuración

// Crear la conexión usando mysql2/promise
const pool = mysql.createPool({
    host: keys.database.host,
    user: keys.database.user,
    password: keys.database.password,
    database: keys.database.database,
    port: keys.database.port,
    waitForConnections: true, // Para manejar múltiples conexiones
    connectionLimit: 10,      // Límite de conexiones en el pool
    queueLimit: 0             // Sin límite de cola
});

// Probar la conexión
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('DB is connected');
        connection.release(); // Liberar la conexión al pool
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
})();

module.exports = pool;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

require('dotenv').config(); // Carga las variables desde el archivo .env

exports.default = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'testdb',
        port: process.env.DB_PORT || 3306
    }
};

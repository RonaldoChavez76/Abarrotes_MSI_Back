"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

require('dotenv').config();

exports.default = {
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
};

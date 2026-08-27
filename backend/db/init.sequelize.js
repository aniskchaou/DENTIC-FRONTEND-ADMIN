'use strict';

const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dialect  = process.env.DB_DIALECT  || 'postgres';
const host     = process.env.DB_HOST     || 'localhost';
const port     = parseInt(process.env.DB_PORT || (dialect === 'mysql' ? '3306' : '5432'), 10);
const database = process.env.DB_NAME     || 'dentic';
const username = process.env.DB_USER     || 'postgres';
const password = process.env.DB_PASSWORD || '';

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;

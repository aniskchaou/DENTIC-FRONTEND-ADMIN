const { Sequelize } = require('sequelize');

const DEMO_MODE = false;

let sequelize;

if (DEMO_MODE) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  console.log("Running in DEMO MODE with in-memory SQLite (cache).");
} else {

  sequelize = new Sequelize(
    'dentic',
    'postgres',
    'admin', 
    {
      host: 'localhost',
      dialect: 'postgres',
      // dialectOptions: {
      // ssl: {
      //   require: false,
      //   rejectUnauthorized: false, // For self-signed or managed certs
      // }
    // },
      logging: true,
    }
  );
  console.log("Running in PRODUCTION MODE with PostgreSQL database.");
}

module.exports = sequelize;

const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DB, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD,
} = process.env;

const sequelize = new Sequelize(DB, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT,
});

sequelize.authenticate()
  .then(
    () => console.log('Connected to DB'),

    (err) => console.log(`Error: ${err}`),
);

module.exports = sequelize;

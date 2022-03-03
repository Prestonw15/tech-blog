// import the sequelize from the library
const Sequelize = require('sequelize');

// require dotenv package to hide sensitive info
require('dotenv').config();

let sequelize;
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
// connects us to the db
sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
}

module.exports = sequelize;
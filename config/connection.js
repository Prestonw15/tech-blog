// import the sequelize from the library
const Sequelize = require('sequelize');

// require dotenv package to hide sensitive info
// require('dotenv').config();
// const name = process.env.DB_NAME
// console.log(name)

let sequelize;
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
// connects us to the db
// sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
sequelize = new Sequelize("tech_blog", "root", "Tayson123", {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306
});
}

module.exports = sequelize;
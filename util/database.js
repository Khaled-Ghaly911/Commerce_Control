const Sequelize = require('sequelize');

const sequelize = new Sequelize('commerce_app', 'root', '12345678', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;



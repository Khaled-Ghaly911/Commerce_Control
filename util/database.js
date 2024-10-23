const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('commerce-app', 'root', '12345678', {
    dialect:'mysql',
    host: 'localhost'
});

module.exports = sequelize;
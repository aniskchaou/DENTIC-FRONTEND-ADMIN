
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Message = sequelize.define('message', {
    name: Sequelize.STRING,
    subject: Sequelize.STRING,
    message: Sequelize.STRING,
});


module.exports = Message; 
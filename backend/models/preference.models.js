var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Preferences = sequelize.define('preference', {
    name_business: Sequelize.STRING,
    email: Sequelize.STRING
});


module.exports = Preferences; 
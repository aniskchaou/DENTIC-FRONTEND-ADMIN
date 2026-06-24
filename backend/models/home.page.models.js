var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var HomePage = sequelize.define('home_page', {
    title1: Sequelize.STRING,
    title2: Sequelize.STRING,
    title3: Sequelize.STRING
});


module.exports = HomePage;

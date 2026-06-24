var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var OpeningPage = sequelize.define('opening_page', {
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    intro: Sequelize.STRING
});
module.exports = OpeningPage;

var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var ServicePage = sequelize.define('service_page', {
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    intro: Sequelize.STRING
});
module.exports = ServicePage;
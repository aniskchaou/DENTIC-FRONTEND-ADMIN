
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var ServiceItem = sequelize.define('service_item', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    status: Sequelize.STRING,
    fileName: Sequelize.STRING
});


module.exports = ServiceItem;


  
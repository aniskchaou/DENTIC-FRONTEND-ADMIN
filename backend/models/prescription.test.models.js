var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var PrescriptionTest = sequelize.define('prescription_test', {
    prescription: Sequelize.STRING,
    test: Sequelize.STRING,
    comment: Sequelize.STRING,

});


module.exports = PrescriptionTest; 
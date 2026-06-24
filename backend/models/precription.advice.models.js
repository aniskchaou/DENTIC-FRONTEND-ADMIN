var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var PrescriptionAdvice = sequelize.define('prescription_advice', {
    prescription: Sequelize.STRING
});


module.exports = PrescriptionAdvice; 
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Certificate = sequelize.define('certificate_template', {
//    patient: {  type: Sequelize.INTEGER,references: 'patients',  referencesKey: 'id' },
    name: Sequelize.STRING,
    content: Sequelize.STRING
});
module.exports = Certificate;

var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var LabInvestigation = sequelize.define('test_investigation', {
    name: Sequelize.STRING,
   /* patient: {
        type: Sequelize.INTEGER,
        references: {
            model: 'patients',
            key: 'id',
        }
    },*/
    result:Sequelize.STRING,
    date:Sequelize.STRING,
      patient: {
            type: Sequelize.INTEGER,
            references: {
                model: 'patients',
                key: 'id'
            }
        }
});


module.exports = LabInvestigation;
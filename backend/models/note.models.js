

var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

var Note = sequelize.define('note', {
    name: Sequelize.STRING,
//    patient: {  type: Sequelize.INTEGER,references: 'patients',  referencesKey: 'id' }
    patient: {
          type: Sequelize.INTEGER,
          references: {
              model: 'patients',
              key: 'id'
          }
      }
});


module.exports = Note; 
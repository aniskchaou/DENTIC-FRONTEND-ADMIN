var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var ToDo = sequelize.define('todo', {

    name: Sequelize.STRING,
    status: Sequelize.STRING,
      patient: {
            type: Sequelize.INTEGER
        }
    });


module.exports = ToDo; 
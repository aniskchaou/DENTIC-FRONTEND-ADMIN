

var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var FeedBackPage = sequelize.define('feedback_page', {
//    patient: {  type: Sequelize.INTEGER,references: 'patients',  referencesKey: 'id' },
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING
});
module.exports = FeedBackPage;
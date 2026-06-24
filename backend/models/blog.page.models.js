var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var BlogPage = sequelize.define('blog_page', {
    //    patient: {  type: Sequelize.INTEGER,references: 'patients',  referencesKey: 'id' },
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    intro: Sequelize.STRING
});
module.exports = BlogPage;
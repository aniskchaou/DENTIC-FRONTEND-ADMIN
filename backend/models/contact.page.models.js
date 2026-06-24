var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var BlogPage = sequelize.define('contact_page', {
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    intro: Sequelize.STRING
});
module.exports = BlogPage;
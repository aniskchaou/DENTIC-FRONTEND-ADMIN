
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var TestimonialsPage = sequelize.define('testimonials_page', {
    title: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    intro: Sequelize.STRING
});
module.exports = TestimonialsPage;
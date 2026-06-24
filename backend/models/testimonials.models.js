var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');

var Testimonial = sequelize.define('testimonial', {
    name:Squelize.STRING,
    image: Sequelize.STRING,
    quote: Sequelize.STRING
});


module.exports = Testimonial;
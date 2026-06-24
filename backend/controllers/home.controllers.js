const HomePage = require("../models/home.page.models.js");

const BlogPage = require("../models/blog.page.models");
const TestimonialsPage = require("../models/testimonials.page.models");
const ContactPage = require("../models/contact.page.models");
const OpeningHoursPage = require("../models/openinghours.page.models");
const ServicePage = require("../models/service.page.models.js");
const ServiceItem = require('../models/service.models')
exports.getHome = async function (req, res) {

  const homePagePromise = HomePage.findOne()
  const openingHoursPromise = OpeningHoursPage.findOne()
  const blogPromise = BlogPage.findOne()
  const testimonialsPromise = TestimonialsPage.findOne()
  const contactPromise = ContactPage.findOne()
  const servicePromise = ServicePage.findOne()
  const serviceItems = ServiceItem.findAll()

  Promise
    .all([homePagePromise, openingHoursPromise, blogPromise, testimonialsPromise, contactPromise, servicePromise, serviceItems])
    .then(responses => {
      console.log(responses[6])
      res.render("elements/index", {
        viewTitle: 'Dentic', openingHoursPage: responses[1].dataValues,
        homePage: responses[0].dataValues, blogPage: responses[2].dataValues,
        testimonialsPage: responses[3].dataValues, contactPage: responses[4].dataValues,
        servicePage: responses[5].dataValues, services: responses[6]
      });
      console.log(responses[6].dataValue)
    })
    .catch(err => {
      console.log('**********ERROR RESULT****************');
      console.log(err);
    });
}

exports.getAbout = async function (req, res) {
  res.render("elements/about", { viewTitle: 'About' });
}

exports.getBlog = async function (req, res) {
  res.render("elements/blog", { viewTitle: 'Blog' });
}


exports.getContact = async function (req, res) {
  res.render("elements/contact", { viewTitle: 'Contact' });
}

exports.getElements = async function (req, res) {
  res.render("elements/elements", { viewTitle: 'Elements' });
}

exports.getOpeningHours = async function (req, res) {
  res.render("elements/openinghours", { viewTitle: 'Opening hours' });
}

exports.getPricing = async function (req, res) {
  res.render("elements/pricing", { viewTitle: 'Pricing' });
}

exports.getServices = async function (req, res) {
  res.render("elements/services", { viewTitle: 'Services' });
}
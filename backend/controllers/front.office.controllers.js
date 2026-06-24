
//homepage
const config = require("../config/connection.server");
const { updateHomePage, getHomePage, getServices, getBlogs, getOpeningHours, updateOpeningHours, updateBlogs, updateServices } = require("../services/front.office.services");

exports.getHomePage = (req, res) => {
    getHomePage(res)
};

//service
exports.getServices = (req, res) => {
    getServices(res)
};

//blog
exports.getBlogs = (req, res) => {
    getBlogs(res)
};


exports.getOpeningHours = (req, res) => {
    getOpeningHours(res)
};



exports.updateHomePage = (req, res) => {
    const id = req.params.id;
    updateHomePage(id, req, res)
};


exports.updateServices = (req, res) => {
    const id = req.params.id;
    updateServices(id, req, res)
};


exports.updateBlogs = (req, res) => {
    const id = req.params.id;
    updateBlogs(id, req, res)
};

exports.updateOpeningHours = (req, res) => {
    const id = req.params.id;
    updateOpeningHours(id, req, res)
};

exports.adminPanel = (req, res) => {
    res.writeHead(302, {
        'Location': config.url
    });
    res.end();
};






//contact
/* exports.getContact = (req, res) => {
    getBlogs(res)
}; */

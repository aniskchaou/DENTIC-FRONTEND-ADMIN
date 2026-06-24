const { filterCertificate, deleteCertificateById, createCertificate, findAllCertificates, findCertificateById, updateCertificate, deleteAllCertificates } = require("../../services/certificate.services");

exports.filterCertificate = (req, res) => {
    const patient = req.params.patient;
    const template = req.params.template;
    filterCertificate(patient, template, req, res)
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const patient = {
        date: req.body.date,
        patient: req.body.patient,
        content: req.body.content,
        template: req.body.template
    }

    createCertificate(patient, res)
};

exports.findAll = (req, res) => {
    findAllCertificates(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findCertificateById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateCertificate(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCertificateById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllCertificates(res)
};
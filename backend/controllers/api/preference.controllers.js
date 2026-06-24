const { findPreferenceById, updatePreference, deletePreferenceById, deleteAllPreferences, findAllPreferences, createPreference } = require("../../services/patient.services");

exports.create = (req, res) => {
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const patient = {
        namepatient: req.body.namepatient,
        emailpatient: req.body.emailpatient,
        birth: req.body.birth,
        telephone: req.body.telephone,
        gender: req.body.gender,
        address: req.body.address
    }

    createPreference(patient, res)
};

exports.findAll = (req, res) => {

    findAllPreferences(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findPreferenceById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updatePreference(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deletePreferenceById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllPreferences(req, res)
};
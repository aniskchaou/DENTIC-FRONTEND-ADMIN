const Clinic = require("../models/clinic.models.js");

// Find all clinics (optionally with condition)
exports.findAllClinics = (condition, res) => {
    Clinic.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving clinics."
            });
        });
};

// Find one clinic by ID
exports.findClinicById = (id, res) => {
    Clinic.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving clinic with id=" + id
            });
        });
};

// Create a new clinic
exports.createClinic = (clinic, res) => {
    Clinic.create(clinic)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the clinic."
            });
        });
};

// Update a clinic by ID
exports.updateClinic = (id, req, res) => {
    Clinic.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Clinic was updated successfully." });
            } else {
                res.send({ message: `Cannot update clinic with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating clinic with id=" + id
            });
        });
};

// Delete a clinic by ID
exports.deleteClinicById = (id, res) => {
    Clinic.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Clinic was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete clinic with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete clinic with id=" + id
            });
        });
};

// Delete all clinics
exports.deleteAllClinics = (res) => {
    Clinic.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} clinics were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all clinics."
            });
        });
};
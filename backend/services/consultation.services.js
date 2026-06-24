const Consultation = require("../models/consultation.models.js");

// Find all consultations (optionally with condition)
exports.findAllConsultations = (condition, res) => {
    Consultation.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving consultations."
            });
        });
};

// Find one consultation by ID
exports.findConsultationById = (id, res) => {
    Consultation.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving consultation with id=" + id
            });
        });
};

// Create a new consultation
exports.createConsultation = (consultation, res) => {
    Consultation.create(consultation)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the consultation."
            });
        });
};

// Update a consultation by ID
exports.updateConsultation = (id, req, res) => {
    Consultation.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Consultation was updated successfully." });
            } else {
                res.send({ message: `Cannot update consultation with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating consultation with id=" + id
            });
        });
};

// Delete a consultation by ID
exports.deleteConsultationById = (id, res) => {
    Consultation.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Consultation was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete consultation with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete consultation with id=" + id
            });
        });
};

// Delete all consultations
exports.deleteAllConsultations = (res) => {
    Consultation.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} consultations were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all consultations."
            });
        });
};
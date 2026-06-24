const Diagnosis = require("../models/diagnostic.models.js");

// Find all diagnoses (optionally with condition)
exports.findAllDiagnoses = (condition, res) => {
    Diagnosis.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving diagnoses."
            });
        });
};

// Find one diagnosis by ID
exports.findDiagnosisById = (id, res) => {
    Diagnosis.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving diagnosis with id=" + id
            });
        });
};

// Create a new diagnosis
exports.createDiagnosis = (diagnosis, res) => {
    Diagnosis.create(diagnosis)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the diagnosis."
            });
        });
};

// Update a diagnosis by ID
exports.updateDiagnosis = (id, req, res) => {
    Diagnosis.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Diagnosis was updated successfully." });
            } else {
                res.send({ message: `Cannot update diagnosis with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating diagnosis with id=" + id
            });
        });
};

// Delete a diagnosis by ID
exports.deleteDiagnosisById = (id, res) => {
    Diagnosis.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Diagnosis was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete diagnosis with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete diagnosis with id=" + id
            });
        });
};

// Delete all diagnoses
exports.deleteAllDiagnoses = (res) => {
    Diagnosis.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} diagnoses were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all diagnoses."
            });
        });
};
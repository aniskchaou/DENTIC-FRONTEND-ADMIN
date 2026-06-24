const Medication = require("../models/medication.models.js");

// Find all medications (optionally with condition)
exports.findAllMedications = (condition, res) => {
    Medication.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving medications."
            });
        });
};

// Find one medication by ID
exports.findMedicationById = (id, res) => {
    Medication.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving medication with id=" + id
            });
        });
};

// Create a new medication
exports.createMedication = (medication, res) => {
    Medication.create(medication)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the medication."
            });
        });
};

// Update a medication by ID
exports.updateMedication = (id, req, res) => {
    Medication.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Medication was updated successfully." });
            } else {
                res.send({ message: `Cannot update medication with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating medication with id=" + id
            });
        });
};

// Delete a medication by ID
exports.deleteMedicationById = (id, res) => {
    Medication.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Medication was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete medication with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete medication with id=" + id
            });
        });
};

// Delete all medications
exports.deleteAllMedications = (res) => {
    Medication.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} medications were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all medications."
            });
        });
};
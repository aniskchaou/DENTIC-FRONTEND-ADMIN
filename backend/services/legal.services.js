const LegalCompliance = require("../models/legal.models.js");

// Find all legal compliance records (optionally with condition)
exports.findAllLegalCompliances = (condition, res) => {
    LegalCompliance.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving legal compliance records."
            });
        });
};

// Find one legal compliance record by ID
exports.findLegalComplianceById = (id, res) => {
    LegalCompliance.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving legal compliance record with id=" + id
            });
        });
};

// Create a new legal compliance record
exports.createLegalCompliance = (legalCompliance, res) => {
    LegalCompliance.create(legalCompliance)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the legal compliance record."
            });
        });
};

// Update a legal compliance record by ID
exports.updateLegalCompliance = (id, req, res) => {
    LegalCompliance.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Legal compliance record was updated successfully." });
            } else {
                res.send({ message: `Cannot update legal compliance record with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating legal compliance record with id=" + id
            });
        });
};

// Delete a legal compliance record by ID
exports.deleteLegalComplianceById = (id, res) => {
    LegalCompliance.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Legal compliance record was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete legal compliance record with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete legal compliance record with id=" + id
            });
        });
};

// Delete all legal compliance records
exports.deleteAllLegalCompliances = (res) => {
    LegalCompliance.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} legal compliance records were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all legal compliance records."
            });
        });
};
const Insurance = require("../models/insurance.models.js");

// Find all insurance records (optionally with condition)
exports.findAllInsurances = (condition, res) => {
    Insurance.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving insurance records."
            });
        });
};

// Find one insurance record by ID
exports.findInsuranceById = (id, res) => {
    Insurance.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving insurance record with id=" + id
            });
        });
};

// Create a new insurance record
exports.createInsurance = (insurance, res) => {
    Insurance.create(insurance)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the insurance record."
            });
        });
};

// Update an insurance record by ID
exports.updateInsurance = (id, req, res) => {
    Insurance.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Insurance record was updated successfully." });
            } else {
                res.send({ message: `Cannot update insurance record with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating insurance record with id=" + id
            });
        });
};

// Delete an insurance record by ID
exports.deleteInsuranceById = (id, res) => {
    Insurance.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Insurance record was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete insurance record with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete insurance record with id=" + id
            });
        });
};

// Delete all insurance records
exports.deleteAllInsurances = (res) => {
    Insurance.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} insurance records were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all insurance records."
            });
        });
};
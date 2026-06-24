const Operation = require("../models/operation.models.js");

// Find all operations (optionally with condition)
exports.findAllOperations = (condition, res) => {
    Operation.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving operations."
            });
        });
};

// Find one operation by ID
exports.findOperationById = (id, res) => {
    Operation.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving operation with id=" + id
            });
        });
};

// Create a new operation
exports.createOperation = (operation, res) => {
    Operation.create(operation)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the operation."
            });
        });
};

// Update an operation by ID
exports.updateOperation = (id, req, res) => {
    Operation.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Operation was updated successfully." });
            } else {
                res.send({ message: `Cannot update operation with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating operation with id=" + id
            });
        });
};

// Delete an operation by ID
exports.deleteOperationById = (id, res) => {
    Operation.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Operation was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete operation with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete operation with id=" + id
            });
        });
};

// Delete all operations
exports.deleteAllOperations = (res) => {
    Operation.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} operations were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all operations."
            });
        });
};
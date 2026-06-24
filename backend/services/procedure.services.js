const Procedure = require("../models/procedure.models.js");

// Find all procedures (optionally with condition)
exports.findAllProcedures = (condition, res) => {
    Procedure.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving procedures."
            });
        });
};

// Find one procedure by ID
exports.findProcedureById = (id, res) => {
    Procedure.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving procedure with id=" + id
            });
        });
};

// Create a new procedure
exports.createProcedure = (procedure, res) => {
    Procedure.create(procedure)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the procedure."
            });
        });
};

// Update a procedure by ID
exports.updateProcedure = (id, req, res) => {
    Procedure.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Procedure was updated successfully." });
            } else {
                res.send({ message: `Cannot update procedure with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating procedure with id=" + id
            });
        });
};

// Delete a procedure by ID
exports.deleteProcedureById = (id, res) => {
    Procedure.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Procedure was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete procedure with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete procedure with id=" + id
            });
        });
};

// Delete all procedures
exports.deleteAllProcedures = (res) => {
    Procedure.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} procedures were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all procedures."
            });
        });
};
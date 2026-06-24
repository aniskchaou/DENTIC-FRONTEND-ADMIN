const { LoyaltyProgram } = require("../models/loyalty.models.js");

// Find all loyalty programs (optionally with condition)
exports.findAllLoyaltyPrograms = (condition, res) => {
    LoyaltyProgram.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving loyalty programs."
            });
        });
};

// Find one loyalty program by ID
exports.findLoyaltyProgramById = (id, res) => {
    LoyaltyProgram.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving loyalty program with id=" + id
            });
        });
};

// Create a new loyalty program
exports.createLoyaltyProgram = (loyaltyProgram, res) => {
    LoyaltyProgram.create(loyaltyProgram)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the loyalty program."
            });
        });
};

// Update a loyalty program by ID
exports.updateLoyaltyProgram = (id, req, res) => {
    LoyaltyProgram.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Loyalty program was updated successfully." });
            } else {
                res.send({ message: `Cannot update loyalty program with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating loyalty program with id=" + id
            });
        });
};

// Delete a loyalty program by ID
exports.deleteLoyaltyProgramById = (id, res) => {
    LoyaltyProgram.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Loyalty program was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete loyalty program with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete loyalty program with id=" + id
            });
        });
};

// Delete all loyalty programs
exports.deleteAllLoyaltyPrograms = (res) => {
    LoyaltyProgram.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} loyalty programs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all loyalty programs."
            });
        });
};
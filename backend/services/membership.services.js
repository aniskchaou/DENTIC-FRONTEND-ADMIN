const DentalMembership = require("../models/membership.models.js");

// Find all dental memberships (optionally with condition)
exports.findAllMemberships = (condition, res) => {
    DentalMembership.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving memberships."
            });
        });
};

// Find one dental membership by ID
exports.findMembershipById = (id, res) => {
    DentalMembership.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving membership with id=" + id
            });
        });
};

// Create a new dental membership
exports.createMembership = (membership, res) => {
    DentalMembership.create(membership)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the membership."
            });
        });
};

// Update a dental membership by ID
exports.updateMembership = (id, req, res) => {
    DentalMembership.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Membership was updated successfully." });
            } else {
                res.send({ message: `Cannot update membership with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating membership with id=" + id
            });
        });
};

// Delete a dental membership by ID
exports.deleteMembershipById = (id, res) => {
    DentalMembership.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Membership was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete membership with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete membership with id=" + id
            });
        });
};

// Delete all dental memberships
exports.deleteAllMemberships = (res) => {
    DentalMembership.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} memberships were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all memberships."
            });
        });
};
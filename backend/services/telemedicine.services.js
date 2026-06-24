const Telemedicine = require("../models/telemedecine.models.js");

// Find all telemedicine sessions (optionally with condition)
exports.findAllTelemedicine = (condition, res) => {
    Telemedicine.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving telemedicine sessions."
            });
        });
};

// Find one telemedicine session by ID
exports.findTelemedicineById = (id, res) => {
    Telemedicine.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving telemedicine session with id=" + id
            });
        });
};

// Create a new telemedicine session
exports.createTelemedicine = (session, res) => {
    Telemedicine.create(session)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the telemedicine session."
            });
        });
};

// Update a telemedicine session by ID
exports.updateTelemedicine = (id, req, res) => {
    Telemedicine.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Telemedicine session was updated successfully." });
            } else {
                res.send({ message: `Cannot update telemedicine session with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating telemedicine session with id=" + id
            });
        });
};

// Delete a telemedicine session by ID
exports.deleteTelemedicineById = (id, res) => {
    Telemedicine.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Telemedicine session was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete telemedicine session with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete telemedicine session with id=" + id
            });
        });
};

// Delete all telemedicine sessions
exports.deleteAllTelemedicine = (res) => {
    Telemedicine.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} telemedicine sessions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all telemedicine sessions."
            });
        });
};
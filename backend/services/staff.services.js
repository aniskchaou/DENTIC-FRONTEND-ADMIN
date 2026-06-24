const Staff = require("../models/staff.models.js");

// Find all staff (optionally with condition)
exports.findAllStaff = (condition, res) => {
    Staff.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving staff."
            });
        });
};

// Find one staff member by ID
exports.findStaffById = (id, res) => {
    Staff.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving staff with id=" + id
            });
        });
};

// Create a new staff member
exports.createStaff = (staff, res) => {
    Staff.create(staff)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the staff member."
            });
        });
};

// Update a staff member by ID
exports.updateStaff = (id, req, res) => {
    Staff.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Staff member was updated successfully." });
            } else {
                res.send({ message: `Cannot update staff with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating staff with id=" + id
            });
        });
};

// Delete a staff member by ID
exports.deleteStaffById = (id, res) => {
    Staff.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Staff member was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete staff with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete staff with id=" + id
            });
        });
};

// Delete all staff
exports.deleteAllStaff = (res) => {
    Staff.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} staff members were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all staff."
            });
        });
};
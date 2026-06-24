const StaffSchedule = require("../models/stffschedule.js");

// Find all staff schedules (optionally with condition)
exports.findAllStaffSchedules = (condition, res) => {
    StaffSchedule.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving staff schedules."
            });
        });
};

// Find one staff schedule by ID
exports.findStaffScheduleById = (id, res) => {
    StaffSchedule.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving staff schedule with id=" + id
            });
        });
};

// Create a new staff schedule
exports.createStaffSchedule = (schedule, res) => {
    StaffSchedule.create(schedule)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the staff schedule."
            });
        });
};

// Update a staff schedule by ID
exports.updateStaffSchedule = (id, req, res) => {
    StaffSchedule.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Staff schedule was updated successfully." });
            } else {
                res.send({ message: `Cannot update staff schedule with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating staff schedule with id=" + id
            });
        });
};

// Delete a staff schedule by ID
exports.deleteStaffScheduleById = (id, res) => {
    StaffSchedule.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Staff schedule was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete staff schedule with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete staff schedule with id=" + id
            });
        });
};

// Delete all staff schedules
exports.deleteAllStaffSchedules = (res) => {
    StaffSchedule.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} staff schedules were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all staff schedules."
            });
        });
};
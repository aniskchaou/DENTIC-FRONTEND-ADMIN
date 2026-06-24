
const Appointement = require("../models/appointement.models");

// Get the count of all appointments
exports.getCount = (req, res) => {
    Appointement.count()
        .then(data => {
            res.send({ appointementCount: data });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the appointment count."
            });
        });
};

// Retrieve all appointments
exports.findAllAppointments = (res) => {
    
    Appointement.findAll({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving appointments."
            });
        });
};

// Create a new appointment
exports.createAppointment = (appointmentData, res) => {
    Appointement.create(appointmentData)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the appointment."
            });
        });
};

// Retrieve an appointment by ID
exports.findAppointmentById = (id, res) => {
    Appointement.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Appointment with id=${id} not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving appointment with id=" + id
            });
        });
};

// Update an appointment by ID
exports.updateAppointment = (id, req, res) => {
    Appointement.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Appointment was updated successfully."
                });
            } else {
                res.status(404).send({
                    message: `Cannot update appointment with id=${id}. Maybe appointment was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating appointment with id=" + id
            });
        });
};

// Delete an appointment by ID
exports.deleteAppointmentById = (id, res) => {
    Appointement.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Appointment was deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete appointment with id=${id}. Maybe appointment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete appointment with id=" + id
            });
        });
};

// Delete all appointments
exports.deleteAllAppointments = (res) => {
    Appointement.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} appointments were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all appointments."
            });
        });
};
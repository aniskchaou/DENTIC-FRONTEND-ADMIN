const Doctor = require("../models/doctor.models.js");

// Find all doctors (optionally with condition)
exports.findAllDoctors = (condition, res) => {
    Doctor.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving doctors."
            });
        });
};

// Find one doctor by ID
exports.findDoctorById = (id, res) => {
    Doctor.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving doctor with id=" + id
            });
        });
};

// Create a new doctor
exports.createDoctor = (doctor, res) => {
    Doctor.create(doctor)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the doctor."
            });
        });
};

// Update a doctor by ID
exports.updateDoctor = (id, req, res) => {
    Doctor.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Doctor was updated successfully." });
            } else {
                res.send({ message: `Cannot update doctor with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating doctor with id=" + id
            });
        });
};

// Delete a doctor by ID
exports.deleteDoctorById = (id, res) => {
    Doctor.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Doctor was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete doctor with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete doctor with id=" + id
            });
        });
};

// Delete all doctors
exports.deleteAllDoctors = (res) => {
    Doctor.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} doctors were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all doctors."
            });
        });
};
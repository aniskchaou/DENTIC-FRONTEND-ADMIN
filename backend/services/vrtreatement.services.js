const VRTreatmentSimulation = require("../models/vr.models.js");

// Find all VR treatment simulations (optionally with condition)
exports.findAllVRTreatments = (condition, res) => {
    VRTreatmentSimulation.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving VR treatments."
            });
        });
};

// Find one VR treatment simulation by ID
exports.findVRTreatmentById = (id, res) => {
    VRTreatmentSimulation.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving VR treatment with id=" + id
            });
        });
};

// Create a new VR treatment simulation
exports.createVRTreatment = (vrTreatment, res) => {
    VRTreatmentSimulation.create(vrTreatment)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the VR treatment."
            });
        });
};

// Update a VR treatment simulation by ID
exports.updateVRTreatment = (id, req, res) => {
    VRTreatmentSimulation.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "VR treatment was updated successfully." });
            } else {
                res.send({ message: `Cannot update VR treatment with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating VR treatment with id=" + id
            });
        });
};

// Delete a VR treatment simulation by ID
exports.deleteVRTreatmentById = (id, res) => {
    VRTreatmentSimulation.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "VR treatment was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete VR treatment with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete VR treatment with id=" + id
            });
        });
};

// Delete all VR treatment simulations
exports.deleteAllVRTreatments = (res) => {
    VRTreatmentSimulation.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} VR treatments were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all VR treatments."
            });
        });
};
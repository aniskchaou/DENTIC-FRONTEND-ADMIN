const EquipmentMaintenance = require("../models/equipement.models.js");

// Find all equipment maintenance records (optionally with condition)
exports.findAllEquipment = (condition, res) => {
    EquipmentMaintenance.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving equipment maintenance records."
            });
        });
};

// Find one equipment maintenance record by ID
exports.findEquipmentById = (id, res) => {
    EquipmentMaintenance.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving equipment maintenance record with id=" + id
            });
        });
};

// Create a new equipment maintenance record
exports.createEquipment = (equipment, res) => {
    EquipmentMaintenance.create(equipment)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the equipment maintenance record."
            });
        });
};

// Update an equipment maintenance record by ID
exports.updateEquipment = (id, req, res) => {
    EquipmentMaintenance.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Equipment maintenance record was updated successfully." });
            } else {
                res.send({ message: `Cannot update equipment maintenance record with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating equipment maintenance record with id=" + id
            });
        });
};

// Delete an equipment maintenance record by ID
exports.deleteEquipmentById = (id, res) => {
    EquipmentMaintenance.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Equipment maintenance record was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete equipment maintenance record with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete equipment maintenance record with id=" + id
            });
        });
};

// Delete all equipment maintenance records
exports.deleteAllEquipment = (res) => {
    EquipmentMaintenance.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} equipment maintenance records were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all equipment maintenance records."
            });
        });
};
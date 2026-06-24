const DentalImaging = require("../models/dentalimg.models.js");

// Find all dental imaging records (optionally with condition)
exports.findAllDentalImaging = (condition, res) => {
    DentalImaging.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving dental imaging records."
            });
        });
};

// Find one dental imaging record by ID
exports.findDentalImagingById = (id, res) => {
    DentalImaging.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving dental imaging record with id=" + id
            });
        });
};

// Create a new dental imaging record
exports.createDentalImaging = (imaging, res) => {
    DentalImaging.create(imaging)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the dental imaging record."
            });
        });
};

// Update a dental imaging record by ID
exports.updateDentalImaging = (id, req, res) => {
    DentalImaging.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Dental imaging record was updated successfully." });
            } else {
                res.send({ message: `Cannot update dental imaging record with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating dental imaging record with id=" + id
            });
        });
};

// Delete a dental imaging record by ID
exports.deleteDentalImagingById = (id, res) => {
    DentalImaging.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Dental imaging record was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete dental imaging record with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete dental imaging record with id=" + id
            });
        });
};

// Delete all dental imaging records
exports.deleteAllDentalImaging = (res) => {
    DentalImaging.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} dental imaging records were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all dental imaging records."
            });
        });
};
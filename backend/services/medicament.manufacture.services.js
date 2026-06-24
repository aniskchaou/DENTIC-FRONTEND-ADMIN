
const MedicamentManufacture = require("../models/medicament.manufactue.models");

exports.findAllMedicamentManufactures = (res) => {

    MedicamentManufacture.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

exports.createMedicamentManufacture = (income,res) => {
    MedicamentManufacture.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the MedicamentManufacture."
            });
        });
}

exports.findMedicamentManufactureById = (id) => {
    MedicamentManufacture.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving MedicamentManufacture with id=" + id
            });
        });
}

exports.deleteMedicamentManufactureById = (id, res) => {
    MedicamentManufacture.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "MedicamentManufacture was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete MedicamentManufacture with id=${id}. Maybe MedicamentManufacture was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete MedicamentManufacture with id=" + id
            });
        });
}

exports.updateMedicamentManufacture = (id, req,res) => {
    MedicamentManufacture.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "MedicamentManufacture was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update MedicamentManufacture with id=${id}. Maybe MedicamentManufacture was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating MedicamentManufacture with id=" + id
            });
        });
}

exports.deleteAllMedicamentManufactures = () => {
    MedicamentManufacture.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} MedicamentManufacture were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}

// const Prescription = require("../models/prescription.models");
// const MedicamentPrescription = require("../models/prescription.medicament.models");
// exports.findAllPrescriptions = (res) => {

//     Prescription.findAll({})
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving users."
//             });
//         });
// }

// exports.findAllMedicamentPrescriptions = (id, res) => {

//     MedicamentPrescription.findAll({
//         where: { prescription: id }
//     })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving users."
//             });
//         });
// }

// exports.createPrescription = (p, res) => {
//     Prescription.create(p)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while creating the Prescription."
//             });
//         });
// }

// exports.createMedicamentPrescription = (p, res) => {
//     MedicamentPrescription.create(p)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while creating the Prescription."
//             });
//         });
// }

// exports.findPrescriptionById = (id, res) => {
//     Prescription.findByPk(id)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving Prescription with id=" + id
//             });
//         });
// }








// exports.deletePrescriptionMedicamentById = (id, res) => {
//     MedicamentPrescription.destroy({
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Prescription was deleted successfully!"
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot delete Prescription with id=${id}. Maybe Prescription was not found!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete Prescription with id=" + id
//             });
//         });
// }

// exports.deletePrescriptionById = (id, res) => {
//     Prescription.destroy({
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Prescription was deleted successfully!"
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot delete Prescription with id=${id}. Maybe Prescription was not found!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete Prescription with id=" + id
//             });
//         });
// }

// exports.updatePrescription = (id, req) => {
//     Prescription.update(req.body, {
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Prescription was updated successfully."
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot update Prescription with id=${id}. Maybe Prescription was not found or req.body is empty!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error updating Prescription with id=" + id
//             });
//         });
// }

// exports.deleteAllPrescriptions = () => {
//     Prescription.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Prescription were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all tutorials."
//             });
//         });
// }

// exports.createMedicamentItem = (income) => {
//     Invoice.create(income)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while creating the Invoice."
//             });
//         });
// }


const Prescription = require("../models/prescription.models.js");

// Find all prescriptions (optionally with condition)
exports.findAllPrescriptions = (res) => {
    Prescription.findAll()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving prescriptions."
            });
        });
};

// Find one prescription by ID
exports.findPrescriptionById = (id, res) => {
    Prescription.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving prescription with id=" + id
            });
        });
};

// Create a new prescription
exports.createPrescription = (prescription, res) => {
    Prescription.create(prescription)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the prescription."
            });
        });
};

// Update a prescription by ID
exports.updatePrescription = (id, req, res) => {
    Prescription.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Prescription was updated successfully." });
            } else {
                res.send({ message: `Cannot update prescription with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating prescription with id=" + id
            });
        });
};

// Delete a prescription by ID
exports.deletePrescriptionById = (id, res) => {
    Prescription.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Prescription was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete prescription with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete prescription with id=" + id
            });
        });
};

// Delete all prescriptions
exports.deleteAllPrescriptions = (res) => {
    Prescription.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} prescriptions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all prescriptions."
            });
        });
};
const EmergencyHandling = require("../models/emergency.models.js");
const EmergencyCase = require("../models/emergency.models.js");
const Referral = require("../models/emergency.models.js");

// EmergencyHandling services
exports.findAllEmergencyHandlings = (condition, res) => {
    EmergencyHandling.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving emergency handling records."
            });
        });
};

exports.findEmergencyHandlingById = (id, res) => {
    EmergencyHandling.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving emergency handling record with id=" + id
            });
        });
};

exports.createEmergencyHandling = (record, res) => {
    EmergencyHandling.create(record)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the emergency handling record."
            });
        });
};

exports.updateEmergencyHandling = (id, req, res) => {
    EmergencyHandling.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Emergency handling record was updated successfully." });
            } else {
                res.send({ message: `Cannot update emergency handling record with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating emergency handling record with id=" + id
            });
        });
};

exports.deleteEmergencyHandlingById = (id, res) => {
    EmergencyHandling.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Emergency handling record was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete emergency handling record with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete emergency handling record with id=" + id
            });
        });
};

exports.deleteAllEmergencyHandlings = (res) => {
    EmergencyHandling.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} emergency handling records were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all emergency handling records."
            });
        });
};

// EmergencyCase services
exports.findAllEmergencyCases = (condition, res) => {
    EmergencyCase.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving emergency cases."
            });
        });
};

exports.findEmergencyCaseById = (id, res) => {
    EmergencyCase.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving emergency case with id=" + id
            });
        });
};

exports.createEmergencyCase = (record, res) => {
    EmergencyCase.create(record)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the emergency case."
            });
        });
};

exports.updateEmergencyCase = (id, req, res) => {
    EmergencyCase.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Emergency case was updated successfully." });
            } else {
                res.send({ message: `Cannot update emergency case with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating emergency case with id=" + id
            });
        });
};

exports.deleteEmergencyCaseById = (id, res) => {
    EmergencyCase.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Emergency case was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete emergency case with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete emergency case with id=" + id
            });
        });
};

exports.deleteAllEmergencyCases = (res) => {
    EmergencyCase.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} emergency cases were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all emergency cases."
            });
        });
};

// Referral services
exports.findAllReferrals = (condition, res) => {
    Referral.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving referrals."
            });
        });
};

exports.findReferralById = (id, res) => {
    Referral.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving referral with id=" + id
            });
        });
};

exports.createReferral = (record, res) => {
    Referral.create(record)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the referral."
            });
        });
};

exports.updateReferral = (id, req, res) => {
    Referral.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Referral was updated successfully." });
            } else {
                res.send({ message: `Cannot update referral with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating referral with id=" + id
            });
        });
};

exports.deleteReferralById = (id, res) => {
    Referral.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Referral was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete referral with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete referral with id=" + id
            });
        });
};

exports.deleteAllReferrals = (res) => {
    Referral.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} referrals were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all referrals."
            });
        });
};
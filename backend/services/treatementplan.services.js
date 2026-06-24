const TreatmentPlan = require("../models/treatementplan.models.js");

// Find all treatment plans (optionally with condition)
exports.findAllTreatmentPlans = (condition, res) => {
    TreatmentPlan.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving treatment plans."
            });
        });
};

// Find one treatment plan by ID
exports.findTreatmentPlanById = (id, res) => {
    TreatmentPlan.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Treatment Plan with id=" + id
            });
        });
};

// Create a new treatment plan
exports.createTreatmentPlan = (plan, res) => {
    TreatmentPlan.create(plan)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Treatment Plan."
            });
        });
};

// Update a treatment plan by ID
exports.updateTreatmentPlan = (id, req, res) => {
    TreatmentPlan.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Treatment Plan was updated successfully." });
            } else {
                res.send({ message: `Cannot update Treatment Plan with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Treatment Plan with id=" + id
            });
        });
};

// Delete a treatment plan by ID
exports.deleteTreatmentPlanById = (id, res) => {
    TreatmentPlan.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Treatment Plan was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete Treatment Plan with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Treatment Plan with id=" + id
            });
        });
};

// Delete all treatment plans
exports.deleteAllTreatmentPlans = (res) => {
    TreatmentPlan.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} Treatment Plans were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Treatment Plans."
            });
        });
};
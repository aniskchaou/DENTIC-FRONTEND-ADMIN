const CaseStudy = require("../models/case.models.js");

// Find all case studies (optionally with condition)
exports.findAllCaseStudies = (condition, res) => {
    CaseStudy.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving case studies."
            });
        });
};

// Find one case study by ID
exports.findCaseStudyById = (id, res) => {
    CaseStudy.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving case study with id=" + id
            });
        });
};

// Create a new case study
exports.createCaseStudy = (caseStudy, res) => {
    CaseStudy.create(caseStudy)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the case study."
            });
        });
};

// Update a case study by ID
exports.updateCaseStudy = (id, req, res) => {
    CaseStudy.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Case study was updated successfully." });
            } else {
                res.send({ message: `Cannot update case study with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating case study with id=" + id
            });
        });
};

// Delete a case study by ID
exports.deleteCaseStudyById = (id, res) => {
    CaseStudy.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Case study was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete case study with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete case study with id=" + id
            });
        });
};

// Delete all case studies
exports.deleteAllCaseStudies = (res) => {
    CaseStudy.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} case studies were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all case studies."
            });
        });
};
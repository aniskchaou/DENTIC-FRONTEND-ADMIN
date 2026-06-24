const MarketingCRM = require("../models/marketing.models.js");

// Find all marketing campaigns (optionally with condition)
exports.findAllMarketingCampaigns = (condition, res) => {
    MarketingCRM.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving marketing campaigns."
            });
        });
};

// Find one marketing campaign by ID
exports.findMarketingCampaignById = (id, res) => {
    MarketingCRM.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving marketing campaign with id=" + id
            });
        });
};

// Create a new marketing campaign
exports.createMarketingCampaign = (campaign, res) => {
    MarketingCRM.create(campaign)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the marketing campaign."
            });
        });
};

// Update a marketing campaign by ID
exports.updateMarketingCampaign = (id, req, res) => {
    MarketingCRM.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Marketing campaign was updated successfully." });
            } else {
                res.send({ message: `Cannot update marketing campaign with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating marketing campaign with id=" + id
            });
        });
};

// Delete a marketing campaign by ID
exports.deleteMarketingCampaignById = (id, res) => {
    MarketingCRM.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Marketing campaign was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete marketing campaign with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete marketing campaign with id=" + id
            });
        });
};

// Delete all marketing campaigns
exports.deleteAllMarketingCampaigns = (res) => {
    MarketingCRM.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} marketing campaigns were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all marketing campaigns."
            });
        });
};
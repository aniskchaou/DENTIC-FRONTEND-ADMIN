const {
    findAllMarketingCampaigns,
    findMarketingCampaignById,
    createMarketingCampaign,
    updateMarketingCampaign,
    deleteMarketingCampaignById,
    deleteAllMarketingCampaigns
} = require("../../services/marketing.services");

/**
 * @swagger
 * tags:
 *   name: MarketingCampaign
 *   description: API for managing marketing campaigns
 */

/**
 * @swagger
 * /marketing:
 *   post:
 *     summary: Create a new marketing campaign
 *     tags: [MarketingCampaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Marketing campaign created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.create = (req, res) => {

    createMarketingCampaign(req.body, res);
};

/**
 * @swagger
 * /marketing:
 *   get:
 *     summary: Retrieve all marketing campaigns
 *     tags: [MarketingCampaign]
 *     responses:
 *       200:
 *         description: A list of marketing campaigns
 */
exports.findAll = (req, res) => {
    findAllMarketingCampaigns(null, res);
};

/**
 * @swagger
 * /marketing/{id}:
 *   get:
 *     summary: Get a single marketing campaign by ID
 *     tags: [MarketingCampaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the marketing campaign
 *     responses:
 *       200:
 *         description: Marketing campaign found
 *       404:
 *         description: Campaign not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMarketingCampaignById(id, res);
};

/**
 * @swagger
 * /marketing/{id}:
 *   put:
 *     summary: Update a marketing campaign by ID
 *     tags: [MarketingCampaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the marketing campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *       404:
 *         description: Campaign not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMarketingCampaign(id, req, res);
};

/**
 * @swagger
 * /marketing/{id}:
 *   delete:
 *     summary: Delete a marketing campaign by ID
 *     tags: [MarketingCampaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the marketing campaign
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 *       404:
 *         description: Campaign not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMarketingCampaignById(id, res);
};

/**
 * @swagger
 * /marketing:
 *   delete:
 *     summary: Delete all marketing campaigns
 *     tags: [MarketingCampaign]
 *     responses:
 *       200:
 *         description: All campaigns deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllMarketingCampaigns(res);
};

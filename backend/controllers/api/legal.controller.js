const {
    findAllLegalCompliances,
    findLegalComplianceById,
    createLegalCompliance,
    updateLegalCompliance,
    deleteLegalComplianceById,
    deleteAllLegalCompliances
} = require("../../services/legal.services");

/**
 * @swagger
 * tags:
 *   name: LegalCompliance
 *   description: API for managing legal compliance records
 */

/**
 * @swagger
 * /legal:
 *   post:
 *     summary: Create a new legal compliance record
 *     tags: [LegalCompliance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - documentType
 *             properties:
 *               patientId:
 *                 type: string
 *               documentType:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Legal compliance record created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.create = (req, res) => {
    if (!req.body.patientId || !req.body.documentType) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createLegalCompliance(req.body, res);
};

/**
 * @swagger
 * /legal:
 *   get:
 *     summary: Retrieve all legal compliance records
 *     tags: [LegalCompliance]
 *     responses:
 *       200:
 *         description: A list of legal compliance records
 */
exports.findAll = (req, res) => {
    findAllLegalCompliances(null, res);
};

/**
 * @swagger
 * /legal/{id}:
 *   get:
 *     summary: Get a single legal compliance record by ID
 *     tags: [LegalCompliance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the legal compliance record
 *     responses:
 *       200:
 *         description: Legal compliance record found
 *       404:
 *         description: Record not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findLegalComplianceById(id, res);
};

/**
 * @swagger
 * /legal/{id}:
 *   put:
 *     summary: Update a legal compliance record by ID
 *     tags: [LegalCompliance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the legal compliance record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               documentType:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateLegalCompliance(id, req, res);
};

/**
 * @swagger
 * /legal/{id}:
 *   delete:
 *     summary: Delete a legal compliance record by ID
 *     tags: [LegalCompliance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the legal compliance record
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteLegalComplianceById(id, res);
};

/**
 * @swagger
 * /legal:
 *   delete:
 *     summary: Delete all legal compliance records
 *     tags: [LegalCompliance]
 *     responses:
 *       200:
 *         description: All records deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllLegalCompliances(res);
};

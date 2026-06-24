const { createCertificateTemplate, findAllCertificateTemplates, findCertificateTemplateById, updateCertificateTemplate, deleteCertificateTemplateById, deleteAllCertificateTemplates } = require("../../services/certificate.template.services");


/**
 * @swagger
 * tags:
 *   name: Certificate template
 *   description: API for managing certificate templates
 */




/**
 * @swagger
 * /certificate-templates:
 *   post:
 *     summary: Create a new certificate template
 *     tags: [Certificate template]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certificate template created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user

    const patient = {
        name: req.body.name,
        content: req.body.content
    }

    createCertificateTemplate(patient, res)
};

/**
 * @swagger
 * /certificate-templates:
 *   get:
 *     summary: Get all certificate templates
 *     tags: [Certificate template]
 *     responses:
 *       200:
 *         description: List of all certificate templates
 */
exports.findAll = (req, res) => {
    findAllCertificateTemplates(res)
};

/**
 * @swagger
 * /certificate-templates/{id}:
 *   get:
 *     summary: Get a certificate template by ID
 *     tags: [Certificate template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate template data
 *       404:
 *         description: Certificate template not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findCertificateTemplateById(id, res)
};

/**
 * @swagger
 * /certificate-templates/{id}:
 *   put:
 *     summary: Update a certificate template by ID
 *     tags: [Certificate template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Certificate template updated
 *       404:
 *         description: Certificate template not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateCertificateTemplate(id, req, res)
};

/**
 * @swagger
 * /certificate-templates/{id}:
 *   delete:
 *     summary: Delete a certificate template by ID
 *     tags: [Certificate template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate template deleted
 *       404:
 *         description: Certificate template not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCertificateTemplateById(id, res)
};

/**
 * @swagger
 * /certificate-templates:
 *   delete:
 *     summary: Delete all certificate templates
 *     tags: [Certificate template]
 *     responses:
 *       200:
 *         description: All certificate templates deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllCertificateTemplates(req, res)
};
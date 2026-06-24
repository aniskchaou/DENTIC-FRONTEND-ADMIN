const { getCount, filterCertificate, deleteCertificateById, createCertificate, findAllCertificates, findCertificateById, updateCertificate, deleteAllCertificates } = require("../../services/certificate.services");


/**
 * @swagger
 * tags:
 *   name: Certificate
 *   description: API for managing certificates
 */

/**
 * @swagger
 * /certificates/count:
 *   get:
 *     summary: Get the total number of certificates
 *     tags: [Certificate]
 *     responses:
 *       200:
 *         description: Certificate count
 */
exports.getCount = (req, res) => {
    getCount(req, res)
}

/**
 * @swagger
 * /certificates/filter/{patient}/{template}:
 *   get:
 *     summary: Filter certificates by patient and template
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: patient
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: template
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered certificates
 */
exports.filterCertificate = (req, res) => {
    const patient = req.params.patient;
    const template = req.params.template;
    filterCertificate(patient, template, req, res)
}

/**
 * @swagger
 * /certificates:
 *   post:
 *     summary: Create a new certificate
 *     tags: [Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certificate'
 *     responses:
 *       201:
 *         description: Certificate created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Certificate ID
 *         date:
 *           type: string
 *           format: date
 *           description: Date of certificate issuance
 *           example: "2025-07-30"
 *         patient:
 *           type: string
 *           description: Patient ID (UUID)
 *           example: "11111111-aaaa-bbbb-cccc-111111111111"
 *         content:
 *           type: string
 *           description: Certificate content/details
 *           example: "This is to certify that the patient has completed the dental procedure."
 *         template:
 *           type: string
 *           description: Certificate template type
 *           example: "Completion"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

exports.create = (req, res) => {
    createCertificate(req.body, res)
};

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates
 *     tags: [Certificate]
 *     responses:
 *       200:
 *         description: List of all certificates
 */
exports.findAll = (req, res) => {
    findAllCertificates(res)
};

/**
 * @swagger
 * /certificates/{id}:
 *   get:
 *     summary: Get a certificate by ID
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate data
 *       404:
 *         description: Certificate not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findCertificateById(id, res)
};

/**
 * @swagger
 * /certificates/{id}:
 *   put:
 *     summary: Update a certificate by ID
 *     tags: [Certificate]
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
 *         description: Certificate updated
 *       404:
 *         description: Certificate not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateCertificate(id, req, res)
};

/**
 * @swagger
 * /certificates/{id}:
 *   delete:
 *     summary: Delete a certificate by ID
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate deleted
 *       404:
 *         description: Certificate not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCertificateById(id, res)
};

/**
 * @swagger
 * /certificates:
 *   delete:
 *     summary: Delete all certificates
 *     tags: [Certificate]
 *     responses:
 *       200:
 *         description: All certificates deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllCertificates(res)
};

/**
 * @swagger
 * /ai/certificate-generator:
 *   post:
 *     summary: AI Certificate Generator
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificateType:
 *                 type: string
 *               patientData:
 *                 type: object
 *               treatmentDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Generated certificate text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificateText:
 *                   type: string
 */
exports.certificateGenerator = async (req, res) => {
  try {
    const { certificateType, patientData, treatmentDetails } = req.body;
    // AI logic (demo)
    const certificateText = `This is to certify that ${patientData.name} received ${treatmentDetails.treatment} on ${treatmentDetails.date}. Fit to work: Yes.`;
    res.send({ certificateText });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/certificate-verification:
 *   post:
 *     summary: Document Verification for certificates
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificateData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.certificateVerification = async (req, res) => {
  try {
    const { certificateData } = req.body;
    // AI logic (demo)
    const isValid = true;
    const issues = [];
    res.send({ isValid, issues });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
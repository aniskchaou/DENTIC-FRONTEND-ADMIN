const {
    findAllConsultations,
    findConsultationById,
    createConsultation,
    updateConsultation,
    deleteConsultationById,
    deleteAllConsultations
} = require("../../services/consultation.services");


/**
 * @swagger
 * tags:
 *   name: Consultation
 *   description: API for managing consultations
 */



/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Create a new consultation
 *     tags: [Consultation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultation created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    if (!req.body.patientId || !req.body.doctorId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createConsultation(req.body, res);
};

/**
 * @swagger
 * /consultations:
 *   get:
 *     summary: Get all consultations
 *     tags: [Consultation]
 *     responses:
 *       200:
 *         description: List of all consultations
 */
exports.findAll = (req, res) => {
    findAllConsultations(null, res);
};

/**
 * @swagger
 * /consultations/{id}:
 *   get:
 *     summary: Get a consultation by ID
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation data
 *       404:
 *         description: Consultation not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findConsultationById(id, res);
};

/**
 * @swagger
 * /consultations/{id}:
 *   put:
 *     summary: Update a consultation by ID
 *     tags: [Consultation]
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
 *         description: Consultation updated
 *       404:
 *         description: Consultation not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateConsultation(id, req, res);
};

/**
 * @swagger
 * /consultations/{id}:
 *   delete:
 *     summary: Delete a consultation by ID
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation deleted
 *       404:
 *         description: Consultation not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteConsultationById(id, res);
};

/**
 * @swagger
 * /consultations:
 *   delete:
 *     summary: Delete all consultations
 *     tags: [Consultation]
 *     responses:
 *       200:
 *         description: All consultations deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllConsultations(res);
};
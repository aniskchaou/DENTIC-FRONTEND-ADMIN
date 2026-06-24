const {
    findAllInsurances,
    findInsuranceById,
    createInsurance,
    updateInsurance,
    deleteInsuranceById,
    deleteAllInsurances
} = require("../../services/insurance.services");

/**
 * @swagger
 * tags:
 *   name: Insurance
 *   description: API for managing insurance records
 */


/**
 * @swagger
 * /insurances:
 *   post:
 *     summary: Create a new insurance record
 *     tags: [Insurance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insurance'
 *     responses:
 *       201:
 *         description: Insurance record created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Insurance:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *         providerName:
 *           type: string
 *         policyNumber:
 *           type: string
 *         coverageDetails:
 *           type: string
 *         validFrom:
 *           type: string
 *           format: date
 *         validTo:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
    if (!req.body.patientId || !req.body.providerName) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createInsurance(req.body, res);
};

/**
 * @swagger
 * /insurances:
 *   get:
 *     summary: Get all insurance records
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: List of all insurance records
 */
exports.findAll = (req, res) => {
    findAllInsurances(null, res);
};

/**
 * @swagger
 * /insurances/{id}:
 *   get:
 *     summary: Get an insurance record by ID
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insurance record data
 *       404:
 *         description: Insurance record not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findInsuranceById(id, res);
};

/**
 * @swagger
 * /insurances/{id}:
 *   put:
 *     summary: Update an insurance record by ID
 *     tags: [Insurance]
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
 *         description: Insurance record updated
 *       404:
 *         description: Insurance record not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateInsurance(id, req, res);
};

/**
 * @swagger
 * /insurances/{id}:
 *   delete:
 *     summary: Delete an insurance record by ID
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insurance record deleted
 *       404:
 *         description: Insurance record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteInsuranceById(id, res);
};

/**
 * @swagger
 * /insurances:
 *   delete:
 *     summary: Delete all insurance records
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: All insurance records deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllInsurances(res);
};

/**
 * @swagger
 * /ai/insurance-eligibility:
 *   post:
 *     summary: Insurance Eligibility Checker
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               insuranceInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Eligibility result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eligible:
 *                   type: boolean
 *                 details:
 *                   type: string
 */
exports.insuranceEligibility = async (req, res) => {
  try {
    const { patientId, insuranceInfo } = req.body;
    // AI logic (demo)
    const eligible = true;
    const details = "Patient is eligible for coverage on standard procedures.";
    res.send({ eligible, details });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/smart-claim-filing:
 *   post:
 *     summary: Smart Claim Filing
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatmentData:
 *                 type: object
 *               insuranceInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Auto-filled claim form
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 claimForm:
 *                   type: object
 */
exports.smartClaimFiling = async (req, res) => {
  try {
    const { treatmentData, insuranceInfo } = req.body;
    // AI logic (demo)
    const claimForm = {
      patient: treatmentData.patientName,
      procedure: treatmentData.procedure,
      insuranceId: insuranceInfo.id,
      amount: treatmentData.cost,
      notes: "Auto-filled by AI"
    };
    res.send({ claimForm });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/insurance-fraud-detection:
 *   post:
 *     summary: Insurance Fraud Detection
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claimHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Fraud detection result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suspiciousClaims:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.insuranceFraudDetection = async (req, res) => {
  try {
    const { claimHistory } = req.body;
    // AI logic (demo)
    const suspiciousClaims = ["Claim #1234: Unusual frequency of high-value procedures"];
    res.send({ suspiciousClaims });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
const {
    findAllMedications,
    findMedicationById,
    createMedication,
    updateMedication,
    deleteMedicationById,
    deleteAllMedications
} = require("../../services/medication.services");

/**
 * @swagger
 * tags:
 *   name: Medications
 *   description: Medication management APIs
 */

/**
 * @swagger
 * /api/medications:
 *   post:
 *     summary: Create a new medication
 *     tags: [Medications]
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
 *               dosage:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medication created successfully
 *       400:
 *         description: Bad request - missing name
 */
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createMedication(req.body, res);
};

/**
 * @swagger
 * /api/medications:
 *   get:
 *     summary: Retrieve all medications
 *     tags: [Medications]
 *     responses:
 *       200:
 *         description: A list of medications
 */
exports.findAll = (req, res) => {
    findAllMedications(null, res);
};

/**
 * @swagger
 * /api/medications/{id}:
 *   get:
 *     summary: Get a medication by ID
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medication ID
 *     responses:
 *       200:
 *         description: Medication found
 *       404:
 *         description: Medication not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMedicationById(id, res);
};

/**
 * @swagger
 * /api/medications/{id}:
 *   put:
 *     summary: Update a medication by ID
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medication ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medication updated
 *       404:
 *         description: Medication not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMedication(id, req, res);
};

/**
 * @swagger
 * /api/medications/{id}:
 *   delete:
 *     summary: Delete a medication by ID
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medication ID
 *     responses:
 *       200:
 *         description: Medication deleted
 *       404:
 *         description: Medication not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMedicationById(id, res);
};

/**
 * @swagger
 * /api/medications:
 *   delete:
 *     summary: Delete all medications
 *     tags: [Medications]
 *     responses:
 *       200:
 *         description: All medications deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllMedications(res);
};

/**
 * @swagger
 * /ai/medication-reminder:
 *   post:
 *     summary: AI Medication Reminder
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
 *               medicationSchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Reminder message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reminderMessage:
 *                   type: string
 */
exports.medicationReminder = async (req, res) => {
  try {
    const { patientId, medicationSchedule } = req.body;
    // AI logic (demo)
    const reminderMessage = "It's time to take your prescribed antibiotics. Please confirm once taken.";
    res.send({ reminderMessage });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/interaction-checker:
 *   post:
 *     summary: Drug Interaction Checker
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Interaction warnings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interactions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.interactionChecker = async (req, res) => {
  try {
    const { prescriptions } = req.body;
    // AI logic (demo)
    const interactions = ["Avoid taking ibuprofen with aspirin."];
    res.send({ interactions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/adherence-prediction:
 *   post:
 *     summary: Medication Adherence Prediction
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
 *               medicationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Adherence prediction and motivational message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likelyToSkip:
 *                   type: boolean
 *                 motivationalNudge:
 *                   type: string
 */
exports.adherencePrediction = async (req, res) => {
  try {
    const { patientId, medicationHistory } = req.body;
    // AI logic (demo)
    const likelyToSkip = true;
    const motivationalNudge = "Taking your medication regularly helps you heal faster!";
    res.send({ likelyToSkip, motivationalNudge });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

const { deletePrescriptionMedicamentById, findAllMedicamentPrescriptions, createMedicamentPrescription, findPrescriptionById, updatePrescription, deletePrescriptionById, deleteAllPrescriptions, findAllPrescriptions, createPrescription } = require("../../services/prescription.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: Prescription
 *   description: API for managing prescriptions
 */


/**
 * @swagger
 * /medicament:
 *   post:
 *     summary: Create a new medicament prescription item
 *     tags: [Prescription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dose:
 *                 type: string
 *               medicament:
 *                 type: string
 *               duration:
 *                 type: string
 *               prescription:
 *                 type: string
 *             required:
 *               - dose
 *               - medicament
 *               - duration
 *               - prescription
 *     responses:
 *       200:
 *         description: Medicament prescription created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.createMedicamentItem = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const patient = {
        dose: req.body.dose,
        medicament: req.body.medicament,
        duration: req.body.duration,
        prescription: req.body.prescription
    }
    console.log(patient)
    createMedicamentPrescription(patient, res)
};

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags:
 *       - Prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prescription'
 *     responses:
 *       200:
 *         description: Prescription created successfully
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Prescription:
 *       type: object
 *       required:
 *         - patient
 *         - pression
 *         - temperature
 *         - problem
 *       properties:
 *         id:
 *           type: string
 *         patient:
 *           type: string
 *         pression:
 *           type: string
 *         temperature:
 *           type: string
 *         problem:
 *           type: string
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 */

exports.create = (req, res) => {

    createPrescription(req.body, res)
};

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: Retrieve a list of all prescriptions
 *     tags:
 *       - Prescription
 *     responses:
 *       200:
 *         description: A list of prescriptions
 */
exports.findAll = (req, res) => {
    findAllPrescriptions(res)
};

/**
 * @swagger
 * /prescriptions/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prescription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription details
 *       404:
 *         description: Prescription not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findPrescriptionById(id, res)
};

/**
 * @swagger
 * /prescriptions/{id}/medicaments:
 *   get:
 *     summary: Get all medicament prescriptions for a given prescription ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prescription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of medicament prescriptions
 */
exports.findAllMedicamentPrescriptions = (req, res) => {
    const id = req.params.id;
    findAllMedicamentPrescriptions(id, res)
};

/**
 * @swagger
 * /prescriptions/{id}:
 *   put:
 *     summary: Update a prescription by ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prescription ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *               pression:
 *                 type: string
 *               temperature:
 *                 type: string
 *               problem:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       404:
 *         description: Prescription not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updatePrescription(id, req, res)
};

/**
 * @swagger
 * /prescriptions/{id}:
 *   delete:
 *     summary: Delete a prescription by ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prescription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *       404:
 *         description: Prescription not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deletePrescriptionById(id, res)
};

/**
 * @swagger
 * /medicament/{id}:
 *   delete:
 *     summary: Delete a medicament prescription by ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Medicament prescription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicament prescription deleted successfully
 *       404:
 *         description: Medicament prescription not found
 */
exports.deleteMedicament = (req, res) => {
    const id = req.params.id;
    deletePrescriptionMedicamentById(id, res)
};

/**
 * @swagger
 * /prescriptions:
 *   delete:
 *     summary: Delete all prescriptions
 *     tags:
 *       - Prescription
 *     responses:
 *       200:
 *         description: All prescriptions deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllPrescriptions(req, res)
};

/**
 * @swagger
 * /ai/prescription-assistant:
 *   post:
 *     summary: AI Prescription Assistant (dosage & duration)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medication:
 *                 type: string
 *               patientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Suggested dosage and duration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dosage:
 *                   type: string
 *                 duration:
 *                   type: string
 */
exports.prescriptionAssistant = async (req, res) => {
  try {
    const { medication, patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Medication: ${medication}
      Patient data: ${JSON.stringify(patientData)}
      Suggest the correct dosage and duration for this medication for the given patient.
      Respond ONLY with a JSON object: { "dosage": "string", "duration": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        dosage: "",
        duration: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/prescription-error-detection:
 *   post:
 *     summary: Prescription Error Detection
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescription:
 *                 type: object
 *     responses:
 *       200:
 *         description: Error flags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.prescriptionErrorDetection = async (req, res) => {
  try {
    const { prescription } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Prescription details: ${JSON.stringify(prescription)}
      Check for potential errors such as overdoses, wrong combinations, or missing details in this prescription.
      Respond ONLY with a JSON object: { "errors": [array of strings] }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        errors: []
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/prescription-explanation:
 *   post:
 *     summary: Digital Explanation of prescription
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescription:
 *                 type: object
 *     responses:
 *       200:
 *         description: Simple explanation for patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 explanation:
 *                   type: string
 */
exports.prescriptionExplanation = async (req, res) => {
  try {
    const { prescription } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Prescription details: ${JSON.stringify(prescription)}
      Explain this prescription in simple, patient-friendly language.
      Respond ONLY with a JSON object: { "explanation": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        explanation: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

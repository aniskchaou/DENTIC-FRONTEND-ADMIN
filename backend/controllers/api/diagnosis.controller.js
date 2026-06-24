const {
    findAllDiagnoses,
    findDiagnosisById,
    createDiagnosis,
    updateDiagnosis,
    deleteDiagnosisById,
    deleteAllDiagnoses
} = require("../../services/diagnostic.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: Diagnosis
 *   description: API for managing diagnoses
 */



/**
 * @swagger
 * /diagnoses:
 *   post:
 *     summary: Create a new diagnosis
 *     tags: [Diagnosis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Diagnosis'
 *     responses:
 *       201:
 *         description: Diagnosis created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Diagnosis:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Diagnosis ID
 *         patientId:
 *           type: string
 *           description: Reference to the patient
 *           example: "11111111-aaaa-bbbb-cccc-111111111111"
 *         doctorId:
 *           type: string
 *           description: Reference to the doctor
 *           example: "22222222-bbbb-cccc-dddd-222222222222"
 *         diagnosis:
 *           type: string
 *           description: Diagnosis details
 *           example: "Acute gingivitis"
 *         notes:
 *           type: string
 *           description: Additional notes
 *           example: "Patient should return for follow-up in 2 weeks."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
// Create a new diagnosis
exports.create = (req, res) => {

    createDiagnosis(req.body, res);
};

/**
 * @swagger
 * /diagnoses:
 *   get:
 *     summary: Get all diagnoses
 *     tags: [Diagnosis]
 *     responses:
 *       200:
 *         description: List of all diagnoses
 */
// Retrieve all diagnoses
exports.findAll = (req, res) => {
    findAllDiagnoses(null, res);
};

/**
 * @swagger
 * /diagnoses/{id}:
 *   get:
 *     summary: Get a diagnosis by ID
 *     tags: [Diagnosis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diagnosis data
 *       404:
 *         description: Diagnosis not found
 */
// Find a single diagnosis by ID
exports.findOne = (req, res) => {
    const id = req.params.id;
    findDiagnosisById(id, res);
};

/**
 * @swagger
 * /diagnoses/{id}:
 *   put:
 *     summary: Update a diagnosis by ID
 *     tags: [Diagnosis]
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
 *         description: Diagnosis updated
 *       404:
 *         description: Diagnosis not found
 */
// Update a diagnosis by ID
exports.update = (req, res) => {
    const id = req.params.id;
    updateDiagnosis(id, req, res);
};

/**
 * @swagger
 * /diagnoses/{id}:
 *   delete:
 *     summary: Delete a diagnosis by ID
 *     tags: [Diagnosis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diagnosis deleted
 *       404:
 *         description: Diagnosis not found
 */
// Delete a diagnosis by ID
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteDiagnosisById(id, res);
};

/**
 * @swagger
 * /diagnoses:
 *   delete:
 *     summary: Delete all diagnoses
 *     tags: [Diagnosis]
 *     responses:
 *       200:
 *         description: All diagnoses deleted
 */
// Delete all diagnoses
exports.deleteAll = (req, res) => {
    deleteAllDiagnoses(res);
};

/**
 * @swagger
 * /ai/symptom-checker:
 *   post:
 *     summary: AI Symptom Checker
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Possible conditions and urgency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conditions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 urgency:
 *                   type: string
 */
exports.symptomChecker = async (req, res) => {
  try {
    const { symptoms } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Symptoms: ${JSON.stringify(symptoms)}
      List possible dental conditions and the urgency level for these symptoms.
      Respond ONLY with a JSON object: { "conditions": [array of strings], "urgency": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        conditions: [],
        urgency: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/decision-support:
 *   post:
 *     summary: Decision Support System for Treatment Plan
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               history:
 *                 type: object
 *     responses:
 *       200:
 *         description: Suggested treatment plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 treatmentPlan:
 *                   type: string
 */
exports.decisionSupport = async (req, res) => {
  try {
    const { diagnosis, history } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Diagnosis: ${diagnosis}
      Patient history: ${JSON.stringify(history)}
      Suggest the most appropriate dental treatment plan for this patient. Respond ONLY with a JSON object: { "treatmentPlan": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        treatmentPlan: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/risk-prediction:
 *   post:
 *     summary: Risk Prediction for long-term oral health
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Predicted risks and screening prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 risks:
 *                   type: array
 *                   items:
 *                     type: string
 *                 screeningPrompt:
 *                   type: string
 */
exports.riskPrediction = async (req, res) => {
  try {
    const { patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Patient data: ${JSON.stringify(patientData)}
      Predict long-term oral health risks for this patient and suggest any screening prompts.
      Respond ONLY with a JSON object: { "risks": [array of strings], "screeningPrompt": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        risks: [],
        screeningPrompt: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
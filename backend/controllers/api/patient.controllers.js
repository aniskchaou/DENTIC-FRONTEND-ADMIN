const { getPatientByDate, searchPatient, getCount, findPatientById, updatePatient, deletePatientById, deleteAllPatients, findAllPatients, createPatient } = require("../../services/patient.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");


/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: API for managing patient records
 */

/**
 * @swagger
 * /patients/date:
 *   get:
 *     summary: Get patients by date
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of patients by date
 */
exports.getPatientByDate = (req, res) => {
    getPatientByDate(res)
};

/**
 * @swagger
 * /patients/search/{patient}:
 *   get:
 *     summary: Search for a patient
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: patient
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient search results
 */
exports.searchPatient = (req, res) => {
    searchPatient(req.params.patient, req, res)
};

/**
 * @swagger
 * /patients/count:
 *   get:
 *     summary: Get patient count
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Patient count
 */
exports.getCount = (req, res) => {
    getCount(req, res)
}

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         namepatient:
 *           type: string
 *         emailpatient:
 *           type: string
 *         birth:
 *           type: string
 *           format: date
 *         telephone:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {

    createPatient(req.body, res)
};

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of all patients
 */
exports.findAll = (req, res) => {
    findAllPatients(res)
};

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Patient not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findPatientById(id, res)
};

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patient]
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
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updatePatient(id, req, res)
};

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deletePatientById(id, res)
};

/**
 * @swagger
 * /patients:
 *   delete:
 *     summary: Delete all patients
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: All patients deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllPatients(req, res)
};

/**
 * @swagger
 * /ai/health-profile-summary:
 *   post:
 *     summary: AI Health Profile Summary
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
 *     responses:
 *       200:
 *         description: Patient health summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 */
exports.healthProfileSummary = async (req, res) => {
  try {
    const { patientId, history, imaging, treatments } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Patient ID: ${patientId}
      History: ${JSON.stringify(history)}
      Imaging: ${JSON.stringify(imaging)}
      Treatments: ${JSON.stringify(treatments)}
      Summarize this patient's dental health profile in clear, concise language.
      Respond ONLY with a JSON object: { "summary": "string" }
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
        summary: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/risk-stratification:
 *   post:
 *     summary: Risk Stratification
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
 *         description: High-risk identification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 riskLevel:
 *                   type: string
 *                 riskFactors:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.riskStratification = async (req, res) => {
  try {
    const { patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Patient data: ${JSON.stringify(patientData)}
      Identify if this patient is high-risk (e.g., smoker, diabetic, elderly, poor oral hygiene).
      Respond ONLY with a JSON object: { "riskLevel": "string", "riskFactors": [array of strings] }
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
        riskLevel: "Unknown",
        riskFactors: [raw]
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/predictive-recall:
 *   post:
 *     summary: Predictive Recall System
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
 *               lastVisit:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Recall prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dueForCheckup:
 *                   type: boolean
 *                 suggestedDate:
 *                   type: string
 *                   format: date
 */
exports.predictiveRecall = async (req, res) => {
  try {
    const { patientId, lastVisit } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Patient ID: ${patientId}
      Last visit date: ${lastVisit}
      Predict if this patient is due for a dental check-up and suggest a suitable date for recall.
      Respond ONLY with a JSON object: { "dueForCheckup": boolean, "suggestedDate": "string" }
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
        dueForCheckup: false,
        suggestedDate: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
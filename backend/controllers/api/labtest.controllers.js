const Appointement = require("../../models/appointement.models");
const { findLabTestById, updateLabTest, deleteLabTestById, deleteAllLabTests, findAllLabTests, createLabTest } = require("../../services/labtest.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: LabTest
 *   description: API for managing lab test records
 */

/**
 * @swagger
 * /labtests:
 *   post:
 *     summary: Create a new lab test
 *     tags: [LabTest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LabTest'
 *     responses:
 *       201:
 *         description: Lab test created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LabTest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *         doctorId:
 *           type: string
 *         clinicId:
 *           type: string
 *         testName:
 *           type: string
 *         testCategory:
 *           type: string
 *         testDescription:
 *           type: string
 *         sampleType:
 *           type: string
 *         sampleCollectionDate:
 *           type: string
 *           format: date-time
 *         sampleCollectedBy:
 *           type: string
 *         testStatus:
 *           type: string
 *         result:
 *           type: object
 *         laboratoryId:
 *           type: string
 *         testCost:
 *           type: number
 *         insuranceCovered:
 *           type: string
 *         paymentStatus:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    createLabTest(req.body, res)
};

/**
 * @swagger
 * /labtests:
 *   get:
 *     summary: Get all lab tests
 *     tags: [LabTest]
 *     responses:
 *       200:
 *         description: List of all lab tests
 */
exports.findAll = (req, res) => {
    findAllLabTests(res)
};

/**
 * @swagger
 * /labtests/{id}:
 *   get:
 *     summary: Get a lab test by ID
 *     tags: [LabTest]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab test data
 *       404:
 *         description: Lab test not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findLabTestById(id, res)
};

/**
 * @swagger
 * /labtests/{id}:
 *   put:
 *     summary: Update a lab test by ID
 *     tags: [LabTest]
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
 *         description: Lab test updated
 *       404:
 *         description: Lab test not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateLabTest(id, req, res)
};

/**
 * @swagger
 * /labtests/{id}:
 *   delete:
 *     summary: Delete a lab test by ID
 *     tags: [LabTest]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab test deleted
 *       404:
 *         description: Lab test not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteLabTestById(id, res)
};

/**
 * @swagger
 * /labtests:
 *   delete:
 *     summary: Delete all lab tests
 *     tags: [LabTest]
 *     responses:
 *       200:
 *         description: All lab tests deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllLabTests(req, res)
};

/**
 * @swagger
 * /ai/lab-report-analysis:
 *   post:
 *     summary: AI Lab Report Analysis
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               labResults:
 *                 type: object
 *     responses:
 *       200:
 *         description: Abnormalities flagged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flaggedIssues:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.labReportAnalysis = async (req, res) => {
  try {
    const { labResults } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Lab results: ${JSON.stringify(labResults)}
      Read these lab results (blood tests, biopsies, etc.) and flag any abnormalities or issues.
      Respond ONLY with a JSON object: { "flaggedIssues": [array of strings] }
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
        flaggedIssues: [raw]
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/cross-diagnosis-support:
 *   post:
 *     summary: Cross-Diagnosis Support (lab results + dental issues)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               labResults:
 *                 type: object
 *               dentalHistory:
 *                 type: object
 *     responses:
 *       200:
 *         description: Linked findings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 linkedFindings:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.crossDiagnosisSupport = async (req, res) => {
  try {
    const { labResults, dentalHistory } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Lab results: ${JSON.stringify(labResults)}
      Dental history: ${JSON.stringify(dentalHistory)}
      Identify and explain any links between these lab results and dental issues (e.g., diabetes impacting gum health).
      Respond ONLY with a JSON object: { "linkedFindings": [array of strings] }
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
        linkedFindings: [raw]
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/lab-turnaround-prediction:
 *   post:
 *     summary: Lab Turnaround Time Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testType:
 *                 type: string
 *               currentQueue:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Predicted turnaround time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictedTime:
 *                   type: string
 */
exports.labTurnaroundPrediction = async (req, res) => {
  try {
    const { testType, currentQueue } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Test type: ${testType}
      Current queue length: ${currentQueue}
      Predict how long this lab test will take to complete. Respond ONLY with a JSON object: { "predictedTime": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        predictedTime: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};


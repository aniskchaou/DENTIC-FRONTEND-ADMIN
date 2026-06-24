const {
    findAllOperations,
    findOperationById,
    createOperation,
    updateOperation,
    deleteOperationById,
    deleteAllOperations
} = require("../../services/operation.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");


/**
 * @swagger
 * tags:
 *   name: Operations
 *   description: API for managing operations
 */

/**
 * @swagger
 * /operations:
 *   post:
 *     summary: Create a new operation
 *     tags: [Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Operation'
 *     responses:
 *       201:
 *         description: Operation created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Operation:
 *       type: object
 *       required:
 *         - patientId
 *         - operationType
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *         operationType:
 *           type: string
 *         notes:
 *           type: string
 *         date:
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
    createOperation(req.body, res);
};

/**
 * @swagger
 * /operations:
 *   get:
 *     summary: Get all operations
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: List of all operations
 */
exports.findAll = (req, res) => {
    findAllOperations(null, res);
};

/**
 * @swagger
 * /operations/{id}:
 *   get:
 *     summary: Get an operation by ID
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operation found
 *       404:
 *         description: Operation not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findOperationById(id, res);
};

/**
 * @swagger
 * /operations/{id}:
 *   put:
 *     summary: Update an operation by ID
 *     tags: [Operations]
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
 *             properties:
 *               patientId:
 *                 type: string
 *               operationType:
 *                 type: string
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Operation updated successfully
 *       400:
 *         description: Invalid input
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateOperation(id, req, res);
};

/**
 * @swagger
 * /operations/{id}:
 *   delete:
 *     summary: Delete an operation by ID
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operation deleted
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteOperationById(id, res);
};

/**
 * @swagger
 * /operations:
 *   delete:
 *     summary: Delete all operations
 *     tags: [Operations]
 *     responses:
 *       200:
 *         description: All operations deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllOperations(res);
};


/**
 * @swagger
 * /ai/surgery-assistant:
 *   post:
 *     summary: AI Surgery Assistant (step-by-step checklists)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surgeryType:
 *                 type: string
 *               patientHistory:
 *                 type: object
 *     responses:
 *       200:
 *         description: Surgery checklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklist:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.surgeryAssistant = async (req, res) => {
  try {
    const { surgeryType, patientHistory } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Surgery type: ${surgeryType}
      Patient history: ${JSON.stringify(patientHistory)}
      Provide a step-by-step checklist for this dental surgery, tailored to the patient's history.
      Respond ONLY with a JSON object: { "checklist": [array of strings] }
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
        checklist: [raw]
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/surgery-risk-prediction:
 *   post:
 *     summary: Surgery Risk Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientHistory:
 *                 type: object
 *     responses:
 *       200:
 *         description: Predicted complications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 risks:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.surgeryRiskPrediction = async (req, res) => {
  try {
    const { patientHistory } = req.body;
    // AI logic (demo)
    const risks = ["Bleeding risk", "Delayed healing"];
    res.send({ risks });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/postop-monitoring:
 *   post:
 *     summary: Post-Op Monitoring Chatbot
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
 *               symptoms:
 *                 type: string
 *     responses:
 *       200:
 *         description: Monitoring result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flag:
 *                   type: boolean
 *                 advice:
 *                   type: string
 */
exports.postopMonitoring = async (req, res) => {
  try {
    const { patientId, symptoms } = req.body;
    // AI logic (demo)
    const flag = symptoms.includes("swelling") || symptoms.includes("fever");
    const advice = flag
      ? "Contact your dentist immediately."
      : "Continue regular post-op care.";
    res.send({ flag, advice });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

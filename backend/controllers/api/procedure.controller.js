const {
    findAllProcedures,
    findProcedureById,
    createProcedure,
    updateProcedure,
    deleteProcedureById,
    deleteAllProcedures
} = require("../../services/procedure.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: Procedures
 *   description: API for managing procedures
 */

/**
 * @swagger
 * /procedures:
 *   post:
 *     summary: Create a new procedure
 *     tags: [Procedures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Procedure'
 *     responses:
 *       201:
 *         description: Procedure created successfully
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Procedure:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
    createProcedure(req.body, res);
};

/**
 * @swagger
 * /procedures:
 *   get:
 *     summary: Retrieve all procedures
 *     tags: [Procedures]
 *     responses:
 *       200:
 *         description: List of all procedures
 */
exports.findAll = (req, res) => {
    findAllProcedures(null, res);
};

/**
 * @swagger
 * /procedures/{id}:
 *   get:
 *     summary: Get a single procedure by ID
 *     tags: [Procedures]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Procedure ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Procedure details
 *       404:
 *         description: Procedure not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findProcedureById(id, res);
};

/**
 * @swagger
 * /procedures/{id}:
 *   put:
 *     summary: Update a procedure by ID
 *     tags: [Procedures]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Procedure ID
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *     responses:
 *       200:
 *         description: Procedure updated successfully
 *       400:
 *         description: Invalid input
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateProcedure(id, req, res);
};

/**
 * @swagger
 * /procedures/{id}:
 *   delete:
 *     summary: Delete a procedure by ID
 *     tags: [Procedures]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Procedure ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Procedure deleted successfully
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteProcedureById(id, res);
};

/**
 * @swagger
 * /procedures:
 *   delete:
 *     summary: Delete all procedures
 *     tags: [Procedures]
 *     responses:
 *       200:
 *         description: All procedures deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllProcedures(res);
};

/**
 * @swagger
 * /ai/procedure-recommendation:
 *   post:
 *     summary: Procedure Recommendation AI
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
 *         description: Suggested procedures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 procedures:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.procedureRecommendation = async (req, res) => {
  try {
    const { diagnosis, history } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Diagnosis: ${diagnosis}
      Patient history: ${JSON.stringify(history)}
      Suggest the most appropriate dental procedures for this patient. Respond ONLY with a JSON object: { "procedures": [array of strings] }
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
        procedures: [raw]
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/procedure-estimation:
 *   post:
 *     summary: Time/Cost Estimation for procedures
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               procedure:
 *                 type: string
 *               patientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Estimated time and cost
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estimatedTime:
 *                   type: string
 *                 estimatedCost:
 *                   type: number
 */
exports.procedureEstimation = async (req, res) => {
  try {
    const { procedure, patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Procedure: ${procedure}
      Patient data: ${JSON.stringify(patientData)}
      Estimate the expected time and cost for this dental procedure for the given patient.
      Respond ONLY with a JSON object: { "estimatedTime": "string", "estimatedCost": number }
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
        estimatedTime: "",
        estimatedCost: 0
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/procedure-outcome-prediction:
 *   post:
 *     summary: Outcome Prediction for procedures
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               procedure:
 *                 type: string
 *               patientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Predicted outcome and recovery time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successLikelihood:
 *                   type: string
 *                 expectedRecovery:
 *                   type: string
 */
exports.procedureOutcomePrediction = async (req, res) => {
  try {
    const { procedure, patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Procedure: ${procedure}
      Patient data: ${JSON.stringify(patientData)}
      Predict the likelihood of success and expected recovery time for this dental procedure for the given patient.
      Respond ONLY with a JSON object: { "successLikelihood": "string", "expectedRecovery": "string" }
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
        successLikelihood: "",
        expectedRecovery: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

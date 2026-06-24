const {
    findAllTreatmentPlans,
    findTreatmentPlanById,
    createTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlanById,
    deleteAllTreatmentPlans
} = require("../../services/treatementplan.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: Treatment Plans
 *   description: API for managing treatment plans
 */

/**
 * @swagger
 * /treatmentplans:
 *   post:
 *     summary: Create a new treatment plan
 *     tags: [Treatment Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreatmentPlan'
 *     responses:
 *       200:
 *         description: The treatment plan was successfully created
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TreatmentPlan:
 *       type: object
 *       required:
 *         - patientId
 *         - planName
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *         planName:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {

    createTreatmentPlan(req.body, res);
};

/**
 * @swagger
 * /treatmentplans:
 *   get:
 *     summary: Retrieve all treatment plans
 *     tags: [Treatment Plans]
 *     responses:
 *       200:
 *         description: A list of treatment plans
 */
exports.findAll = (req, res) => {
    findAllTreatmentPlans(null, res);
};

/**
 * @swagger
 * /treatmentplans/{id}:
 *   get:
 *     summary: Find a single treatment plan by ID
 *     tags: [Treatment Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment plan found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findTreatmentPlanById(id, res);
};

/**
 * @swagger
 * /treatmentplans/{id}:
 *   put:
 *     summary: Update a treatment plan by ID
 *     tags: [Treatment Plans]
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
 *         description: The treatment plan was successfully updated
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateTreatmentPlan(id, req, res);
};

/**
 * @swagger
 * /treatmentplans/{id}:
 *   delete:
 *     summary: Delete a treatment plan by ID
 *     tags: [Treatment Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Treatment plan successfully deleted
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteTreatmentPlanById(id, res);
};

/**
 * @swagger
 * /treatmentplans:
 *   delete:
 *     summary: Delete all treatment plans
 *     tags: [Treatment Plans]
 *     responses:
 *       200:
 *         description: All treatment plans deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllTreatmentPlans(res);
};

/**
 * @swagger
 * /ai/treatment-optimizer:
 *   post:
 *     summary: AI Treatment Optimizer
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
 *               budget:
 *                 type: number
 *     responses:
 *       200:
 *         description: Optimized treatment plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan:
 *                   type: string
 */
exports.treatmentOptimizer = async (req, res) => {
  try {
    const { diagnosis, history, budget } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Diagnosis: ${diagnosis}
      Patient history: ${JSON.stringify(history)}
      Budget: ${budget}
      Suggest the best dental treatment plan for this patient, considering their diagnosis, history, and budget.
      Respond ONLY with a JSON object: { "plan": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        plan: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/treatment-outcome-prediction:
 *   post:
 *     summary: Outcome Prediction for treatment plans
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatmentPlan:
 *                 type: string
 *               patientData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Predicted outcomes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successRate:
 *                   type: string
 *                 recoveryTime:
 *                   type: string
 *                 longTermBenefits:
 *                   type: string
 */
exports.treatmentOutcomePrediction = async (req, res) => {
  try {
    const { treatmentPlan, patientData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Treatment plan: ${treatmentPlan}
      Patient data: ${JSON.stringify(patientData)}
      Predict the expected success rate, recovery time, and long-term benefits for this treatment plan.
      Respond ONLY with a JSON object: { "successRate": "string", "recoveryTime": "string", "longTermBenefits": "string" }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        successRate: "",
        recoveryTime: "",
        longTermBenefits: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/treatment-explainer:
 *   post:
 *     summary: Patient-Friendly Treatment Explainer
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatmentPlan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Simple explanation with visuals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 explanation:
 *                   type: string
 *                 visuals:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.treatmentExplainer = async (req, res) => {
  try {
    const { treatmentPlan } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Explain the following dental treatment plan in simple, patient-friendly language. Also suggest two relevant visual aids as image URLs.
      Treatment plan: ${treatmentPlan}
      Respond ONLY with a JSON object: { "explanation": "string", "visuals": [array of image URLs as strings] }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      result = {
        explanation: raw,
        visuals: []
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};


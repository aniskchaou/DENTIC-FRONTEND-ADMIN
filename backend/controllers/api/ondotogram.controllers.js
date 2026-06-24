const Ondotogram = require("../../models/ondotogram.models.js");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * /ondotogram:
 *   post:
 *     summary: Save or update ondotogram data for a patient/appointment
 *     tags: [Ondotogram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: integer
 *               doctor:
 *                 type: integer
 *               clinic:
 *                 type: integer
 *               appointment:
 *                 type: integer
 *               membership:
 *                 type: string
 *               teeth:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     toothNumber:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     procedure:
 *                       type: string
 *                     operation:
 *                       type: string
 *                     diagnosis:
 *                       type: string
 *                     treatmentSummary:
 *                       type: string
 *     responses:
 *       200:
 *         description: Ondotogram data saved or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error saving ondotogram
 */
exports.saveOndotogram = async (req, res) => {
  try {
    const { patient, doctor, clinic, appointment, membership, teeth } = req.body;
    const [record, created] = await Ondotogram.findOrCreate({
      where: { patient, doctor, clinic, appointment, membership },
      defaults: { teeth }
    });
    if (!created) {
      // Merge new teeth with existing, avoiding duplicates by toothNumber
      let existingTeeth = Array.isArray(record.teeth) ? record.teeth : [];
      let newTeeth = Array.isArray(teeth) ? teeth : [];
      // Remove existing teeth with the same toothNumber as new ones
      const newToothNumbers = newTeeth.map(t => t.toothNumber);
      existingTeeth = existingTeeth.filter(t => !newToothNumbers.includes(t.toothNumber));
      const updatedTeeth = [...existingTeeth, ...newTeeth];
      await record.update({ teeth: updatedTeeth });
      res.status(200).send(record);
    } else {
      res.status(200).send(record);
    }
  } catch (err) {
    res.status(500).send({ message: "Error saving ondotogram", error: err });
  }
};

/**
 * @swagger
 * /ondotogram/teeth:
 *   post:
 *     summary: Get teeth array for a patient/appointment
 *     tags: [Ondotogram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: integer
 *               doctor:
 *                 type: integer
 *               clinic:
 *                 type: integer
 *               appointment:
 *                 type: integer
 *               membership:
 *                 type: string
 *     responses:
 *       200:
 *         description: Array of teeth for the patient/appointment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   toothNumber:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   procedure:
 *                     type: string
 *                   operation:
 *                     type: string
 *                   diagnosis:
 *                     type: string
 *                   treatmentSummary:
 *                     type: string
 *       500:
 *         description: Error retrieving teeth
 */
exports.getTeeth = async (req, res) => {
  try {
    const { patient, doctor, clinic, appointment, membership, toothNumber } = req.body;
    const record = await Ondotogram.findOne({
      where: { patient, doctor, clinic, appointment, membership }
    });
    if (!record) return res.status(404).send([]);
    if (toothNumber !== undefined) {
      // Find the single tooth object
      const tooth = (record.teeth || []).find(t => t.toothNumber === toothNumber);
      return res.send(tooth ? [{ ...tooth, createdAt: record.createdAt }] : []);
    }
    // Add createdAt to each tooth in the array
    const teethWithCreatedAt = (record.teeth || []).map(t => ({
      ...t,
      createdAt: record.createdAt
    }));
    res.send(teethWithCreatedAt);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving teeth", error: err });
  }
};

/**
 * @swagger
 * /ai/automated-odontogram:
 *   post:
 *     summary: Automated Odontogram Generation
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imagingData:
 *                 type: object
 *               diagnosisData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Generated dental chart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 odontogram:
 *                   type: object
 */
exports.automatedOdontogram = async (req, res) => {
  try {
    const { imagingData, diagnosisData } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Imaging data: ${JSON.stringify(imagingData)}
      Diagnosis data: ${JSON.stringify(diagnosisData)}
      Generate a dental odontogram chart by filling in tooth conditions based on the provided imaging and diagnosis data.
      Respond ONLY with a JSON object: { "odontogram": { "toothNumber": "condition", ... } }
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
        odontogram: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/condition-prediction:
 *   post:
 *     summary: Tooth Condition Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               odontogram:
 *                 type: object
 *     responses:
 *       200:
 *         description: Predicted future dental issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictions:
 *                   type: object
 */
exports.conditionPrediction = async (req, res) => {
  try {
    const { odontogram } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Odontogram: ${JSON.stringify(odontogram)}
      For each tooth, predict future dental issues such as caries risk, gum disease risk, or other concerns.
      Respond ONLY with a JSON object: { "predictions": { "toothNumber": "prediction", ... } }
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
        predictions: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/treatment-simulation:
 *   post:
 *     summary: Treatment Simulation for dental chart
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               odontogram:
 *                 type: object
 *               treatmentPlan:
 *                 type: object
 *     responses:
 *       200:
 *         description: Simulated odontogram evolution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 simulatedOdontogram:
 *                   type: object
 */
exports.treatmentSimulation = async (req, res) => {
  try {
    const { odontogram, treatmentPlan } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Odontogram: ${JSON.stringify(odontogram)}
      Treatment plan: ${JSON.stringify(treatmentPlan)}
      Simulate how this patient's dental chart (odontogram) will evolve after applying the treatment plan. 
      Respond ONLY with a JSON object: { "simulatedOdontogram": { "toothNumber": "newCondition", ... } }
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
        simulatedOdontogram: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
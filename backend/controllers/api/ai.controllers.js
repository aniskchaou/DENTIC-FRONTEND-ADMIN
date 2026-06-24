let chatPipeline;
let pipelineLoaded = false;

async function loadPipeline() {
  if (!pipelineLoaded) {
    const { pipeline } = await import('@xenova/transformers');
    chatPipeline = await pipeline('text-generation', 'Xenova/gpt2'); // or another supported model
    pipelineLoaded = true;
  }
}
loadPipeline();

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Get AI chatbot response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 */
exports.chat = async (req, res) => {
  if (!pipelineLoaded) {
    await loadPipeline();
    if (!pipelineLoaded) {
      return res.status(503).send({ message: "AI model loading, try again soon." });
    }
  }
  const { message } = req.body;
  try {
    const result = await chatPipeline(message, { max_new_tokens: 50 });
    res.send({ response: result[0].generated_text });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err });
  }
};

/**
 * @swagger
 * /ai/treatment-recommendation:
 *   post:
 *     summary: Get AI treatment recommendation
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
 *         description: AI treatment recommendation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendation:
 *                   type: string
 */
const ort = require("onnxruntime-node");
const fs = require("fs");

const TREATMENTS = ["Deep Cleaning", "Root Canal", "Filling"];

exports.treatmentRecommendation = async (req, res) => {
  try {
    const { symptoms, SYMPTOM_LIST } = req.body;

    if (!Array.isArray(SYMPTOM_LIST) || !Array.isArray(symptoms)) {
      return res.status(400).send({ message: "SYMPTOM_LIST and symptoms must be arrays." });
    }

    const inputArray = SYMPTOM_LIST.map(symptom => symptoms.includes(symptom) ? 1 : 0);
    const inputTensor = new ort.Tensor("float32", Float32Array.from(inputArray), [1, SYMPTOM_LIST.length]);

    const modelPath = "model/treatment_recommendation.onnx";
    if (!fs.existsSync(modelPath)) {
      return res.status(500).send({ message: "Model file not found." });
    }

    const session = await ort.InferenceSession.create(modelPath);
    const inputName = session.inputNames ? session.inputNames[0] : "input";
    const outputName = session.outputNames ? session.outputNames[0] : "output_label";

    const feeds = { [inputName]: inputTensor };
    const results = await session.run(feeds);

    // Get the output scores (logits)
    const output = results[outputName].data;
    // Find the index of the highest score
    const maxIdx = output.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
    // Map to treatment name
    const recommendation = TREATMENTS[maxIdx];

    res.send({ recommendation });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/image-diagnosis:
 *   post:
 *     summary: Diagnose dental image
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Diagnosis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diagnosis:
 *                   type: string
 */
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.imageDiagnosis = async (req, res) => {
  try {
    // Assuming image is uploaded as 'image'
    const imagePath = req.file.path;
    // Preprocess image (convert to tensor, resize, etc.)
    // Run ONNX model for image diagnosis
    // Example: const diagnosis = await runImageDiagnosisModel(imagePath);
    // For demo:
    const diagnosis = "Possible caries detected";
    res.send({ diagnosis });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/ondotogram-suggestion:
 *   post:
 *     summary: Suggest next treatment for a tooth
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teeth:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Suggestion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestion:
 *                   type: string
 */
exports.ondotogramSuggestion = async (req, res) => {
  try {
    const { teeth } = req.body;
    // Preprocess teeth data
    // Run ONNX model for suggestion
    // Example: const suggestion = await runOndotogramModel(teeth);
    // For demo:
    const suggestion = "Consider root canal for tooth 22";
    res.send({ suggestion });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/clinic-qa:
 *   post:
 *     summary: Answer clinic info questions
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 */
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

let qaPipeline;
let qaLoaded = false;

async function loadQAPipeline() {
  if (!qaLoaded) {
    const { pipeline } = await import('@xenova/transformers');
    qaPipeline = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad');
    qaLoaded = true;
  }
}
loadQAPipeline();

exports.clinicQA = async (req, res) => {
  try {
    const { question, context } = req.body;

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Context: ${context}
      Question: ${question}
      Answer the question based on the provided clinic context. Respond ONLY with a short, clear answer string.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.2,
    });

    const answer = completion.choices[0].message.content;
    res.send({ answer });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/appointment-prediction:
 *   post:
 *     summary: Predict appointment risk
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Prediction result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 risk:
 *                   type: string
 */
exports.appointmentPrediction = async (req, res) => {
  try {
    const { appointmentData } = req.body;
    // Run ONNX model for prediction
    // For demo:
    const risk = "Low";
    res.send({ risk });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/symptom-checker:
 *   post:
 *     summary: AI Symptom Checker for patients
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms:
 *                 type: string
 *     responses:
 *       200:
 *         description: Possible dental issues and urgency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: string
 *                 urgency:
 *                   type: string
 */
exports.symptomChecker = async (req, res) => {
  try {
    const { symptoms } = req.body;
    // Use NLP model + rules/knowledge base (demo response below)
    const issues = ["Cavity", "Gingivitis"];
    const urgency = "Book an appointment soon";
    res.send({ issues, urgency });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/appointment-assistant:
 *   post:
 *     summary: AI Appointment Scheduling Assistant
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
 *               preferredTimes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Suggested appointment slots and reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestedSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                 reminder:
 *                   type: string
 */
exports.appointmentAssistant = async (req, res) => {
  try {
    const { patientId, preferredTimes } = req.body;
    // Use scheduling model + history (demo response below)
    const suggestedSlots = ["2025-08-28 10:00", "2025-08-28 14:30"];
    const reminder = "You will receive a reminder 24 hours before your appointment.";
    res.send({ suggestedSlots, reminder });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/treatment-explainer:
 *   post:
 *     summary: Treatment Plan Explainer
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
 *         description: Simple explanation of treatment plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 explanation:
 *                   type: string
 */
exports.treatmentExplainer = async (req, res) => {
  try {
    const { treatmentPlan } = req.body;
    // Use NLP model to simplify explanation (demo response below)
    const explanation = "A root canal removes infection from inside your tooth and helps save it.";
    res.send({ explanation });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/smile-simulation:
 *   post:
 *     summary: Virtual Smile Simulation (Cosmetic Dentistry)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               simulationType:
 *                 type: string
 *                 enum: [whitening, braces, veneers]
 *     responses:
 *       200:
 *         description: Before/after simulation images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 beforeUrl:
 *                   type: string
 *                 afterUrl:
 *                   type: string
 */
exports.smileSimulation = async (req, res) => {
  try {
    // For demo: return placeholder URLs
    const beforeUrl = "https://example.com/before.jpg";
    const afterUrl = "https://example.com/after.jpg";
    res.send({ beforeUrl, afterUrl });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/patient-followup:
 *   post:
 *     summary: Smart Patient Follow-ups
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
 *         description: Follow-up prediction and reminder message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likelyToMiss:
 *                   type: boolean
 *                 reminderMessage:
 *                   type: string
 */
exports.patientFollowup = async (req, res) => {
  try {
    const { patientId, lastVisit } = req.body;
    // AI prediction logic (demo response below)
    const likelyToMiss = true;
    const reminderMessage = "Dear patient, it's time for your checkup! Please book your appointment soon.";
    res.send({ likelyToMiss, reminderMessage });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/inventory-management:
 *   post:
 *     summary: Inventory Management Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               usageHistory:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Inventory forecast
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictedDepletionDate:
 *                   type: string
 *                   format: date
 *                 reorderSuggestion:
 *                   type: string
 */
exports.inventoryManagement = async (req, res) => {
  try {
    const { item, usageHistory } = req.body;
    // AI forecasting logic (demo response below)
    const predictedDepletionDate = "2025-09-15";
    const reorderSuggestion = `Order more ${item} by September 10th.`;
    res.send({ predictedDepletionDate, reorderSuggestion });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/billing-assistant:
 *   post:
 *     summary: AI Billing Assistant
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
 *               treatmentPlan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Billing explanation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coverageDetails:
 *                   type: string
 *                 paymentOptions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.billingAssistant = async (req, res) => {
  try {
    const { patientId, insuranceInfo, treatmentPlan } = req.body;
    // AI billing logic (demo response below)
    const coverageDetails = "Your insurance covers 80% of the root canal procedure.";
    const paymentOptions = [
      "Pay remaining balance at clinic",
      "Set up monthly installments",
      "Use HSA/FSA card"
    ];
    res.send({ coverageDetails, paymentOptions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
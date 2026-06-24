const {
    findAllDoctors,
    findDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctorById,
    deleteAllDoctors
} = require("../../services/doctor.services");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: API for managing doctor records
 */



/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Doctor created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *           description: Reference to the user account
 *         fullName:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         specialization:
 *           type: string
 *           enum: [General Dentist, Orthodontist, Periodontist, Endodontist, Prosthodontist]
 *         experienceYears:
 *           type: integer
 *         consultationFee:
 *           type: number
 *           format: float
 *         availableDays:
 *           type: array
 *           items:
 *             type: string
 *         availableTimeSlots:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *         rating:
 *           type: number
 *           format: float
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

exports.create = (req, res) => {
    createDoctor(req.body, res);
};

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of all doctors
 */
exports.findAll = (req, res) => {
    // You can add query-based filtering here if needed
    findAllDoctors(null, res);
};

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor data
 *       404:
 *         description: Doctor not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findDoctorById(id, res);
};

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update a doctor by ID
 *     tags: [Doctor]
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
 *         description: Doctor updated
 *       404:
 *         description: Doctor not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateDoctor(id, req, res);
};

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor by ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted
 *       404:
 *         description: Doctor not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteDoctorById(id, res);
};

/**
 * @swagger
 * /doctors:
 *   delete:
 *     summary: Delete all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: All doctors deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllDoctors(res);
};

/**
 * @swagger
 * /ai/profile-matcher:
 *   post:
 *     summary: AI Profile Matcher for doctor-patient assignment
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientCase:
 *                 type: object
 *     responses:
 *       200:
 *         description: Best matched doctor profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: string
 *                 doctorName:
 *                   type: string
 *                 specialization:
 *                   type: string
 */
exports.profileMatcher = async (req, res) => {
  try {
    const { patientCase, doctorList } = req.body; // doctorList optional, if you want to provide available doctors

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const prompt = `
      Patient case: ${JSON.stringify(patientCase)}
      ${doctorList ? "Available doctors: " + JSON.stringify(doctorList) : ""}
      Match this patient with the most suitable doctor based on specialization and case details.
      Respond ONLY with a JSON object: { "doctorId": "string", "doctorName": "string", "specialization": "string" }
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
        doctorId: "",
        doctorName: "",
        specialization: raw
      };
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/voice-notes:
 *   post:
 *     summary: Voice-to-Text Notes for doctors
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Transcribed and structured notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: string
 */
exports.voiceNotes = async (req, res) => {
  try {
    // AI logic (demo)
    const notes = "Patient presents with mild pain in lower molar. Recommend X-ray and possible filling.";
    res.send({ notes });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/performance-insights:
 *   post:
 *     summary: Performance Insights for doctors
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insights and improvement suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.performanceInsights = async (req, res) => {
  try {
    const { doctorId } = req.body;
    // AI logic (demo)
    const insights = "High patient satisfaction, successful outcomes in root canal cases.";
    const suggestions = ["Attend advanced endodontics workshop", "Improve follow-up communication"];
    res.send({ insights, suggestions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
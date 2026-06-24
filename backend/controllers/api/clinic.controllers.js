const {
    findAllClinics,
    findClinicById,
    createClinic,
    updateClinic,
    deleteClinicById,
    deleteAllClinics
} = require("../../services/clinic.srrvices");


/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: API for managing clinics
 */






/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *               openingHours:
 *                 type: string
 *                 description: Opening hours for the clinic
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       201:
 *         description: Clinic created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {

    createClinic(req.body, res);
};

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: List of all clinics
 */
exports.findAll = (req, res) => {
    // You can add query-based filtering here if needed
    findAllClinics(null, res);
};

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get a clinic by ID
 *     tags: [Clinic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic data
 *       404:
 *         description: Clinic not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findClinicById(id, res);
};

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Update a clinic by ID
 *     tags: [Clinic]
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
 *         description: Clinic updated
 *       404:
 *         description: Clinic not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateClinic(id, req, res);
};

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete a clinic by ID
 *     tags: [Clinic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic deleted
 *       404:
 *         description: Clinic not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteClinicById(id, res);
};

/**
 * @swagger
 * /clinics:
 *   delete:
 *     summary: Delete all clinics
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: All clinics deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllClinics(res);
};


/**
 * @swagger
 * /ai/operational-analytics:
 *   post:
 *     summary: Predict patient inflow for staffing
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateRange:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *     responses:
 *       200:
 *         description: Predicted busy days and peak hours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 busyDays:
 *                   type: array
 *                   items:
 *                     type: string
 *                 peakHours:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.operationalAnalytics = async (req, res) => {
  try {
    const { dateRange } = req.body;
    // AI prediction logic (demo response below)
    const busyDays = ["2025-08-29", "2025-09-01"];
    const peakHours = ["10:00-12:00", "16:00-18:00"];
    res.send({ busyDays, peakHours });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/feedback-analysis:
 *   post:
 *     summary: Patient Feedback Sentiment Analysis
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedbacks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sentiment and improvement suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sentimentSummary:
 *                   type: string
 *                 improvementSuggestions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.feedbackAnalysis = async (req, res) => {
  try {
    const { feedbacks } = req.body;
    // AI sentiment analysis logic (demo response below)
    const sentimentSummary = "Mostly positive, some concerns about wait times.";
    const improvementSuggestions = ["Reduce wait times", "Improve front desk communication"];
    res.send({ sentimentSummary, improvementSuggestions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
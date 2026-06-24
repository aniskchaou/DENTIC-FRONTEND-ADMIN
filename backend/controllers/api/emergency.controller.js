const {
    findAllEmergencyHandlings,
    findEmergencyHandlingById,
    createEmergencyHandling,
    updateEmergencyHandling,
    deleteEmergencyHandlingById,
    deleteAllEmergencyHandlings,
    findAllEmergencyCases,
    findEmergencyCaseById,
    createEmergencyCase,
    updateEmergencyCase,
    deleteEmergencyCaseById,
    deleteAllEmergencyCases,
    findAllReferrals,
    findReferralById,
    createReferral,
    updateReferral,
    deleteReferralById,
    deleteAllReferrals
} = require("../../services/emergency.services");

/**
 * @swagger
 * tags:
 *   name: Emergency
 *   description: API for managing emergency records
 */




/**
 * @swagger
 * /emergency/handling:
 *   post:
 *     summary: Create a new emergency handling record
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emergency handling created
 *       400:
 *         description: Content can not be empty!
 */
exports.createHandling = (req, res) => {
    if (!req.body.patientId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createEmergencyHandling(req.body, res);
};

/**
 * @swagger
 * /emergency/handling:
 *   get:
 *     summary: Get all emergency handlings
 *     tags: [Emergency]
 *     responses:
 *       200:
 *         description: List of all emergency handlings
 */
exports.findAllHandlings = (req, res) => {
    findAllEmergencyHandlings(null, res);
};

/**
 * @swagger
 * /emergency/handling/{id}:
 *   get:
 *     summary: Get an emergency handling by ID
 *     tags: [Emergency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency handling data
 *       404:
 *         description: Emergency handling not found
 */
exports.findHandling = (req, res) => {
    const id = req.params.id;
    findEmergencyHandlingById(id, res);
};

/**
 * @swagger
 * /emergency/handling/{id}:
 *   put:
 *     summary: Update an emergency handling by ID
 *     tags: [Emergency]
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
 *         description: Emergency handling updated
 *       404:
 *         description: Emergency handling not found
 */
exports.updateHandling = (req, res) => {
    const id = req.params.id;
    updateEmergencyHandling(id, req, res);
};

/**
 * @swagger
 * /emergency/handling/{id}:
 *   delete:
 *     summary: Delete an emergency handling by ID
 *     tags: [Emergency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency handling deleted
 *       404:
 *         description: Emergency handling not found
 */
exports.deleteHandling = (req, res) => {
    const id = req.params.id;
    deleteEmergencyHandlingById(id, res);
};

/**
 * @swagger
 * /emergency/handling:
 *   delete:
 *     summary: Delete all emergency handlings
 *     responses:
 *       200:
 *         description: All emergency handlings deleted
 */
exports.deleteAllHandlings = (req, res) => {
    deleteAllEmergencyHandlings(res);
};

/**
 * @swagger
 * /emergency/case:
 *   post:
 *     summary: Create a new emergency case
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emergency case created
 *       400:
 *         description: Content can not be empty!
 */
exports.createCase = (req, res) => {
    if (!req.body.patientId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createEmergencyCase(req.body, res);
};

/**
 * @swagger
 * /emergency/case:
 *   get:
 *     summary: Get all emergency cases
 *     responses:
 *       200:
 *         description: List of all emergency cases
 */
exports.findAllCases = (req, res) => {
    findAllEmergencyCases(null, res);
};

/**
 * @swagger
 * /emergency/case/{id}:
 *   get:
 *     summary: Get an emergency case by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency case data
 *       404:
 *         description: Emergency case not found
 */
exports.findCase = (req, res) => {
    const id = req.params.id;
    findEmergencyCaseById(id, res);
};

/**
 * @swagger
 * /emergency/case/{id}:
 *   put:
 *     summary: Update an emergency case by ID
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
 *         description: Emergency case updated
 *       404:
 *         description: Emergency case not found
 */
exports.updateCase = (req, res) => {
    const id = req.params.id;
    updateEmergencyCase(id, req, res);
};

/**
 * @swagger
 * /emergency/case/{id}:
 *   delete:
 *     summary: Delete an emergency case by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emergency case deleted
 *       404:
 *         description: Emergency case not found
 */
exports.deleteCase = (req, res) => {
    const id = req.params.id;
    deleteEmergencyCaseById(id, res);
};

/**
 * @swagger
 * /emergency/case:
 *   delete:
 *     summary: Delete all emergency cases
 *     responses:
 *       200:
 *         description: All emergency cases deleted
 */
exports.deleteAllCases = (req, res) => {
    deleteAllEmergencyCases(res);
};

/**
 * @swagger
 * /emergency/referral:
 *   post:
 *     summary: Create a new referral
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               referredTo:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referral created
 *       400:
 *         description: Content can not be empty!
 */
exports.createReferral = (req, res) => {
    if (!req.body.patientId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createReferral(req.body, res);
};

/**
 * @swagger
 * /emergency/referral:
 *   get:
 *     summary: Get all referrals
 *     responses:
 *       200:
 *         description: List of all referrals
 */
exports.findAllReferrals = (req, res) => {
    findAllReferrals(null, res);
};

/**
 * @swagger
 * /emergency/referral/{id}:
 *   get:
 *     summary: Get a referral by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral data
 *       404:
 *         description: Referral not found
 */
exports.findReferral = (req, res) => {
    const id = req.params.id;
    findReferralById(id, res);
};

/**
 * @swagger
 * /emergency/referral/{id}:
 *   put:
 *     summary: Update a referral by ID
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
 *         description: Referral updated
 *       404:
 *         description: Referral not found
 */
exports.updateReferral = (req, res) => {
    const id = req.params.id;
    updateReferral(id, req, res);
};

/**
 * @swagger
 * /emergency/referral/{id}:
 *   delete:
 *     summary: Delete a referral by ID
 *     tags: [Emergency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral deleted
 *       404:
 *         description: Referral not found
 */
exports.deleteReferral = (req, res) => {
    const id = req.params.id;
    deleteReferralById(id, res);
};

/**
 * @swagger
 * /emergency/referral:
 *   delete:
 *     summary: Delete all referrals
 *     tags: [Emergency]
 *     responses:
 *       200:
 *         description: All referrals deleted
 */
exports.deleteAllReferrals = (req, res) => {
    deleteAllReferrals(res);
};

/**
 * @swagger
 * /ai/emergency-triage:
 *   post:
 *     summary: Emergency Severity Triage
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
 *         description: Triage result and recommended action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 severity:
 *                   type: string
 *                 action:
 *                   type: string
 */
exports.emergencyTriage = async (req, res) => {
  try {
    const { symptoms } = req.body;
    // AI logic (demo)
    const severity = "High";
    const action = "Seek immediate care for swelling infection.";
    res.send({ severity, action });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/emergency-routing:
 *   post:
 *     summary: Real-Time Routing for emergencies
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nearest available dentist or hospital
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nearestProvider:
 *                   type: string
 *                 address:
 *                   type: string
 */
exports.emergencyRouting = async (req, res) => {
  try {
    const { location } = req.body;
    // AI logic (demo)
    const nearestProvider = "City Hospital Dental ER";
    const address = "123 Main St, YourCity";
    res.send({ nearestProvider, address });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
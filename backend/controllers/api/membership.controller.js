const {
    findAllMemberships,
    findMembershipById,
    createMembership,
    updateMembership,
    deleteMembershipById,
    deleteAllMemberships
} = require("../../services/membership.services");

/**
 * @swagger
 * tags:
 *   name: Memberships
 *   description: API for managing membership records
 */

/**
 * @swagger
 * /memberships:
 *   post:
 *     summary: Create a new dental membership
 *     tags: [Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       201:
 *         description: Membership created successfully
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: Get all dental memberships
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: List of memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 */

/**
 * @swagger
 * /memberships/{id}:
 *   get:
 *     summary: Get a dental membership by ID
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 *       404:
 *         description: Membership not found
 */

/**
 * @swagger
 * /memberships/{id}:
 *   put:
 *     summary: Update a dental membership by ID
 *     tags: [Memberships]
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
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       200:
 *         description: Membership updated
 *       404:
 *         description: Membership not found
 */

/**
 * @swagger
 * /memberships/{id}:
 *   delete:
 *     summary: Delete a dental membership by ID
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership deleted
 *       404:
 *         description: Membership not found
 */

/**
 * @swagger
 * /memberships:
 *   delete:
 *     summary: Delete all dental memberships
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: All memberships deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Membership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *           description: Reference to Patient
 *         membershipPlan:
 *           type: string
 *           enum: [Basic, Premium, Family, Corporate]
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           description: List of benefits provided under the membership plan
 *           example: ["Free Cleanings", "Discounted Treatments", "Priority Booking", "Emergency Support"]
 *         validityPeriod:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *           description: Validity period of the membership
 *         paymentStatus:
 *           type: string
 *           enum: [Active, Expired, Canceled]
 *         renewalDate:
 *           type: string
 *           format: date
 *           description: Date when the membership is due for renewal
 *         lastPaymentAmount:
 *           type: number
 *           format: float
 *           description: Amount of the last payment made
 *         lastPaymentDate:
 *           type: string
 *           format: date
 *           description: Date when the last payment was made
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */




/**
 * @swagger
 * /memberships:
 *   post:
 *     summary: Create a new dental membership
 *     tags: [Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       201:
 *         description: Membership created successfully
 *       400:
 *         description: Missing required fields
 */
exports.create = (req, res) => {
   
    createMembership(req.body, res);
};

/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: Get all dental memberships
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: List of memberships
 */
exports.findAll = (req, res) => {
    findAllMemberships(null, res);
};

/**
 * @swagger
 * /memberships/{id}:
 *   get:
 *     summary: Get a dental membership by ID
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership details
 *       404:
 *         description: Membership not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMembershipById(id, res);
};

/**
 * @swagger
 * /memberships/{id}:
 *   put:
 *     summary: Update a dental membership by ID
 *     tags: [Memberships]
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
 *             $ref: '#/components/schemas/Membership'
 *     responses:
 *       200:
 *         description: Membership updated
 *       404:
 *         description: Membership not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMembership(id, req, res);
};

/**
 * @swagger
 * /memberships/{id}:
 *   delete:
 *     summary: Delete a dental membership by ID
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership deleted
 *       404:
 *         description: Membership not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMembershipById(id, res);
};

/**
 * @swagger
 * /memberships:
 *   delete:
 *     summary: Delete all dental memberships
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: All memberships deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllMemberships(res);
};

/**
 * @swagger
 * /ai/churn-prediction:
 *   post:
 *     summary: Membership Churn Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               membershipHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Churn likelihood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likelyToChurn:
 *                   type: boolean
 *                 reason:
 *                   type: string
 */
exports.churnPrediction = async (req, res) => {
  try {
    const { memberId, membershipHistory } = req.body;
    // AI logic (demo)
    const likelyToChurn = true;
    const reason = "Member has not booked any appointments in the last 6 months.";
    res.send({ likelyToChurn, reason });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/personalized-offers:
 *   post:
 *     summary: Personalized Offers for members
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               patientHistory:
 *                 type: object
 *     responses:
 *       200:
 *         description: Recommended offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offers:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.personalizedOffers = async (req, res) => {
  try {
    const { memberId, patientHistory } = req.body;
    // AI logic (demo)
    const offers = ["10% off on next cleaning", "Free whitening session with annual renewal"];
    res.send({ offers });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/engagement-ai:
 *   post:
 *     summary: Engagement AI for membership renewals
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               engagementData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Campaign suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaigns:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.engagementAI = async (req, res) => {
  try {
    const { memberId, engagementData } = req.body;
    // AI logic (demo)
    const campaigns = ["Send renewal reminder email", "Offer loyalty points for referrals"];
    res.send({ campaigns });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

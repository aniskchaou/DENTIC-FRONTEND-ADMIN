const {
  findPaymentById,
  updatePayment,
  deletePaymentById,
  deleteAllPayments,
  findAllPayments,
  createPayment
} = require("../../services/payment.services");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment created successfully
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         paymenMode:
 *           type: string
 *         amountReceived:
 *           type: number
 *         invoiceBlanceDue:
 *           type: number
 *         patient:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }



  createPayment(req.body, res);
};

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: A list of payments
 */
exports.findAll = (req, res) => {
  findAllPayments(res);
};

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  findPaymentById(id, res);
};

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *               paymenMode:
 *                 type: string
 *               amountReceived:
 *                 type: number
 *               invoiceBlanceDue:
 *                 type: number
 *               patient:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated
 *       404:
 *         description: Payment not found
 */
exports.update = (req, res) => {
  const id = req.params.id;
  updatePayment(id, req, res);
};

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted
 *       404:
 *         description: Payment not found
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  deletePaymentById(id, res);
};

/**
 * @swagger
 * /payments:
 *   delete:
 *     summary: Delete all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: All payments deleted
 */
exports.deleteAll = (req, res) => {
  deleteAllPayments(req, res);
};

/**
 * @swagger
 * /ai/payment-plan-generator:
 *   post:
 *     summary: Smart Payment Plan Generator
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
 *               treatmentCost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Suggested payment plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.paymentPlanGenerator = async (req, res) => {
  try {
    const { patientId, treatmentCost } = req.body;
    // AI logic (demo)
    const plans = [
      "3 monthly payments of $200",
      "6 monthly payments of $110"
    ];
    res.send({ plans });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/payment-fraud-detection:
 *   post:
 *     summary: Payment Fraud Detection
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Fraud detection result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suspiciousPayments:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.paymentFraudDetection = async (req, res) => {
  try {
    const { paymentHistory } = req.body;
    // AI logic (demo)
    const suspiciousPayments = ["Payment #456: Unusual amount"];
    res.send({ suspiciousPayments });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/late-payment-prediction:
 *   post:
 *     summary: Late Payment Prediction
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
 *               paymentHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Late payment likelihood
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likelyToBeLate:
 *                   type: boolean
 *                 advice:
 *                   type: string
 */
exports.latePaymentPrediction = async (req, res) => {
  try {
    const { patientId, paymentHistory } = req.body;
    // AI logic (demo)
    const likelyToBeLate = true;
    const advice = "Send reminder 3 days before due date.";
    res.send({ likelyToBeLate, advice });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

const {
    findInvoiceById,
    updateInvoice,
    deleteInvoiceById,
    deleteAllInvoices,
    findAllInvoices,
    createInvoice
} = require("../../services/invoice.services");

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - namepatient
 *         - emailpatient
 *       properties:
 *         id:
 *           type: string
 *         namepatient:
 *           type: string
 *         emailpatient:
 *           type: string
 *         birth:
 *           type: string
 *           format: date
 *         telephone:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {

    createInvoice(req.body, res);
};

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Retrieve all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: A list of invoices
 */
exports.findAll = (req, res) => {
    findAllInvoices(res);
};

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Retrieve an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Invoice data
 *       404:
 *         description: Invoice not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findInvoiceById(id, res);
};

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Update an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namepatient:
 *                 type: string
 *               emailpatient:
 *                 type: string
 *               birth:
 *                 type: string
 *                 format: date
 *               telephone:
 *                 type: string
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invoice updated
 *       404:
 *         description: Invoice not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateInvoice(id, req, res);
};

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Delete an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted
 *       404:
 *         description: Invoice not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteInvoiceById(id, res);
};

/**
 * @swagger
 * /invoices:
 *   delete:
 *     summary: Delete all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: All invoices deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllInvoices(req, res);
};

/**
 * @swagger
 * /ai/invoice-explainer:
 *   post:
 *     summary: AI Billing Assistant for invoices
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Simple invoice explanation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 explanation:
 *                   type: string
 */
exports.invoiceExplainer = async (req, res) => {
  try {
    const { invoiceData } = req.body;
    // AI logic (demo)
    const explanation = "This invoice covers your root canal and filling. Insurance paid 80%, you owe $120.";
    res.send({ explanation });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/payment-reminder:
 *   post:
 *     summary: Smart Payment Reminders
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
 *               invoiceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment reminder message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reminderMessage:
 *                   type: string
 */
exports.paymentReminder = async (req, res) => {
  try {
    const { patientId, invoiceId } = req.body;
    // AI logic (demo)
    const reminderMessage = "Your payment for invoice #123 is overdue. Please pay by September 5th to avoid late fees.";
    res.send({ reminderMessage });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/pricing-insights:
 *   post:
 *     summary: Dynamic Pricing Insights
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Pricing suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.pricingInsights = async (req, res) => {
  try {
    const { serviceData } = req.body;
    // AI logic (demo)
    const suggestions = [
      "Offer 10% discount on whitening packages this month.",
      "Bundle checkup + cleaning for $99 to attract new patients."
    ];
    res.send({ suggestions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

const { findIncomeById, updateIncome, deleteIncomeById, deleteAllIncomes, findAllIncomes, createIncome } = require("../../services/income.services");


/**
 * @swagger
 * tags:
 *   name: Income
 *   description: API for managing income records
 */


/**
 * @swagger
 * /incomes:
 *   post:
 *     summary: Create a new income record
 *     tags: [Income]
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
 *       201:
 *         description: Income record created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user
    const patient = {
        namepatient: req.body.namepatient,
        emailpatient: req.body.emailpatient,
        birth: req.body.birth,
        telephone: req.body.telephone,
        gender: req.body.gender,
        address: req.body.address
    }

    createIncome(patient, res)
};

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Get all income records
 *     tags: [Income]
 *     responses:
 *       200:
 *         description: List of all income records
 */
exports.findAll = (req, res) => {
    findAllIncomes(res)
};

/**
 * @swagger
 * /incomes/{id}:
 *   get:
 *     summary: Get an income record by ID
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income record data
 *       404:
 *         description: Income record not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findIncomeById(id, res)
};

/**
 * @swagger
 * /incomes/{id}:
 *   put:
 *     summary: Update an income record by ID
 *     tags: [Income]
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
 *         description: Income record updated
 *       404:
 *         description: Income record not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateIncome(id, req, res)
};

/**
 * @swagger
 * /incomes/{id}:
 *   delete:
 *     summary: Delete an income record by ID
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income record deleted
 *       404:
 *         description: Income record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteIncomeById(id, res)
};

/**
 * @swagger
 * /incomes:
 *   delete:
 *     summary: Delete all income records
 *     tags: [Income]
 *     responses:
 *       200:
 *         description: All income records deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllIncomes(req, res)
};

/**
 * @swagger
 * /ai/revenue-forecast:
 *   post:
 *     summary: Revenue Forecasting
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               historicalIncome:
 *                 type: array
 *                 items:
 *                   type: number
 *               appointmentData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Predicted future income
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forecast:
 *                   type: array
 *                   items:
 *                     type: number
 */
exports.revenueForecast = async (req, res) => {
  try {
    const { historicalIncome, appointmentData } = req.body;
    // AI logic (demo)
    const forecast = [12000, 13000, 12500]; // Example: next 3 months
    res.send({ forecast });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/profitability-analysis:
 *   post:
 *     summary: Profitability Analysis
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
 *         description: Most profitable services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profitableServices:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.profitabilityAnalysis = async (req, res) => {
  try {
    const { serviceData } = req.body;
    // AI logic (demo)
    const profitableServices = ["Implants", "Whitening"];
    res.send({ profitableServices });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
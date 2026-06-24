const { deleteExpenseById,createExpense, findAllExpenses, findExpenseById, updateExpense, deleteAllExpenses } = require("../../services/expense.services");



/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API for managing expense records
 */






/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         name:
 *           type: string
 *         amount:
 *           type: number
 *         note:
 *           type: string
 *         paymenMode:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
 
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a user

    const patient = {
        datee: req.body.date,
        name: req.body.name,
        amount: req.body.amount,
        note: req.body.note,
        paymenMode: req.body.paymenMode
    }

    createExpense(patient, res)
};

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: List of all expenses
 */
exports.findAll = (req, res) => {
    findAllExpenses(res)
};

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense data
 *       404:
 *         description: Expense not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findExpenseById(id, res)
};

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expense]
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
 *         description: Expense updated
 *       404:
 *         description: Expense not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateExpense(id, req, res)
};

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteExpenseById(id, res)
};

/**
 * @swagger
 * /expenses:
 *   delete:
 *     summary: Delete all expenses
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: All expenses deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllExpenses(req, res)
};


/**
 * @swagger
 * /ai/expense-categorization:
 *   post:
 *     summary: Smart Expense Categorization
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseDescription:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Categorized expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 */
exports.expenseCategorization = async (req, res) => {
  try {
    const { expenseDescription, amount } = req.body;
    // AI logic (demo)
    const category = "Supplies";
    res.send({ category });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/expense-anomaly:
 *   post:
 *     summary: Fraud/Anomaly Detection for expenses
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Anomaly detection result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 anomalies:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.expenseAnomaly = async (req, res) => {
  try {
    const { expenseData } = req.body;
    // AI logic (demo)
    const anomalies = ["Unusual high spending on utilities in July"];
    res.send({ anomalies });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
const { findMedicamentCategoryById, updateMedicamentCategory, deleteMedicamentCategoryById, deleteAllMedicamentCategorys, findAllMedicamentCategorys, createMedicamentCategory } = require("../../services/medicament.category.services");



/**
 * @swagger
 * tags:
 *   name: MedicamentCategory
 *   description: API for managing medicament categories
 */



/**
 * @swagger
 * /medicament-categories:
 *   post:
 *     summary: Create a new medicament category
 *     tags: [MedicamentCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicament category created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    createMedicamentCategory(req.body, res)
};

/**
 * @swagger
 * /medicament-categories:
 *   get:
 *     summary: Get all medicament categories
 *     tags: [MedicamentCategory]
 *     responses:
 *       200:
 *         description: List of all medicament categories
 */
exports.findAll = (req, res) => {
    findAllMedicamentCategorys(res)
};

/**
 * @swagger
 * /medicament-categories/{id}:
 *   get:
 *     summary: Get a medicament category by ID
 *     tags: [MedicamentCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicament category data
 *       404:
 *         description: Medicament category not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMedicamentCategoryById(id, res)
};

/**
 * @swagger
 * /medicament-categories/{id}:
 *   put:
 *     summary: Update a medicament category by ID
 *     tags: [MedicamentCategory]
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
 *         description: Medicament category updated
 *       404:
 *         description: Medicament category not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMedicamentCategory(id, req, res)
};

/**
 * @swagger
 * /medicament-categories/{id}:
 *   delete:
 *     summary: Delete a medicament category by ID
 *     tags: [MedicamentCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicament category deleted
 *       404:
 *         description: Medicament category not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMedicamentCategoryById(id, res)
};

/**
 * @swagger
 * /medicament-categories:
 *   delete:
 *     summary: Delete all medicament categories
 *     tags: [MedicamentCategory]
 *     responses:
 *       200:
 *         description: All medicament categories deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllMedicamentCategorys(req, res)
};


/**
 * @swagger
 * /ai/medicament-categorization:
 *   post:
 *     summary: Smart Categorization for medications
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicationName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Therapeutic category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 */
exports.medicamentCategorization = async (req, res) => {
  try {
    const { medicationName, description } = req.body;
    // AI logic (demo)
    const category = "Antibiotic";
    res.send({ category });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/medicament-trend-insights:
 *   post:
 *     summary: Trend Insights for drug categories
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caseType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commonly used drug categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commonCategories:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.medicamentTrendInsights = async (req, res) => {
  try {
    const { caseType } = req.body;
    // AI logic (demo)
    const commonCategories = ["Antibiotics", "Analgesics"];
    res.send({ commonCategories });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
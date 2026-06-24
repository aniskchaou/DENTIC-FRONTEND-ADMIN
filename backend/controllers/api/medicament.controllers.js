const { getMedicamentByDate, getCount, findMedicamentById, updateMedicament, deleteMedicamentById, deleteAllMedicaments, findAllMedicaments, createMedicament } = require("../../services/medicamnt.services");


/**
 * @swagger
 * tags:
 *   name: Medicament
 *   description: API for managing medicament records
 */

/**
 * @swagger
 * /medicaments:
 *   get:
 *     summary: Retrieve all medicaments
 *     tags: [Medicament]
 *     responses:
 *       200:
 *         description: A list of medicaments.
 */
exports.findAll = (req, res) => {
    findAllMedicaments(res);
};

/**
 * @swagger
 * /medicaments/count:
 *   get:
 *     summary: Get total count of medicaments
 *     tags: [Medicament]
 *     responses:
 *       200:
 *         description: Medicament count
 */
exports.getCount = (req, res) => {
    getCount(req, res);
};

/**
 * @swagger
 * /medicaments/by-date:
 *   get:
 *     summary: Retrieve medicaments by date
 *     tags: [Medicament]
 *     responses:
 *       200:
 *         description: Medicaments filtered by date
 */
exports.getMedicamentByDate = (req, res) => {
    getMedicamentByDate(res);
};

/**
 * @swagger
 * /medicaments:
 *   post:
 *     summary: Create a new medicament
 *     tags: [Medicament]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               company_name:
 *                 type: string
 *               group_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicament created
 */
exports.create = (req, res) => {
    createMedicament(req.body, res);
};

/**
 * @swagger
 * /medicaments/{id}:
 *   get:
 *     summary: Get a medicament by ID
 *     tags: [Medicament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicament details
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMedicamentById(id, res);
};

/**
 * @swagger
 * /medicaments/{id}:
 *   put:
 *     summary: Update a medicament by ID
 *     tags: [Medicament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicament'
 *     responses:
 *       200:
 *         description: Medicament updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Medicament:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         company_name:
 *           type: string
 *         group_name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 */

exports.update = (req, res) => {
    const id = req.params.id;
    updateMedicament(id, req, res);
};

/**
 * @swagger
 * /medicaments/{id}:
 *   delete:
 *     summary: Delete a medicament by ID
 *     tags: [Medicament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicament deleted
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMedicamentById(id, res);
};

/**
 * @swagger
 * /medicaments:
 *   delete:
 *     summary: Delete all medicaments
 *     tags: [Medicament]
 *     responses:
 *       200:
 *         description: All medicaments deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllMedicaments(req, res);
};

/**
 * @swagger
 * /ai/drug-info-assistant:
 *   post:
 *     summary: Drug Information Assistant
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Drug info in plain language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 indications:
 *                   type: string
 *                 sideEffects:
 *                   type: string
 *                 interactions:
 *                   type: string
 */
exports.drugInfoAssistant = async (req, res) => {
  try {
    const { drugName } = req.body;
    // AI logic (demo)
    const indications = "Used to treat bacterial infections.";
    const sideEffects = "May cause nausea, diarrhea.";
    const interactions = "Avoid with blood thinners.";
    res.send({ indications, sideEffects, interactions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/medicament-stock-optimization:
 *   post:
 *     summary: Stock Optimization for medications
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugName:
 *                 type: string
 *               usageHistory:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Predicted demand
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictedDemand:
 *                   type: string
 */
exports.medicamentStockOptimization = async (req, res) => {
  try {
    const { drugName, usageHistory } = req.body;
    // AI logic (demo)
    const predictedDemand = "High demand expected for antibiotics during flu season.";
    res.send({ predictedDemand });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
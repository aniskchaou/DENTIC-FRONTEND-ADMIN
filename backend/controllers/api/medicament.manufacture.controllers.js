const { findMedicamentManufactureById, updateMedicamentManufacture, deleteMedicamentManufactureById, deleteAllMedicamentManufactures, findAllMedicamentManufactures, createMedicamentManufacture } = require("../../services/medicament.manufacture.services");

/**
 * @swagger
 * tags:
 *   name: MedicamentManufacture
 *   description: API for managing medicament manufacture records
 */



/**
 * @swagger
 * /medicament-manufactures:
 *   post:
 *     summary: Create a new medicament manufacture
 *     tags: [MedicamentManufactures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicament manufacture created
 *       400:
 *         description: Invalid input
 */
exports.create = (req, res) => {

    createMedicamentManufacture(req.body, res);
};

/**
 * @swagger
 * /medicament-manufactures:
 *   get:
 *     summary: Get all medicament manufactures
 *     tags: [MedicamentManufactures]
 *     responses:
 *       200:
 *         description: List of medicament manufactures
 */
exports.findAll = (req, res) => {
    findAllMedicamentManufactures(res);
};

/**
 * @swagger
 * /medicament-manufactures/{id}:
 *   get:
 *     summary: Get a medicament manufacture by ID
 *     tags: [MedicamentManufactures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicament manufacture found
 *       404:
 *         description: Medicament manufacture not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMedicamentManufactureById(id, res);
};

/**
 * @swagger
 * /medicament-manufactures/{id}:
 *   put:
 *     summary: Update a medicament manufacture
 *     tags: [MedicamentManufactures]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicament manufacture updated
 *       400:
 *         description: Invalid input
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMedicamentManufacture(id, req, res);
};

/**
 * @swagger
 * /medicament-manufactures/{id}:
 *   delete:
 *     summary: Delete a medicament manufacture
 *     tags: [MedicamentManufactures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicament manufacture deleted
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMedicamentManufactureById(id, res);
};

/**
 * @swagger
 * /medicament-manufactures:
 *   delete:
 *     summary: Delete all medicament manufactures
 *     tags: [MedicamentManufactures]
 *     responses:
 *       200:
 *         description: All medicament manufactures deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllMedicamentManufactures(req, res);
};

/**
 * @swagger
 * /ai/supplier-reliability:
 *   post:
 *     summary: Supplier Reliability Scoring
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *               deliveryHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Supplier reliability score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reliabilityScore:
 *                   type: number
 *                 comments:
 *                   type: string
 */
exports.supplierReliability = async (req, res) => {
  try {
    const { supplierId, deliveryHistory } = req.body;
    // AI logic (demo)
    const reliabilityScore = 92;
    const comments = "Consistently on-time, good quality.";
    res.send({ reliabilityScore, comments });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/price-prediction:
 *   post:
 *     summary: Price Prediction for dental medications
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
 *               marketData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Predicted price trend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictedPrice:
 *                   type: number
 *                 trend:
 *                   type: string
 */
exports.pricePrediction = async (req, res) => {
  try {
    const { drugName, marketData } = req.body;
    // AI logic (demo)
    const predictedPrice = 15.5;
    const trend = "Slight increase expected next quarter.";
    res.send({ predictedPrice, trend });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

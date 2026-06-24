const Inventory = require("../../models/inventory.models");

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API for managing inventory items
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *           enum: [Dental Tools, Medications, Consumables, Equipment]
 *         quantity:
 *           type: integer
 *         unit:
 *           type: string
 *         supplierId:
 *           type: string
 *           nullable: true
 *         clinicId:
 *           type: string
 *         reorderLevel:
 *           type: integer
 *         expiryDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [In Stock, Low Stock, Out of Stock]
 *         notes:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

exports.create = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).send(item);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the inventory item."
    });
  }
};

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Retrieve all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 */
exports.findAll = async (req, res) => {
  try {
    const items = await Inventory.findAll();
    res.send(items);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving inventory items."
    });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Retrieve a single inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item data
 *       404:
 *         description: Inventory item not found
 */
exports.findOne = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).send({ message: `Inventory item with id=${req.params.id} not found.` });
    }
    res.send(item);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving inventory item with id=" + req.params.id
    });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an inventory item by ID
 *     tags: [Inventory]
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
 *         description: Inventory item updated
 *       404:
 *         description: Inventory item not found
 */
exports.update = async (req, res) => {
  try {
    const [updated] = await Inventory.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedItem = await Inventory.findByPk(req.params.id);
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: `Cannot update inventory item with id=${req.params.id}. Maybe item was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating inventory item with id=" + req.params.id
    });
  }
};

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item deleted
 *       404:
 *         description: Inventory item not found
 */
exports.delete = async (req, res) => {
  try {
    const deleted = await Inventory.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.send({ message: "Inventory item was deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete inventory item with id=${req.params.id}. Maybe item was not found!` });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete inventory item with id=" + req.params.id
    });
  }
};

/**
 * @swagger
 * /inventory:
 *   delete:
 *     summary: Delete all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: All inventory items deleted
 */
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Inventory.destroy({ where: {}, truncate: false });
    res.send({ message: `${nums} inventory items were deleted successfully!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all inventory items."
    });
  }
};

/**
 * @swagger
 * /ai/stock-prediction:
 *   post:
 *     summary: AI Stock Prediction
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               usageHistory:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Stock depletion prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 depletionDate:
 *                   type: string
 *                   format: date
 */
exports.stockPrediction = async (req, res) => {
  try {
    const { item, usageHistory } = req.body;
    // AI logic (demo)
    const depletionDate = "2025-09-25";
    res.send({ depletionDate });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/auto-reorder:
 *   post:
 *     summary: Auto-Reorder System
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               currentStock:
 *                 type: integer
 *               predictedDepletionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reorder trigger result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reorderTriggered:
 *                   type: boolean
 *                 reorderDate:
 *                   type: string
 *                   format: date
 */
exports.autoReorder = async (req, res) => {
  try {
    const { item, currentStock, predictedDepletionDate } = req.body;
    // AI logic (demo)
    const reorderTriggered = true;
    const reorderDate = "2025-09-15";
    res.send({ reorderTriggered, reorderDate });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/waste-reduction:
 *   post:
 *     summary: Waste Reduction Suggestions
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               appointmentForecast:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Stock adjustment suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adjustmentSuggestion:
 *                   type: string
 */
exports.wasteReduction = async (req, res) => {
  try {
    const { item, appointmentForecast } = req.body;
    // AI logic (demo)
    const adjustmentSuggestion = `Reduce order of ${item} by 10% next month based on forecast.`;
    res.send({ adjustmentSuggestion });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
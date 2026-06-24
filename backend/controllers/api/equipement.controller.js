const {
    findAllEquipment,
    findEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipmentById,
    deleteAllEquipment
} = require("../../services/equipement.services");


/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: API for managing equipment records
 */

/**
 * @swagger
 * /equipment:
 *   post:
 *     summary: Create a new equipment maintenance record
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       201:
 *         description: Equipment maintenance record created
 *       400:
 *         description: Content can not be empty!
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         clinicId:
 *           type: string
 *         equipmentName:
 *           type: string
 *         modelNumber:
 *           type: string
 *         manufacturer:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date
 *         lastServiceDate:
 *           type: string
 *           format: date
 *         nextServiceDue:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         assignedTechnician:
 *           type: string
 *         maintenanceNotes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
    if (!req.body.clinicId || !req.body.equipmentName) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createEquipment(req.body, res);
};

/**
 * @swagger
 * /equipment:
 *   get:
 *     summary: Get all equipment maintenance records
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: List of all equipment maintenance records
 */
exports.findAll = (req, res) => {
    findAllEquipment(null, res);
};

/**
 * @swagger
 * /equipment/{id}:
 *   get:
 *     summary: Get an equipment maintenance record by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment maintenance record data
 *       404:
 *         description: Equipment maintenance record not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findEquipmentById(id, res);
};

/**
 * @swagger
 * /equipment/{id}:
 *   put:
 *     summary: Update an equipment maintenance record by ID
 *     tags: [Equipment]
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
 *         description: Equipment maintenance record updated
 *       404:
 *         description: Equipment maintenance record not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateEquipment(id, req, res);
};

/**
 * @swagger
 * /equipment/{id}:
 *   delete:
 *     summary: Delete an equipment maintenance record by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment maintenance record deleted
 *       404:
 *         description: Equipment maintenance record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteEquipmentById(id, res);
};

/**
 * @swagger
 * /equipment:
 *   delete:
 *     summary: Delete all equipment maintenance records
 *     responses:
 *       200:
 *         description: All equipment maintenance records deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllEquipment(res);
};

/**
 * @swagger
 * /ai/predictive-maintenance:
 *   post:
 *     summary: Predictive Maintenance for equipment
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: string
 *               usageData:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Predicted failure date and maintenance suggestion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictedFailureDate:
 *                   type: string
 *                   format: date
 *                 maintenanceSuggestion:
 *                   type: string
 */
exports.predictiveMaintenance = async (req, res) => {
  try {
    const { equipmentId, usageData } = req.body;
    // AI logic (demo)
    const predictedFailureDate = "2025-10-01";
    const maintenanceSuggestion = "Schedule maintenance before September 25th.";
    res.send({ predictedFailureDate, maintenanceSuggestion });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/usage-optimization:
 *   post:
 *     summary: Usage Optimization for equipment maintenance
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: string
 *               usageHistory:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Optimized maintenance schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextMaintenanceDate:
 *                   type: string
 *                   format: date
 *                 scheduleDetails:
 *                   type: string
 */
exports.usageOptimization = async (req, res) => {
  try {
    const { equipmentId, usageHistory } = req.body;
    // AI logic (demo)
    const nextMaintenanceDate = "2025-09-20";
    const scheduleDetails = "Based on usage, next checkup should be before September 20th.";
    res.send({ nextMaintenanceDate, scheduleDetails });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
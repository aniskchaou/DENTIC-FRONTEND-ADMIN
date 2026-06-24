const {
    findAllLoyaltyPrograms,
    findLoyaltyProgramById,
    createLoyaltyProgram,
    updateLoyaltyProgram,
    deleteLoyaltyProgramById,
    deleteAllLoyaltyPrograms
} = require("../../services/loyalty.services");

/**
 * @swagger
 * tags:
 *   name: LoyaltyProgram
 *   description: API for managing loyalty programs
 */

/**
 * @swagger
 * /loyalty:
 *   post:
 *     summary: Create a new loyalty program
 *     tags: [LoyaltyProgram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *             properties:
 *               patientId:
 *                 type: string
 *               points:
 *                 type: number
 *               tier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loyalty program created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.create = (req, res) => {
    if (!req.body.patientId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createLoyaltyProgram(req.body, res);
};

/**
 * @swagger
 * /loyalty:
 *   get:
 *     summary: Retrieve all loyalty programs
 *     tags: [LoyaltyProgram]
 *     responses:
 *       200:
 *         description: A list of loyalty programs
 */
exports.findAll = (req, res) => {
    findAllLoyaltyPrograms(null, res);
};

/**
 * @swagger
 * /loyalty/{id}:
 *   get:
 *     summary: Get a single loyalty program by ID
 *     tags: [LoyaltyProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the loyalty program
 *     responses:
 *       200:
 *         description: Loyalty program found
 *       404:
 *         description: Program not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findLoyaltyProgramById(id, res);
};

/**
 * @swagger
 * /loyalty/{id}:
 *   put:
 *     summary: Update a loyalty program by ID
 *     tags: [LoyaltyProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the loyalty program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               points:
 *                 type: number
 *               tier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Program updated successfully
 *       404:
 *         description: Program not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateLoyaltyProgram(id, req, res);
};

/**
 * @swagger
 * /loyalty/{id}:
 *   delete:
 *     summary: Delete a loyalty program by ID
 *     tags: [LoyaltyProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the loyalty program
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *       404:
 *         description: Program not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteLoyaltyProgramById(id, res);
};

/**
 * @swagger
 * /loyalty:
 *   delete:
 *     summary: Delete all loyalty programs
 *     tags: [LoyaltyProgram]
 *     responses:
 *       200:
 *         description: All programs deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllLoyaltyPrograms(res);
};

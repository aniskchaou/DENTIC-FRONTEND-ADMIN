const {
    deleteHistoryById,
    deleteAllHistories
} = require("../../services/history.services");



/**
 * @swagger
 * tags:
 *   name: History
 *   description: API for managing history records
 */

/**
 * @swagger
 * /histories/{id}:
 *   delete:
 *     summary: Delete a history record by ID
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History record deleted
 *       404:
 *         description: History record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteHistoryById(id, res);
};

/**
 * @swagger
 * /histories:
 *   delete:
 *     summary: Delete all history records
 *     tags: [History]
 *     responses:
 *       200:
 *         description: All history records deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllHistories(res);
};
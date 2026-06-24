const MedicamentCategory = require("../models/medicament.category.models");

/**
 * @swagger
 * /medicament-categories:
 *   get:
 *     summary: Get all medicament categories
 *     responses:
 *       200:
 *         description: List of all medicament categories
 */
exports.findAllMedicamentCategorys = (res) => {
    MedicamentCategory.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

/**
 * @swagger
 * /medicament-categories:
 *   post:
 *     summary: Create a new medicament category
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
exports.createMedicamentCategory = (income, res) => {
    MedicamentCategory.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the MedicamentCategory."
            });
        });
}

/**
 * @swagger
 * /medicament-categories/{id}:
 *   get:
 *     summary: Get a medicament category by ID
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
exports.findMedicamentCategoryById = (id, res) => {
    MedicamentCategory.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving MedicamentCategory with id=" + id
            });
        });
}

/**
 * @swagger
 * /medicament-categories/{id}:
 *   delete:
 *     summary: Delete a medicament category by ID
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
exports.deleteMedicamentCategoryById = (id, res) => {
    MedicamentCategory.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "MedicamentCategory was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete MedicamentCategory with id=${id}. Maybe MedicamentCategory was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete MedicamentCategory with id=" + id
            });
        });
}

/**
 * @swagger
 * /medicament-categories/{id}:
 *   put:
 *     summary: Update a medicament category by ID
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
exports.updateMedicamentCategory = (id, req, res) => {
    MedicamentCategory.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "MedicamentCategory was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update MedicamentCategory with id=${id}. Maybe MedicamentCategory was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating MedicamentCategory with id=" + id
            });
        });
}

/**
 * @swagger
 * /medicament-categories:
 *   delete:
 *     summary: Delete all medicament categories
 *     responses:
 *       200:
 *         description: All medicament categories deleted
 */
exports.deleteAllMedicamentCategorys = (res) => {
    MedicamentCategory.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} MedicamentCategory were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}
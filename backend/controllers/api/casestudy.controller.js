const {
    findAllCaseStudies,
    findCaseStudyById,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudyById,
    deleteAllCaseStudies
} = require("../../services/casestudy.services");

/**
 * @swagger
 * tags:
 *   name: CaseStudy
 *   description: API for managing case studies
 */



/**
 * @swagger
 * /casestudies:
 *   post:
 *     summary: Create a new case study
 *     tags: [CaseStudy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Case study created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createCaseStudy(req.body, res);
};

/**
 * @swagger
 * /casestudies:
 *   get:
 *     summary: Retrieve all case studies
 *     tags: [CaseStudy]
 *     responses:
 *       200:
 *         description: List of all case studies
 */
exports.findAll = (req, res) => {
    // You can add query-based filtering here if needed
    findAllCaseStudies(null, res);
};

/**
 * @swagger
 * /casestudies/{id}:
 *   get:
 *     summary: Get a case study by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case study data
 *       404:
 *         description: Case study not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findCaseStudyById(id, res);
};

/**
 * @swagger
 * /casestudies/{id}:
 *   put:
 *     summary: Update a case study by ID
 *     tags: [CaseStudy]
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
 *         description: Case study updated
 *       404:
 *         description: Case study not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateCaseStudy(id, req, res);
};



/**
 * @swagger
 * /casestudies/{id}:
 *   delete:
 *     summary: Delete a case study by ID
 *     tags: [CaseStudy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case study deleted
 *       404:
 *         description: Case study not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteCaseStudyById(id, res);
};

/**
 * @swagger
 * /casestudies:
 *   delete:
 *     summary: Delete all case studies
 *     tags: [CaseStudy]
 *     responses:
 *       200:
 *         description: All case studies deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllCaseStudies(res);
};
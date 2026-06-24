const { getCount, createMessage, findAllMessages, findMessageById, updateMessage, deleteMessageById, deleteAllMessages } = require("../../services/message.services");

/**
 * @swagger
 * /messages/count:
 *   get:
 *     summary: Get the count of all messages
 *     tags:
 *       - Message
 *     responses:
 *       200:
 *         description: Total count of messages
 */
exports.getCount = (req, res) => {
    getCount(req, res)
};

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - Message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - name
 *               - subject
 *               - message
 *     responses:
 *       200:
 *         description: Message created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.create = (req, res) => {
 
    createMessage(req.body, res);
};

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Retrieve all messages
 *     tags:
 *       - Message
 *     responses:
 *       200:
 *         description: List of all messages
 */
exports.findAll = (req, res) => {
    findAllMessages(res);
};

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message details
 *       404:
 *         description: Message not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findMessageById(id, res);
};

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: Update a message by ID
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
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
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateMessage(id, req, res);
};

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags:
 *       - Message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteMessageById(id, res);
};

/**
 * @swagger
 * /messages:
 *   delete:
 *     summary: Delete all messages
 *     tags:
 *       - Message
 *     responses:
 *       200:
 *         description: All messages deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllMessages(req, res);
};

/**
 * @swagger
 * /ai/chatbot:
 *   post:
 *     summary: AI Chatbot for patient questions
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chatbot answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 */
exports.chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    // AI logic (demo)
    const answer = "Our clinic is open from 9am to 6pm. A cleaning costs $80.";
    res.send({ answer });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/smart-triage:
 *   post:
 *     summary: Smart Triage for message routing
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Routed department/doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routedTo:
 *                   type: string
 */
exports.smartTriage = async (req, res) => {
  try {
    const { message } = req.body;
    // AI logic (demo)
    const routedTo = "Front Desk";
    res.send({ routedTo });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/message-sentiment:
 *   post:
 *     summary: Sentiment Analysis for messages
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sentiment and urgency detection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sentiment:
 *                   type: string
 *                 urgency:
 *                   type: string
 */
exports.messageSentiment = async (req, res) => {
  try {
    const { message } = req.body;
    // AI logic (demo)
    const sentiment = "Dissatisfied";
    const urgency = "High";
    res.send({ sentiment, urgency });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};


const { loginUser, findAll, findAllUsers, createUser, findUserById, deleteUserById, updateUser, deleteAllUsers } = require("../../services/user.services");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Content can not be empty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
exports.create = (req, res) => {
    createUser(req.body,res);
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users (optionally filter by username)
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter by username
 *     responses:
 *       200:
 *         description: List of users
 */
exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    findAllUsers(condition, res);
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findUserById(id, res);
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateUser(id, req, res);
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteUserById(id, res);
};

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: All users deleted successfully
 */
exports.deleteAll = (req, res) => {
    deleteAllUsers(res);
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid username or password
 */
exports.login = (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    loginUser(user.username, user.password, res);
};

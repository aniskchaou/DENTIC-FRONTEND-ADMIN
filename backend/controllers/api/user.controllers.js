
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

const User = require("../../models/user.models");
const bcrypt = require("bcrypt");

// PUT /users/:id/disable  –  set status to Disabled
exports.disable = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    await user.update({ status: "Disabled" });
    res.json({ message: "User disabled." });
};

// PUT /users/:id/enable  –  restore status to Active
exports.enable = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    await user.update({ status: "Active" });
    res.json({ message: "User enabled." });
};

// PUT /users/:id/permissions  –  overwrite permissions on linked staff record
exports.assignPermissions = async (req, res) => {
    const { permissions } = req.body;
    if (!Array.isArray(permissions))
        return res.status(400).json({ message: "permissions must be an array." });
    const Staff = require("../../models/staff.models");
    const [updated] = await Staff.update({ permissions }, { where: { userId: req.params.id } });
    if (!updated) return res.status(404).json({ message: "No staff record found for this user." });
    res.json({ message: "Permissions updated." });
};

// POST /users/:id/reset-password  –  admin sets a new password without needing the old one
exports.adminResetPassword = async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "newPassword is required." });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });
    res.json({ message: "Password reset by admin." });
};

// POST /users/:id/impersonate  –  superadmin gets a temporary session as another user (audit-logged)
exports.impersonate = async (req, res) => {
    const target = await User.findByPk(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found." });
    // Log the impersonation action
    const AuditLog = require("../../models/audit.log.models");
    await AuditLog.create({
        userId: req.body.adminId || null,
        username: req.body.adminUsername || "superadmin",
        role: "SUPERADMIN",
        action: "IMPERSONATE",
        entity: "user",
        entityId: target.id,
        ipAddress: req.ip,
        details: { targetUsername: target.username, targetRole: target.role },
    }).catch(() => {});
    // Return the target user's profile as if they logged in (no real JWT in this demo)
    res.json({
        id: target.id,
        username: target.username,
        role: target.role,
        email: target.email,
        impersonatedBy: req.body.adminUsername || "superadmin",
        _impersonation: true,
    });
};


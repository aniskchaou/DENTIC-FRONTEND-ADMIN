const AuditLog = require('../../models/audit.log.models');
const { Op } = require('sequelize');

// POST /audit-logs  — used internally by middleware, not exposed directly
exports.log = async ({ userId, username, role, action, entity, entityId, ipAddress, details }) => {
  try {
    await AuditLog.create({ userId, username, role, action, entity, entityId, ipAddress, details });
  } catch (_) { /* never block the main request */ }
};

// GET /audit-logs
exports.getAll = async (req, res) => {
  try {
    const { action, entity, userId, from, to, limit = 100, offset = 0 } = req.query;
    const where = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to)   where.createdAt[Op.lte] = new Date(to);
    }
    const rows = await AuditLog.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /audit-logs/:id
exports.getOne = async (req, res) => {
  try {
    const row = await AuditLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /audit-logs  — purge older than `before` date or all
exports.purge = async (req, res) => {
  try {
    const { before } = req.query;
    const where = before ? { createdAt: { [Op.lt]: new Date(before) } } : {};
    const count = await AuditLog.destroy({ where });
    res.json({ deleted: count });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

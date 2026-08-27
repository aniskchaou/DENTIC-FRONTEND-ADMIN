const SupportTicket = require('../../models/support.ticket.models');

// GET /support-tickets
exports.getAll = async (req, res) => {
  try {
    const { status, priority, clinicId } = req.query;
    const where = {};
    if (status)   where.status   = status;
    if (priority) where.priority = priority;
    if (clinicId) where.clinicId = clinicId;
    const tickets = await SupportTicket.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(tickets);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /support-tickets/:id
exports.getOne = async (req, res) => {
  try {
    const t = await SupportTicket.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /support-tickets
exports.create = async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json(ticket);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// PUT /support-tickets/:id
exports.update = async (req, res) => {
  try {
    const t = await SupportTicket.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await t.update(req.body);
    res.json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// PUT /support-tickets/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const t = await SupportTicket.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await t.update({ status: req.body.status, assignedTo: req.body.assignedTo || t.assignedTo });
    res.json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// POST /support-tickets/:id/reply
exports.reply = async (req, res) => {
  try {
    const t = await SupportTicket.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    const replies = [...(t.replies || []), { ...req.body, timestamp: new Date() }];
    await t.update({ replies });
    res.json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// DELETE /support-tickets/:id
exports.remove = async (req, res) => {
  try {
    const t = await SupportTicket.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await t.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

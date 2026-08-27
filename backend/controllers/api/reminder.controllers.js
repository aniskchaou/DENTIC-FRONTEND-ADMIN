const Reminder = require('../../models/reminder.models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.type)   where.reminderType = req.query.type;
    if (req.query.status) where.status  = req.query.status;
    const reminders = await Reminder.findAll({ where, order: [['sendAt', 'ASC']] });
    res.json(reminders);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const r = await Reminder.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const r = await Reminder.create(req.body);
    res.status(201).json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const r = await Reminder.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    await r.update(req.body);
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const r = await Reminder.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    await r.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

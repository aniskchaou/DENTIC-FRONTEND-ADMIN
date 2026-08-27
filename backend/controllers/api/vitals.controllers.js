const Vitals = require('../../models/vitals.models');

exports.getAll = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.query;
    const where = {};
    if (patientId)     where.patientId     = patientId;
    if (appointmentId) where.appointmentId = appointmentId;
    const rows = await Vitals.findAll({ where, order: [['recordedAt', 'DESC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const v = await Vitals.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Not found' });
    res.json(v);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const v = await Vitals.create({ ...req.body, recordedAt: new Date() });
    res.status(201).json(v);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const v = await Vitals.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Not found' });
    await v.update(req.body);
    res.json(v);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const v = await Vitals.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: 'Not found' });
    await v.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

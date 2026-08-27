const ClinicPaymentMethod = require('../../models/clinic.payment.method.models');

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.clinicId) where.clinicId = req.query.clinicId;
    const rows = await ClinicPaymentMethod.findAll({ where, order: [['isDefault', 'DESC'], ['createdAt', 'ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const m = await ClinicPaymentMethod.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const m = await ClinicPaymentMethod.create(req.body);
    res.status(201).json(m);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const m = await ClinicPaymentMethod.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    await m.update(req.body);
    res.json(m);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.setDefault = async (req, res) => {
  try {
    const m = await ClinicPaymentMethod.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    // Clear current default for same clinic
    await ClinicPaymentMethod.update({ isDefault: false }, { where: { clinicId: m.clinicId } });
    await m.update({ isDefault: true });
    res.json(m);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const m = await ClinicPaymentMethod.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    await m.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

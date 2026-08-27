var AppointmentType = require("../../models/appointment.type.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId } : {};
    res.json(await AppointmentType.findAll({ where }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const t = await AppointmentType.create(req.body);
    res.status(201).json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const t = await AppointmentType.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    await t.update(req.body);
    res.json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const t = await AppointmentType.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    await t.update({ isActive: false });
    res.json({ message: "Deactivated" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

var Room = require("../../models/room.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId } : {};
    res.json(await Room.findAll({ where }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Room.create(req.body));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const r = await Room.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.update(req.body);
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const r = await Room.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.toggleActive = async (req, res) => {
  try {
    const r = await Room.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.update({ isActive: !r.isActive });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

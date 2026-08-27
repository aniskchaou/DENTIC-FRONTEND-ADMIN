var Waitlist = require("../../models/waitlist.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId, status } = req.query;
    const where = {};
    if (clinicId) where.clinicId = clinicId;
    if (status) where.status = status;
    res.json(await Waitlist.findAll({ where, order: [["priority", "DESC"], ["createdAt", "ASC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Waitlist.create(req.body));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const w = await Waitlist.findByPk(req.params.id);
    if (!w) return res.status(404).json({ error: "Not found" });
    await w.update(req.body);
    res.json(w);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.notify = async (req, res) => {
  try {
    const w = await Waitlist.findByPk(req.params.id);
    if (!w) return res.status(404).json({ error: "Not found" });
    await w.update({ status: "notified", notifiedAt: new Date() });
    res.json(w);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const w = await Waitlist.findByPk(req.params.id);
    if (!w) return res.status(404).json({ error: "Not found" });
    await w.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

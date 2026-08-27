var Holiday = require("../../models/holiday.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId } : {};
    res.json(await Holiday.findAll({ where, order: [["date", "ASC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const h = await Holiday.create(req.body);
    res.status(201).json(h);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const h = await Holiday.findByPk(req.params.id);
    if (!h) return res.status(404).json({ error: "Not found" });
    await h.update(req.body);
    res.json(h);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const h = await Holiday.findByPk(req.params.id);
    if (!h) return res.status(404).json({ error: "Not found" });
    await h.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

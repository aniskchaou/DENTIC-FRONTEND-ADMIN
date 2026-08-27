var ServicePrice = require("../../models/service.price.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId, category } = req.query;
    const where = {};
    if (clinicId) where.clinicId = clinicId;
    if (category) where.category = category;
    res.json(await ServicePrice.findAll({ where, order: [["category", "ASC"], ["name", "ASC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await ServicePrice.create(req.body));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const sp = await ServicePrice.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ error: "Not found" });
    await sp.update(req.body);
    res.json(sp);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const sp = await ServicePrice.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ error: "Not found" });
    await sp.update({ isActive: false });
    res.json({ message: "Deactivated" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

var ClinicLocation = require("../../models/clinic.location.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId } : {};
    const locations = await ClinicLocation.findAll({ where });
    res.json(locations);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const loc = await ClinicLocation.findByPk(req.params.id);
    if (!loc) return res.status(404).json({ error: "Not found" });
    res.json(loc);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const loc = await ClinicLocation.create(req.body);
    res.status(201).json(loc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const loc = await ClinicLocation.findByPk(req.params.id);
    if (!loc) return res.status(404).json({ error: "Not found" });
    await loc.update(req.body);
    res.json(loc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const loc = await ClinicLocation.findByPk(req.params.id);
    if (!loc) return res.status(404).json({ error: "Not found" });
    await loc.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.setMain = async (req, res) => {
  try {
    const loc = await ClinicLocation.findByPk(req.params.id);
    if (!loc) return res.status(404).json({ error: "Not found" });
    await ClinicLocation.update({ isMain: false }, { where: { clinicId: loc.clinicId } });
    await loc.update({ isMain: true });
    res.json(loc);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

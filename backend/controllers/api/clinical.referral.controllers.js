var ClinicalReferral = require("../../models/clinical.referral.models.js");

exports.getAll = async (req, res) => {
  try {
    const { patientId, referringDoctorId, status } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (referringDoctorId) where.referringDoctorId = referringDoctorId;
    if (status) where.status = status;
    res.json(await ClinicalReferral.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const r = await ClinicalReferral.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await ClinicalReferral.create(req.body));
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const r = await ClinicalReferral.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.update(req.body);
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.send = async (req, res) => {
  try {
    const r = await ClinicalReferral.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.update({ status: "sent", sentAt: new Date() });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const r = await ClinicalReferral.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    await r.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

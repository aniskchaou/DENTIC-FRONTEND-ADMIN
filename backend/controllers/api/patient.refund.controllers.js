var PatientRefund = require("../../models/patient.refund.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId, patientId, status } = req.query;
    const where = {};
    if (clinicId) where.clinicId = clinicId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    res.json(await PatientRefund.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const r = await PatientRefund.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const r = await PatientRefund.create(req.body);
    res.status(201).json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const r = await PatientRefund.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    const updates = { status: req.body.status };
    if (req.body.status === "processed") {
      updates.processedAt = new Date();
      updates.processedBy = req.body.processedBy;
    }
    await r.update(updates);
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

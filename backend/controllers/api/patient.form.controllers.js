var PatientForm = require("../../models/patient.form.models.js");
var crypto = require("crypto");

exports.getAll = async (req, res) => {
  try {
    const { patientId, status, formType } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (formType) where.formType = formType;
    res.json(await PatientForm.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const f = await PatientForm.findByPk(req.params.id);
    if (!f) return res.status(404).json({ error: "Not found" });
    res.json(f);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// Get by public access token (patient fills form via link)
exports.getByToken = async (req, res) => {
  try {
    const f = await PatientForm.findOne({ where: { accessToken: req.params.token } });
    if (!f) return res.status(404).json({ error: "Form not found or link expired" });
    if (f.expiresAt && new Date() > f.expiresAt) return res.status(410).json({ error: "Form link has expired" });
    if (f.status === "draft") await f.update({ status: "viewed", viewedAt: new Date() });
    res.json(f);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const form = await PatientForm.create({ ...req.body, accessToken: token, expiresAt, status: "draft" });
    res.status(201).json(form);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.send = async (req, res) => {
  try {
    const f = await PatientForm.findByPk(req.params.id);
    if (!f) return res.status(404).json({ error: "Not found" });
    await f.update({ status: "sent", sentAt: new Date(), sentVia: req.body.sentVia || "link" });
    res.json({ form: f, link: `/patient-form/${f.accessToken}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.submitResponses = async (req, res) => {
  try {
    const f = await PatientForm.findOne({ where: { accessToken: req.params.token } });
    if (!f) return res.status(404).json({ error: "Form not found" });
    if (f.expiresAt && new Date() > f.expiresAt) return res.status(410).json({ error: "Form expired" });
    await f.update({ responses: req.body.responses, status: "completed", completedAt: new Date() });
    res.json(f);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const f = await PatientForm.findByPk(req.params.id);
    if (!f) return res.status(404).json({ error: "Not found" });
    await f.update(req.body);
    res.json(f);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const f = await PatientForm.findByPk(req.params.id);
    if (!f) return res.status(404).json({ error: "Not found" });
    await f.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

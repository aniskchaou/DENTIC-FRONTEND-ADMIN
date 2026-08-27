var ClinicalNote = require("../../models/clinical.note.models.js");

exports.getAll = async (req, res) => {
  try {
    const { patientId, doctorId, noteType, isDraft } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (noteType) where.noteType = noteType;
    if (isDraft !== undefined) where.isDraft = isDraft === 'true';
    res.json(await ClinicalNote.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const n = await ClinicalNote.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: "Not found" });
    res.json(n);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const note = await ClinicalNote.create(req.body);
    res.status(201).json(note);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const n = await ClinicalNote.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: "Not found" });
    if (n.isSigned) return res.status(403).json({ error: "Signed notes cannot be edited. Use amendment." });
    await n.update(req.body);
    res.json(n);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.sign = async (req, res) => {
  try {
    const n = await ClinicalNote.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: "Not found" });
    await n.update({
      isSigned: true,
      signedAt: new Date(),
      signatureData: req.body.signatureData || null,
      isDraft: false,
    });
    res.json(n);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.amend = async (req, res) => {
  try {
    const n = await ClinicalNote.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: "Not found" });
    await n.update({ isAmended: true, amendmentNote: req.body.amendmentNote });
    // Create a new draft with amended content
    const amended = await ClinicalNote.create({
      ...n.dataValues,
      id: undefined,
      isSigned: false,
      isDraft: true,
      isAmended: false,
      amendmentNote: null,
      signedAt: null,
      signatureData: null,
      content: req.body.content || n.content,
      subjective: req.body.subjective || n.subjective,
      objective: req.body.objective || n.objective,
      assessment: req.body.assessment || n.assessment,
      plan: req.body.plan || n.plan,
    });
    res.status(201).json(amended);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const n = await ClinicalNote.findByPk(req.params.id);
    if (!n) return res.status(404).json({ error: "Not found" });
    if (n.isSigned) return res.status(403).json({ error: "Signed notes cannot be deleted" });
    await n.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

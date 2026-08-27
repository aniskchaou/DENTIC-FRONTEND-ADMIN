var AdminDocument = require("../../models/admin.document.models.js");
var path = require("path");
var fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const { patientId, docType, isVerified } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (docType) where.docType = docType;
    if (isVerified !== undefined) where.isVerified = isVerified === "true";
    res.json(await AdminDocument.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const doc = await AdminDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const doc = await AdminDocument.create({
      patientId: req.body.patientId,
      uploadedBy: req.body.uploadedBy,
      clinicId: req.body.clinicId,
      docType: req.body.docType || "other",
      fileName: req.file.originalname,
      fileUrl: `/uploads/admin-docs/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      description: req.body.description || "",
    });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.verify = async (req, res) => {
  try {
    const doc = await AdminDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    await doc.update({
      isVerified: true,
      verifiedBy: req.body.verifiedBy,
      verifiedAt: new Date(),
      verificationNote: req.body.note || "",
    });
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const doc = await AdminDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const filePath = path.join(__dirname, "../../uploads/admin-docs", path.basename(doc.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await doc.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

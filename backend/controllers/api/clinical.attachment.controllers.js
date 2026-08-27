var ClinicalAttachment = require("../../models/clinical.attachment.models.js");
var path = require("path");
var fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const { entityType, entityId, patientId } = req.query;
    const where = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (patientId) where.patientId = patientId;
    res.json(await ClinicalAttachment.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const attachment = await ClinicalAttachment.create({
      entityType: req.body.entityType,
      entityId: req.body.entityId,
      patientId: req.body.patientId,
      uploadedBy: req.body.uploadedBy,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: `/uploads/clinical/${req.file.filename}`,
      category: req.body.category || "document",
      description: req.body.description || "",
    });
    res.status(201).json(attachment);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const a = await ClinicalAttachment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ error: "Not found" });
    // Optionally delete file from disk
    const filePath = path.join(__dirname, "../../uploads/clinical", path.basename(a.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await a.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

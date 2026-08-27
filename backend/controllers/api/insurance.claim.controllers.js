const InsuranceClaim = require("../../models/insurance.claim.models.js");
const crypto = require("crypto");

const generateClaimNumber = () => `CLM-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

exports.getAll = async (req, res) => {
  try {
    const { patientId, status, insuranceId, clinicId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (insuranceId) where.insuranceId = insuranceId;
    if (clinicId) where.clinicId = clinicId;
    res.json(await InsuranceClaim.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const claim = await InsuranceClaim.create({ ...req.body, claimNumber: generateClaimNumber(), status: "draft" });
    res.status(201).json(claim);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    await c.update(req.body);
    res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.submit = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    await c.update({ status: "submitted", submittedAt: new Date(), submittedBy: req.body.submittedBy || null });
    res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    const { status, rejectionReason, reimbursementAmount, coveredAmount } = req.body;
    const updates = { status };
    if (status === "acknowledged") updates.acknowledgedAt = new Date();
    if (status === "approved" || status === "partially_approved") {
      updates.approvedAt = new Date();
      if (coveredAmount !== undefined) updates.coveredAmount = coveredAmount;
    }
    if (status === "rejected") {
      updates.rejectedAt = new Date();
      updates.rejectionReason = rejectionReason || null;
    }
    if (status === "paid") {
      updates.paidAt = new Date();
      if (reimbursementAmount !== undefined) updates.reimbursementAmount = reimbursementAmount;
    }
    await c.update(updates);
    res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.resubmit = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    if (c.status !== "rejected") return res.status(400).json({ error: "Only rejected claims can be resubmitted" });
    await c.update({
      status: "resubmitted",
      submittedAt: new Date(),
      resubmitCount: (c.resubmitCount || 0) + 1,
      resubmitNote: req.body.resubmitNote || null,
      clinicalNarrative: req.body.clinicalNarrative || c.clinicalNarrative,
    });
    res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.addDocument = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    const docs = Array.isArray(c.supportingDocuments) ? c.supportingDocuments : [];
    docs.push({
      name: req.body.name,
      url: req.body.url,
      type: req.body.type || "document",
      addedAt: new Date(),
    });
    await c.update({ supportingDocuments: docs });
    res.json(c);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const c = await InsuranceClaim.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    if (c.status !== "draft") return res.status(400).json({ error: "Only draft claims can be deleted" });
    await c.destroy();
    res.json({ deleted: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// GET /insurance-claims/analytics — summary by status
exports.analytics = async (req, res) => {
  try {
    const all = await InsuranceClaim.findAll();
    const byStatus = {};
    let totalClaimed = 0, totalReimbursed = 0;
    all.forEach(c => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      totalClaimed += parseFloat(c.claimAmount) || 0;
      totalReimbursed += parseFloat(c.reimbursementAmount) || 0;
    });
    res.json({ total: all.length, byStatus, totalClaimed, totalReimbursed, pendingReimbursement: totalClaimed - totalReimbursed });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

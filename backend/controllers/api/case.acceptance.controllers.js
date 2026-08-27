const CaseAcceptance = require("../../models/case.acceptance.models.js");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { patientId, status, coordinatorId, priority } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (coordinatorId) where.coordinatorId = coordinatorId;
    if (priority) where.priority = priority;
    res.json(await CaseAcceptance.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const c = await CaseAcceptance.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const ca = await CaseAcceptance.create({ ...req.body, status: "pending" });
    res.status(201).json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.update(req.body);
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.markPresented = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.update({ status: "presented", presentedAt: new Date(), coordinatorNotes: req.body.notes || ca.coordinatorNotes });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.recordAcceptance = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.update({
      status: "accepted",
      acceptedAt: new Date(),
      acceptedProcedures: req.body.acceptedProcedures || [],
      acceptedValue: req.body.acceptedValue || 0,
      financingOption: req.body.financingOption || "none",
      financingTerm: req.body.financingTerm || null,
      monthlyPayment: req.body.monthlyPayment || null,
    });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.recordRejection = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    const objections = Array.isArray(ca.objections) ? ca.objections : [];
    if (req.body.objection) objections.push({ text: req.body.objection, addedAt: new Date() });
    await ca.update({
      status: "rejected",
      rejectedAt: new Date(),
      objections,
      coordinatorNotes: req.body.notes || ca.coordinatorNotes,
    });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.defer = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.update({
      status: "deferred",
      deferralReason: req.body.reason || null,
      followUpDate: req.body.followUpDate || null,
      followUpNote: req.body.followUpNote || null,
    });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.addObjection = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    const objections = Array.isArray(ca.objections) ? ca.objections : [];
    objections.push({ text: req.body.text, respondedWith: null, addedAt: new Date() });
    await ca.update({ objections });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.addCallSummary = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.update({ callSummary: req.body.callSummary || "" });
    res.json(ca);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// GET /case-acceptance/pipeline — grouped by status
exports.getPipeline = async (req, res) => {
  try {
    const all = await CaseAcceptance.findAll({ order: [["createdAt", "DESC"]] });
    const pipeline = { pending: [], presented: [], deferred: [], accepted: [], rejected: [], partial: [] };
    all.forEach(c => { if (pipeline[c.status]) pipeline[c.status].push(c); });
    const stats = {
      total: all.length,
      acceptanceRate: all.length > 0 ? ((pipeline.accepted.length / all.length) * 100).toFixed(1) : 0,
      totalAcceptedValue: pipeline.accepted.reduce((s, c) => s + (parseFloat(c.acceptedValue) || 0), 0),
      totalEstimatedValue: all.reduce((s, c) => s + (parseFloat(c.estimatedValue) || 0), 0),
    };
    res.json({ pipeline, stats });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /case-acceptance/follow-ups — cases needing follow-up today or overdue
exports.getFollowUps = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const cases = await CaseAcceptance.findAll({
      where: {
        followUpDate: { [Op.lte]: today },
        status: { [Op.in]: ["pending", "presented", "deferred"] },
      },
      order: [["followUpDate", "ASC"]],
    });
    res.json(cases);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const ca = await CaseAcceptance.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    await ca.destroy();
    res.json({ deleted: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

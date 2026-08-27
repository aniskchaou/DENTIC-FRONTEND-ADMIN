const Patient = require("../../models/patient.models.js");
const Appointment = require("../../models/appointement.models.js");
const Invoice = require("../../models/invoice.models.js");
const TreatmentPlan = require("../../models/treatementplan.models.js");
const EducationalContent = require("../../models/educational.content.models.js");
const PostTreatmentSurvey = require("../../models/post.treatment.survey.models.js");
const Prescription = require("../../models/prescription.models.js");
const Waitlist = require("../../models/waitlist.models.js");
const Payment = require("../../models/payment.models.js");
const { Op } = require("sequelize");
const crypto = require("crypto");

// ── Patient-facing profile ────────────────────────────────────────────────

exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    // Strip sensitive fields before returning
    const { password, ...safe } = patient.toJSON ? patient.toJSON() : patient.dataValues;
    res.json(safe);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    const allowed = ["phone", "address", "email", "emergencyContact", "preferredLanguage", "communicationPreference"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    await patient.update(updates);
    res.json(patient);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// ── Patient appointments (read + self-service) ────────────────────────────

exports.getMyAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.findAll({
      where: { patientId },
      order: [["startTime", "DESC"]],
    });
    res.json(appointments);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.requestAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create({
      ...req.body,
      status: "requested",
      source: "patient_portal",
    });
    res.status(201).json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.cancelMyAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    if (!["confirmed", "requested", "scheduled"].includes(appt.status)) {
      return res.status(400).json({ error: "Cannot cancel appointment in status: " + appt.status });
    }
    await appt.update({ status: "cancelled", cancellationReason: req.body.reason || "Patient cancellation", cancelledAt: new Date() });
    res.json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// ── Patient invoices ──────────────────────────────────────────────────────

exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { patientId: req.params.patientId },
      order: [["createdAt", "DESC"]],
    });
    res.json(invoices);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Patient treatment plans ───────────────────────────────────────────────

exports.getMyTreatmentPlans = async (req, res) => {
  try {
    const plans = await TreatmentPlan.findAll({
      where: { patientId: req.params.patientId },
      order: [["createdAt", "DESC"]],
    });
    res.json(plans);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Educational content (public, paginated) ───────────────────────────────

exports.getEducation = async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { body: { [Op.like]: `%${search}%` } },
      ];
    }
    const items = await EducationalContent.findAll({ where, limit: parseInt(limit), offset: parseInt(offset), order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getEducationItem = async (req, res) => {
  try {
    const item = await EducationalContent.findByPk(req.params.id);
    if (!item || !item.isPublished) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Educational content admin (manage) ───────────────────────────────────

exports.createEducation = async (req, res) => {
  try {
    const item = await EducationalContent.create(req.body);
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.updateEducation = async (req, res) => {
  try {
    const item = await EducationalContent.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.update(req.body);
    res.json(item);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.deleteEducation = async (req, res) => {
  try {
    const item = await EducationalContent.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.destroy();
    res.json({ deleted: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// ── Post-treatment surveys ────────────────────────────────────────────────

exports.getAllSurveys = async (req, res) => {
  try {
    const { patientId, status, clinicId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (clinicId) where.clinicId = clinicId;
    res.json(await PostTreatmentSurvey.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendSurvey = async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const survey = await PostTreatmentSurvey.create({
      ...req.body,
      status: "pending",
      accessToken: token,
      sentAt: new Date(),
    });
    res.status(201).json({ ...survey.toJSON(), surveyLink: `/patient/survey/${token}` });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getSurveyByToken = async (req, res) => {
  try {
    const survey = await PostTreatmentSurvey.findOne({ where: { accessToken: req.params.token } });
    if (!survey) return res.status(404).json({ error: "Survey not found" });
    if (survey.status === "expired") return res.status(410).json({ error: "Survey expired" });
    res.json(survey);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.submitSurvey = async (req, res) => {
  try {
    const survey = await PostTreatmentSurvey.findOne({ where: { accessToken: req.params.token } });
    if (!survey) return res.status(404).json({ error: "Survey not found" });
    await survey.update({
      overallRating: req.body.overallRating,
      painLevel: req.body.painLevel,
      recoveryRating: req.body.recoveryRating,
      staffRating: req.body.staffRating,
      wouldRecommend: req.body.wouldRecommend,
      comments: req.body.comments,
      concerns: req.body.concerns,
      followUpNeeded: req.body.followUpNeeded || false,
      status: "completed",
      completedAt: new Date(),
    });
    res.json({ message: "Thank you for your feedback!", survey });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// ── Patient reschedule ────────────────────────────────────────────────────

exports.rescheduleMyAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    if (!["confirmed", "requested", "scheduled"].includes(appt.status)) {
      return res.status(400).json({ error: "Cannot reschedule in current status: " + appt.status });
    }
    const { appointmentDate, startTime, endTime, reason } = req.body;
    await appt.update({ appointmentDate, startTime, endTime, status: "requested", notes: reason ? `Rescheduled: ${reason}` : appt.notes });
    res.json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// ── Patient prescriptions ─────────────────────────────────────────────────

exports.getMyPrescriptions = async (req, res) => {
  try {
    const rows = await Prescription.findAll({
      where: { patientId: req.params.patientId },
      order: [["createdAt", "DESC"]],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Patient self-join waitlist ────────────────────────────────────────────

exports.joinWaitlist = async (req, res) => {
  try {
    const entry = await Waitlist.create({ ...req.body, source: "patient_portal" });
    res.status(201).json(entry);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getMyWaitlist = async (req, res) => {
  try {
    const rows = await Waitlist.findAll({ where: { patientId: req.params.patientId }, order: [["createdAt", "DESC"]] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.leaveWaitlist = async (req, res) => {
  try {
    const entry = await Waitlist.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    await entry.destroy();
    res.json({ message: "Removed from waitlist" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Patient online payment ────────────────────────────────────────────────

exports.getMyPayments = async (req, res) => {
  try {
    const rows = await Payment.findAll({
      where: { patientId: req.params.patientId },
      order: [["createdAt", "DESC"]],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.initiatePayment = async (req, res) => {
  try {
    // Records a payment intent; real gateway integration plugs in here
    const { patientId, invoiceId, amount, method, currency = "USD" } = req.body;
    if (!patientId || !amount) return res.status(400).json({ error: "patientId and amount required" });
    const payment = await Payment.create({
      patientId, invoiceId, amount, method: method || "online",
      currency, status: "pending", transactionId: "PAY-" + crypto.randomBytes(8).toString("hex").toUpperCase(),
    });
    res.status(201).json({ payment, redirectUrl: null, message: "Payment recorded as pending" });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: "Not found" });
    await payment.update({ status: "paid", paidAt: new Date(), gatewayRef: req.body.gatewayRef });
    res.json(payment);
  } catch (e) { res.status(400).json({ error: e.message }); }
};


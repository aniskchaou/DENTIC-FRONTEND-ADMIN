var sequelize = require("../../db/init.sequelize.js");
var { Sequelize, Op } = require("sequelize");
var Income = require("../../models/income.models.js");
var Appointement = require("../../models/appointement.models.js");
var Patient = require("../../models/patient.models.js");
var Invoice = require("../../models/invoice.models.js");
var Payment = require("../../models/payment.models.js");

function startOf(period) {
  const d = new Date();
  if (period === "month") { d.setDate(1); d.setHours(0, 0, 0, 0); }
  else if (period === "year") { d.setMonth(0, 1); d.setHours(0, 0, 0, 0); }
  else { d.setDate(d.getDate() - 30); }
  return d;
}

exports.revenueByDoctor = async (req, res) => {
  try {
    const { clinicId, period = "month" } = req.query;
    const since = startOf(period);
    const where = { source: "Appointment" };
    if (clinicId) where.clinicId = clinicId;
    where.createdAt = { [Op.gte]: since };

    const rows = await Income.findAll({
      where,
      attributes: ["description", [Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
      group: ["description"],
      order: [[Sequelize.literal("total"), "DESC"]],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.revenueByProcedure = async (req, res) => {
  try {
    const { clinicId, period = "month" } = req.query;
    const since = startOf(period);
    const where = { category: "Procedure" };
    if (clinicId) where.clinicId = clinicId;
    where.createdAt = { [Op.gte]: since };

    const rows = await Income.findAll({
      where,
      attributes: ["description", [Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
      group: ["description"],
      order: [[Sequelize.literal("total"), "DESC"]],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.newVsReturning = async (req, res) => {
  try {
    const { clinicId, period = "month" } = req.query;
    const since = startOf(period);
    const where = {};
    if (clinicId) where.clinicId = clinicId;

    const totalPatients = await Patient.count({ where });

    const newWhere = { ...where, createdAt: { [Op.gte]: since } };
    const newPatients = await Patient.count({ where: newWhere });
    const returning = totalPatients - newPatients;

    res.json({ total: totalPatients, new: newPatients, returning: returning > 0 ? returning : 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.appointmentStats = async (req, res) => {
  try {
    const { clinicId, period = "month" } = req.query;
    const since = startOf(period);
    const where = { appointmentDate: { [Op.gte]: since } };
    if (clinicId) where.clinicId = clinicId;

    const total = await Appointement.count({ where });
    const completed = await Appointement.count({ where: { ...where, status: "Completed" } });
    const cancelled = await Appointement.count({ where: { ...where, status: "Cancelled" } });
    const noShow = await Appointement.count({ where: { ...where, status: "No-show" } });

    const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;
    const noShowRate = total > 0 ? ((noShow / total) * 100).toFixed(1) : 0;
    const utilizationRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    res.json({ total, completed, cancelled, noShow, cancellationRate, noShowRate, utilizationRate });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.financialSummary = async (req, res) => {
  try {
    const { clinicId, period = "month" } = req.query;
    const since = startOf(period);

    const incomeWhere = { createdAt: { [Op.gte]: since } };
    if (clinicId) incomeWhere.clinicId = clinicId;

    const production = await Income.sum("amount", { where: incomeWhere }) || 0;

    const paidWhere = { ...incomeWhere, paymentStatus: "Paid" };
    const collections = await Payment.sum("amount", { where: { createdAt: { [Op.gte]: since } } }) || 0;

    const invoiceWhere = { createdAt: { [Op.gte]: since } };
    if (clinicId) invoiceWhere.clinicId = clinicId;
    const outstandingWhere = { ...invoiceWhere, paymentStatus: { [Op.in]: ["Pending", "Overdue"] } };
    const outstanding = await Invoice.sum("totalAmount", { where: outstandingWhere }) || 0;

    res.json({ production, collections, outstanding });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.patientRetention = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = {};
    if (clinicId) where.clinicId = clinicId;

    const total = await Patient.count({ where });

    // Patients with appointments in both last 6 months and 6-12 months ago = retained
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const twelveMonthsAgo = new Date(); twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const recentIds = await Appointement.findAll({
      where: { ...where, appointmentDate: { [Op.gte]: sixMonthsAgo } },
      attributes: ["patientId"],
      group: ["patientId"],
      raw: true,
    });
    const olderIds = await Appointement.findAll({
      where: { ...where, appointmentDate: { [Op.between]: [twelveMonthsAgo, sixMonthsAgo] } },
      attributes: ["patientId"],
      group: ["patientId"],
      raw: true,
    });

    const recentSet = new Set(recentIds.map(r => r.patientId));
    const retained = olderIds.filter(r => recentSet.has(r.patientId)).length;
    const retentionRate = olderIds.length > 0 ? ((retained / olderIds.length) * 100).toFixed(1) : null;

    res.json({ total, retained, retentionRate });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.outstandingBalances = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = { paymentStatus: { [Op.in]: ["Pending", "Overdue"] } };
    if (clinicId) where.clinicId = clinicId;
    const invoices = await Invoice.findAll({ where, order: [["createdAt", "DESC"]] });
    const total = invoices.reduce((s, i) => s + parseFloat(i.totalAmount || 0), 0);
    res.json({ invoices, total });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.operationalDashboard = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const today = new Date().toISOString().slice(0, 10);
    const where = {};
    if (clinicId) where.clinicId = clinicId;

    const todayWhere = { ...where, appointmentDate: today };
    const [todayTotal, todayCompleted, todayCancelled, todayNoShow, todayPending] = await Promise.all([
      Appointement.count({ where: todayWhere }),
      Appointement.count({ where: { ...todayWhere, status: "Completed" } }),
      Appointement.count({ where: { ...todayWhere, status: "Cancelled" } }),
      Appointement.count({ where: { ...todayWhere, status: "No-show" } }),
      Appointement.count({ where: { ...todayWhere, status: "Pending" } }),
    ]);

    const todayIncome = await Income.sum("amount", {
      where: { ...where, createdAt: { [Op.gte]: new Date(today) } },
    }) || 0;

    const outstanding = await Invoice.sum("totalAmount", {
      where: { ...where, paymentStatus: { [Op.in]: ["Pending", "Overdue"] } },
    }) || 0;

    res.json({
      todayAppointments: todayTotal,
      todayCompleted,
      todayCancelled,
      todayNoShow,
      todayPending,
      todayProduction: todayIncome,
      outstanding,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

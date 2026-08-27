const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../../db/init.sequelize");
const SaasInvoice = require("../../models/saas.invoice.models");
const ClinicSubscription = require("../../models/clinic.subscription.models");
const AppUsage = require("../../models/app.usage.models");
const User = require("../../models/user.models");

// Monthly revenue: sum of paid SaaS invoices grouped by month
exports.monthlyRevenue = async (req, res) => {
  const rows = await SaasInvoice.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("paidAt")), "month"],
      [fn("SUM", col("finalAmount")), "revenue"],
    ],
    where: { status: "paid" },
    group: [fn("DATE_TRUNC", "month", col("paidAt"))],
    order: [[fn("DATE_TRUNC", "month", col("paidAt")), "ASC"]],
    raw: true,
  });
  res.json(rows);
};

// Active clinics: subscriptions with status = active or trial
exports.activeClinics = async (req, res) => {
  const count = await ClinicSubscription.count({
    where: { status: { [Op.in]: ["active", "trial"] } },
  });
  res.json({ activeClinics: count });
};

// Active users: distinct users who acted in the last 30 days
exports.activeUsers = async (req, res) => {
  const since = new Date(Date.now() - 30 * 86400000);
  const count = await AppUsage.count({
    where: { createdAt: { [Op.gte]: since }, userId: { [Op.ne]: null } },
    distinct: true,
    col: "userId",
  });
  res.json({ activeUsers: count });
};

// App usage: top modules by action count in the last 30 days
exports.appUsage = async (req, res) => {
  const since = new Date(Date.now() - 30 * 86400000);
  const rows = await AppUsage.findAll({
    attributes: ["module", [fn("COUNT", col("id")), "count"]],
    where: { createdAt: { [Op.gte]: since } },
    group: ["module"],
    order: [[fn("COUNT", col("id")), "DESC"]],
    raw: true,
  });
  res.json(rows);
};

// Failed payments: SaaS invoices that are overdue
exports.failedPayments = async (req, res) => {
  const rows = await SaasInvoice.findAll({
    where: { status: "overdue" },
    order: [["dueDate", "ASC"]],
  });
  res.json({ count: rows.length, invoices: rows });
};

// Growth: compare this month's new subscriptions vs last month
exports.growth = async (req, res) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonth, lastMonth] = await Promise.all([
    ClinicSubscription.count({ where: { createdAt: { [Op.gte]: startOfThisMonth } } }),
    ClinicSubscription.count({
      where: { createdAt: { [Op.gte]: startOfLastMonth, [Op.lt]: startOfThisMonth } },
    }),
  ]);

  const growthRate =
    lastMonth === 0 ? null : (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(2);

  res.json({
    thisMonth,
    lastMonth,
    growthRate: growthRate !== null ? `${growthRate}%` : "N/A (no previous data)",
  });
};

// Combined dashboard summary
exports.dashboard = async (req, res) => {
  const [revenue, clinics, users, failed, growth] = await Promise.all([
    SaasInvoice.sum("finalAmount", { where: { status: "paid" } }),
    ClinicSubscription.count({ where: { status: { [Op.in]: ["active", "trial"] } } }),
    User.count(),
    SaasInvoice.count({ where: { status: "overdue" } }),
    ClinicSubscription.count({ where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
  ]);
  res.json({
    totalRevenue: revenue || 0,
    activeClinics: clinics,
    totalUsers: users,
    failedPayments: failed,
    newClinicsThisMonth: growth,
  });
};

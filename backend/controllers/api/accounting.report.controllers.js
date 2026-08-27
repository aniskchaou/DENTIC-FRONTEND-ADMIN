const Payment = require("../../models/payment.models.js");
const Invoice = require("../../models/invoice.models.js");
const Expense = require("../../models/expense.models.js");
const { Op } = require("sequelize");

// GET /accounting/daily-collections?date=YYYY-MM-DD
exports.dailyCollections = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    const payments = await Payment.findAll({
      where: { createdAt: { [Op.between]: [start, end] } },
      order: [["createdAt", "ASC"]],
    });
    const total = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    // Group by payment method
    const byMethod = {};
    payments.forEach(p => {
      const m = p.paymentMethod || "Other";
      byMethod[m] = (byMethod[m] || 0) + (parseFloat(p.amount) || 0);
    });
    res.json({ date: start.toISOString().split("T")[0], totalCollected: total, byMethod, payments });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/monthly-report?year=YYYY&month=MM
exports.monthlyReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const [payments, invoices, expenses] = await Promise.all([
      Payment.findAll({ where: { createdAt: { [Op.between]: [start, end] } } }),
      Invoice.findAll({ where: { createdAt: { [Op.between]: [start, end] } } }),
      Expense.findAll({ where: { createdAt: { [Op.between]: [start, end] } } }).catch(() => []),
    ]);

    const totalCollected = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const totalProduction = invoices.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

    // Daily breakdown
    const dailyMap = {};
    payments.forEach(p => {
      const d = new Date(p.createdAt).toISOString().split("T")[0];
      dailyMap[d] = (dailyMap[d] || 0) + (parseFloat(p.amount) || 0);
    });
    const daily = Object.entries(dailyMap).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));

    // By payment method
    const byMethod = {};
    payments.forEach(p => {
      const m = p.paymentMethod || "Other";
      byMethod[m] = (byMethod[m] || 0) + (parseFloat(p.amount) || 0);
    });

    res.json({ year, month, totalCollected, totalProduction, netProfit: totalCollected - totalExpenses, totalExpenses, daily, byMethod });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/production-vs-collections?startDate=&endDate=
exports.productionVsCollections = async (req, res) => {
  try {
    const start = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(1));
    const end = req.query.endDate ? new Date(req.query.endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const [payments, invoices] = await Promise.all([
      Payment.findAll({ where: { createdAt: { [Op.between]: [start, end] } } }),
      Invoice.findAll({ where: { createdAt: { [Op.between]: [start, end] } } }),
    ]);

    const production = invoices.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
    const collections = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const adjustments = production - collections;
    const collectionRate = production > 0 ? ((collections / production) * 100).toFixed(1) : 0;

    res.json({ startDate: start, endDate: end, production, collections, adjustments, collectionRate: parseFloat(collectionRate) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/tax-report?year=YYYY
exports.taxReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const invoices = await Invoice.findAll({ where: { createdAt: { [Op.between]: [start, end] } } });

    const taxableRevenue = invoices.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
    const totalTaxCollected = invoices.reduce((s, i) => s + (parseFloat(i.taxAmount) || 0), 0);

    // Monthly breakdown
    const monthly = Array.from({ length: 12 }, (_, m) => {
      const monthInvoices = invoices.filter(i => new Date(i.createdAt).getMonth() === m);
      return {
        month: m + 1,
        revenue: monthInvoices.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0),
        tax: monthInvoices.reduce((s, i) => s + (parseFloat(i.taxAmount) || 0), 0),
      };
    });

    res.json({ year, taxableRevenue, totalTaxCollected, monthly, invoiceCount: invoices.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/payment-methods-breakdown?startDate=&endDate=
exports.paymentMethodsBreakdown = async (req, res) => {
  try {
    const start = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(1));
    const end = req.query.endDate ? new Date(req.query.endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const payments = await Payment.findAll({ where: { createdAt: { [Op.between]: [start, end] } } });
    const breakdown = {};
    payments.forEach(p => {
      const m = p.paymentMethod || "Other";
      if (!breakdown[m]) breakdown[m] = { method: m, count: 0, total: 0 };
      breakdown[m].count += 1;
      breakdown[m].total += parseFloat(p.amount) || 0;
    });

    res.json({ startDate: start, endDate: end, breakdown: Object.values(breakdown), grandTotal: payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/insurance-receivables
exports.insuranceReceivables = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { paymentStatus: ["Pending", "Partially Paid", "Overdue"] },
      order: [["createdAt", "DESC"]],
    });
    const insuranceBilled = invoices.filter(i => {
      if (!i.paymentMethod) return false;
      const m = (i.paymentMethod || "").toLowerCase();
      return m.includes("insurance");
    });
    const total = insuranceBilled.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
    res.json({ count: insuranceBilled.length, totalReceivable: total, items: insuranceBilled });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/export/transactions?startDate=&endDate=&format=csv
exports.exportTransactions = async (req, res) => {
  try {
    const start = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(1));
    const end = req.query.endDate ? new Date(req.query.endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const payments = await Payment.findAll({ where: { createdAt: { [Op.between]: [start, end] } }, order: [["createdAt", "ASC"]] });

    // Build CSV
    const rows = [["ID", "Date", "Patient ID", "Invoice ID", "Amount", "Currency", "Method", "Status", "Transaction ID"]];
    payments.forEach(p => {
      rows.push([
        p.id,
        new Date(p.createdAt).toISOString().split("T")[0],
        p.patientId || "",
        p.invoiceId || "",
        p.amount,
        p.currency || "USD",
        p.paymentMethod || "",
        p.status || "",
        p.transactionId || "",
      ]);
    });

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="transactions-${start.toISOString().split("T")[0]}-to-${end.toISOString().split("T")[0]}.csv"`);
    res.send(csv);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /accounting/reconciliation/unreconciled — payments with no reconciliation flag
exports.getUnreconciled = async (req, res) => {
  try {
    const payments = await Payment.findAll({ where: { isReconciled: false }, order: [["createdAt", "ASC"]] });
    res.json(payments);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /accounting/reconciliation/:id — mark a payment reconciled
exports.markReconciled = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    await payment.update({ isReconciled: true, reconciledAt: new Date(), reconciledBy: req.body.reconciledBy || null, reconciliationNote: req.body.note || null });
    res.json(payment);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// PUT /accounting/reconciliation/bulk — mark multiple reconciled
exports.bulkReconcile = async (req, res) => {
  try {
    const { ids, reconciledBy, note } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ error: "ids array required" });
    await Payment.update(
      { isReconciled: true, reconciledAt: new Date(), reconciledBy: reconciledBy || null, reconciliationNote: note || null },
      { where: { id: ids } }
    );
    res.json({ updated: ids.length });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

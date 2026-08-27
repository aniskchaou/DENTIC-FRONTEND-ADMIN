const SaasInvoice = require("../../models/saas.invoice.models");
const Coupon = require("../../models/coupon.models");

exports.getAll = async (req, res) => {
  const { clinicId } = req.query;
  const where = clinicId ? { clinicId } : {};
  const invoices = await SaasInvoice.findAll({ where, order: [["createdAt", "DESC"]] });
  res.json(invoices);
};

exports.getOne = async (req, res) => {
  const invoice = await SaasInvoice.findByPk(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found." });
  res.json(invoice);
};

exports.create = async (req, res) => {
  const { clinicId, subscriptionId, amount, couponCode, dueDate } = req.body;
  if (!clinicId || !subscriptionId || !amount || !dueDate)
    return res.status(400).json({ message: "clinicId, subscriptionId, amount, and dueDate are required." });

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
    if (coupon) {
      discount =
        coupon.discountType === "percentage"
          ? (amount * coupon.discountValue) / 100
          : coupon.discountValue;
      await coupon.increment("usedCount");
    }
  }

  const invoiceNumber = await SaasInvoice.generateNumber();
  const invoice = await SaasInvoice.create({
    invoiceNumber,
    clinicId,
    subscriptionId,
    amount,
    discount,
    finalAmount: Math.max(0, amount - discount),
    couponCode: couponCode || null,
    dueDate,
    status: "sent",
  });
  res.status(201).json(invoice);
};

exports.markPaid = async (req, res) => {
  const { id } = req.params;
  const { paymentReference } = req.body;
  const [updated] = await SaasInvoice.update(
    { status: "paid", paidAt: new Date(), paymentReference: paymentReference || null },
    { where: { id } }
  );
  if (!updated) return res.status(404).json({ message: "Invoice not found." });
  res.json({ message: "Invoice marked as paid." });
};

const Refund = require("../../models/refund.models");

exports.getAll = async (req, res) => {
  const refunds = await Refund.findAll({ order: [["createdAt", "DESC"]] });
  res.json(refunds);
};

exports.getOne = async (req, res) => {
  const refund = await Refund.findByPk(req.params.id);
  if (!refund) return res.status(404).json({ message: "Refund not found." });
  res.json(refund);
};

exports.create = async (req, res) => {
  const refund = await Refund.create(req.body);
  res.status(201).json(refund);
};

// Approve, reject, or mark as processed
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, processedBy } = req.body;
  const allowed = ["approved", "rejected", "processed"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}.` });

  const updates = { status };
  if (status === "processed") {
    updates.processedAt = new Date();
    updates.processedBy = processedBy || null;
  }
  const [updated] = await Refund.update(updates, { where: { id } });
  if (!updated) return res.status(404).json({ message: "Refund not found." });
  res.json({ message: `Refund marked as ${status}.` });
};

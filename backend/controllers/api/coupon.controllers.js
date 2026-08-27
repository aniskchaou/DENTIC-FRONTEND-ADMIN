const Coupon = require("../../models/coupon.models");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  const coupons = await Coupon.findAll();
  res.json(coupons);
};

exports.getOne = async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Coupon not found." });
  res.json(coupon);
};

exports.create = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

exports.update = async (req, res) => {
  await Coupon.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Coupon updated." });
};

exports.remove = async (req, res) => {
  await Coupon.update({ isActive: false }, { where: { id: req.params.id } });
  res.json({ message: "Coupon deactivated." });
};

// Validate a coupon code and return its discount info
exports.validate = async (req, res) => {
  const { code } = req.params;
  const coupon = await Coupon.findOne({
    where: {
      code,
      isActive: true,
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
      [Op.or]: [{ maxUses: null }, { maxUses: { [Op.gt]: Coupon.sequelize.col("usedCount") } }],
    },
  });
  if (!coupon) return res.status(404).json({ message: "Coupon invalid or expired." });
  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
};

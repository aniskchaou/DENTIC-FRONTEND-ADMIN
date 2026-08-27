const User = require("../../models/user.models");
const PasswordReset = require("../../models/password.reset.models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Return success regardless to avoid user enumeration
    return res.json({ message: "If that email exists, a reset link has been sent." });
  }

  const record = await PasswordReset.generateToken(user.id);
  // In production: send record.token via email to user.email
  res.json({
    message: "Password reset token generated.",
    // expose token only in dev; remove in production
    token: process.env.NODE_ENV === "production" ? undefined : record.token,
  });
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token and newPassword are required." });

  const record = await PasswordReset.findOne({
    where: { token, used: false, expiresAt: { [Op.gt]: new Date() } },
  });
  if (!record) return res.status(400).json({ message: "Invalid or expired token." });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { id: record.userId } });
  await record.update({ used: true });

  res.json({ message: "Password has been reset successfully." });
};

// PUT /auth/change-password
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword)
    return res.status(400).json({ message: "userId, currentPassword, and newPassword are required." });

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ message: "User not found." });

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(401).json({ message: "Current password is incorrect." });

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed });
  res.json({ message: "Password changed successfully." });
};

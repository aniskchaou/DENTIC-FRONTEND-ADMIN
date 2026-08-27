var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");
var crypto = require("crypto");

var EmployeeInvite = sequelize.define("employee_invite", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  acceptedAt: { type: DataTypes.DATE, allowNull: true },
  invitedBy: { type: DataTypes.UUID, allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "expired", "revoked"),
    defaultValue: "pending",
  },
});

EmployeeInvite.generateInvite = async function (clinicId, email, role, invitedBy) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h
  return EmployeeInvite.create({ clinicId, email, role, token, expiresAt, invitedBy, status: "pending" });
};

module.exports = EmployeeInvite;

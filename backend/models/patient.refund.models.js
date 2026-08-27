var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var PatientRefund = sequelize.define("patient_refund", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  patientId: { type: DataTypes.UUID, allowNull: false },
  invoiceId: { type: DataTypes.UUID, allowNull: true },
  paymentId: { type: DataTypes.UUID, allowNull: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  refundMethod: {
    type: DataTypes.ENUM("cash", "card", "bank_transfer", "credit"),
    defaultValue: "cash",
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "processed"),
    defaultValue: "pending",
  },
  processedAt: { type: DataTypes.DATE, allowNull: true },
  processedBy: { type: DataTypes.UUID, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = PatientRefund;

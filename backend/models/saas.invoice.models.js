var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

// Invoice issued by the SaaS platform to a clinic
var SaasInvoice = sequelize.define("saas_invoice", {
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "FK to clinic_subscription",
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("draft", "sent", "paid", "overdue", "cancelled"),
    defaultValue: "draft",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Gateway transaction reference",
  },
});

SaasInvoice.generateNumber = async function () {
  const count = await SaasInvoice.count();
  return `SINV-${String(count + 1).padStart(6, "0")}`;
};

module.exports = SaasInvoice;

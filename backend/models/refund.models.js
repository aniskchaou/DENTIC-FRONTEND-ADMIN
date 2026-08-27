var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var Refund = sequelize.define("refund", {
  saasInvoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "FK to saas_invoice",
  },
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "processed"),
    defaultValue: "pending",
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  processedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: "Super admin user ID who processed the refund",
  },
});

module.exports = Refund;

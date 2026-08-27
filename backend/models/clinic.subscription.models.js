var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

// Links a clinic to a subscription plan
var ClinicSubscription = sequelize.define("clinic_subscription", {
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "FK to subscription_plan",
  },
  status: {
    type: DataTypes.ENUM("trial", "active", "suspended", "cancelled", "expired"),
    defaultValue: "trial",
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = ClinicSubscription;

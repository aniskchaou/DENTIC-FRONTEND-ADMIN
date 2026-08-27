var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

const CaseAcceptance = sequelize.define("case_acceptance", {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  treatmentPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  coordinatorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "presented", "accepted", "rejected", "deferred", "partial"),
    defaultValue: "pending",
  },
  presentedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  objections: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    // Array of { text, respondedWith, resolvedAt }
  },
  objectionSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  financingOption: {
    type: DataTypes.ENUM("none", "in_house", "third_party", "insurance", "payment_plan"),
    defaultValue: "none",
  },
  financingTerm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  monthlyPayment: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  deferralReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  followUpNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  callSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coordinatorNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  acceptedProcedures: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    // Subset of procedures from treatment plan
  },
  estimatedValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  acceptedValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  priority: {
    type: DataTypes.ENUM("low", "normal", "high"),
    defaultValue: "normal",
  },
});

module.exports = CaseAcceptance;

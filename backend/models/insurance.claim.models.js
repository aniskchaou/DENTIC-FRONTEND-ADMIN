var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

const InsuranceClaim = sequelize.define("insurance_claim", {
  claimNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  insuranceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  providerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  policyNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  diagnosisCodes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  procedureCodes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  claimAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  coveredAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  patientCopay: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  clinicalNarrative: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  narrativeAiGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("draft", "submitted", "acknowledged", "under_review", "approved", "partially_approved", "rejected", "resubmitted", "paid", "closed"),
    defaultValue: "draft",
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reimbursementAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  resubmitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  resubmitNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supportingDocuments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submittedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = InsuranceClaim;

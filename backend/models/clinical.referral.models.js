var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

var ClinicalReferral = sequelize.define("clinical_referral", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  referringDoctorId: { type: DataTypes.INTEGER, allowNull: false },
  clinicId: { type: DataTypes.INTEGER, allowNull: true },
  // Recipient
  toSpecialty: { type: DataTypes.STRING, allowNull: false, comment: "e.g. Orthodontist, Periodontist" },
  toDoctor: { type: DataTypes.STRING, allowNull: true },
  toClinic: { type: DataTypes.STRING, allowNull: true },
  // Content
  reason: { type: DataTypes.TEXT, allowNull: false },
  urgency: { type: DataTypes.ENUM("routine", "urgent", "emergency"), defaultValue: "routine" },
  clinicalSummary: { type: DataTypes.TEXT, allowNull: true },
  requestedProcedure: { type: DataTypes.STRING, allowNull: true },
  // AI-generated letter
  referralLetterText: { type: DataTypes.TEXT, allowNull: true },
  letterAiGenerated: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Status tracking
  status: {
    type: DataTypes.ENUM("draft", "sent", "acknowledged", "completed", "cancelled"),
    defaultValue: "draft",
  },
  sentAt: { type: DataTypes.DATE, allowNull: true },
  appointmentDate: { type: DataTypes.DATEONLY, allowNull: true },
  feedback: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = ClinicalReferral;

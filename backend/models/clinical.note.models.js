var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

var ClinicalNote = sequelize.define("clinical_note", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  appointmentId: { type: DataTypes.INTEGER, allowNull: true },
  clinicId: { type: DataTypes.INTEGER, allowNull: true },
  noteType: {
    type: DataTypes.ENUM("soap", "progress", "consultation", "follow_up", "discharge", "referral", "procedure", "general"),
    defaultValue: "progress",
  },
  // SOAP structure
  subjective: { type: DataTypes.TEXT, allowNull: true },
  objective: { type: DataTypes.TEXT, allowNull: true },
  assessment: { type: DataTypes.TEXT, allowNull: true },
  plan: { type: DataTypes.TEXT, allowNull: true },
  // Generic content for non-SOAP types
  content: { type: DataTypes.TEXT, allowNull: true },
  chiefComplaint: { type: DataTypes.TEXT, allowNull: true },
  vitalSigns: { type: DataTypes.JSON, allowNull: true, comment: "BP, pulse, temp, etc." },
  // Signing
  isSigned: { type: DataTypes.BOOLEAN, defaultValue: false },
  signedAt: { type: DataTypes.DATE, allowNull: true },
  signatureData: { type: DataTypes.TEXT, allowNull: true, comment: "Base64 signature image" },
  // AI generation flag
  aiGenerated: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDraft: { type: DataTypes.BOOLEAN, defaultValue: true },
  isAmended: { type: DataTypes.BOOLEAN, defaultValue: false },
  amendmentNote: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = ClinicalNote;

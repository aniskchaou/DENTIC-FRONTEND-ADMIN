var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

var PatientForm = sequelize.define("patient_form", {
  clinicId: { type: DataTypes.INTEGER, allowNull: true },
  patientId: { type: DataTypes.INTEGER, allowNull: true },
  sentBy: { type: DataTypes.INTEGER, allowNull: true },
  formType: {
    type: DataTypes.ENUM("intake", "medical_history", "dental_history", "consent", "hipaa", "satisfaction", "custom"),
    defaultValue: "intake",
  },
  title: { type: DataTypes.STRING, allowNull: false },
  // JSON schema of form fields (label, type, required, options)
  fields: { type: DataTypes.JSON, allowNull: true },
  // Patient responses
  responses: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM("draft", "sent", "viewed", "completed", "expired"),
    defaultValue: "draft",
  },
  sentVia: { type: DataTypes.ENUM("email", "sms", "link"), allowNull: true },
  // Unique public token for patient to fill in the form
  accessToken: { type: DataTypes.STRING, allowNull: true, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
  sentAt: { type: DataTypes.DATE, allowNull: true },
  viewedAt: { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = PatientForm;

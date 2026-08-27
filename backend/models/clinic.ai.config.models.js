var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var ClinicAIConfig = sequelize.define("clinic_ai_config", {
  clinicId: { type: DataTypes.UUID, allowNull: false, unique: true },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  // Feature toggles
  enableNoShowPrediction: { type: DataTypes.BOOLEAN, defaultValue: true },
  enableSlotSuggestions: { type: DataTypes.BOOLEAN, defaultValue: true },
  enablePricingInsights: { type: DataTypes.BOOLEAN, defaultValue: true },
  enableRecallSuggestions: { type: DataTypes.BOOLEAN, defaultValue: true },
  enableDentalImaging: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Permissions
  allowDoctorAccess: { type: DataTypes.BOOLEAN, defaultValue: true },
  allowStaffAccess: { type: DataTypes.BOOLEAN, defaultValue: false },
  requireAdminApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Budget/limits
  monthlyTokenBudget: { type: DataTypes.INTEGER, allowNull: true, comment: "Max tokens per month" },
  monthlyTokensUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
  alertAtPercent: { type: DataTypes.INTEGER, defaultValue: 80, comment: "Alert when usage hits X%" },
  resetDay: { type: DataTypes.INTEGER, defaultValue: 1, comment: "Day of month to reset token count" },
});

module.exports = ClinicAIConfig;

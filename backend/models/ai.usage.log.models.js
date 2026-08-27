var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var AIUsageLog = sequelize.define("ai_usage_log", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: true },
  feature: { type: DataTypes.STRING, allowNull: false, comment: "e.g. no_show_prediction" },
  promptTokens: { type: DataTypes.INTEGER, defaultValue: 0 },
  completionTokens: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalTokens: { type: DataTypes.INTEGER, defaultValue: 0 },
  model: { type: DataTypes.STRING, allowNull: true },
  success: { type: DataTypes.BOOLEAN, defaultValue: true },
  errorMessage: { type: DataTypes.TEXT, allowNull: true },
  meta: { type: DataTypes.JSON, allowNull: true },
});

module.exports = AIUsageLog;

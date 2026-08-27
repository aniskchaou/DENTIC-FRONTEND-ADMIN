var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

// One record per user session/action for platform-level usage tracking
var AppUsage = sequelize.define("app_usage", {
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. login, create_appointment, run_ai",
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. appointments, billing, ai, odontogram",
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

module.exports = AppUsage;

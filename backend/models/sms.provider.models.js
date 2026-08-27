var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var SmsProvider = sequelize.define("sms_provider", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. Twilio, Vonage, AWS SNS",
  },
  provider: {
    type: DataTypes.ENUM("twilio", "vonage", "aws_sns", "custom"),
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apiSecret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senderNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  extraConfig: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: "Provider-specific extra fields",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = SmsProvider;

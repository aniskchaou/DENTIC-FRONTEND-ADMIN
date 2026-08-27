var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");
const crypto = require("crypto");

var PasswordReset = sequelize.define("password_reset", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Returns a new token valid for 1 hour
PasswordReset.generateToken = function (userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  return PasswordReset.create({ userId, token, expiresAt });
};

module.exports = PasswordReset;

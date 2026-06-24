const { DataTypes } = require("sequelize");
const sequelize = require("../db/init.sequelize.js");

const Ondotogram = sequelize.define("ondotogram", {
  patient: { type: DataTypes.INTEGER, allowNull: false },
  doctor: { type: DataTypes.INTEGER, allowNull: false },
  clinic: { type: DataTypes.INTEGER, allowNull: false },
  appointment: { type: DataTypes.INTEGER, allowNull: false },
  membership: { type: DataTypes.STRING, allowNull: true },
  teeth: { type: DataTypes.JSON, allowNull: false }
});

module.exports = Ondotogram;

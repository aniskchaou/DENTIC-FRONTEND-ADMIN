var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var Holiday = sequelize.define("holiday", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  isRecurring: { type: DataTypes.BOOLEAN, defaultValue: false, comment: "Repeats every year" },
  closedAllDay: { type: DataTypes.BOOLEAN, defaultValue: true },
  openTime: { type: DataTypes.TIME, allowNull: true },
  closeTime: { type: DataTypes.TIME, allowNull: true },
  note: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Holiday;

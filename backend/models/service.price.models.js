var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var ServicePrice = sequelize.define("service_price", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: {
    type: DataTypes.ENUM("consultation", "procedure", "imaging", "lab", "other"),
    defaultValue: "procedure",
  },
  standardPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  minPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  maxPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  insuranceCovered: { type: DataTypes.BOOLEAN, defaultValue: false },
  insuranceRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0, comment: "Percentage covered by insurance" },
  durationMinutes: { type: DataTypes.INTEGER, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = ServicePrice;

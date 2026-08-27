var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

// One row per tooth per exam date
var PeriodontalChart = sequelize.define("periodontal_chart", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  examDate: { type: DataTypes.DATEONLY, allowNull: false },
  toothNumber: { type: DataTypes.INTEGER, allowNull: false, comment: "FDI notation, 11-48" },
  // Pocket depth in mm — 3 sites per tooth (mesial, mid, distal) × buccal/lingual
  pocketDepthMB: { type: DataTypes.INTEGER, allowNull: true },
  pocketDepthB: { type: DataTypes.INTEGER, allowNull: true },
  pocketDepthDB: { type: DataTypes.INTEGER, allowNull: true },
  pocketDepthML: { type: DataTypes.INTEGER, allowNull: true },
  pocketDepthL: { type: DataTypes.INTEGER, allowNull: true },
  pocketDepthDL: { type: DataTypes.INTEGER, allowNull: true },
  // Recession in mm
  recessionMB: { type: DataTypes.INTEGER, defaultValue: 0 },
  recessionB: { type: DataTypes.INTEGER, defaultValue: 0 },
  recessionDB: { type: DataTypes.INTEGER, defaultValue: 0 },
  recessionML: { type: DataTypes.INTEGER, defaultValue: 0 },
  recessionL: { type: DataTypes.INTEGER, defaultValue: 0 },
  recessionDL: { type: DataTypes.INTEGER, defaultValue: 0 },
  // Bleeding on probing (BOP) — booleans per site
  bleedingMB: { type: DataTypes.BOOLEAN, defaultValue: false },
  bleedingB: { type: DataTypes.BOOLEAN, defaultValue: false },
  bleedingDB: { type: DataTypes.BOOLEAN, defaultValue: false },
  bleedingML: { type: DataTypes.BOOLEAN, defaultValue: false },
  bleedingL: { type: DataTypes.BOOLEAN, defaultValue: false },
  bleedingDL: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Summary
  furcation: { type: DataTypes.ENUM("none", "class1", "class2", "class3"), defaultValue: "none" },
  mobility: { type: DataTypes.ENUM("none", "grade1", "grade2", "grade3"), defaultValue: "none" },
  plaque: { type: DataTypes.BOOLEAN, defaultValue: false },
  calculus: { type: DataTypes.BOOLEAN, defaultValue: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = PeriodontalChart;

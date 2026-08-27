var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var ClinicLocation = sequelize.define("clinic_location", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false, comment: "Branch name, e.g. Downtown" },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  isMain: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  logoUrl: { type: DataTypes.STRING, allowNull: true },
  colorScheme: { type: DataTypes.STRING, allowNull: true, comment: "Hex color for branding" },
});

module.exports = ClinicLocation;

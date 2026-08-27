var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var AppointmentType = sequelize.define("appointment_type", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
  color: { type: DataTypes.STRING, defaultValue: "#2196f3" },
  description: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  requiresConfirmation: { type: DataTypes.BOOLEAN, defaultValue: false },
});

AppointmentType.insertDefaults = async function (clinicId) {
  const defaults = ["Consultation", "Cleaning", "X-Ray", "Filling", "Extraction", "Crown", "Root Canal", "Whitening"];
  await AppointmentType.bulkCreate(
    defaults.map(name => ({ clinicId, name, durationMinutes: 30, isActive: true })),
    { ignoreDuplicates: true }
  );
};

module.exports = AppointmentType;

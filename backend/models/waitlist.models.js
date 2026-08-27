var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var Waitlist = sequelize.define("waitlist", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  patientId: { type: DataTypes.UUID, allowNull: false },
  doctorId: { type: DataTypes.UUID, allowNull: true },
  preferredDate: { type: DataTypes.DATEONLY, allowNull: true },
  preferredTime: { type: DataTypes.TIME, allowNull: true },
  appointmentType: { type: DataTypes.STRING, allowNull: true },
  reason: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM("waiting", "notified", "booked", "expired", "cancelled"),
    defaultValue: "waiting",
  },
  priority: { type: DataTypes.ENUM("low", "normal", "urgent"), defaultValue: "normal" },
  notes: { type: DataTypes.TEXT, allowNull: true },
  notifiedAt: { type: DataTypes.DATE, allowNull: true },
  bookedAppointmentId: { type: DataTypes.UUID, allowNull: true },
});

module.exports = Waitlist;

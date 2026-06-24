var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

var Appointement = sequelize.define("appointment", {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clinicLocationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentDate: {
    type: DataTypes.STRING, // Store as string (YYYY-MM-DD)
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING, // Store as string (HH:mm)
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING, // Store as string (HH:mm)
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // Store as string
    allowNull: false,
    defaultValue: "Scheduled",
  },
  appointmentType: {
    type: DataTypes.STRING, // Store as string
    allowNull: false,
  },
  reasonForVisit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING, // Store as string
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toISOString(),
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().toISOString(),
  },
});

/**
 * Insert a real Appointment record with all fields as strings.
 */
async function insertRealAppointment() {
  const realData = {
    patientId: 1,
    doctorId: 1,
    clinicLocationId: 1,
    appointmentDate: "2025-06-01",
    startTime: "09:00",
    endTime: "09:30",
    status: "Scheduled",
    appointmentType: "In-Person",
    reasonForVisit: "Routine dental checkup",
    notes: "Patient prefers morning appointments.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await Appointement.create(realData);
}

// Export the Sequelize model directly for compatibility with .findAll, .create, etc.
module.exports = Appointement;
module.exports.insertRealAppointment = insertRealAppointment;

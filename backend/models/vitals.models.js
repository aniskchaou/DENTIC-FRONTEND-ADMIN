const { DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const Vitals = sequelize.define('vitals', {
  patientId:          { type: DataTypes.INTEGER, allowNull: false },
  appointmentId:      { type: DataTypes.INTEGER, allowNull: true },
  recordedBy:         { type: DataTypes.INTEGER, allowNull: true },  // staff/assistant userId
  bloodPressureSys:   { type: DataTypes.INTEGER, allowNull: true },  // mmHg systolic
  bloodPressureDia:   { type: DataTypes.INTEGER, allowNull: true },  // mmHg diastolic
  pulse:              { type: DataTypes.INTEGER, allowNull: true },   // bpm
  temperature:        { type: DataTypes.FLOAT,   allowNull: true },   // Celsius
  weight:             { type: DataTypes.FLOAT,   allowNull: true },   // kg
  height:             { type: DataTypes.FLOAT,   allowNull: true },   // cm
  oxygenSaturation:   { type: DataTypes.FLOAT,   allowNull: true },   // %
  respiratoryRate:    { type: DataTypes.INTEGER, allowNull: true },   // breaths/min
  notes:              { type: DataTypes.TEXT,    allowNull: true },
  recordedAt:         { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
});

module.exports = Vitals;

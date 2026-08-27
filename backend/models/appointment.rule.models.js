var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var AppointmentRule = sequelize.define("appointment_rule", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  minNoticeHours: { type: DataTypes.INTEGER, defaultValue: 24, comment: "Min hours before booking" },
  maxAdvanceDays: { type: DataTypes.INTEGER, defaultValue: 90, comment: "Max days into future to book" },
  slotDurationMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
  bufferMinutes: { type: DataTypes.INTEGER, defaultValue: 10, comment: "Gap between appointments" },
  maxPerDay: { type: DataTypes.INTEGER, allowNull: true },
  allowDoubleBooking: { type: DataTypes.BOOLEAN, defaultValue: false },
  autoConfirm: { type: DataTypes.BOOLEAN, defaultValue: false },
  requireDeposit: { type: DataTypes.BOOLEAN, defaultValue: false },
  depositAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  // Cancellation rules
  cancellationWindowHours: { type: DataTypes.INTEGER, defaultValue: 24, comment: "Free cancellation window" },
  lateCancellationFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  noShowFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  maxCancellationsPerPatient: { type: DataTypes.INTEGER, allowNull: true },
  sendReminder24h: { type: DataTypes.BOOLEAN, defaultValue: true },
  sendReminder1h: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = AppointmentRule;

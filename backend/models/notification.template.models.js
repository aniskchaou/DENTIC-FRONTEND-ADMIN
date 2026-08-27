const { DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const NotificationTemplate = sequelize.define('notification_template', {
  name:      { type: DataTypes.STRING, allowNull: false },
  type:      { type: DataTypes.ENUM('sms','email','push'), defaultValue: 'email' },
  event:     { type: DataTypes.STRING, allowNull: false }, // appointment_reminder, payment_due, recall, welcome, etc.
  subject:   { type: DataTypes.STRING, allowNull: true },  // email subject
  body:      { type: DataTypes.TEXT,   allowNull: false },  // template with {{placeholders}}
  isActive:  { type: DataTypes.BOOLEAN, defaultValue: true },
  isGlobal:  { type: DataTypes.BOOLEAN, defaultValue: true }, // global = platform default
  clinicId:  { type: DataTypes.INTEGER, allowNull: true },    // null = global
  variables: { type: DataTypes.JSON,   defaultValue: [] },    // list of available {{vars}}
});

module.exports = NotificationTemplate;

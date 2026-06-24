const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  recipients: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Comma-separated list of email addresses'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sendAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Scheduled time to send reminder'
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Associated appointment ID'
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  timestamps: true
});

/**
 * Insert a dummy reminder record for testing/demo purposes.
 */
Reminder.insertDummyReminder = async function() {
  return await Reminder.create({
    recipients: 'kchaouanis20@gmail.com,user2@example.com',
    subject: 'Demo Appointment Reminder',
    body: 'This is a demo reminder email for your appointment tomorrow.',
    sendAt: new Date(Date.now() + 60 * 1000), // 1 minute from now
    appointmentId: 123,
    status: 'pending'
  });
};

module.exports = Reminder;

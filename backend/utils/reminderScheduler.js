const { sendMail } = require('./email.services');
const db = require('../db/models.sequelize'); // Adjust if you have a specific Appointment model
const Reminder = require('../models/reminder.models');
const { Op } = require('sequelize');

/**
 * Save a reminder job to the database
 * @param {Object} params
 * @param {string[]} params.recipients - Array of email addresses
 * @param {string} params.subject - Email subject
 * @param {string} params.body - Email body
 * @param {Date} params.sendAt - When to send the reminder
 * @param {number} params.appointmentId - Associated appointment ID
 */
async function saveReminderJob({ recipients, subject, body, sendAt, appointmentId }) {
  // Example: Save to a Reminders table (define this model in Sequelize)
  return Reminder.create({
    recipients: recipients.join(','),
    subject,
    body,
    sendAt,
    appointmentId,
    status: 'pending'
  });
}

/**
 * Execute pending reminder jobs at the scheduled time
 * Should be called by a scheduler (e.g., cron job)
 */
async function executePendingReminders() {
  const now = new Date();
  const pendingReminders = await Reminder.findAll({
    where: {
      status: 'pending',
      sendAt: { [Op.lte]: now }
    }
  });
  for (const reminder of pendingReminders) {
    try {
      await sendMail({
        to: reminder.recipients.split(','),
        subject: reminder.subject,
        text: reminder.body
      });
      reminder.status = 'sent';
      await reminder.save();
    } catch (err) {
      reminder.status = 'failed';
      await reminder.save();
    }
  }
}

module.exports = { saveReminderJob, executePendingReminders };

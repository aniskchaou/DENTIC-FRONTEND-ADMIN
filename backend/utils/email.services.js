
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load email config from clinic.json
const clinicConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../clinic.json'), 'utf8'));
const emailConfig = clinicConfig.email;

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass
  }
});

/**
 * Send an email using Gmail
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {string} [html] - Optional HTML body
 * @returns {Promise}
 */
function sendMail({ to, subject, text, html, from }) {
  const mailOptions = {
    from: from || emailConfig.from || emailConfig.auth.user,
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    text,
    html
  };
  return transporter.sendMail(mailOptions);
}

/**
 * Send an email with file attachment(s)
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {string} [html] - Optional HTML body
 * @param {Array|Object} attachments - Array of attachment objects or single attachment object
 * @returns {Promise}
 */
function sendMailWithAttachment({ to, subject, text, html, attachments, from }) {
  const mailOptions = {
    from: from || emailConfig.from || emailConfig.auth.user,
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    text,
    html,
    attachments: Array.isArray(attachments) ? attachments : [attachments]
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail, sendMailWithAttachment };

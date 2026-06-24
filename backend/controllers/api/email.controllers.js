const { sendMailWithAttachment } = require('../../utils/email.services');
const path = require('path');

/**
 * @swagger
 * /send-email-with-attachment:
 *   post:
 *     summary: Send email with file attachment(s)
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Comma-separated recipient emails
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *               html:
 *                 type: string
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Error sending email
 */
exports.sendEmailWithAttachment = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const file = req.file;
    if (!to || !subject || !file) {
      return res.status(400).send({ message: 'Missing required fields or file.' });
    }
    const recipients = to.split(',').map(e => e.trim());
    const attachments = [{
      filename: file.originalname,
      path: file.path
    }];
    await sendMailWithAttachment({
      to: recipients,
      subject,
      text,
      html,
      attachments
    });
    res.send({ message: 'Email sent successfully.' });
  } catch (err) {
    res.status(400).send({ message: 'Error sending email', error: err.toString() });
  }
};

// Communication controller — SMS, email and templated messages for receptionists
// All sends are mocked/logged; wire to real provider (Twilio, SendGrid, etc.) in production

exports.sendSMS = async (req, res) => {
  try {
    const { to, message, patientId } = req.body;
    if (!to || !message) return res.status(400).json({ error: "to and message are required" });
    // TODO: integrate Twilio or platform SMS provider
    console.log(`[SMS] To: ${to} | ${message}`);
    res.json({ sent: true, to, message, channel: "sms", sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, patientId } = req.body;
    if (!to || !subject || !body) return res.status(400).json({ error: "to, subject, body are required" });
    // TODO: integrate SendGrid or platform email provider
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    res.json({ sent: true, to, subject, channel: "email", sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendAppointmentReminder = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, appointmentDate, startTime, doctorName, channel = "sms" } = req.body;
    if (!patientName || !appointmentDate) return res.status(400).json({ error: "patientName and appointmentDate required" });
    const message = `Hi ${patientName}, this is a reminder for your dental appointment on ${appointmentDate} at ${startTime} with ${doctorName || "your dentist"}. Please arrive 10 minutes early.`;
    console.log(`[REMINDER/${channel.toUpperCase()}] ${message}`);
    res.json({ sent: true, channel, message, sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendConfirmation = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, appointmentDate, startTime, channel = "sms" } = req.body;
    if (!patientName) return res.status(400).json({ error: "patientName required" });
    const message = `Hi ${patientName}, your appointment on ${appointmentDate} at ${startTime} has been confirmed. See you soon!`;
    console.log(`[CONFIRM/${channel.toUpperCase()}] ${message}`);
    res.json({ sent: true, channel, message, sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendRecall = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, lastVisit, channel = "sms" } = req.body;
    if (!patientName) return res.status(400).json({ error: "patientName required" });
    const message = `Hi ${patientName}, it's been a while since your last dental visit${lastVisit ? ` on ${lastVisit}` : ""}. We recommend scheduling your next check-up soon. Call us or book online!`;
    console.log(`[RECALL/${channel.toUpperCase()}] ${message}`);
    res.json({ sent: true, channel, message, sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.sendPaymentReminder = async (req, res) => {
  try {
    const { patientName, patientEmail, patientPhone, amount, dueDate, invoiceId, channel = "email" } = req.body;
    if (!patientName || !amount) return res.status(400).json({ error: "patientName and amount required" });
    const message = `Hi ${patientName}, you have an outstanding balance of ${amount}${dueDate ? ` due on ${dueDate}` : ""}${invoiceId ? ` (Invoice #${invoiceId})` : ""}. Please contact us to arrange payment.`;
    console.log(`[PAYMENT_REMINDER/${channel.toUpperCase()}] ${message}`);
    res.json({ sent: true, channel, message, sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

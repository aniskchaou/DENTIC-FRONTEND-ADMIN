const NotificationTemplate = require('../../models/notification.template.models');

const DEFAULT_TEMPLATES = [
  { name: 'Appointment Reminder', type: 'sms', event: 'appointment_reminder', body: 'Hi {{patientName}}, your appointment is on {{date}} at {{time}} with {{doctorName}}. Reply CANCEL to cancel.', isGlobal: true, variables: ['patientName','date','time','doctorName'] },
  { name: 'Appointment Confirmation', type: 'email', event: 'appointment_confirmation', subject: 'Appointment Confirmed — {{clinicName}}', body: 'Dear {{patientName}},\n\nYour appointment has been confirmed for {{date}} at {{time}}.\n\nClinic: {{clinicName}}\nDoctor: {{doctorName}}\n\nSee you soon!', isGlobal: true, variables: ['patientName','date','time','clinicName','doctorName'] },
  { name: 'Payment Due', type: 'sms', event: 'payment_due', body: 'Hi {{patientName}}, you have an outstanding balance of {{amount}} at {{clinicName}}. Please contact us.', isGlobal: true, variables: ['patientName','amount','clinicName'] },
  { name: 'Recall Reminder', type: 'email', event: 'recall', subject: "It's time for your check-up — {{clinicName}}", body: "Dear {{patientName}},\n\nWe haven't seen you in a while! Please schedule your regular check-up.\n\nCall us or book online.\n\n{{clinicName}}", isGlobal: true, variables: ['patientName','clinicName'] },
  { name: 'Welcome', type: 'email', event: 'welcome', subject: 'Welcome to {{clinicName}}!', body: 'Dear {{patientName}},\n\nWelcome to {{clinicName}}! We are happy to have you as a patient.\n\nYour portal is ready at {{portalUrl}}\n\nBest regards,\n{{clinicName}}', isGlobal: true, variables: ['patientName','clinicName','portalUrl'] },
];

exports.seed = async () => {
  for (const t of DEFAULT_TEMPLATES) {
    const [, created] = await NotificationTemplate.findOrCreate({ where: { event: t.event, type: t.type, isGlobal: true }, defaults: t });
  }
};

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.type)     where.type     = req.query.type;
    if (req.query.event)    where.event    = req.query.event;
    if (req.query.clinicId) where.clinicId = req.query.clinicId;
    const rows = await NotificationTemplate.findAll({ where, order: [['isGlobal', 'DESC'], ['event', 'ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const t = await NotificationTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const t = await NotificationTemplate.create(req.body);
    res.status(201).json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const t = await NotificationTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await t.update(req.body);
    res.json(t);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const t = await NotificationTemplate.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    await t.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

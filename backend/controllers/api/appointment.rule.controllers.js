var AppointmentRule = require("../../models/appointment.rule.models.js");

exports.get = async (req, res) => {
  try {
    const { clinicId } = req.query;
    if (!clinicId) return res.status(400).json({ error: "clinicId required" });
    const [rule] = await AppointmentRule.findOrCreate({
      where: { clinicId },
      defaults: { clinicId },
    });
    res.json(rule);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.save = async (req, res) => {
  try {
    const { clinicId } = req.body;
    if (!clinicId) return res.status(400).json({ error: "clinicId required" });
    const [rule, created] = await AppointmentRule.findOrCreate({ where: { clinicId }, defaults: req.body });
    if (!created) await rule.update(req.body);
    res.json(rule);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

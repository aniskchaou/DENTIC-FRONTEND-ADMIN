var PeriodontalChart = require("../../models/periodontal.chart.models.js");

exports.getByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const rows = await PeriodontalChart.findAll({
      where: { patientId },
      order: [["examDate", "DESC"]],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getExam = async (req, res) => {
  try {
    const { patientId, examDate } = req.query;
    if (!patientId || !examDate) return res.status(400).json({ error: "patientId and examDate required" });
    const rows = await PeriodontalChart.findAll({ where: { patientId, examDate } });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// Save all tooth records for one exam in bulk (upsert)
exports.saveExam = async (req, res) => {
  try {
    const { patientId, doctorId, examDate, teeth } = req.body;
    if (!patientId || !doctorId || !examDate || !Array.isArray(teeth)) {
      return res.status(400).json({ error: "patientId, doctorId, examDate, teeth[] required" });
    }
    // Delete existing exam rows then re-insert
    await PeriodontalChart.destroy({ where: { patientId, examDate } });
    const rows = await PeriodontalChart.bulkCreate(
      teeth.map(t => ({ ...t, patientId, doctorId, examDate }))
    );
    res.status(201).json(rows);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getExamDates = async (req, res) => {
  try {
    const { patientId } = req.params;
    const rows = await PeriodontalChart.findAll({
      where: { patientId },
      attributes: ["examDate"],
      group: ["examDate"],
      order: [["examDate", "DESC"]],
    });
    res.json(rows.map(r => r.examDate));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

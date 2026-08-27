var ClinicAIConfig = require("../../models/clinic.ai.config.models.js");
var AIUsageLog = require("../../models/ai.usage.log.models.js");
var { Sequelize, Op } = require("sequelize");

exports.get = async (req, res) => {
  try {
    const { clinicId } = req.query;
    if (!clinicId) return res.status(400).json({ error: "clinicId required" });
    const [cfg] = await ClinicAIConfig.findOrCreate({ where: { clinicId }, defaults: { clinicId } });
    res.json(cfg);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.save = async (req, res) => {
  try {
    const { clinicId } = req.body;
    if (!clinicId) return res.status(400).json({ error: "clinicId required" });
    const [cfg, created] = await ClinicAIConfig.findOrCreate({ where: { clinicId }, defaults: req.body });
    if (!created) await cfg.update(req.body);
    res.json(cfg);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getUsage = async (req, res) => {
  try {
    const { clinicId } = req.query;
    if (!clinicId) return res.status(400).json({ error: "clinicId required" });
    const since = new Date();
    since.setDate(1); // start of month
    const logs = await AIUsageLog.findAll({
      where: { clinicId, createdAt: { [Op.gte]: since } },
      attributes: [
        "feature",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "calls"],
        [Sequelize.fn("SUM", Sequelize.col("totalTokens")), "tokens"],
      ],
      group: ["feature"],
    });
    const totals = await AIUsageLog.findOne({
      where: { clinicId, createdAt: { [Op.gte]: since } },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("totalTokens")), "totalTokens"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalCalls"],
      ],
    });
    res.json({ byFeature: logs, totals });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.logUsage = async (req, res) => {
  try {
    const log = await AIUsageLog.create(req.body);
    // Update monthly token count on config
    if (req.body.clinicId) {
      await ClinicAIConfig.increment("monthlyTokensUsed", {
        by: req.body.totalTokens || 0,
        where: { clinicId: req.body.clinicId },
      });
    }
    res.status(201).json(log);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

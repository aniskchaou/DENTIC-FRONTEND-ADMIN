const SmsProvider = require("../../models/sms.provider.models");
const PaymentGateway = require("../../models/payment.gateway.models");
const StorageConfig = require("../../models/storage.config.models");

// ── SMS Providers ──────────────────────────────────────────────────────────

exports.getAllSmsProviders = async (req, res) => {
  res.json(await SmsProvider.findAll());
};

exports.createSmsProvider = async (req, res) => {
  const provider = await SmsProvider.create(req.body);
  res.status(201).json(provider);
};

exports.updateSmsProvider = async (req, res) => {
  await SmsProvider.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "SMS provider updated." });
};

exports.activateSmsProvider = async (req, res) => {
  await SmsProvider.update({ isActive: false }, { where: {} });
  await SmsProvider.update({ isActive: true }, { where: { id: req.params.id } });
  res.json({ message: "SMS provider activated." });
};

exports.deleteSmsProvider = async (req, res) => {
  await SmsProvider.destroy({ where: { id: req.params.id } });
  res.json({ message: "SMS provider deleted." });
};

// ── Payment Gateways ───────────────────────────────────────────────────────

exports.getAllGateways = async (req, res) => {
  res.json(await PaymentGateway.findAll());
};

exports.createGateway = async (req, res) => {
  const gateway = await PaymentGateway.create(req.body);
  res.status(201).json(gateway);
};

exports.updateGateway = async (req, res) => {
  await PaymentGateway.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Payment gateway updated." });
};

exports.activateGateway = async (req, res) => {
  await PaymentGateway.update({ isActive: false }, { where: {} });
  await PaymentGateway.update({ isActive: true }, { where: { id: req.params.id } });
  res.json({ message: "Payment gateway activated." });
};

exports.deleteGateway = async (req, res) => {
  await PaymentGateway.destroy({ where: { id: req.params.id } });
  res.json({ message: "Payment gateway deleted." });
};

// ── Storage Config ─────────────────────────────────────────────────────────

exports.getStorageConfig = async (req, res) => {
  const config = await StorageConfig.findOne({ where: { isActive: true } });
  res.json(config || {});
};

exports.saveStorageConfig = async (req, res) => {
  await StorageConfig.update({ isActive: false }, { where: {} });
  const config = await StorageConfig.create({ ...req.body, isActive: true });
  res.status(201).json(config);
};

exports.updateStorageConfig = async (req, res) => {
  await StorageConfig.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Storage config updated." });
};

// ── AI Integrations ────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");
const clinicPath = path.join(__dirname, "../../clinic.json");

exports.getAiConfig = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(clinicPath, "utf8"));
    // Never expose the raw key; return a masked version
    const key = data?.ia?.OPEN_API_KEY || "";
    res.json({ configured: key.length > 0, keyPreview: key ? `${key.slice(0, 6)}...` : "" });
  } catch {
    res.json({ configured: false });
  }
};

exports.saveAiConfig = (req, res) => {
  const { openApiKey } = req.body;
  if (!openApiKey) return res.status(400).json({ message: "openApiKey is required." });
  try {
    let data = {};
    if (fs.existsSync(clinicPath)) data = JSON.parse(fs.readFileSync(clinicPath, "utf8"));
    data.ia = { ...(data.ia || {}), OPEN_API_KEY: openApiKey };
    fs.writeFileSync(clinicPath, JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "AI configuration saved." });
  } catch {
    res.status(500).json({ message: "Failed to save AI config." });
  }
};

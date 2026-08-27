const SubscriptionPlan = require("../../models/subscription.plan.models");
const ClinicSubscription = require("../../models/clinic.subscription.models");

// ── Plans ──────────────────────────────────────────────────────────────────

exports.getAllPlans = async (req, res) => {
  const plans = await SubscriptionPlan.findAll({ where: { isActive: true } });
  res.json(plans);
};

exports.createPlan = async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json(plan);
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  await SubscriptionPlan.update(req.body, { where: { id } });
  res.json({ message: "Plan updated." });
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  await SubscriptionPlan.update({ isActive: false }, { where: { id } });
  res.json({ message: "Plan deactivated." });
};

// ── Clinic subscriptions ──────────────────────────────────────────────────

exports.getClinicSubscription = async (req, res) => {
  const { clinicId } = req.params;
  const sub = await ClinicSubscription.findOne({ where: { clinicId } });
  if (!sub) return res.status(404).json({ message: "No subscription found." });
  res.json(sub);
};

exports.createClinicSubscription = async (req, res) => {
  const { clinicId, planId, trialDays } = req.body;
  const trialEndsAt = trialDays ? new Date(Date.now() + trialDays * 86400000) : null;
  const now = new Date();
  const sub = await ClinicSubscription.create({
    clinicId,
    planId,
    status: trialDays ? "trial" : "active",
    trialEndsAt,
    currentPeriodStart: now,
    currentPeriodEnd: new Date(now.getTime() + 30 * 86400000),
  });
  res.status(201).json(sub);
};

// Upgrade or downgrade a clinic to a different plan
exports.changePlan = async (req, res) => {
  const { clinicId } = req.params;
  const { planId } = req.body;
  if (!planId) return res.status(400).json({ message: "planId is required." });

  const plan = await SubscriptionPlan.findByPk(planId);
  if (!plan) return res.status(404).json({ message: "Plan not found." });

  const [updated] = await ClinicSubscription.update(
    { planId, status: "active" },
    { where: { clinicId } }
  );
  if (!updated) return res.status(404).json({ message: "Clinic subscription not found." });
  res.json({ message: `Subscription updated to ${plan.name}.` });
};

// Extend or start a trial
exports.manageTrial = async (req, res) => {
  const { clinicId } = req.params;
  const { trialDays } = req.body;
  if (!trialDays) return res.status(400).json({ message: "trialDays is required." });

  const trialEndsAt = new Date(Date.now() + trialDays * 86400000);
  const [updated] = await ClinicSubscription.update(
    { status: "trial", trialEndsAt },
    { where: { clinicId } }
  );
  if (!updated) return res.status(404).json({ message: "Clinic subscription not found." });
  res.json({ message: `Trial extended to ${trialEndsAt.toISOString()}.` });
};

exports.cancelSubscription = async (req, res) => {
  const { clinicId } = req.params;
  const [updated] = await ClinicSubscription.update(
    { status: "cancelled", cancelledAt: new Date() },
    { where: { clinicId } }
  );
  if (!updated) return res.status(404).json({ message: "Clinic subscription not found." });
  res.json({ message: "Subscription cancelled." });
};

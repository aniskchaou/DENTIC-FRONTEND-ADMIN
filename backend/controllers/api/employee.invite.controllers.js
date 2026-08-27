var EmployeeInvite = require("../../models/employee.invite.models.js");

exports.getAll = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where = clinicId ? { clinicId } : {};
    res.json(await EmployeeInvite.findAll({ where, order: [["createdAt", "DESC"]] }));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.invite = async (req, res) => {
  try {
    const { clinicId, email, role, invitedBy } = req.body;
    if (!clinicId || !email || !role) return res.status(400).json({ error: "clinicId, email, role required" });
    const existing = await EmployeeInvite.findOne({ where: { clinicId, email, status: "pending" } });
    if (existing) return res.status(409).json({ error: "An active invite already exists for this email" });
    const invite = await EmployeeInvite.generateInvite(clinicId, email, role, invitedBy);
    res.status(201).json({ invite, inviteLink: `/accept-invite?token=${invite.token}` });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.accept = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await EmployeeInvite.findOne({ where: { token, status: "pending" } });
    if (!invite) return res.status(404).json({ error: "Invalid or expired invite" });
    if (invite.expiresAt < new Date()) {
      await invite.update({ status: "expired" });
      return res.status(410).json({ error: "Invite has expired" });
    }
    await invite.update({ status: "accepted", acceptedAt: new Date() });
    res.json({ invite, email: invite.email, role: invite.role, clinicId: invite.clinicId });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.revoke = async (req, res) => {
  try {
    const invite = await EmployeeInvite.findByPk(req.params.id);
    if (!invite) return res.status(404).json({ error: "Not found" });
    await invite.update({ status: "revoked" });
    res.json(invite);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

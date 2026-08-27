var Appointement = require("../../models/appointement.models.js");

const setStatus = (status, extra = {}) => async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    await appt.update({ status, ...extra });
    res.json(appt);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.confirm = setStatus("Confirmed", { confirmedAt: new Date() });

exports.checkIn = async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    if (appt.checkedInAt) return res.status(409).json({ error: "Already checked in" });
    await appt.update({ status: "Checked-In", checkedInAt: new Date() });
    res.json(appt);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.checkOut = async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    await appt.update({ status: "Checked-Out", checkedOutAt: new Date() });
    res.json(appt);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.cancel = async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    await appt.update({ status: "Cancelled", cancelledAt: new Date(), cancellationReason: req.body.reason || "" });
    res.json(appt);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.assignDoctor = async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    if (!req.body.doctorId) return res.status(400).json({ error: "doctorId required" });
    await appt.update({ doctorId: req.body.doctorId });
    res.json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.assignRoom = async (req, res) => {
  try {
    const appt = await Appointement.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    if (!req.body.roomId && !req.body.roomNumber) return res.status(400).json({ error: "roomId or roomNumber required" });
    await appt.update({
      assignedRoomId: req.body.roomId || null,
      roomNumber: req.body.roomNumber || appt.roomNumber,
    });
    res.json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// Get today's appointments for check-in board
exports.todayBoard = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appts = await Appointement.findAll({
      where: { appointmentDate: today },
      order: [["startTime", "ASC"]],
    });
    res.json(appts);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

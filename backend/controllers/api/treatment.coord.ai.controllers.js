const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config.js");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function complete(system, user, maxTokens = 700) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
  });
  return res.choices[0].message.content;
}

// POST /ai/treatment-coord/summarize-objections
// Body: { objections: [{ text }], treatmentPlan }
exports.summarizeObjections = async (req, res) => {
  try {
    const { objections, treatmentPlan } = req.body;
    const objText = (objections || []).map((o, i) => `${i + 1}. ${o.text || o}`).join("\n");
    const system = "You are a dental treatment coordinator AI. Summarize patient objections to a treatment plan and suggest empathetic, effective responses the coordinator can use.";
    const user = `Treatment Plan: ${treatmentPlan || "N/A"}\nObjections:\n${objText}`;
    const summary = await complete(system, user);
    res.json({ summary });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/suggest-follow-up-timing
// Body: { caseHistory, lastContactDate, objections, status }
exports.suggestFollowUpTiming = async (req, res) => {
  try {
    const { caseHistory, lastContactDate, objections, status } = req.body;
    const system = "You are a dental treatment coordinator AI. Based on the case information, recommend the optimal follow-up timing, communication channel, and messaging approach.";
    const user = `Status: ${status || "pending"}\nLast Contact: ${lastContactDate || "N/A"}\nObjections: ${objections || "None"}\nHistory: ${caseHistory || "N/A"}`;
    const suggestion = await complete(system, user);
    res.json({ suggestion });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/financing-explanation
// Body: { treatmentCost, financingOption, term, monthlyPayment, patientName }
exports.generateFinancingExplanation = async (req, res) => {
  try {
    const { treatmentCost, financingOption, term, monthlyPayment, patientName } = req.body;
    const system = "You are a dental treatment coordinator AI. Write a clear, friendly financing explanation for a patient. Make it easy to understand, show value, and reduce payment anxiety. Keep it under 150 words.";
    const user = `Patient: ${patientName || "the patient"}\nTreatment cost: $${treatmentCost || "N/A"}\nFinancing option: ${financingOption || "N/A"}\nTerm: ${term || "N/A"}\nMonthly payment: $${monthlyPayment || "N/A"}`;
    const explanation = await complete(system, user, 400);
    res.json({ explanation });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/call-summary
// Body: { transcript or notes, patientName, date }
exports.createCallSummary = async (req, res) => {
  try {
    const { notes, transcript, patientName, date } = req.body;
    const system = "You are a treatment coordinator AI. Summarize this phone call with a patient. Extract: key concerns raised, coordinator responses, agreed next steps, and follow-up date if any.";
    const user = `Patient: ${patientName || "N/A"}, Date: ${date || "today"}\nNotes/Transcript:\n${notes || transcript || ""}`;
    const summary = await complete(system, user);
    res.json({ summary });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/prioritize-follow-ups
// Body: { cases: [{ id, patientName, status, followUpDate, estimatedValue, objections }] }
exports.prioritizeFollowUps = async (req, res) => {
  try {
    const { cases } = req.body;
    if (!cases || !cases.length) return res.status(400).json({ error: "cases array required" });
    const casesSummary = cases.map((c, i) =>
      `${i + 1}. Patient: ${c.patientName || c.patientId}, Status: ${c.status}, Last contact: ${c.followUpDate || "N/A"}, Est. Value: $${c.estimatedValue || 0}, Objections: ${(c.objections || []).length}`
    ).join("\n");
    const system = "You are a treatment coordinator AI. Prioritize this list of follow-up cases from highest to lowest priority. Consider: estimated case value, days since last contact, case status, and number of objections. Explain the top 3 priorities.";
    const result = await complete(system, casesSummary);
    res.json({ prioritization: result });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/patient-friendly-explanation
exports.patientFriendlyExplanation = async (req, res) => {
  try {
    const { treatmentPlan, patientAge, concerns } = req.body;
    const system = "You are a dental treatment coordinator. Explain the proposed treatment plan in simple, reassuring language that a patient can easily understand. Avoid jargon. Address common concerns.";
    const user = `Treatment Plan: ${treatmentPlan}\nPatient age: ${patientAge || "adult"}\nConcerns: ${concerns || "none stated"}`;
    const explanation = await complete(system, user, 600);
    res.json({ explanation });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/treatment-coord/follow-up-message
exports.generateFollowUpMessage = async (req, res) => {
  try {
    const { patientName, treatmentPlan, lastContactDate, preferredChannel = "email" } = req.body;
    const system = `You are a dental treatment coordinator. Write a warm, professional ${preferredChannel} follow-up message to re-engage a patient about their pending treatment plan. Keep it concise and empathetic.`;
    const user = `Patient: ${patientName || "Patient"}\nTreatment plan: ${treatmentPlan || "pending dental treatment"}\nLast contact: ${lastContactDate || "some time ago"}`;
    const message = await complete(system, user, 400);
    res.json({ message });
  } catch (e) { res.status(500).json({ error: e.message }); }
};


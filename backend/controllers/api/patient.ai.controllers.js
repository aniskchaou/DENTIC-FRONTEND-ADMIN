const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config.js");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function complete(system, user, maxTokens = 600) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.5,
    max_tokens: maxTokens,
  });
  return res.choices[0].message.content;
}

// POST /ai/patient/faq
// Body: { question, clinicContext? }
exports.answerFAQ = async (req, res) => {
  try {
    const { question, clinicContext } = req.body;
    const system = `You are a friendly dental clinic assistant AI. Answer patient questions accurately, empathetically, and in simple language. Always recommend consulting the dentist for medical questions. ${clinicContext ? `Clinic context: ${clinicContext}` : ""}`;
    const answer = await complete(system, question || "");
    res.json({ answer });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient/prepare-for-appointment
// Body: { appointmentType, date, specialInstructions? }
exports.prepareForAppointment = async (req, res) => {
  try {
    const { appointmentType, date, specialInstructions } = req.body;
    const system = "You are a dental patient assistant AI. Help the patient prepare for their upcoming dental appointment. Include what to expect, pre-appointment instructions, what to bring, and how to manage any anxiety.";
    const user = `Appointment type: ${appointmentType || "dental checkup"}\nDate: ${date || "upcoming"}\nSpecial instructions: ${specialInstructions || "none"}`;
    const guide = await complete(system, user);
    res.json({ guide });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient/explain-document
// Body: { documentText, documentType? }
exports.explainDocument = async (req, res) => {
  try {
    const { documentText, documentType } = req.body;
    const system = "You are a dental clinic AI assistant. Explain this document in simple, easy-to-understand language for a patient with no medical background. Highlight key points and what action the patient may need to take.";
    const user = `Document type: ${documentType || "dental document"}\nDocument text:\n${documentText || ""}`;
    const explanation = await complete(system, user);
    res.json({ explanation });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient/navigate-portal
// Body: { question }
exports.navigatePortal = async (req, res) => {
  try {
    const { question } = req.body;
    const system = "You are a patient portal navigation assistant for a dental clinic app. Help the patient find features in the portal such as booking appointments, viewing invoices, accessing educational content, completing forms, or contacting the clinic. Be specific about where to find each feature.";
    const guide = await complete(system, question || "How do I use this portal?", 400);
    res.json({ guide });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient/schedule-help
// Body: { preferredDays, preferredTime, treatmentType, urgency }
exports.scheduleHelp = async (req, res) => {
  try {
    const { preferredDays, preferredTime, treatmentType, urgency } = req.body;
    const system = "You are a dental scheduling assistant. Help a patient understand how to request an appointment and what to expect. Advise on urgency and typical wait times.";
    const user = `Treatment needed: ${treatmentType || "checkup"}\nUrgency: ${urgency || "routine"}\nPreferred days: ${preferredDays || "flexible"}\nPreferred time: ${preferredTime || "flexible"}`;
    const advice = await complete(system, user, 400);
    res.json({ advice });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient/chat
// Body: { messages: [{ role, content }], clinicContext? }
exports.chat = async (req, res) => {
  try {
    const { messages, clinicContext } = req.body;
    if (!messages || !messages.length) return res.status(400).json({ error: "messages array required" });
    const systemMsg = {
      role: "system",
      content: `You are a helpful dental clinic patient assistant. Answer questions clearly and empathetically. Always recommend consulting the dentist for clinical advice. ${clinicContext || ""}`,
    };
    const chatRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMsg, ...messages.slice(-10)],
      temperature: 0.6,
      max_tokens: 500,
    });
    res.json({ reply: chatRes.choices[0].message.content });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

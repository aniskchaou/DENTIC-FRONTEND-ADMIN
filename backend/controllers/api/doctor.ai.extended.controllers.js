const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config.js");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Helper — single completion call
async function complete(systemPrompt, userPrompt) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 800,
  });
  return res.choices[0].message.content;
}

// POST /ai/clinical-note-draft
// Body: { symptoms, diagnosis, toothNumber?, noteType? }
exports.generateClinicalNoteDraft = async (req, res) => {
  try {
    const { symptoms, diagnosis, toothNumber, noteType = "SOAP" } = req.body;
    const system = "You are an expert dental clinician. Write structured clinical notes in the requested format.";
    const user = `Create a ${noteType} clinical note draft.\nSymptoms: ${symptoms || "N/A"}\nDiagnosis: ${diagnosis || "N/A"}${toothNumber ? `\nTooth: #${toothNumber}` : ""}`;
    const draft = await complete(system, user);
    res.json({ draft });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/soap-draft
// Body: { freeText, patientContext? }
exports.generateSOAPDraft = async (req, res) => {
  try {
    const { freeText, patientContext } = req.body;
    const system = "You are a dental assistant AI. Convert free text into a structured SOAP note with S (Subjective), O (Objective), A (Assessment), P (Plan) sections.";
    const user = `${patientContext ? `Patient context: ${patientContext}\n` : ""}Free text: ${freeText}`;
    const soap = await complete(system, user);
    res.json({ soap });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/summarize-visits
// Body: { patientId, visits: [{ date, doctor, notes, procedures }] }
exports.summarizeVisits = async (req, res) => {
  try {
    const { visits } = req.body;
    if (!visits || !visits.length) return res.status(400).json({ error: "visits array required" });
    const visitText = visits.map((v, i) =>
      `Visit ${i + 1} (${v.date}): Doctor: ${v.doctor || "N/A"}, Procedures: ${v.procedures || "N/A"}, Notes: ${v.notes || "N/A"}`
    ).join("\n");
    const system = "You are a dental AI. Summarize a patient's visit history concisely, highlighting key findings, treatments, and trends.";
    const summary = await complete(system, visitText);
    res.json({ summary });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/suggest-missing-docs
// Body: { patientRecord: { diagnoses, procedures, notes, xrays, treatmentPlans } }
exports.suggestMissingDocs = async (req, res) => {
  try {
    const { patientRecord } = req.body;
    const system = "You are a clinical compliance AI for a dental practice. Review the patient record and list any missing or incomplete documentation that should be present based on dental standards.";
    const user = `Patient record: ${JSON.stringify(patientRecord, null, 2)}`;
    const suggestions = await complete(system, user);
    res.json({ suggestions });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/patient-friendly-explanation
// Body: { treatmentPlan, diagnosis, procedures }
exports.patientFriendlyExplanation = async (req, res) => {
  try {
    const { treatmentPlan, diagnosis, procedures } = req.body;
    const system = "You are a dental AI that explains treatments in simple, empathetic language that a patient without medical background can understand. Avoid jargon.";
    const user = `Create a patient-friendly explanation for:\nDiagnosis: ${diagnosis || "N/A"}\nTreatment plan: ${treatmentPlan || "N/A"}\nProcedures: ${procedures || "N/A"}`;
    const explanation = await complete(system, user);
    res.json({ explanation });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/post-treatment-instructions
// Body: { procedure, toothNumber?, anesthesiaUsed? }
exports.postTreatmentInstructions = async (req, res) => {
  try {
    const { procedure, toothNumber, anesthesiaUsed } = req.body;
    const system = "You are a dental AI. Generate post-treatment home care instructions for the patient. Be clear, bullet-pointed, and empathetic.";
    const user = `Procedure: ${procedure}${toothNumber ? `, Tooth #${toothNumber}` : ""}${anesthesiaUsed ? ", Anesthesia used: Yes" : ""}`;
    const instructions = await complete(system, user);
    res.json({ instructions });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/follow-up-message
// Body: { patientName, procedure, nextAppointmentDate?, channel? }
exports.generateFollowUpMessage = async (req, res) => {
  try {
    const { patientName, procedure, nextAppointmentDate, channel = "sms" } = req.body;
    const system = `You are a dental clinic assistant. Generate a short, warm ${channel === "email" ? "email" : "SMS"} follow-up message to check on a patient after their procedure.`;
    const user = `Patient: ${patientName}, Procedure: ${procedure}${nextAppointmentDate ? `, Next appointment: ${nextAppointmentDate}` : ""}`;
    const message = await complete(system, user);
    res.json({ message });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/referral-letter
// Body: { patientName, patientAge, diagnosis, toSpecialty, reason, clinicalSummary, doctorName }
exports.generateReferralLetter = async (req, res) => {
  try {
    const { patientName, patientAge, diagnosis, toSpecialty, reason, clinicalSummary, doctorName } = req.body;
    const system = "You are a dental AI. Write a formal, professional clinical referral letter.";
    const user = `Write a referral letter:\nFrom Dr. ${doctorName || "referring clinician"}\nPatient: ${patientName}, Age: ${patientAge || "N/A"}\nTo: ${toSpecialty} specialist\nDiagnosis: ${diagnosis || "N/A"}\nReason: ${reason}\nClinical summary: ${clinicalSummary || "N/A"}`;
    const letter = await complete(system, user);
    res.json({ letter });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/extract-document
// Body: { documentText } — text extracted from uploaded document
exports.extractDocumentInfo = async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText) return res.status(400).json({ error: "documentText required" });
    const system = "You are a dental AI. Extract structured information (patient name, date, findings, measurements, recommendations) from medical/dental document text. Output valid JSON.";
    const extracted = await complete(system, documentText);
    res.json({ extracted });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/nl-patient-search
// Body: { query, patients: [{ id, name, diagnoses, procedures, notes }] }
exports.naturalLanguageSearch = async (req, res) => {
  try {
    const { query, patients } = req.body;
    if (!query) return res.status(400).json({ error: "query required" });
    const system = "You are a dental AI. Search through patient records based on a natural language query. Return only the matching patient IDs and a brief reason in JSON array format: [{id, reason}].";
    const user = `Query: "${query}"\nPatients: ${JSON.stringify(patients || [])}`;
    const results = await complete(system, user);
    res.json({ results });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

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
    temperature: 0.3,
    max_tokens: maxTokens,
  });
  return res.choices[0].message.content;
}

// POST /ai/insurance/extract-info
// Body: { documentText }
exports.extractInsuranceInfo = async (req, res) => {
  try {
    const { documentText } = req.body;
    const system = "You are an insurance data extraction AI for a dental clinic. Extract all insurance-related fields from the document. Return a JSON object with fields: providerName, policyNumber, groupNumber, memberId, coverageType, validFrom, validUntil, copayAmount, deductible, coveragePercentage, contactPhone, claimAddress.";
    const result = await complete(system, `Document:\n${documentText}`);
    try { res.json(JSON.parse(result)); } catch { res.json({ raw: result }); }
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/insurance/detect-missing
// Body: { claim: { procedureCodes, diagnosisCodes, claimAmount, serviceDate, ... } }
exports.detectMissingInfo = async (req, res) => {
  try {
    const { claim } = req.body;
    const system = "You are a dental insurance claim compliance AI. Review the claim data and identify missing or incomplete fields that would cause a rejection. Be specific and actionable.";
    const result = await complete(system, `Claim data:\n${JSON.stringify(claim, null, 2)}`);
    res.json({ issues: result });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/insurance/draft-narrative
// Body: { patientHistory, diagnosis, procedures, treatmentReason }
exports.draftNarrative = async (req, res) => {
  try {
    const { patientHistory, diagnosis, procedures, treatmentReason } = req.body;
    const system = "You are a dental billing specialist AI. Write a professional clinical narrative for an insurance claim that justifies the medical necessity of the treatment. Use clinical terminology. Keep it under 250 words.";
    const user = `Diagnosis: ${diagnosis || "N/A"}\nProcedures: ${procedures || "N/A"}\nPatient History: ${patientHistory || "N/A"}\nTreatment Reason: ${treatmentReason || "N/A"}`;
    const narrative = await complete(system, user);
    res.json({ narrative });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/insurance/summarize-rejected
// Body: { claims: [{ claimNumber, rejectionReason, procedureCodes, diagnosis }] }
exports.summarizeRejected = async (req, res) => {
  try {
    const { claims } = req.body;
    if (!claims || !claims.length) return res.status(400).json({ error: "claims array required" });
    const claimsText = claims.map((c, i) => `Claim ${i + 1} (${c.claimNumber || "N/A"}): Rejection reason: ${c.rejectionReason || "N/A"}, Procedures: ${(c.procedureCodes || []).join(", ")}, Diagnosis: ${c.diagnosis || "N/A"}`).join("\n");
    const system = "You are a dental billing AI. Analyze these rejected insurance claims and identify patterns, common rejection reasons, and recommend corrective actions to improve claim acceptance rates.";
    const summary = await complete(system, claimsText);
    res.json({ summary });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/insurance/find-incomplete
// Body: { claims: [...] }
exports.findIncomplete = async (req, res) => {
  try {
    const { claims } = req.body;
    if (!claims || !claims.length) return res.status(400).json({ error: "claims array required" });
    const incomplete = claims.filter(c =>
      !c.diagnosisCodes || !c.diagnosisCodes.length ||
      !c.procedureCodes || !c.procedureCodes.length ||
      !c.serviceDate || !c.claimAmount
    );
    const system = "You are a dental insurance AI. For each incomplete claim listed, explain what is missing and what is needed to make it submittable.";
    const user = `Incomplete claims:\n${JSON.stringify(incomplete, null, 2)}`;
    const result = await complete(system, user);
    res.json({ incompleteCount: incomplete.length, incompleteIds: incomplete.map(c => c.id), analysis: result });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /ai/insurance/verify-eligibility
// Body: { patientName, insuranceProvider, policyNumber, serviceType }
exports.verifyEligibility = async (req, res) => {
  try {
    const { patientName, insuranceProvider, policyNumber, serviceType } = req.body;
    const system = "You are a dental insurance eligibility assistant. Simulate eligibility verification and explain typical coverage rules for the requested service. Note: this is a simulation for demonstration only.";
    const user = `Patient: ${patientName || "N/A"}, Provider: ${insuranceProvider || "N/A"}, Policy: ${policyNumber || "N/A"}, Service: ${serviceType || "N/A"}`;
    const result = await complete(system, user);
    res.json({ eligibilityResult: result, note: "Simulated — integrate with real payer API for live verification" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

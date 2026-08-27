import axios from '../../libraries/axios/axios';

// ── Clinical Notes ────────────────────────────────────────────────────────
export const getClinicalNotes = (params) => axios.get('/clinical-notes', { params });
export const getClinicalNote = (id) => axios.get(`/clinical-notes/${id}`);
export const createClinicalNote = (data) => axios.post('/clinical-notes', data);
export const updateClinicalNote = (id, data) => axios.put(`/clinical-notes/${id}`, data);
export const signClinicalNote = (id, signatureData) => axios.post(`/clinical-notes/${id}/sign`, { signatureData });
export const amendClinicalNote = (id, data) => axios.post(`/clinical-notes/${id}/amend`, data);
export const deleteClinicalNote = (id) => axios.delete(`/clinical-notes/${id}`);

// ── Periodontal Charts ────────────────────────────────────────────────────
export const getPeriodontalCharts = (patientId) => axios.get(`/periodontal-charts/patient/${patientId}`);
export const getPerioExamDates = (patientId) => axios.get(`/periodontal-charts/exam-dates/${patientId}`);
export const getPerioExam = (patientId, examDate) => axios.get('/periodontal-charts/exam', { params: { patientId, examDate } });
export const savePerioExam = (data) => axios.post('/periodontal-charts', data);

// ── Clinical Referrals ────────────────────────────────────────────────────
export const getClinicalReferrals = (params) => axios.get('/clinical-referrals', { params });
export const getClinicalReferral = (id) => axios.get(`/clinical-referrals/${id}`);
export const createClinicalReferral = (data) => axios.post('/clinical-referrals', data);
export const updateClinicalReferral = (id, data) => axios.put(`/clinical-referrals/${id}`, data);
export const sendClinicalReferral = (id) => axios.post(`/clinical-referrals/${id}/send`);
export const deleteClinicalReferral = (id) => axios.delete(`/clinical-referrals/${id}`);

// ── Clinical Attachments ──────────────────────────────────────────────────
export const getClinicalAttachments = (params) => axios.get('/clinical-attachments', { params });
export const uploadClinicalAttachment = (formData) => axios.post('/clinical-attachments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteClinicalAttachment = (id) => axios.delete(`/clinical-attachments/${id}`);

// ── Doctor AI (extended) ──────────────────────────────────────────────────
export const aiClinicalNoteDraft = (data) => axios.post('/ai/clinical-note-draft', data);
export const aiSOAPDraft = (data) => axios.post('/ai/soap-draft', data);
export const aiSummarizeVisits = (data) => axios.post('/ai/summarize-visits', data);
export const aiSuggestMissingDocs = (data) => axios.post('/ai/suggest-missing-docs', data);
export const aiPatientFriendlyExplanation = (data) => axios.post('/ai/patient-friendly-explanation', data);
export const aiPostTreatmentInstructions = (data) => axios.post('/ai/post-treatment-instructions', data);
export const aiFollowUpMessage = (data) => axios.post('/ai/follow-up-message', data);
export const aiReferralLetter = (data) => axios.post('/ai/referral-letter', data);
export const aiExtractDocument = (data) => axios.post('/ai/extract-document', data);
export const aiNLPatientSearch = (data) => axios.post('/ai/nl-patient-search', data);

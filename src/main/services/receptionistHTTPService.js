import axios from '../../libraries/axios/axios';

// ── Appointment actions ───────────────────────────────────────────────────
export const getTodayBoard = () => axios.get('/appointments/today-board');
export const confirmAppointment = (id) => axios.post(`/appointments/${id}/confirm`);
export const checkInAppointment = (id) => axios.post(`/appointments/${id}/check-in`);
export const checkOutAppointment = (id) => axios.post(`/appointments/${id}/check-out`);
export const cancelAppointment = (id, reason) => axios.post(`/appointments/${id}/cancel`, { reason });
export const assignDoctor = (id, doctorId) => axios.put(`/appointments/${id}/assign-doctor`, { doctorId });
export const assignRoom = (id, roomId, roomNumber) => axios.put(`/appointments/${id}/assign-room`, { roomId, roomNumber });

// ── Admin documents ───────────────────────────────────────────────────────
export const getAdminDocuments = (params) => axios.get('/admin-documents', { params });
export const uploadAdminDocument = (formData) => axios.post('/admin-documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const verifyAdminDocument = (id, data) => axios.post(`/admin-documents/${id}/verify`, data);
export const deleteAdminDocument = (id) => axios.delete(`/admin-documents/${id}`);

// ── Patient forms ─────────────────────────────────────────────────────────
export const getPatientForms = (params) => axios.get('/patient-forms', { params });
export const getPatientForm = (id) => axios.get(`/patient-forms/${id}`);
export const createPatientForm = (data) => axios.post('/patient-forms', data);
export const updatePatientForm = (id, data) => axios.put(`/patient-forms/${id}`, data);
export const sendPatientForm = (id, sentVia) => axios.post(`/patient-forms/${id}/send`, { sentVia });
export const deletePatientForm = (id) => axios.delete(`/patient-forms/${id}`);

// ── Communication ─────────────────────────────────────────────────────────
export const sendSMS = (data) => axios.post('/communications/sms', data);
export const sendEmail = (data) => axios.post('/communications/email', data);
export const sendAppointmentReminder = (data) => axios.post('/communications/appointment-reminder', data);
export const sendConfirmation = (data) => axios.post('/communications/confirmation', data);
export const sendRecall = (data) => axios.post('/communications/recall', data);
export const sendPaymentReminder = (data) => axios.post('/communications/payment-reminder', data);

// ── Receipts ──────────────────────────────────────────────────────────────
export const generateReceipt = (data) => axios.post('/receipts/generate', data, { responseType: 'text' });
export const emailReceipt = (data) => axios.post('/receipts/email', data);

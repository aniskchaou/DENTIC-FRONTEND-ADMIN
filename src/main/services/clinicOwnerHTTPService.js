import axios from '../../libraries/axios/axios';
import BASE_URL from '../urls/urls';

// Clinic Locations
export const getClinicLocations = (clinicId) => axios.get(`${BASE_URL}/clinic-locations${clinicId ? `?clinicId=${clinicId}` : ''}`);
export const createClinicLocation = (data) => axios.post(`${BASE_URL}/clinic-locations`, data);
export const updateClinicLocation = (id, data) => axios.put(`${BASE_URL}/clinic-locations/${id}`, data);
export const deleteClinicLocation = (id) => axios.delete(`${BASE_URL}/clinic-locations/${id}`);
export const setMainLocation = (id) => axios.put(`${BASE_URL}/clinic-locations/${id}/set-main`);

// Holidays
export const getHolidays = (clinicId) => axios.get(`${BASE_URL}/holidays${clinicId ? `?clinicId=${clinicId}` : ''}`);
export const createHoliday = (data) => axios.post(`${BASE_URL}/holidays`, data);
export const updateHoliday = (id, data) => axios.put(`${BASE_URL}/holidays/${id}`, data);
export const deleteHoliday = (id) => axios.delete(`${BASE_URL}/holidays/${id}`);

// Appointment Rules
export const getAppointmentRules = (clinicId) => axios.get(`${BASE_URL}/appointment-rules?clinicId=${clinicId}`);
export const saveAppointmentRules = (data) => axios.post(`${BASE_URL}/appointment-rules`, data);

// Appointment Types
export const getAppointmentTypes = (clinicId) => axios.get(`${BASE_URL}/appointment-types${clinicId ? `?clinicId=${clinicId}` : ''}`);
export const createAppointmentType = (data) => axios.post(`${BASE_URL}/appointment-types`, data);
export const updateAppointmentType = (id, data) => axios.put(`${BASE_URL}/appointment-types/${id}`, data);
export const deactivateAppointmentType = (id) => axios.delete(`${BASE_URL}/appointment-types/${id}`);

// Rooms
export const getRooms = (clinicId) => axios.get(`${BASE_URL}/rooms${clinicId ? `?clinicId=${clinicId}` : ''}`);
export const createRoom = (data) => axios.post(`${BASE_URL}/rooms`, data);
export const updateRoom = (id, data) => axios.put(`${BASE_URL}/rooms/${id}`, data);
export const deleteRoom = (id) => axios.delete(`${BASE_URL}/rooms/${id}`);
export const toggleRoom = (id) => axios.put(`${BASE_URL}/rooms/${id}/toggle`);

// Waitlist
export const getWaitlist = (params = {}) => axios.get(`${BASE_URL}/waitlist`, { params });
export const addToWaitlist = (data) => axios.post(`${BASE_URL}/waitlist`, data);
export const updateWaitlistEntry = (id, data) => axios.put(`${BASE_URL}/waitlist/${id}`, data);
export const notifyWaitlistEntry = (id) => axios.put(`${BASE_URL}/waitlist/${id}/notify`);
export const removeFromWaitlist = (id) => axios.delete(`${BASE_URL}/waitlist/${id}`);

// Employee Invites
export const getEmployeeInvites = (clinicId) => axios.get(`${BASE_URL}/employee-invites${clinicId ? `?clinicId=${clinicId}` : ''}`);
export const sendEmployeeInvite = (data) => axios.post(`${BASE_URL}/employee-invites`, data);
export const revokeEmployeeInvite = (id) => axios.put(`${BASE_URL}/employee-invites/${id}/revoke`);
export const acceptEmployeeInvite = (token) => axios.get(`${BASE_URL}/employee-invites/accept/${token}`);

// Clinic AI Config
export const getClinicAIConfig = (clinicId) => axios.get(`${BASE_URL}/clinic-ai-config?clinicId=${clinicId}`);
export const saveClinicAIConfig = (data) => axios.post(`${BASE_URL}/clinic-ai-config`, data);
export const getAIUsage = (clinicId) => axios.get(`${BASE_URL}/clinic-ai-usage?clinicId=${clinicId}`);

// Patient Refunds
export const getPatientRefunds = (params = {}) => axios.get(`${BASE_URL}/patient-refunds`, { params });
export const createPatientRefund = (data) => axios.post(`${BASE_URL}/patient-refunds`, data);
export const updatePatientRefundStatus = (id, data) => axios.put(`${BASE_URL}/patient-refunds/${id}/status`, data);

// Service Pricing
export const getServicePrices = (params = {}) => axios.get(`${BASE_URL}/service-prices`, { params });
export const createServicePrice = (data) => axios.post(`${BASE_URL}/service-prices`, data);
export const updateServicePrice = (id, data) => axios.put(`${BASE_URL}/service-prices/${id}`, data);
export const deactivateServicePrice = (id) => axios.delete(`${BASE_URL}/service-prices/${id}`);
export const getRevenueByDoctor = (params) => axios.get(`${BASE_URL}/clinic-analytics/revenue-by-doctor`, { params });
export const getRevenueByProcedure = (params) => axios.get(`${BASE_URL}/clinic-analytics/revenue-by-procedure`, { params });
export const getNewVsReturning = (params) => axios.get(`${BASE_URL}/clinic-analytics/new-vs-returning`, { params });
export const getAppointmentStats = (params) => axios.get(`${BASE_URL}/clinic-analytics/appointment-stats`, { params });
export const getFinancialSummary = (params) => axios.get(`${BASE_URL}/clinic-analytics/financial-summary`, { params });
export const getPatientRetention = (params) => axios.get(`${BASE_URL}/clinic-analytics/patient-retention`, { params });
export const getOutstandingBalances = (params) => axios.get(`${BASE_URL}/clinic-analytics/outstanding-balances`, { params });
export const getOperationalDashboard = (params) => axios.get(`${BASE_URL}/clinic-analytics/operational-dashboard`, { params });

import http from "../../libraries/axios/axios";

// baseURL is already set in the axios instance; use relative paths only
const api = (path) => path;

// Auth
const forgotPassword = (data) => http.post(api("/auth/forgot-password"), data);
const resetPassword = (data) => http.post(api("/auth/reset-password"), data);
const changePassword = (data) => http.put(api("/auth/change-password"), data);

// Clinic management
const getClinics = () => http.get(api("/clinics"));
const suspendClinic = (id) => http.put(api(`/clinics/${id}/suspend`));
const unsuspendClinic = (id) => http.put(api(`/clinics/${id}/unsuspend`));
const getClinicSubscription = (clinicId) => http.get(api(`/clinic-subscriptions/${clinicId}`));
const createClinicSubscription = (data) => http.post(api("/clinic-subscriptions"), data);
const changePlan = (clinicId, data) => http.put(api(`/clinic-subscriptions/${clinicId}/plan`), data);
const manageTrial = (clinicId, data) => http.put(api(`/clinic-subscriptions/${clinicId}/trial`), data);
const cancelSubscription = (clinicId) => http.put(api(`/clinic-subscriptions/${clinicId}/cancel`));

// User management
const getUsers = () => http.get(api("/users"));
const createUser = (data) => http.post(api("/users"), data);
const deleteUser = (id) => http.delete(api(`/users/${id}`));
const disableUser = (id) => http.put(api(`/users/${id}/disable`));
const enableUser = (id) => http.put(api(`/users/${id}/enable`));
const assignPermissions = (id, data) => http.put(api(`/users/${id}/permissions`), data);
const adminResetPassword = (id, data) => http.post(api(`/users/${id}/reset-password`), data);

// Subscription plans
const getPlans = () => http.get(api("/subscription-plans"));
const createPlan = (data) => http.post(api("/subscription-plans"), data);
const updatePlan = (id, data) => http.put(api(`/subscription-plans/${id}`), data);
const deletePlan = (id) => http.delete(api(`/subscription-plans/${id}`));

// Coupons
const getCoupons = () => http.get(api("/coupons"));
const createCoupon = (data) => http.post(api("/coupons"), data);
const updateCoupon = (id, data) => http.put(api(`/coupons/${id}`), data);
const deactivateCoupon = (id) => http.delete(api(`/coupons/${id}`));
const validateCoupon = (code) => http.get(api(`/coupons/validate/${code}`));

// Refunds
const getRefunds = () => http.get(api("/refunds"));
const createRefund = (data) => http.post(api("/refunds"), data);
const updateRefundStatus = (id, data) => http.put(api(`/refunds/${id}/status`), data);

// SaaS invoices
const getSaasInvoices = (clinicId) => http.get(api(`/saas-invoices${clinicId ? `?clinicId=${clinicId}` : ""}`));
const createSaasInvoice = (data) => http.post(api("/saas-invoices"), data);
const markInvoicePaid = (id, data) => http.put(api(`/saas-invoices/${id}/mark-paid`), data);

// Platform settings — SMS providers
const getSmsProviders = () => http.get(api("/platform/sms-providers"));
const createSmsProvider = (data) => http.post(api("/platform/sms-providers"), data);
const updateSmsProvider = (id, data) => http.put(api(`/platform/sms-providers/${id}`), data);
const activateSmsProvider = (id) => http.put(api(`/platform/sms-providers/${id}/activate`));
const deleteSmsProvider = (id) => http.delete(api(`/platform/sms-providers/${id}`));

// Platform settings — Payment gateways
const getGateways = () => http.get(api("/platform/payment-gateways"));
const createGateway = (data) => http.post(api("/platform/payment-gateways"), data);
const updateGateway = (id, data) => http.put(api(`/platform/payment-gateways/${id}`), data);
const activateGateway = (id) => http.put(api(`/platform/payment-gateways/${id}/activate`));
const deleteGateway = (id) => http.delete(api(`/platform/payment-gateways/${id}`));

// Platform settings — Storage
const getStorageConfig = () => http.get(api("/platform/storage"));
const saveStorageConfig = (data) => http.post(api("/platform/storage"), data);
const updateStorageConfig = (id, data) => http.put(api(`/platform/storage/${id}`), data);

// Platform settings — AI
const getAiConfig = () => http.get(api("/platform/ai-config"));
const saveAiConfig = (data) => http.put(api("/platform/ai-config"), data);

// SaaS Analytics
const getDashboard = () => http.get(api("/saas-analytics/dashboard"));
const getMonthlyRevenue = () => http.get(api("/saas-analytics/monthly-revenue"));
const getActiveClinics = () => http.get(api("/saas-analytics/active-clinics"));
const getActiveUsers = () => http.get(api("/saas-analytics/active-users"));
const getAppUsage = () => http.get(api("/saas-analytics/app-usage"));
const getFailedPayments = () => http.get(api("/saas-analytics/failed-payments"));
const getGrowth = () => http.get(api("/saas-analytics/growth"));

export default {
  forgotPassword, resetPassword, changePassword,
  getClinics, suspendClinic, unsuspendClinic,
  getClinicSubscription, createClinicSubscription, changePlan, manageTrial, cancelSubscription,
  getUsers, createUser, deleteUser, disableUser, enableUser, assignPermissions, adminResetPassword,
  getPlans, createPlan, updatePlan, deletePlan,
  getCoupons, createCoupon, updateCoupon, deactivateCoupon, validateCoupon,
  getRefunds, createRefund, updateRefundStatus,
  getSaasInvoices, createSaasInvoice, markInvoicePaid,
  getSmsProviders, createSmsProvider, updateSmsProvider, activateSmsProvider, deleteSmsProvider,
  getGateways, createGateway, updateGateway, activateGateway, deleteGateway,
  getStorageConfig, saveStorageConfig, updateStorageConfig,
  getAiConfig, saveAiConfig,
  getDashboard, getMonthlyRevenue, getActiveClinics, getActiveUsers,
  getAppUsage, getFailedPayments, getGrowth,
};

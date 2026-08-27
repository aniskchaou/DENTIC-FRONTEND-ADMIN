import React from 'react';
import PropTypes from 'prop-types';
import './Content.css';

import { BrowserRouter as Router, Route } from "react-router-dom"
import Configuration from '../Configuration/Configuration';
import Dashbord from '../DashBoard/DashBoard';
import Rendezvous from '../Rendezvous/Rendezvous';
import Prescription from '../Prescription/Prescription';
import Payment from '../Payment/Payment';
import Patient from '../Patient/Patient';
import Medicament from '../Medicament/Medicament';
import Login from '../Login/Login';
import AddPrescription from "../AddPrescription/AddPrescription";
import CurrentUser from '../../main/config/user';
import AddMedicament from '../AddMedicament/AddMedicament';
import AddPatient from '../AddPatient/AddPatient';
import Expense from "../Expense/Expense";
import Income from "../Income/Income";
import Note from "../Note/Note";
import ToDo from "../ToDo/ToDo";
import Message from "../Message/Message";
import MedicamentManufacture from "../MedicamentManufacture/MedicamentManufacture";
import MedicamentCategory from "../MedicamentCategory/MedicamentCategory";
import LabTest from "../LabTest/LabTest";
import Invoice from "../Invoice/Invoice";
import Certificates from '../Certificates/Certificates'
import Consultation from '../Consultation/Consultations.jsx'
import CertificateTemplates from '../CertificateTemplates/CertificateTemplates'
import TestLab from '../LabTest/LabTest'
import MedicamentAnalytics from '../MedicamentAnalytics/MedicamentAnalytics';
import PatientAnalytics from '../PatientAnalytics/PatientAnalytics'
import SaleAnalytics from '../SaleAnalytics/SaleAnalytics'
import Services from '../Services/Services'
import OpeningHourPage from '../OpeningHourPage/OpeningHourPage'
import ContactPage from '../ContactPage/ContactPage'
import ServicePage from '../ServicePage/ServicePage'
import BlogPage from '../BlogPage/BlogPage'
import Testimonial from '../Testimonial/Testimonial'
import Schedule from '../Schedule/Schedule'
import NewsLetter from '../NewsLetter/NewsLetter'
import SearchPatient from '../SearchPatient/SearchPatient';
import Profile from '../Profile/Profile';
import Appointments from '../Appointements/Appointements';
import CaseStudies from '../CaseStudy/CaseStudies';
import MembershipDetails from '../Membership/MembershipDetails.jsx';
import OperationDetails from '../Operation/OperationDetails.jsx';
import ClinicInfo from '../Clinic/ClinicInfo.jsx';
import Diagnoses from '../Diagnose/Diagnoses.jsx';
import EquipmentMaintenance from '../EquipmentMaintenance/EquipementMaintenance.js';
import InsuranceInfo from '../Insurance/InsuranceInfo.jsx';
import LegalCompliance from '../LegalCompliance/LegalCompliance.jsx';
import LoyaltyProgram from '../LoyaltyProgram/LoyaltyProgram.js';
import MarketingCampaign from '../MarketingCampaign/MarketingCampaign.jsx';
import StaffProfile from '../Staff/StaffProfile.jsx';
import ProcedureDetails from '../Procedure/ProcedureDetails.jsx';
import TreatmentPlan from '../TreatmentPlan/TreatmentPlan.jsx';
import Doctors from '../Doctor/Doctors.jsx';
import ProfessionalOdontogram from '../Odontogram/ProfessionalOdontogram.js';
import Telemedicine from '../Telemedicine/Telemedicine.js';
import Billing from '../Billing/Billing.js';
import DentalImaging from '../DentalImaging/DentalImaging.js';
import InventoryItem from '../InventoryItem/InventoryItem.js';
import HomePage from '../Home/HomePage.jsx';
import DocumentationHelp from '../DocumentationHelp/DocumentationHelp.js';
import Register from '../Register/Register.js';
import AboutUsPage from '../AboutUsPage/AboutUsPage.jsx';
import AddInventoryItem from '../InventoryItem/AddInventoryItem.js';
import AddAppointment from '../Appointements/AddAppointment.js';
import ReminderAppointment from '../Reminders/ReminderAppointment';
import ReminderFollowUp from '../Reminders/ReminderFollowUp';
import ReminderTreatementCompletion from '../Reminders/ReminderTreatementCompletion';
import DicomViewer from '../DentalImaging/DicomViewer';
import SuperAdminDashboard from '../SuperAdmin/SuperAdminDashboard';
import ClinicManagement from '../SuperAdmin/ClinicManagement';
import UserManagement from '../SuperAdmin/UserManagement';
import SubscriptionPlans from '../SuperAdmin/SubscriptionPlans';
import CouponManagement from '../SuperAdmin/CouponManagement';
import RefundManagement from '../SuperAdmin/RefundManagement';
import SaasInvoices from '../SuperAdmin/SaasInvoices';
import PlatformSettings from '../SuperAdmin/PlatformSettings';
import ClinicLocations from '../ClinicLocations/ClinicLocations';
import HolidayConfig from '../HolidayConfig/HolidayConfig';
import AppointmentRules from '../AppointmentRules/AppointmentRules';
import AppointmentTypes from '../AppointmentTypes/AppointmentTypes';
import RoomManagement from '../RoomManagement/RoomManagement';
import Waitlist from '../Waitlist/Waitlist';
import EmployeeInvite from '../EmployeeInvite/EmployeeInvite';
import ClinicAnalytics from '../ClinicAnalytics/ClinicAnalytics';
import OperationalDashboard from '../OperationalDashboard/OperationalDashboard';
import OutstandingBalances from '../OutstandingBalances/OutstandingBalances';
import ClinicAIConfig from '../ClinicAIConfig/ClinicAIConfig';
import PatientRefund from '../PatientRefund/PatientRefund';
import PricingManagement from '../PricingManagement/PricingManagement';
import RecallManagement from '../RecallManagement/RecallManagement';
import ClinicalNotes from '../ClinicalNotes/ClinicalNotes';
import PeriodontalChart from '../PeriodontalChart/PeriodontalChart';
import ClinicalReferral from '../ClinicalReferral/ClinicalReferral';
import PatientTimeline from '../PatientTimeline/PatientTimeline';
import DoctorAIHub from '../DoctorAIHub/DoctorAIHub';
import AppointmentCheckIn from '../AppointmentCheckIn/AppointmentCheckIn';
import PatientForms from '../PatientForms/PatientForms';
import AdminDocuments from '../AdminDocuments/AdminDocuments';
import CommunicationCenter from '../CommunicationCenter/CommunicationCenter';
import ReceiptManager from '../ReceiptManager/ReceiptManager';
import FinancialReports from '../FinancialReports/FinancialReports';
import PaymentReconciliation from '../PaymentReconciliation/PaymentReconciliation';
import InsuranceClaims from '../InsuranceClaims/InsuranceClaims';
import InsuranceAIHub from '../InsuranceAIHub/InsuranceAIHub';
import CaseAcceptance from '../CaseAcceptance/CaseAcceptance';
import TreatmentPipeline from '../TreatmentPipeline/TreatmentPipeline';
import TreatmentCoordAIHub from '../TreatmentCoordAIHub/TreatmentCoordAIHub';
import PatientMyAppointments from '../PatientMyAppointments/PatientMyAppointments';
import PatientMyInvoices from '../PatientMyInvoices/PatientMyInvoices';
import PatientEducation from '../PatientEducation/PatientEducation';
import PatientAIAssistant from '../PatientAIAssistant/PatientAIAssistant';
import SurveyManagement, { PatientSurveyForm } from '../PatientSurvey/PatientSurvey';
import AuditLogs from '../AuditLogs/AuditLogs';
import SupportTickets from '../SupportTickets/SupportTickets';
import NotificationTemplates from '../NotificationTemplates/NotificationTemplates';
import VitalsRecord from '../VitalsRecord/VitalsRecord';
import PatientPayment from '../PatientPayment/PatientPayment';
import PatientPrescriptions from '../PatientPrescriptions/PatientPrescriptions';
import PaymentMethods from '../PaymentMethods/PaymentMethods';

const Content = ({ connected }) => (
  <div className="col-md-12" style={{ display: (connected ? 'block' : 'none') }}>
    <div>
      <Route exact path="/dashboard" component={Dashbord} />
      <Route exact path="/rendezvous" component={Appointments} />
      <Route exact path="/prescription" component={Prescription} />
      <Route exact path="/addprescription" component={AddPrescription} />
      <Route exact path="/patient" component={Patient} />
      <Route exact path="/medicaments" component={Medicament} />
      <Route exact path="/configuration" component={Configuration} />
      <Route exact path="/add-prescription" component={AddPrescription} />
      <Route exact path="/add-medicament" component={AddMedicament} />
      <Route exact path="/add-patient" component={AddPatient} />
      <Route exact path="/add-appointement" component={Rendezvous} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/income" component={Income} />
      <Route exact path="/expense" component={Expense} />
      <Route exact path="/note" component={Note} />
      <Route exact path="/todo" component={ToDo} />
      <Route exact path="/message" component={Message} />
      <Route exact path="/telemedicine" component={Telemedicine} />
      <Route exact path="/billing" component={Billing} />
      <Route exact path="/dental-imaging" component={DentalImaging} />
      <Route exact path="/inventory-item" component={InventoryItem} />
      <Route exact path="/aboutus" component={AboutUsPage} />
      <Route exact path="/medicament-manufacture" component={MedicamentManufacture} />
      <Route exact path="/medicament-category" component={MedicamentCategory} />
      <Route exact path="/lab-test" component={LabTest} />
      <Route exact path="/invoice" component={Invoice} />
      <Route exact path="/certificate" component={Certificates} />
      <Route exact path="/consultation" component={Consultation} />
      <Route exact path="/certificate-template" component={CertificateTemplates} />
      <Route exact path="/quick-test" component={TestLab} />
      <Route exact path="/medicament-analytics" component={MedicamentAnalytics} />
      <Route exact path="/patient-analytics" component={PatientAnalytics} />
      <Route exact path="/sale-analytics" component={SaleAnalytics} />
      <Route exact path="/service" component={Services} />

      <Route exact path="/homepage" component={HomePage} />
      <Route exact path="/openinghourpage" component={OpeningHourPage} />
      <Route exact path="/servicepage" component={ServicePage} />
      <Route exact path="/blogpage" component={BlogPage} />
      <Route exact path="/contactpage" component={ContactPage} />

      <Route exact path="/testimonials" component={Testimonial} />
      <Route exact path="/schedule" component={Schedule} />
      <Route exact path="/messages" component={Message} />
      <Route exact path="/newsletters" component={NewsLetter} />
      <Route path="/result/:input" component={SearchPatient} />
      <Route exact path="/profile" component={Profile} />


      <Route exact path="/case-study" component={CaseStudies} />
      <Route exact path="/dental-membership" component={MembershipDetails} />
      <Route exact path="/operation" component={OperationDetails} />
      <Route exact path="/treatment-plan" component={TreatmentPlan} />
      <Route exact path="/procedure" component={ProcedureDetails} />
      <Route exact path="/staff" component={StaffProfile} />
      <Route exact path="/marketing" component={MarketingCampaign} />
      <Route exact path="/loyalty" component={LoyaltyProgram} />
      <Route exact path="/legal" component={LegalCompliance} />
      <Route exact path="/insurance" component={InsuranceInfo} />
      <Route exact path="/income" component={Income} />
      <Route exact path="/equipment-maintenance" component={EquipmentMaintenance} />
      <Route exact path="/diagnosis" component={Diagnoses} />
      <Route exact path="/clinic" component={ClinicInfo} />
      <Route exact path="/doctor" component={Doctors} />
      <Route exact path="/help" component={DocumentationHelp} />
      <Route exact path="/odontogram" component={ProfessionalOdontogram} />
      <Route exact path="/appointments/add" component={AddAppointment} />
      <Route exact path="/patients/add" component={AddPatient} />
      <Route exact path="/inventory/add" component={AddInventoryItem} />
      <Route exact path="/dicom-viewer" component={DicomViewer} />
      <Route exact path="/reminders/appointment" component={ReminderAppointment} />
      <Route exact path="/reminders/follow-up" component={ReminderFollowUp} />
      <Route exact path="/reminders/treatment-completion" component={ReminderTreatementCompletion} />

      {/* Super Admin routes */}
      <Route exact path="/superadmin/dashboard" component={SuperAdminDashboard} />
      <Route exact path="/superadmin/clinics" component={ClinicManagement} />
      <Route exact path="/superadmin/users" component={UserManagement} />
      <Route exact path="/superadmin/plans" component={SubscriptionPlans} />
      <Route exact path="/superadmin/coupons" component={CouponManagement} />
      <Route exact path="/superadmin/refunds" component={RefundManagement} />
      <Route exact path="/superadmin/invoices" component={SaasInvoices} />
      <Route exact path="/superadmin/platform" component={PlatformSettings} />
      <Route exact path="/superadmin/audit-logs" component={AuditLogs} />
      <Route exact path="/superadmin/support-tickets" component={SupportTickets} />
      <Route exact path="/superadmin/notification-templates" component={NotificationTemplates} />

      {/* Clinic Owner routes */}
      <Route exact path="/clinic/locations" component={ClinicLocations} />
      <Route exact path="/clinic/holidays" component={HolidayConfig} />
      <Route exact path="/clinic/appointment-rules" component={AppointmentRules} />
      <Route exact path="/clinic/appointment-types" component={AppointmentTypes} />
      <Route exact path="/clinic/rooms" component={RoomManagement} />
      <Route exact path="/clinic/waitlist" component={Waitlist} />
      <Route exact path="/clinic/employee-invites" component={EmployeeInvite} />
      <Route exact path="/clinic/analytics" component={ClinicAnalytics} />
      <Route exact path="/clinic/operational-dashboard" component={OperationalDashboard} />
      <Route exact path="/clinic/outstanding" component={OutstandingBalances} />
      <Route exact path="/clinic/ai-config" component={ClinicAIConfig} />
      <Route exact path="/clinic/patient-refunds" component={PatientRefund} />
      <Route exact path="/clinic/pricing" component={PricingManagement} />
      <Route exact path="/clinic/recalls" component={RecallManagement} />
      {/* Doctor / Dentist routes */}
      <Route exact path="/doctor/clinical-notes" component={ClinicalNotes} />
      <Route exact path="/doctor/periodontal-chart" component={PeriodontalChart} />
      <Route exact path="/doctor/clinical-referrals" component={ClinicalReferral} />
      <Route exact path="/doctor/patient-timeline" component={PatientTimeline} />
      <Route exact path="/doctor/ai-hub" component={DoctorAIHub} />
      {/* Dental Assistant routes */}
      <Route exact path="/dental/vitals" component={VitalsRecord} />
      {/* Receptionist / Front Desk routes */}
      <Route exact path="/receptionist/check-in" component={AppointmentCheckIn} />
      <Route exact path="/receptionist/patient-forms" component={PatientForms} />
      <Route exact path="/receptionist/admin-documents" component={AdminDocuments} />
      <Route exact path="/receptionist/communications" component={CommunicationCenter} />
      <Route exact path="/receptionist/receipts" component={ReceiptManager} />
      {/* Billing / Accountant routes */}
      <Route exact path="/accountant/financial-reports" component={FinancialReports} />
      <Route exact path="/accountant/reconciliation" component={PaymentReconciliation} />
      <Route exact path="/accountant/payment-methods" component={PaymentMethods} />
      {/* Insurance Coordinator routes */}
      <Route exact path="/insurance/claims" component={InsuranceClaims} />
      <Route exact path="/insurance/ai-hub" component={InsuranceAIHub} />
      {/* Treatment Coordinator routes */}
      <Route exact path="/treatment-coord/case-acceptance" component={CaseAcceptance} />
      <Route exact path="/treatment-coord/pipeline" component={TreatmentPipeline} />
      <Route exact path="/treatment-coord/ai-hub" component={TreatmentCoordAIHub} />
      {/* Patient Portal routes */}
      <Route exact path="/patient/my-appointments" component={PatientMyAppointments} />
      <Route exact path="/patient/my-invoices" component={PatientMyInvoices} />
      <Route exact path="/patient/education" component={PatientEducation} />
      <Route exact path="/patient/ai-assistant" component={PatientAIAssistant} />
      <Route exact path="/patient/payments" component={PatientPayment} />
      <Route exact path="/patient/prescriptions" component={PatientPrescriptions} />
      <Route exact path="/patient/survey/:token" component={PatientSurveyForm} />
      <Route exact path="/clinic/surveys" component={SurveyManagement} />
    </div>
  </div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;

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
    </div>
  </div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;

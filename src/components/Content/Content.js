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
import Consultation from '../Consultation/Consultation'
import CertificateTemplates from '../CertificateTemplates/CertificateTemplates'
import TestLab from '../LabTest/LabTest'
import MedicamentAnalytics from '../MedicamentAnalytics/MedicamentAnalytics';
import PatientAnalytics from '../PatientAnalytics/PatientAnalytics'
import SaleAnalytics from '../SaleAnalytics/SaleAnalytics'
import Services from '../Services/Services'
import HomePage from '../HomePage/HomePage'
import OpeningHourPage from '../OpeningHourPage/OpeningHourPage'
import ContactPage from '../ContactPage/ContactPage'
import ServicePage from '../ServicePage/ServicePage'
import BlogPage from '../BlogPage/BlogPage'
import Testimonial from '../Testimonial/Testimonial'
import Schedule from '../Schedule/Schedule'
import NewsLetter from '../NewsLetter/NewsLetter'
const Content = () => (
  <div className="col-md-12" style={{ display: (CurrentUser.CONNECTED_USER ? 'block' : 'none') }}>
    <div>
      <Route exact path="/" component={Dashbord} />
      <Route exact path="/dashboard" component={Dashbord} />
      <Route exact path="/rendezvous" component={Rendezvous} />
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









    </div>
  </div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;

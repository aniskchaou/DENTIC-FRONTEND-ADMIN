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

const Content = () => (
  <div className="col-md-12">
  
        <div>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashbord} />
          <Route exact path="/rendezvous" component={Rendezvous} />
          <Route exact path="/prescription" component={Prescription} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/patient" component={Patient} />
          <Route exact path="/medicaments" component={Medicament} />
          <Route exact path="/configuration" component={Configuration} />
         
          
        </div>
      
   
</div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;

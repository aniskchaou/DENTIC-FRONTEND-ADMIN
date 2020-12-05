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

const Content = () => (
  <div className="col-md-12">
    <Router>
        <div>
        <Route exact path="/" component={Dashbord} />
        <Route exact path="/dashboard" component={Dashbord} />
          <Route exact path="/rendezvous" component={Rendezvous} />
          <Route exact path="/prescription" component={Prescription} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/patient" component={Patient} />
          <Route exact path="/medicament" component={Medicament} />
          <Route exact path="/configuration" component={Configuration} />
         
          
        </div>
      </Router>
   
</div>
);

Content.propTypes = {};

Content.defaultProps = {};

export default Content;

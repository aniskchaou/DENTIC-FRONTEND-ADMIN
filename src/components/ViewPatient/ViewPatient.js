import React from 'react';
import PropTypes from 'prop-types';
import './ViewPatient.css';

const ViewPatient = () => (
  <div className="ViewPatient">






    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">Overview</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Notes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Medication</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Prescriptions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Consultations History</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Appointements</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Document</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Test Lab</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">perations</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Quick test</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" tabindex="-1" aria-disabled="true">Invoices</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">To do</a>
      </li>
    </ul>
  </div>
);

ViewPatient.propTypes = {};

ViewPatient.defaultProps = {};

export default ViewPatient;

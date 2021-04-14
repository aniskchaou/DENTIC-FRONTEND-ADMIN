import React from 'react';
import PropTypes from 'prop-types';
import './ViewPrescription.css';

const ViewPrescription = () => (
  <div className="ViewPrescription">


    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">11/01/2021</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Patient Id
               </th>
          <td>J1234</td>
        </tr>
        <tr>
          <th scope="row"> Appointment Id </th>
          <td>A20Z9TH</td>
        </tr>
        <tr>
          <th scope="row">Patient Name</th>
          <td>Jenifer</td>
        </tr>
      </tbody>
    </table>



  </div>
);

ViewPrescription.propTypes = {};

ViewPrescription.defaultProps = {};

export default ViewPrescription;

import React from 'react';
import PropTypes from 'prop-types';
import './Payment.css';

const Payment = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Paiement</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead class=" text-primary">
          <th>ID Patient </th>
          <th>ID de rendez-vous</th>
          <th> email</th>
          <th>Montant </th>
          <th>Date </th>
          <th>Remarque </th>
        </thead>
        <tbody>
          <tr>
            <td>12E323</td>
            <td>32E3A3</td>
            <td>kchaouanis25@gmail.com</td>
            <td>300$</td>
            <td>22/10/2020</td>
            <td>a tester</td>

          </tr>

        </tbody>
      </table>
    </div>
  </div>
);

Payment.propTypes = {};

Payment.defaultProps = {};

export default Payment;

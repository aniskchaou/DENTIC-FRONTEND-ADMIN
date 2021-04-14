import React from 'react';
import PropTypes from 'prop-types';
import './ViewPatient.css';

const ViewPatient = () => (
  <div className="ViewPatient">

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Nom du patient</th>
          <th scope="col">Jenifer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Age
               </th>
          <td>26 ans</td>
        </tr>
        <tr>
          <th scope="row"> sexe</th>
          <td>Femme</td>
        </tr>
        <tr>
          <th scope="row">poids</th>
          <td>59 kg</td>
        </tr>
      </tbody>
    </table>

  </div>
);

ViewPatient.propTypes = {};

ViewPatient.defaultProps = {};

export default ViewPatient;

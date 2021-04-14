import React from 'react';
import PropTypes from 'prop-types';
import './ViewAppointment.css';

const ViewAppointment = () => (
  <div className="ViewAppointment">

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">ID de rendez-vous</th>
          <th scope="col">A201LPSI</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Nom
               </th>
          <td>David</td>
        </tr>
        <tr>
          <th scope="row"> Heure</th>
          <td>14h00</td>
        </tr>
        <tr>
          <th scope="row">Date</th>
          <td>11/11/2018</td>
        </tr>
        <tr>
          <th scope="row">Docteur</th>
          <td>Dr Anderson</td>
        </tr>
        <tr>
          <th scope="row">Département</th>
          <td>Lorem Ipsum est simplement un faux texte de la norme de l'industrie</td>
        </tr>
      </tbody>
    </table>


  </div>
);

ViewAppointment.propTypes = {};

ViewAppointment.defaultProps = {};

export default ViewAppointment;

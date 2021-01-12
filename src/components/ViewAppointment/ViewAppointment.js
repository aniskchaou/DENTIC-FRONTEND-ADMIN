import React from 'react';
import PropTypes from 'prop-types';
import './ViewAppointment.css';

const ViewAppointment = () => (
  <div className="ViewAppointment">
    <div class="container">
      <div class="row ccc">
        <div class="sec-title colored text-center">
          <p class="h2"></p>
        </div>
        <div class="information">
          <div class="information-details">
            <ul>
              <li><font  ><font  >ID de rendez-vous: </font></font><span class="pull-right"><font  ><font  > A201LPSI</font></font></span></li>
              <li><font  ><font  >Nom complet : </font></font><span class="pull-right"><font  ><font  >David</font></font></span></li>
              <li><font  ><font  >Id du patient: </font></font><span class="pull-right"><font  ><font  >d123</font></font></span></li>
              <li><font  ><font  >Heure de rendez-vous: </font></font><span class="pull-right"><font  ><font  >08h40</font></font></span></li>
              <li><font  ><font  >Date : </font></font><span class="pull-right"><font  ><font  >30 juin 2020 </font></font></span></li>
              <li><font  ><font  >Docteur : </font></font><span class="pull-right"><font  ><font  >Dr Anderson</font></font></span></li>
              <li><font  ><font  >Département : </font></font><span class="pull-right"><font  ><font  > Lorem Ipsum est simplement un faux texte de la norme de l'industrie</font></font></span></li>
            </ul>
          </div>
        </div>
        <div class="mape pimg">
          <img src="https://soft23.bdtask.com/doctor-new/./assets/uploads/patient/portra.jpg" class=" img-responsive" />
        </div>
      </div>
    </div>
  </div>
);

ViewAppointment.propTypes = {};

ViewAppointment.defaultProps = {};

export default ViewAppointment;

import React from 'react';
import PropTypes from 'prop-types';
import './Consultation.css';

const Consultation = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Médicaments</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead class=" text-primary">
          <tr>
            <th>Nom </th>
            <th> Compagnie</th>
            <th> Groupe</th>
            <th>Description </th>
            <th>Actions</th></tr>
        </thead>
        <tbody>





        </tbody>
      </table>
      <button type="button" data-toggle="modal" data-target="#addMedicament" className="btn btn-success btn-sm">Ajouter</button>

      <div class="modal fade" id="addMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="viewMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
);

Consultation.propTypes = {};

Consultation.defaultProps = {};

export default Consultation;

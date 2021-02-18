import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Prescription.css';
import { Link } from "react-router-dom"
import AddPrescription from '../AddPrescription/AddPrescription';
import { LoadJS } from './../init';
import ViewPrescription from './../ViewPrescription/ViewPrescription';
import EditPrescription from './../EditPrescription/EditPrescription';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Prescription = () => {
  useEffect(() => {
    // Runs ONCE after initial rendering
    LoadJS()
  }, []);


  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Préscription</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>ID Patient </th>
              <th> Nom Patient</th>
              <th> Téléphone</th>
              <th>Sexe </th>
              <th>Actions</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                123423
                          </td>
              <td>
                Benoît Grandbois

                          </td>
              <td>
                03.39.93.54.49
                          </td>
              <td>
                Homme
              </td>
              <td><button type="button" data-toggle="modal" data-target="#viewPrescription" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
                <button type="button" data-toggle="modal" data-target="#editPrescription" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>
            </tr>

          </tbody>
        </table>
        <button data-toggle="modal" data-target="#addPrescription" type="button" className="btn btn-success btn-sm">Ajouter</button>

        <div class="modal fade" id="addPrescription" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddPrescription />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editPrescription" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditPrescription />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewPrescription" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewPrescription />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
};

Prescription.propTypes = {};

Prescription.defaultProps = {};

export default Prescription;

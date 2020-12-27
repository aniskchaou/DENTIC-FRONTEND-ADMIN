import React from 'react';
import PropTypes from 'prop-types';
import './Patient.css';
const deleteTask=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}
const Patient = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Patients</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead class=" text-primary">
          <th>ID Patient </th>
          <th> Nom Patient</th>
          <th> Téléphone</th>
          <th>Sexe </th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr>
            <td>
              123423
                          </td>
            <td>
              Anis KCHAOU
                          </td>
            <td>
              243423423
                          </td>
            <td>
              Homme
                          </td>
                          <td><button type="button" data-toggle="modal" data-target="#viewPatient" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editPatient"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>
          </tr>
          
        </tbody>
      </table>
      <button  type="button" data-toggle="modal" data-target="#addPatient" className="btn btn-success btn-sm">Ajouter</button>


      <div class="modal fade" id="addPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="viewPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>


      <div class="modal fade" id="editPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
);

Patient.propTypes = {};

Patient.defaultProps = {};

export default Patient;

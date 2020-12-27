import React from 'react';
import PropTypes from 'prop-types';
import './User.css';
const deleteTask=()=>{
    return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
 }
const User = () => (
  <div className="card">
  <div className="card-header">
      <strong className="card-title">Utilisateurs</strong>
  </div>
  <div className="card-body">
      <table id="bootstrap-data-table" className="table table-striped table-bordered">
          <thead>
              <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>Tiger Nixon</td>
                  <td>tiger@gmail.com</td>
                  <td>355355353</td>
                  <td><button type="button" data-toggle="modal" data-target="#viewTask" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editTask"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>
              </tr>
             
          </tbody>
      </table>
      <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
  </div>
</div>
);

User.propTypes = {};

User.defaultProps = {};

export default User;

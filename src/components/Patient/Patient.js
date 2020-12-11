import React from 'react';
import PropTypes from 'prop-types';
import './Patient.css';

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
                          <td><button disabled type="button" className="btn btn-primary btn-sm">voir</button>
              <button disabled type="button" className="btn btn-warning btn-sm">editer</button>
              <button disabled type="button" className="btn btn-danger btn-sm">Supprimer</button></td>
          </tr>
          
        </tbody>
      </table>
      <button  type="button" className="btn btn-success btn-sm">Ajouter</button>
    </div>
  </div>
);

Patient.propTypes = {};

Patient.defaultProps = {};

export default Patient;

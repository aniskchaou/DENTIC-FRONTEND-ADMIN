import React from 'react';
import PropTypes from 'prop-types';
import './Rendezvous.css';

const Rendezvous = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Rendez vous</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead class=" text-primary">
          <th>Nom </th>
          <th> Téléphone</th>
          <th> Date</th>
          <th>Heure </th>
          <th>SMS </th>
          <th>Statut </th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr>
            <td>
              KCHAOU Anis
                          </td>
            <td>
              342342334
                          </td>
            <td>
              12/11/2020
                          </td>
            <td>
              12:00
                          </td>
            <td>
              <button class="btn btn-primary">Envoyer un SMS</button>
            </td>
            <td>
              impayé
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

Rendezvous.propTypes = {};

Rendezvous.defaultProps = {};

export default Rendezvous;

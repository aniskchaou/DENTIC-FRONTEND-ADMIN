import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Medicament.css';
import { LoadJS } from './../init';
import ViewMedicament from './../ViewMedicament/ViewMedicament';
import EditMedicament from './../EditMedicament/EditMedicament';
import AddMedicament from './../AddMedicament/AddMedicament';
import HTTPService from '../../main/services/HTTPService';
import MedicamentTestService from '../../main/mocks/MedicamentTestService';
import medicamentMessage from '../../main/messages/medicamentMessage';
import useForceUpdate from 'use-force-update';
import showMessage from '../../libraries/messages/messages';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Medicament = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    LoadJS()
    retrieveMedicaments()
  }, []);


  const getAll = () => {
    HTTPService.getAll()
      .then(response => {
        setMedicaments(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeOne = (data) => {
    HTTPService.remove(data)
      .then(response => {

      })
      .catch(e => {

      });
  }



  const retrieveMedicaments = () => {
    var medicaments = MedicamentTestService.getAll();
    setMedicaments(medicaments);
  };

  const resfresh = () => {
    retrieveMedicaments()
    forceUpdate()
  }

  const remove = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', medicamentMessage.delete, 'success')
      MedicamentTestService.remove(data)
      //removeOne(data)
      resfresh()
    }

  }

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfresh()
  }


  return (
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

            {medicaments.map(item =>
              <tr>
                <td> {item.medicine_name}</td>
                <td>{item.company_name}</td>
                <td>{item.group_name}</td>
                <td>{item.description}</td>
                <td>
                  <button onClick={e => update(e, item)} type="button" data-toggle="modal" data-target="#editMedicament" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => remove(e, medicaments.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>

              </tr>
            )}


            <tr>
              <td> Euphytose</td>
              <td>Dakota Rice</td>
              <td>Niger</td>
              <td>Oud-Turnhout</td>
              <td>
                <button type="button" data-toggle="modal" data-target="#editMedicament" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>
            </tr>

          </tbody>
        </table>
        <button type="button" data-toggle="modal" data-target="#addMedicament" className="btn btn-success btn-sm">Ajouter</button>

        <div class="modal fade" id="addMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddMedicament />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
                <ViewMedicament />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button onClick={resfresh} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditMedicament medicament={updatedItem} />
              </div>
              <div class="modal-footer">
                <button onClick={resfresh} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Medicament.propTypes = {};

Medicament.defaultProps = {};

export default Medicament;

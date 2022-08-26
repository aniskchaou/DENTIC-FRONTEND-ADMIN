import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Medicament.css';
import { LoadJS, LoadJSFiles } from './../init';
import ViewMedicament from './../ViewMedicament/ViewMedicament';
import EditMedicament from './../EditMedicament/EditMedicament';
import AddMedicament from './../AddMedicament/AddMedicament';
import medicamentMessage from '../../main/messages/medicamentMessage';
import useForceUpdate from 'use-force-update';
import showMessage from '../../libraries/messages/messages';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Medicament = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllMedicament()
  }, []);


  const getAllMedicament = () => {
    setLoading(true);
    medicamentHTTPService.getAllMedicament()
      .then(response => {
        setMedicaments(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
  };


  const resfreshComponent = () => {
    getAllMedicament()
    // forceUpdate()
  }

  const removeMedicamentAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', medicamentMessage.delete, 'success')
      medicamentHTTPService.removeMedicament(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateMedicamentAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfreshComponent()
  }

  const closeModalEdit = (data) => {
    resfreshComponent()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    resfreshComponent()
    closeButtonAdd.current.click()
  }



  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Medecines</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addMedicament" className="btn btn-success btn-sm">Create</button>

        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>Name </th>
              <th> Producer</th>
              <th> Group</th>
              <th>Actions</th></tr>
          </thead>
          <tbody>

            {medicaments.map(item =>
              <tr>
                <td> {item.name}</td>
                <td>{item.producer}</td>
                <td>{item.group}</td>
                <td>
                  <button onClick={e => updateMedicamentAction(e, item)} type="button" data-toggle="modal" data-target="#editMedicament" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                  <button onClick={e => removeMedicamentAction(e, medicaments.indexOf(item))} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>

              </tr>
            )}



          </tbody>
        </table>

        <div class="modal fade" id="addMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button onClick={resfreshComponent} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddMedicament closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button onClick={resfreshComponent} ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">View</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewMedicament />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button onClick={resfreshComponent} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditMedicament medicament={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button onClick={resfreshComponent} ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

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

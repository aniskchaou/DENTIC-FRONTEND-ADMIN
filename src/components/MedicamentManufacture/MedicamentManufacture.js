import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './MedicamentManufacture.css';
import { LoadJSFiles } from '../init';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import useForceUpdate from 'use-force-update';
import AddMedicamentManufacture from '../AddMedicamentManufacture/AddMedicamentManufacture';
import EditMedicamentManufacture from '../EditMedicamentManufacture/EditMedicamentManufacture';


import { useForm } from 'react-hook-form';
const MedicamentManufacture = () => {

  const [medicamentManufactures, setMdicamentManufactures] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllIncomes()
  }, []);


  const getAllIncomes = () => {
    setLoading(true);
    medicamentManufactureHTTPService.getAllMedicamentManufacture()
      .then(response => {
        setMdicamentManufactures(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllIncomes()
    forceUpdate()
  }

  const removeMedicamentManufactureAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      medicamentManufactureHTTPService.removeMedicamentManufacture(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateMedicamentManufactureAction = (e, data) => {
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
        <strong className="card-title">Paiement</strong>
      </div>
      <div className="card-body">
        <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Create</button>

        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              medicamentManufactures.map(item =>
                <tr>
                  <td> {item.name}</td>
                  <td>

                    <button onClick={e => updateMedicamentManufactureAction(e, item)} type="button" data-toggle="modal" data-target="#editPatient" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removeMedicamentManufactureAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}

          </tbody>
        </table>

        <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddMedicamentManufacture closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditMedicamentManufacture medicamentManufacture={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

MedicamentManufacture.propTypes = {};

MedicamentManufacture.defaultProps = {};

export default MedicamentManufacture;

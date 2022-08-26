
import PropTypes from 'prop-types';
import './Rendezvous.css';
import { LoadJS, LoadJSFiles } from './../init';
import ViewAppointment from './../ViewAppointment/ViewAppointment';
import AddAppointment from '../AddAppointment/AddAppointment';
import EdiTAppointement from './../EditAppointment/EditAppointment'
import appointementHTTPService from '../../main/services/appointementHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from 'use-force-update';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';


const Rendezvous = () => {

  const [appointements, setAppointements] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    LoadJSFiles()
    getAllAppointements()
  }, []);


  const getAllAppointements = () => {
    // setLoading(true);
    appointementHTTPService.getAllAppointement()
      .then(response => {
        setAppointements(response.data);
        // setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllAppointements()
    forceUpdate()
  }

  const removeAppointementAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      appointementHTTPService.removeAppointement(data).then(data => {
        // resfreshComponent()
        getAllAppointements()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateAppointementAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //resfreshComponent()

  }

  const closeModalEdit = (data) => {
    closeButtonEdit.current.click()
    getAllAppointements()
  }

  const closeModalAdd = (data) => {
    //resfreshComponent()
    closeButtonAdd.current.click()
    getAllAppointements()
  }

  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Appointements</strong>
      </div>
      <div className="card-body">
        <button data-toggle="modal" data-target="#addRendezvous" type="button" className="btn btn-success btn-sm">Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>Patient Name</th>
              <th> Date</th>
              <th>Problem</th>
              <th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? "loading..." :
              appointements.map(item =>
                <tr>
                  <td> {item.patient}</td>
                  <td>{item.datee} </td>
                  <td>{item.problem} </td>
                  <td>
                    <button onClick={e => updateAppointementAction(e, item)} type="button" data-toggle="modal" data-target="#editRendezvous" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removeAppointementAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}
          </tbody>
        </table>


        <div class="modal fade" id="addRendezvous" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddAppointment closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonAdd} type="button" onClick={closeModalAdd} class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editRendezvous" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EdiTAppointement appointement={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} onClick={closeModalEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewRendezvous" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">View</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewAppointment />
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

Rendezvous.propTypes = {};

Rendezvous.defaultProps = {};

export default Rendezvous;

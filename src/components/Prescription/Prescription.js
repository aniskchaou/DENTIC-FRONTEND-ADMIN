import PropTypes from 'prop-types';
import './Prescription.css';
import { Link } from "react-router-dom"
import AddPrescription from '../AddPrescription/AddPrescription';
import { LoadJS, LoadJSFiles } from './../init';
import ViewPrescription from './../ViewPrescription/ViewPrescription';
import EditPrescription from './../EditPrescription/EditPrescription';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from 'use-force-update';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
ChartJS.register(ArcElement, Tooltip, Legend);
const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}


export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
const Prescription = () => {

  const [prescriptions, setPrescriptions] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllPrescriptions()
  }, []);


  const getAllPrescriptions = () => {
    setLoading(true);
    prescriptionHTTPService.getAllPrescription()
      .then(response => {
        setPrescriptions(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllPrescriptions()
    forceUpdate()
  }

  const removePrescriptionAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      prescriptionHTTPService.removePrescription(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePrescriptionAction = (e, data) => {
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
        <strong className="card-title">Préscription</strong>
      </div>
      <div className="card-body">

        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>patient</th>
              <th> datee</th>
              <th> medicament</th>
              <th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? "loading..." :
              prescriptions.map(item =>
                <tr>
                  <td> {item.patient}</td>
                  <td>{item.datee} </td>
                  <td>{item.medicament}</td>
                  <td>
                    <button type="button" data-toggle="modal" data-target="#viewPatient" class="btn btn-warning btn-sm"><i class="fas fa-eye"></i></button>
                    <button onClick={e => updatePrescriptionAction(e, item)} type="button" data-toggle="modal" data-target="#editPatient" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removePrescriptionAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}

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

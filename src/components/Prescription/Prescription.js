import PropTypes from 'prop-types';
import './Prescription.css';
import { Link } from "react-router-dom"
import AddPrescription from '../AddPrescription/AddPrescription';
import { LoadJS, LoadJSFiles } from './../init';
import ViewPrescription from './../ViewPrescription/ViewPrescription';
import EditPrescription from './../EditPrescription/EditPrescription';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from 'use-force-update';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import AddMedicamentItem from '../AddMedicamentItem/AddMedicamentItem';
import CurrentUser from '../../main/config/user';
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
  const [viewPrescription, setViewPrescription] = useState(false);

  useEffect(() => {
    // LoadJSFiles()
    getAllPrescriptions()
  }, []);


  const getAllPrescriptions = () => {
    setLoading(true);
    prescriptionHTTPService.getAllPrescription()
      .then(response => {
        setPrescriptions(response.data);
        console.log(response.data)
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
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
      showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success')
      prescriptionHTTPService.removePrescription(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
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

  const columns = [
    { field: 'id', headerName: '#', width: 200 },
    { field: 'patient', headerName: 'Patient', width: 200 },
    { field: 'createdAt', headerName: 'Issue Date', width: 200 },
    { field: 'pression', headerName: 'Pression', width: 200 },
    { field: 'problem', headerName: 'Medicament', width: 200 },
    { field: 'temperature', headerName: 'Temperature', width: 200 },
    { field: 'note', headerName: 'Note', width: 200 },
  ];


  const handleRowSelection = (e) => {

    if (e.length == 1) {
      setViewPrescription(true)
      setUpdatedItemId(e[0])
      const selectedItem = prescriptions.find(item => item.id == e[0])
      setUpdatedItem(selectedItem)
      console.log(updatedItem);
    } else if (e.length == 0) {
      setViewPrescription(false)
    }
    setUpdatedItemIds(e)

  }
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const removeAll = (e) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      /*   certificateHTTPService.removeAllCertificates().then(data => {
          getAllPatient()
        }) */
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        {
          showChart &&
          <div className="card">
            <div className="card-body">
              <h4>Chart</h4>
              <br />
              <Bar options={chartBarOption} data={data2} />
            </div>
          </div>
        }

        {showFilter &&
          <div className="row">
            <SummaryWidget />

            <SummaryWidget />

            <SummaryWidget />

            <SummaryWidget />
          </div>
        }
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i>   Prescriptions
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addPrescription" ><i class="fas fa-plus"></i> Create </Button>
        {viewPrescription &&
          <span>
            <Button onClick={e => updatePrescriptionAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#viewPrescription"><i class="fas fa-edit"></i> View</Button>
            <Button onClick={e => updatePrescriptionAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#addMedicamentItem" ><i class="fas fa-trash-alt"></i> Add Medicaments</Button>
          </span>}
        <Button onClick={e => removePrescriptionAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>


        <Button type="button" onClick={() => getAllPrescriptions()}><i class="fas fa-refresh"></i> Reload</Button>

        <br /><br />
        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={prescriptions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
          /></div>}

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
                <AddPrescription closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} class="btn btn-secondary" ref={closeButtonAdd} data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="addMedicamentItem" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Add Medicament Item</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddMedicamentItem updatedItem={updatedItem} />
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
                <ViewPrescription updatedItem={updatedItem} />
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


      </div>
    </div>
  )
};

Prescription.propTypes = {};

Prescription.defaultProps = {};

export default Prescription;

import React, { useEffect, useRef, useState } from 'react';
import './Patient.css';
import { LoadJSFiles } from './../init';
import AddPatient from './../AddPatient/AddPatient';
import ViewPatient from './../ViewPatient/ViewPatient';
import EditPatient from './../EditPatient/EditPatient';

import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import useForceUpdate from 'use-force-update';
import patientHTTPService from '../../main/services/patientHTTPService';

import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
import CurrentUser from '../../main/config/user';

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
  };




  const removePatientAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      patientHTTPService.removePatient(data).then(data => {
        resfreshComponent()
        showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success')
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
    }
  }

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //resfreshComponent()
  }

  const closeModalEdit = (data) => {
    //resfreshComponent()
    closeButtonEdit.current.click()
    getAllPatient()
  }

  const closeModalAdd = (data) => {
    //resfreshComponent()
    closeButtonAdd.current.click()
    getAllPatient()
  }
  const resfreshComponent = () => {
    getAllPatient()
    //forceUpdate()
  }

  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);

  const columns = [
    {
      field: 'id', headerName: '#', description: 'The identification used by the person with access to the online service.', width: 20
    },
    { field: 'namepatient', headerName: 'Full Name', width: 200 },
    { field: 'emailpatient', headerName: 'Email', width: 200 },
    { field: 'birth', headerName: 'Date of Birth', width: 200 },
    { field: 'telephone', headerName: 'Telephone', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = patients.find(item => item.id == e[0])
      setUpdatedItem(selectedItem)
      console.log(updatedItem);
    }
    setUpdatedItemIds(e)

  }

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
          <i className="menu-icon fa fa-bars"></i>   Patients
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addPatient" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updatePatientAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editPatient"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removePatientAction(e, updatedItemId)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => getAllPatient()}><i class="fas fa-refresh"></i> Reload</Button>

        <br /><br />

        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={patients}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar, showQuickFilter: true }}
          /></div>}



        <div class="modal fade" id="addPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfreshComponent} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddPatient closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button onClick={resfreshComponent} ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="viewPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ViewPatient />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

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
                <EditPatient patient={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
};

export default Patient;


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
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
import SummaryWidget from '../SummaryWidget/SummaryWidget';

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
    setLoading(true);
    appointementHTTPService.getAllAppointement()
      .then(response => {
        setAppointements(response.data);
        setLoading(false);
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

  const columns = [
    { field: 'id', headerName: '#', width: 200 },
    { field: 'patient', headerName: 'Patient', width: 200 },
    { field: 'datee', headerName: ' Date', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'telephone', headerName: 'Telephone', width: 200 },
    { field: 'message', headerName: 'Problem', width: 200 },
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = appointements.find(item => item.id == e[0])
      setUpdatedItem(selectedItem)
      console.log(updatedItem);
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
          <i className="menu-icon fa fa-bars"></i>   Appointements
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addRendezvous" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updateAppointementAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editRendezvous"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removeAppointementAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
        <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
        <Button type="button" onClick={() => getAllAppointements()}><i class="fas fa-refresh"></i> Reload</Button>
        <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
        <br /><br />
        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={appointements}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
          /></div>}


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

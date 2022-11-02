import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Services.css';
import AddService from '../AddService/AddService';
import EditService from '../EditService/EditService'
import { LoadJSFiles } from '../init';
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import serviceHTTPService from '../../main/services/serviceHTTPService';
import showMessage from '../../libraries/messages/messages';
const Services = () => {
  const [patients, setPatients] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});

  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    // setLoading(true);
    serviceHTTPService.getAllService()
      .then(response => {
        setPatients(response.data);
        // setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };




  const removePatientAction = (e, data) => {
    /*  e.preventDefault();
     var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
     if (r) {
       showMessage('Confirmation', patientMessage.delete, 'success')
       patientHTTPService.removePatient(data).then(data => {
         resfreshComponent()
       }).catch(e => {
         showMessage('Confirmation', e, 'warning')
       });
     } */
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

  const columns = [
    { field: 'id', headerName: '#', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'status', headerName: 'Description', width: 200 }]


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = patients.find(item => item.id == e[0])
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

        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i>   Services
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addPatient" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updatePatientAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editMedicament"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removePatientAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
        <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
        <Button type="button" onClick={() => getAllPatient()}><i class="fas fa-refresh"></i> Reload</Button>
        <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
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
            components={{ Toolbar: GridToolbar }}
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
                <AddService closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button onClick={resfreshComponent} ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

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
}

Services.propTypes = {};

Services.defaultProps = {};

export default Services;

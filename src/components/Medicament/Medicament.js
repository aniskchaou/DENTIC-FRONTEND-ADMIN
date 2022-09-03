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
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
import SummaryWidget from '../SummaryWidget/SummaryWidget';


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


      data.forEach(element => {
        medicamentHTTPService.removeMedicament(element).then(data => {
          resfreshComponent()
        }).catch(e => {
          showMessage('Confirmation', e, 'warning')
        });
      });
    }
  }

  const updateMedicamentAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(medicaments.filter(item => item.id === data)[0])
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
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'producer', headerName: 'Manufacture', width: 200 },
    { field: 'group', headerName: 'Category', width: 200 },
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])

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
          <i className="menu-icon fa fa-bars"></i>   Medecines
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addMedicament" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updateMedicamentAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editMedicament"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removeMedicamentAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
        <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
        <Button type="button" onClick={() => getAllMedicament()}><i class="fas fa-refresh"></i> Reload</Button>
        <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
        <br /><br />

        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={medicaments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
          /></div>}

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

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Certificates.css';
import AddAppointment from '../AddAppointment/AddAppointment';
import AddCertificate from '../AddCertificate/AddCertificate';
import EditCertificate from '../EditCertificate/EditCertificate';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import showMessage from '../../libraries/messages/messages';
import { LoadJSFiles } from './../init';
import ReactTooltip from 'react-tooltip';
import { chartBarOption, intialChartBarData } from '../../main/config/chart.bar';
import { Bar } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import SummaryWidget from "../../components/SummaryWidget/SummaryWidget";



const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
export const data2 = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 3, 4, 5, 11, 3, 2],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }

  ],
};
const Certificates = () => {

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([

  ]);

  const columns = [
    { field: 'id', headerName: '#', width: 200 },
    { field: 'template', headerName: 'Certificate Template', width: 200 },
    { field: 'patient', headerName: 'Patient Name', width: 200 },
    { field: 'date', headerName: 'Issue Date', width: 200 },
  ];
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    certificateHTTPService.getAllCertificate()
      .then(response => {
        setCertificates(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };

  const removeActivityAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      data.forEach(element => {
        certificateHTTPService.removeCertificate(element).then(data => {
          getAllPatient()
        }).catch(e => {
          showMessage('Confirmation', e, 'warning')
        });
      });

    }
  }

  const updateActivityAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)

  }

  const closeModalEdit = (data) => {
    getAllPatient()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    getAllPatient()
    closeButtonAdd.current.click()
  }


  const handleRowSelection = (e) => {
    if (e.length == 1) {
      console.log(e);
      setUpdatedItemId(e[0])
    } else {
      setUpdatedItemIds(e)
    }
  }

  const removeAll = (e) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      certificateHTTPService.removeAllCertificates().then(data => {
        getAllPatient()
      })
    }
  }



  return (
    <div className="Certificates">



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

      <div className="card">

        <div className="card-body">
          <Typography variant="h4" gutterBottom>
            <i className="menu-icon fa fa-bars"></i>   Certificates
          </Typography>
          <br />
          <Button type="button" data-toggle="modal" data-target="#addMedicament" ><i class="fas fa-plus"></i> Create </Button>
          <Button onClick={e => updateActivityAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#edit"><i class="fas fa-edit"></i> Edit</Button>
          <Button onClick={e => removeActivityAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
          <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
          <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
          <Button type="button" onClick={() => getAllPatient()}><i class="fas fa-refresh"></i> Reload</Button>
          <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
          <br /><br />
          {loading ?
            <LinearProgress />
            : <div style={{ height: 400, width: '100%' }}><DataGrid
              rows={certificates}
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
                  <h5 class="modal-title" id="exampleModalLongTitle">Create Certificate</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <AddCertificate closeModal={closeModalAdd} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Close</button>

                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Edit Certificate</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <EditCertificate closeModal={closeModalEdit} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Close</button>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div >
    </div >
  )
};

Certificates.propTypes = {};

Certificates.defaultProps = {};

export default Certificates;

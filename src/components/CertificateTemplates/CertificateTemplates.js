import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './CertificateTemplates.css';
import AddCertificateTemplate from '../AddCertificateTemplate/AddCertificateTemplate'
import EditCertificationTemplate from '../EditCertificateTemplate/EditCertificateTemplate'
import certificateTemplateValidation from '../../main/validations/certificationtemplateValidation';
import certificationtemplatetHTTPServiceCopy from '../../main/services/certificationtemplatetHTTPService copy';
import showMessage from '../../libraries/messages/messages';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
const CertificateTemplates = () => {

  const [certificateTemplate, setCertificateTemplate] = useState([]);
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    certificationtemplatetHTTPServiceCopy.getAllCertificationTemplate()
      .then(response => {
        console.log(response.data)
        setCertificateTemplate(response.data);
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

      certificationtemplatetHTTPServiceCopy.removeCertificationTemplate(data).then(data => {
        getAllPatient()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
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

  const columns = [
    { field: 'id', headerName: '#', width: 200 },
    { field: 'name', headerName: 'Certificate Template', width: 200 },
    { field: 'name', headerName: 'Certificate Template', width: 200 }

  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = certificateTemplate.find(item => item.id == e[0])
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
    <div className="CertificateTemplates">
      <div className="card">

        <div className="card-body">

          <Typography variant="h4" gutterBottom>
            <i className="menu-icon fa fa-bars"></i>   Certificate Templates
          </Typography>
          <br />
          <Button type="button" data-toggle="modal" data-target="#addMedicament" ><i class="fas fa-plus"></i> Create </Button>
          <Button onClick={e => updateActivityAction(e, updatedItem)} type="button" data-toggle="modal" data-target="#edit"><i class="fas fa-edit"></i> Edit</Button>
          <Button onClick={e => removeActivityAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
          <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
          <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
          <Button type="button" onClick={() => getAllPatient()}><i class="fas fa-refresh"></i> Reload</Button>
          <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
          <br /><br />

          {loading ?
            <LinearProgress />
            : <div style={{ height: 430, width: '100%' }}><DataGrid
              rows={certificateTemplate}
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
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <AddCertificateTemplate closeModal={closeModalAdd} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal">Close</button>

                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <EditCertificationTemplate closeModal={closeModalEdit} certificateTemplate={updatedItem} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
};

CertificateTemplates.propTypes = {};

CertificateTemplates.defaultProps = {};

export default CertificateTemplates;

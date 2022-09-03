import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Payment.css';
import { LoadJSFiles } from './../init';
import useForceUpdate from 'use-force-update';
import paymentHTTPService from '../../main/services/paymentHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import patientHTTPService from '../../main/services/patientHTTPService';
import AddPayment from '../AddPayment/AddPayment';
import EditPayment from '../EditPayment/EditPayment';
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllPayments()
  }, []);

  const getAllPayments = () => {
    setLoading(true);
    paymentHTTPService.getAllPayment()
      .then(response => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllPayments()
    // forceUpdate()
  }

  const removePaymentAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      paymentHTTPService.removePayment(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePaymentAction = (e, data) => {
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
    { field: 'invoiceNumber', headerName: 'Invoice Number', width: 200 },
    { field: 'paymentDate', headerName: 'Date', width: 200 },
    { field: 'paymenMode', headerName: 'Mode', width: 200 },
    { field: 'amountReceived', headerName: 'Received', width: 200 },
    { field: 'invoiceBlanceDue', headerName: 'Due', width: 200 },
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
          <i className="menu-icon fa fa-bars"></i>   Payments
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addPayment" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updatePaymentAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editMedicament"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removePaymentAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
        <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
        <Button type="button" onClick={() => getAllPayments()}><i class="fas fa-refresh"></i> Reload</Button>
        <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
        <br /><br />

        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={payments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
          /></div>}


        <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddPayment closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" ref={closeButtonAdd} data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditPayment closeModal={closeModalEdit} payment={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

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

Payment.propTypes = {};

Payment.defaultProps = {};

export default Payment;

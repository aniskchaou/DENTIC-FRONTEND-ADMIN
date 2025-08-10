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
import { Button, LinearProgress, Typography, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Box, Divider, Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { Bar } from 'react-chartjs-2';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import CurrentUser from '../../main/config/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BASE_URL from '../../main/urls/urls';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllPayments()
    // Fetch patients
    fetch(`${BASE_URL}/patients`)
      .then(res => res.json())
      .then(data => setPatients(data));
    // Fetch clinics
    fetch(`${BASE_URL}/clinics`)
      .then(res => res.json())
      .then(data => setClinics(data));
  }, []);

  const getAllPayments = () => {
    setLoading(true);
    paymentHTTPService.getAllPayment()
      .then(response => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
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
      showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success')
      paymentHTTPService.removePayment(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
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

  // Helper functions to get names
  const getPatientName = (id) => {
    const pat = patients.find(p => p.id === id);
    return pat ? pat.fullName : 'Patient not found';
  };
  const getClinicName = (id) => {
    const clinic = clinics.find(c => c.id === id);
    return clinic ? clinic.name : 'Clinic not found';
  };

  // Actions menu for each row
  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => { setAnchorEl(event.currentTarget); setSelectedRow(params.row); }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => {
          setViewItem(params.row);
          setViewOpen(true);
          setAnchorEl(null);
        }}>View</MenuItem>
        <MenuItem onClick={() => { updatePaymentAction({}, params.row); setAnchorEl(null); }}>Edit</MenuItem>
        <MenuItem onClick={() => { removePaymentAction({}, [params.row.id]); setAnchorEl(null); }}>Delete</MenuItem>
      </Menu>
    </div>
  );

  // Columns for Payment object (do not show id, createdAt, updatedAt)
  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient',
      width: 200,
      renderCell: (params) => (
        <Chip label={getPatientName(params.value)} color="primary" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'clinicId',
      headerName: 'Clinic',
      width: 200,
      renderCell: (params) => (
        <Chip label={getClinicName(params.value)} color="info" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="success" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} color="default" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color="info" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'paymentStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Paid'
              ? 'success'
              : params.value === 'Pending'
                ? 'warning'
                : 'default'
          }
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      width: 160,
      renderCell: (params) => (
        <Chip
          label={new Date(params.value).toLocaleString()}
          color="default"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: renderActionsMenu
    }
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = payments.find(item => item.id == e[0])
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
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          type="button"
          data-toggle="modal"
          data-target="#addPayment"
          startIcon={<i className="fas fa-plus"></i>}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => updatePaymentAction(e, updatedItem)}
          type="button"
          data-toggle="modal"
          data-target="#editPayment"
          startIcon={<i className="fas fa-edit"></i>}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => removePaymentAction(e, updatedItemIds)}
          type="button"
          startIcon={<i className="fas fa-trash-alt"></i>}
        >
          Remove
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
          type="button"
          onClick={() => getAllPayments()}
          startIcon={<i className="fas fa-refresh"></i>}
        >
          Reload
        </Button>
        <br /><br />

        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={payments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 15, 20]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
            autoHeight
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

        {/* Add this MUI Dialog for viewing payment details */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>View Payment</DialogTitle>
          <DialogContent>
            {viewItem ? (
              <Box sx={{
                bgcolor: '#fafdff',
                borderRadius: 2,
                boxShadow: 1,
                p: { xs: 2, sm: 3 },
                minWidth: 320,
                minHeight: 200,
                mb: 2
              }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={getPatientName(viewItem.patientId)} color="primary" icon={<i className="fas fa-user"></i>} sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={getClinicName(viewItem.clinicId)} color="info" icon={<i className="fas fa-hospital"></i>} sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Amount: ${viewItem.amount} ${viewItem.currency}`} color="success" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewItem.paymentMethod} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewItem.paymentStatus} color={viewItem.paymentStatus === 'Paid' ? 'success' : viewItem.paymentStatus === 'Pending' ? 'warning' : 'default'} sx={{ fontWeight: 600, fontSize: 15 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <b>Appointment ID:</b> {viewItem.appointmentId}<br />
                  <b>Invoice ID:</b> {viewItem.invoiceId}<br />
                  <b>Transaction ID:</b> {viewItem.transactionId}<br />
                  <b>Insurance Claim:</b> {viewItem.insuranceClaimId}<br />
                  <b>Payment Date:</b> {viewItem.paymentDate ? new Date(viewItem.paymentDate).toLocaleString() : '-'}<br />
                  <b>Notes:</b> {viewItem.notes}
                </Typography>
              </Box>
            ) : (
              <Typography>No payment selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
};

Payment.propTypes = {};

Payment.defaultProps = {};

export default Payment;

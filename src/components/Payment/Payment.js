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
// import EditPayment from '../EditPayment/EditPayment';
import { Button, LinearProgress, Typography, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Divider, Stack, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { chartBarOption } from '../../main/config/chart.bar';
import { Bar } from 'react-chartjs-2';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import CurrentUser from '../../main/config/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Payment = () => {
  const { t } = useTranslation();
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
  const [addOpen, setAddOpen] = useState(false);


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

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/payments.json')
        .then(res => res.json())
        .then(data => {
          setPayments(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    } else {
      paymentHTTPService.getAllPayment()
        .then(response => {
          setPayments(response.data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    }
  };


  const resfreshComponent = () => {
    getAllPayments()
    // forceUpdate()
  }

  const removePaymentAction = (e, data) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
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
    return pat ? pat.fullName : t('payment.patient_not_found');
  };
  const getClinicName = (id) => {
    const clinic = clinics.find(c => c.id === id);
    return clinic ? clinic.name : t('payment.clinic_not_found');
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
        }}>{t('payment.view')}</MenuItem>
        <MenuItem onClick={() => { removePaymentAction({}, [params.row.id]); setAnchorEl(null); }}>{t('payment.delete')}</MenuItem>
      </Menu>
    </div>
  );

  // Columns for Payment object
  const columns = [
    {
      field: 'patientId',
      headerName: t('payment.patient'),
      width: 200,
      renderCell: (params) => (
        getPatientName(params.value)
      )
    },
    {
      field: 'clinicId',
      headerName: t('payment.clinic'),
      width: 200,
      renderCell: (params) => (
        getClinicName(params.value)
      )
    },
    {
      field: 'amount',
      headerName: t('payment.amount'),
      width: 120,
      renderCell: (params) => (
        params.value
      )
    },
    {
      field: 'currency',
      headerName: t('payment.currency'),
      width: 100,
      renderCell: (params) => (
        params.value
      )
    },
    {
      field: 'paymentMethod',
      headerName: t('payment.payment_method'),
      width: 150,
      renderCell: (params) => (
        params.value
      )
    },
    {
      field: 'paymentStatus',
      headerName: t('payment.status'),
      width: 120,
      renderCell: (params) => (
        t(`payment.status_${params.value.toLowerCase()}`)
      )
    },
    {
      field: 'paymentDate',
      headerName: t('payment.payment_date'),
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
      headerName: t('payment.actions'),
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
          <i className="menu-icon fa fa-bars"></i> {t('payment.title')}
        </Typography>
        <br />
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          startIcon={<i className="fas fa-plus"></i>}
          onClick={() => setAddOpen(true)}
        >
          {t('payment.create')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => removePaymentAction(e, [updatedItem.id])}
          type="button"
          startIcon={<i className="fas fa-trash-alt"></i>}
        >
          {t('payment.delete')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
          type="button"
          onClick={() => getAllPayments()}
          startIcon={<i className="fas fa-refresh"></i>}
        >
          {t('payment.reload')}
        </Button>
        <br /><br />

        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}>
              <DataGrid
                rows={payments}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 15, 20]}
                checkboxSelection
                onSelectionModelChange={handleRowSelection}
                components={{ Toolbar: GridToolbar }}
                autoHeight
              />
            </div>
        }

        {/* Add Payment Modal */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('payment.add_new')}</DialogTitle>
          <DialogContent>
            <AddPayment closeModal={() => setAddOpen(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">
              {t('payment.close')}
            </Button>
          </DialogActions>
        </Dialog>

  {/* Edit Payment Modal removed */}

        {/* View Payment Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('payment.view')}</DialogTitle>
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
                  {getPatientName(viewItem.patientId)}<br/>
                  {getClinicName(viewItem.clinicId)}<br/>
                  {t('payment.amount')}: {viewItem.amount} {viewItem.currency}<br/>
                  {viewItem.paymentMethod}<br/>
                  {t(`payment.status_${viewItem.paymentStatus.toLowerCase()}`)}<br/>
                </Stack>
              </Box>
            ) : (
              <Typography>{t('payment.no_payment_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="outlined">
              {t('payment.close')}
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

import PropTypes from 'prop-types';
import './Expense.css';
import expenseHTTPService from '../../main/services/expenseHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import useForceUpdate from 'use-force-update';
import AddExpense from './AddExpense';
import EditExpense from '../EditExpense/EditExpense';
import { Typography, Button, LinearProgress, Menu, MenuItem, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CurrentUser from '../../main/config/user';
Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);



const Expense = () => {

  const [expenses, setExpenses] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [viewExpense, setViewExpense] = useState(null);
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);


  useEffect(() => {
    LoadJSFiles()
    getAllExpenses()
  }, []);


  const getAllExpenses = () => {
    setLoading(true);
    expenseHTTPService.getAllExpense()
      .then(response => {
        setExpenses(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
  };


  const resfreshComponent = () => {
    getAllExpenses()
    //   forceUpdate()
  }

  const removeExpenseAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success')
      expenseHTTPService.removeExpense(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
    }
  }

  const updateExpenseAction = (e, data) => {
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

  // Actions menu for each row
  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => { setAnchorEl(event.currentTarget); setSelectedRow(params.row); }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => {
          setViewExpense(params.row);
          setViewDialogOpen(true);
          setAnchorEl(null);
        }}>View</MenuItem>
        <MenuItem onClick={e => updateExpenseAction(e, params.row)}>Edit</MenuItem>
        <MenuItem onClick={e => removeExpenseAction(e, [params.row.id])}>Delete</MenuItem>
      </Menu>
    </div>
  );

  // Columns for Expense object (do not show id, createdAt, updatedAt)
  const columns = [
    {
      field: 'expenseCategory',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    { field: 'description', headerName: 'Description', width: 220 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="success" size="small" sx={{ fontWeight: 600 }} />
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
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: renderActionsMenu
    }
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = expenses.find(item => item.id == e[0])
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

  // Widget summary data
  const totalExpenses = expenses.length;
  const paidExpenses = expenses.filter(e => e.paymentStatus === 'Paid').length;
  const pendingExpenses = expenses.filter(e => e.paymentStatus === 'Pending').length;
  const categories = expenses.reduce((acc, e) => {
    acc[e.expenseCategory] = (acc[e.expenseCategory] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const doughnutData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Expenses per Category',
      data: Object.values(categories),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Paid',
        data: Object.keys(categories).map(cat => expenses.filter(e => e.expenseCategory === cat && e.paymentStatus === 'Paid').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(categories).map(cat => expenses.filter(e => e.expenseCategory === cat && e.paymentStatus === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  // Add this handler to refresh after adding
  const handleExpenseCreated = () => {
    setAddDialogOpen(false);
    getAllExpenses();
  };

  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i>   Expenses
        </Typography>
        <br />
        {/* Widgets row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
          <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="primary">Total Expenses</Typography>
            <Typography variant="h6">{totalExpenses}</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="success.main">Paid</Typography>
            <Typography variant="h6">{paidExpenses}</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="warning.main">Pending</Typography>
            <Typography variant="h6">{pendingExpenses}</Typography>
          </Box>
        </Box>

        {/* Charts row */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">Expenses by Category</Typography>
            <Doughnut data={doughnutData} />
          </Box>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">Expenses per Category</Typography>
            <Bar data={barData} />
          </Box>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">Status Trends by Category</Typography>
            <Line data={lineData} />
          </Box>
        </Box>

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
       
        {/* Material-UI Create Button */}
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={() => setAddDialogOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          Create Expense
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => updateExpenseAction(e, updatedItemId)}
          startIcon={<i className="fas fa-edit"></i>}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => removeExpenseAction(e, updatedItemIds)}
          startIcon={<i className="fas fa-trash-alt"></i>}
        >
          Remove
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
          onClick={() => getAllExpenses()}
          startIcon={<i className="fas fa-refresh"></i>}
        >
          Reload
        </Button>

        <br /><br />




        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={expenses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 15, 20]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
            autoHeight
          /></div>}

        {/* Material-UI Add Expense Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Expense</DialogTitle>
          <DialogContent>
            <AddExpense
              closeModal={() => setAddDialogOpen(false)}
              onCreate={handleExpenseCreated}
            />
          </DialogContent>
        </Dialog>

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
                <EditExpense expense={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        {/* Add this MUI Dialog for viewing expense details */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#e3f2fd', fontWeight: 700, fontSize: 22 }}>
            <i className="fas fa-file-invoice-dollar" style={{ color: '#1976d2', marginRight: 10 }} />
            Expense Details
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#fafdff' }}>
            {viewExpense ? (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {viewExpense.expenseCategory}
                  </Typography>
                  <Chip
                    label={viewExpense.paymentStatus}
                    color={
                      viewExpense.paymentStatus === 'Paid'
                        ? 'success'
                        : viewExpense.paymentStatus === 'Pending'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <b>Description:</b> {viewExpense.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Amount:</b> <span style={{ color: '#1976d2', fontWeight: 600 }}>{viewExpense.amount}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Payment Method:</b> {viewExpense.paymentMethod}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Vendor:</b> {viewExpense.vendorName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Invoice ID:</b> {viewExpense.invoiceId}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Clinic ID:</b> {viewExpense.clinicId}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Transaction Date:</b> {viewExpense.transactionDate ? new Date(viewExpense.transactionDate).toLocaleString() : '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Notes:</b> {viewExpense.notes || '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>Receipt:</b>{' '}
                    {viewExpense.receiptAttachments && viewExpense.receiptAttachments.length > 0 ? (
                      <a href={viewExpense.receiptAttachments[0]} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    ) : (
                      '-'
                    )}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ p: 2 }}>No expense selected.</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#fafdff' }}>
            <Button onClick={() => setViewDialogOpen(false)} color="primary" variant="outlined" sx={{ minWidth: 100 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>)
};

Expense.propTypes = {};

Expense.defaultProps = {};

export default Expense;

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import { useTranslation } from 'react-i18next';
Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);



const Expense = () => {
  const { t } = useTranslation();

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


  const handleExportPDF = async () => {
    const element = document.getElementById('expense-details-pdf');
    if (!element) return;
    // Hide export button before rendering
    const exportBtn = document.getElementById('expense-export-btn');
    if (exportBtn) exportBtn.style.display = 'none';
    // Use higher scale for better quality
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    if (exportBtn) exportBtn.style.display = '';
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    // Center image and fit to page
    const imgProps = pdf.getImageProperties(imgData);
    let imgWidth = pdfWidth;
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = (imgProps.width * imgHeight) / imgProps.height;
    }
    const x = (pdfWidth - imgWidth) / 2;
    const y = 20;
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('expense-details.pdf');
  };

  useEffect(() => {
    LoadJSFiles()
    getAllExpenses()
  }, []);


  const getAllExpenses = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/expenses.json')
        .then(res => res.json())
        .then(data => {
          setExpenses(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    } else {
      expenseHTTPService.getAllExpense()
        .then(response => {
          setExpenses(response.data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning')
        });
    }
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
        }}>{t('expense.view')}</MenuItem>
        <MenuItem onClick={e => removeExpenseAction(e, [params.row.id])}>{t('expense.delete')}</MenuItem>
      </Menu>
    </div>
  );

  // Columns for Expense object (do not show id, createdAt, updatedAt)
  const columns = [
    {
      field: 'expenseCategory',
      headerName: t('expense.category'),
      width: 150,
      // Removed Chip, now plain text
      renderCell: (params) => (
        <span style={{ fontWeight: 600 }}>{params.value}</span>
      )
    },
    { field: 'description', headerName: t('expense.description'), width: 220 },
    {
      field: 'amount',
      headerName: t('expense.amount'),
      width: 120,
      // Removed Chip, now plain text
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#43a047' }}>{params.value}</span>
      )
    },
    {
      field: 'paymentMethod',
      headerName: t('expense.payment_method'),
      width: 150,
      // Removed Chip, now plain text
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: '#1976d2' }}>{params.value}</span>
      )
    },
    {
      field: 'paymentStatus',
      headerName: t('expense.status'),
      width: 120,
      // Keep Chip for status only
      renderCell: (params) => (
        <Chip
          label={t(`expense.status_${params.value.toLowerCase()}`)}
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
      headerName: t('expense.actions'),
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
          <i className="menu-icon fa fa-bars"></i> {t('expense.title')}
        </Typography>
        <br />
        {/* Widgets row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
          <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="primary">{t('expense.total_expenses')}</Typography>
            <Typography variant="h6">{totalExpenses}</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="success.main">{t('expense.paid')}</Typography>
            <Typography variant="h6">{paidExpenses}</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="warning.main">{t('expense.pending')}</Typography>
            <Typography variant="h6">{pendingExpenses}</Typography>
          </Box>
        </Box>

        {/* Charts row */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">{t('expense.by_category')}</Typography>
            <Doughnut data={doughnutData} />
          </Box>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">{t('expense.per_category')}</Typography>
            <Bar data={barData} />
          </Box>
          <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" align="center">{t('expense.status_trends_by_category')}</Typography>
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
          {t('expense.create')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, mr: 1, fontWeight: 600 }}
          onClick={e => removeExpenseAction(e, updatedItemIds)}
          startIcon={<i className="fas fa-trash-alt"></i>}
        >
          {t('expense.remove')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
          onClick={() => getAllExpenses()}
          startIcon={<i className="fas fa-refresh"></i>}
        >
          {t('expense.reload')}
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
          <DialogTitle>{t('expense.create')}</DialogTitle>
          <DialogContent>
            <AddExpense
              closeModal={() => setAddDialogOpen(false)}
              onCreate={handleExpenseCreated}
            />
          </DialogContent>
        </Dialog>

        {/* Material-UI Edit Expense Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#e3f2fd', fontWeight: 700, fontSize: 22 }}>
            <i className="fas fa-file-invoice-dollar" style={{ color: '#1976d2', marginRight: 10 }} />
            {t('expense.details')}
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#fafdff' }}>
            {viewExpense ? (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {viewExpense.expenseCategory}
                  </Typography>
                  <Chip
                    label={t(`expense.status_${viewExpense.paymentStatus.toLowerCase()}`)}
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
                <Box sx={{ mb: 2 }} id="expense-details-pdf">
            <Button id="expense-export-btn" onClick={handleExportPDF} color="secondary" variant="contained" sx={{ minWidth: 100, mr: 2 }}>
              <i className="fas fa-file-pdf" style={{ marginRight: 8 }} />
              {t('expense.export_pdf')}
            </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <b>{t('expense.description')}:</b> {viewExpense.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>{t('expense.amount')}:</b> <span style={{ color: '#1976d2', fontWeight: 600 }}>{viewExpense.amount}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>{t('expense.payment_method')}:</b> {viewExpense.paymentMethod}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>{t('expense.vendor')}:</b> {viewExpense.vendorName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>{t('expense.transaction_date')}:</b> {viewExpense.transactionDate ? new Date(viewExpense.transactionDate).toLocaleString() : '-'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <b>{t('expense.notes')}:</b> {viewExpense.notes || '-'}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ p: 2 }}>{t('expense.no_expense_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#fafdff' }}>
            <Button onClick={() => setViewDialogOpen(false)} color="primary" variant="outlined" sx={{ minWidth: 100 }}>
              {t('expense.close')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>)
};

Expense.propTypes = {};

Expense.defaultProps = {};

export default Expense;

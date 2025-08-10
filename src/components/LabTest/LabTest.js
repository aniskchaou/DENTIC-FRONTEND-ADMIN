import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './LabTest.css';
import useForceUpdate from 'use-force-update';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import labTestHTTPService from '../../main/services/labTestHTTPService';


import testlabHTTPService from '../../main/services/testlabHTTPService';
import { Button, Chip, LinearProgress, Link, Typography, Menu, MenuItem, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';

import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import CurrentUser from '../../main/config/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddLabTest from './AddLabTest';
import EditLabTest from './EditLabTest';
import ViewLabTest from './ViewLabTest';
import jsPDF from 'jspdf';
import BASE_URL from '../../main/urls/urls';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const LabTest = () => {

  const [labTests, setLabTests] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedItem, setViewedItem] = useState(null);

  useEffect(() => {
    LoadJSFiles()
    getAllIncomes()
    // Fetch patients and doctors
    fetch(`${BASE_URL}/patients`)
      .then(res => res.json())
      .then(data => setPatients(data));
    fetch(`${BASE_URL}/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, []);


  const getAllIncomes = () => {
    setLoading(true);
    testlabHTTPService.getAllTestLab()
      .then(response => {
        setLabTests(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
  };


  const resfreshComponent = () => {
    getAllIncomes()
    //forceUpdate()
  }

  const removeLabTestAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      testlabHTTPService.removeTestLab(data).then(data => {
        getAllIncomes()
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
    }
  }

  const updateLabTestAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //  resfreshComponent()
  }

  const closeModalEdit = (data) => {
    //resfreshComponent()
    closeButtonEdit.current.click()
    getAllIncomes()
  }

  const closeModalAdd = (data) => {
    //resfreshComponent()
    closeButtonAdd.current.click()
    getAllIncomes()
  }

  // Helper functions to get full names
  const getPatientName = (id) => {
    const pat = patients.find(p => p.id === id);
    return pat ? pat.fullName : `ID: ${id}`;
  };
  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === id);
    return doc ? doc.fullName : `ID: ${id}`;
  };

  const renderActionsMenu = (params) => (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => handleMenuOpen(event, params.row)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>View</MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleMenuAction('download')}>Download</MenuItem>
        <MenuItem onClick={() => handleMenuAction('download-pdf')}>Download PDF</MenuItem>
        <MenuItem>
          <label style={{ cursor: 'pointer', margin: 0 }}>
            Upload Lab Report
            <input
              type="file"
              hidden
              onChange={handleUploadReport}
            />
          </label>
        </MenuItem>
      </Menu>
    </div>
  );

   const columns = [
    {
      field: 'patientId',
      headerName: 'Patient',
      width: 250,
      renderCell: (params) => (
        <span>{getPatientName(params.value)}</span>
      )
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      width: 250,
      renderCell: (params) => (
        <span>{getDoctorName(params.value)}</span>
      )
    },
    { field: 'testName', headerName: 'Test Name', width: 180 },
    {
      field: 'testCategory',
      headerName: 'Category',
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={
            value === 'Blood'
              ? 'primary'
              : value === 'Urine'
              ? 'success'
              : value === 'Radiology'
              ? 'info'
              : value === 'Biopsy'
              ? 'secondary'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      )
    },
    {
      field: 'sampleCollectionDate',
      headerName: 'Sample Date',
      width: 140,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'testStatus',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value || 'Unknown'}
          color={
            value === 'Completed'
              ? 'success'
              : value === 'Pending'
              ? 'warning'
              : value === 'In Progress'
              ? 'info'
              : value === 'Cancelled'
              ? 'error'
              : 'default'
          }
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: renderActionsMenu
    }
  ];

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuAction = (action) => {
    if (action === 'view') {
      setViewedItem(selectedRow);
      handleMenuClose();
      setViewModalOpen(true);
    }
    if (action === 'edit') {
      setUpdatedItem(selectedRow);
      handleMenuClose();
      setEditModalOpen(true);
    }
    if (action === 'delete') {
      // ...your delete logic...
      handleMenuClose();
    }
    if (action === 'download') {
      // Download lab test as JSON file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedRow, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `labtest_${selectedRow.id || 'data'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      handleMenuClose();
    }
    if (action === 'download-pdf') {
      // Download lab test as a nicely formatted PDF
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor('#1976d2');
      doc.text('Lab Test Report', 105, 18, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor('#333');
      let y = 32;

      // Add patient and doctor info at the top
      doc.setFont(undefined, 'bold');
      doc.text('Patient:', 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(getPatientName(selectedRow.patientId), 40, y);
      y += 8;
      doc.setFont(undefined, 'bold');
      doc.text('Doctor:', 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(getDoctorName(selectedRow.doctorId), 40, y);
      y += 10;

      // Draw a line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;

      // Add main test info as key-value pairs
      const fields = [
        { label: 'Test Name', value: selectedRow.testName },
        { label: 'Category', value: selectedRow.testCategory },
        { label: 'Sample Date', value: selectedRow.sampleCollectionDate ? new Date(selectedRow.sampleCollectionDate).toLocaleDateString() : '' },
        { label: 'Status', value: selectedRow.testStatus },
        { label: 'Result', value: selectedRow.result ? (typeof selectedRow.result === 'object' ? JSON.stringify(selectedRow.result, null, 2) : selectedRow.result) : '' },
        { label: 'Notes', value: selectedRow.notes || '' }
      ];

      fields.forEach(f => {
        if (f.value) {
          doc.setFont(undefined, 'bold');
          doc.text(`${f.label}:`, 14, y);
          doc.setFont(undefined, 'normal');
          // Handle long text wrapping
          const splitText = doc.splitTextToSize(String(f.value), 160);
          doc.text(splitText, 40, y);
          y += 8 + (splitText.length - 1) * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor('#888');
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 290);

      doc.save(`labtest_${selectedRow.id || 'data'}.pdf`);
      handleMenuClose();
    }
    handleMenuClose();
  };

  const handleRowSelection = (e) => {
    if (e.length === 1) {
      setUpdatedItemId(e[0]);
      const selectedItem = labTests.find(item => item.id === e[0]);
      setUpdatedItem(selectedItem);
      console.log(updatedItem);
    }
    setUpdatedItemIds(e);
  }
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const bulkDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected items?");
    if (confirmDelete) {
      console.log('Deleting selected items:', updatedItemIds);
      // Add logic to delete selected items
    }
  };

  const exportSelected = () => {
    console.log('Exporting selected items:', updatedItemIds);
    // Add logic to export selected items to CSV or Excel
  };

  const handleUploadReport = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      // Add logic to upload and analyze the report
    }
  };

  const analyzeRadiograph = (image) => {
    console.log('Analyzing radiograph:', image);
    // Placeholder for AI analysis logic
    // Call AI API or model to analyze the image
  };

  const matchDiagnosisCode = (description) => {
    console.log('Matching diagnosis code for:', description);
    // Placeholder for ICD10 integration logic
    // Call API or use dataset to find matching codes
  };

  // Example widget summary data
  const totalLabTests = labTests.length;
  const completedTests = labTests.filter(t => t.testStatus === 'Completed').length;
  const pendingTests = labTests.filter(t => t.testStatus === 'Pending').length;
  const categories = {};
  labTests.forEach(t => {
    categories[t.testCategory] = (categories[t.testCategory] || 0) + 1;
  });

  // Example chart data
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
      label: 'Tests per Category',
      data: Object.values(categories),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(categories).map(cat => labTests.filter(t => t.testCategory === cat && t.testStatus === 'Completed').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(categories).map(cat => labTests.filter(t => t.testCategory === cat && t.testStatus === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  return (
    <div className="card">
      {/* Page Title */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className="fas fa-vials" style={{ marginRight: 10 }} />
          Quick Test
        </Typography>
      </Box>
      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total Lab Tests</Typography>
          <Typography variant="h6">{totalLabTests}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Completed</Typography>
          <Typography variant="h6">{completedTests}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">Pending</Typography>
          <Typography variant="h6">{pendingTests}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Lab Tests by Category</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Tests per Category</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Status Trends by Category</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
            justifyContent: 'flex-start', // or 'center' to center the buttons
          }}
        >
          <Button
            type="button"
            data-toggle="modal"
            data-target="#addPayment"
            color="primary"
            variant="outlined"
            sx={{ minWidth: 150 }}
            startIcon={<i className="fas fa-plus"></i>}
          >
            Create Lab Test
          </Button>
          <Button
            onClick={e => updateLabTestAction(e, updatedItem)}
            type="button"
            data-toggle="modal"
            data-target="#edit"
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-edit"></i>}
          >
            Edit
          </Button>
          <Button
            onClick={e => removeLabTestAction(e, updatedItemId)}
            type="button"
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-trash-alt"></i>}
          >
            Remove
          </Button>
          <Button
            type="button"
            onClick={() => getAllIncomes()}
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-refresh"></i>}
          >
            Reload
          </Button>
          <Button
            onClick={bulkDelete}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 150 }}
          >
            Delete Selected
          </Button>
          <Button
            onClick={exportSelected}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 150 }}
          >
            Export Selected
          </Button>
        </Box>
        <br /><br />
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ width: '100%' }}>
            <DataGrid
              rows={labTests}
              columns={columns}
              pageSize={10} // Show 10 rows visible
              rowsPerPageOptions={[10, 15, 20]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
              autoHeight // Remove vertical scroll, fit to 10 rows
            />
          </div>
        )}

        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Edit Lab Test</DialogTitle>
          <DialogContent>
            <EditLabTest
              closeModal={() => setEditModalOpen(false)}
              testLab={updatedItem}
              patients={patients}
              doctors={doctors}
              // pass clinics, laboratories if needed
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        <ViewLabTest
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          testLab={viewedItem}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
        />

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
                <AddLabTest closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button onClick={closeModalAdd} ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
                <EditLabTest closeModal={closeButtonEdit} testLab={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonEdit} onClick={closeModalEdit} class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
      </div>
    </div>
  )
};

LabTest.propTypes = {};

LabTest.defaultProps = {};

export default LabTest;

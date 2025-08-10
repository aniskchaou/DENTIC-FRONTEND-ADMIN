// Enhanced Patient.js (with added features)
import React, { useEffect, useRef, useState } from 'react';
import './Patient.css';
import { LoadJSFiles } from './../init';
import AddPatient from './../AddPatient/AddPatient';
import ViewPatient from './ViewPatient';
import EditPatient from './../EditPatient/EditPatient';

import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import patientHTTPService from '../../main/services/patientHTTPService';

import { Button, LinearProgress, Typography, Menu, MenuItem, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import CurrentUser from '../../main/config/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    LoadJSFiles();
    getAllPatient();
  }, []);

  const getAllPatient = () => {
    setLoading(true);
    patientHTTPService.getAllPatients()
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
      });
  };

  const removePatientAction = (e, data) => {
    e?.preventDefault();
    if (window.confirm("Etes-vous sûr que vous voulez supprimer ?")) {
      patientHTTPService.removePatient(data)
        .then(() => {
          resfreshComponent();
          showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success');
        })
        .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
    }
  };

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data);
  };

  const closeModalEdit = () => {
    closeButtonEdit.current.click();
    getAllPatient();
  };

  const closeModalAdd = () => {
    closeButtonAdd.current.click();
    getAllPatient();
  };

  const resfreshComponent = () => {
    getAllPatient();
  };

  const exportPatientData = (patient) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patient, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `patient_${patient.userId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const printPatientData = (patient) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Patient</title></head><body>');
    printWindow.document.write(`<pre>${JSON.stringify(patient, null, 2)}</pre>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const sharePatientData = (patient) => {
    const text = JSON.stringify(patient, null, 2);
    if (navigator.share) {
      navigator.share({
        title: `Patient: ${patient.userId}`,
        text: text
      });
    } else {
      alert('Web Share API not supported in your browser');
    }
  };

  const duplicatePatient = (patient) => {
    const duplicated = { ...patient, id: Date.now() };
    patientHTTPService.createPatient(duplicated)
      .then(() => {
        showMessage('Duplicated', 'Patient duplicated successfully', 'success');
        getAllPatient();
      })
      .catch(() => showMessage('Error', 'Failed to duplicate', 'warning'));
  };

  const handleRowSelection = (e) => {
    if (e.length === 1) {
      setUpdatedItemId(e[0]);
      const selectedItem = patients.find(item => item.id === e[0]);
      setUpdatedItem(selectedItem);
    }
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'view':
        setUpdatedItem(selectedRow);
        setViewOpen(true);
        break;
      case 'edit':
        setUpdatedItem(selectedRow);
        setEditOpen(true);
        break;
      case 'delete':
        removePatientAction(null, selectedRow);
        break;
      case 'archive':
        break;
      case 'export':
        exportPatientData(selectedRow);
        break;
      case 'print':
        printPatientData(selectedRow);
        break;
      case 'share':
        sharePatientData(selectedRow);
        break;
      case 'duplicate':
        duplicatePatient(selectedRow);
        break;
      default:
        console.warn('Unknown action:', action);
    }
    handleMenuClose();
  };

  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleMenuAction('view')}>View</MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>Delete</MenuItem>
      </Menu>
    </div>
  );

  // Columns for Patient object (do not show id, userId, createdAt, updatedAt)
  const columns = [
    // { field: 'userId', headerName: 'User ID', width: 220 }, // deleted
    { field: 'fullName', headerName: 'Full Name', width: 220 },
    { field: 'medicalRecordNumber', headerName: 'Medical Record #', width: 180 },
    {
      field: 'bloodType',
      headerName: 'Blood Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'A+' || params.value === 'A-' ? 'primary'
            : params.value === 'B+' || params.value === 'B-' ? 'warning'
            : params.value === 'O+' || params.value === 'O-' ? 'success'
            : params.value === 'AB+' || params.value === 'AB-' ? 'error'
            : 'default'
          }
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'allergies',
      headerName: 'Allergies',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(params.value && params.value.length > 0)
            ? params.value.map((a, i) => (
                <Chip key={i} label={a} color="error" size="small" variant="outlined" sx={{ mb: 0.5 }} />
              ))
            : <Chip label="None" color="default" size="small" />}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: renderActionsMenu
    },
  ];

  const filteredPatients = patients.filter(patient =>
    Object.values(patient).some(value => value?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- Replace bloodTypes and chart data logic ---

  // Count all blood types including A+, A-, B+, B-, AB+, AB-, O+, O-
  const bloodTypes = patients.reduce((acc, p) => {
    acc[p.bloodType] = (acc[p.bloodType] || 0) + 1;
    return acc;
  }, {});

  const bloodTypeLabels = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const bloodTypeColors = ['#43a047', '#81c784', '#ffa000', '#ffe082', '#1976d2', '#90caf9', '#e53935', '#ef9a9a'];
  const bloodTypeCounts = bloodTypeLabels.map(type => bloodTypes[type] || 0);

  // Example widget summary data (replace with your actual logic)
  const totalPatients = patients.length;
  const typeCounts = {};
  bloodTypeLabels.forEach(type => { typeCounts[type] = bloodTypes[type] || 0; });

  // Example chart data (customize for your context)
  const doughnutData = {
    labels: bloodTypeLabels,
    datasets: [{
      data: bloodTypeCounts,
      backgroundColor: bloodTypeColors,
    }]
  };

  const barData = {
    labels: bloodTypeLabels,
    datasets: [{
      label: 'Blood Type Count',
      data: bloodTypeCounts,
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: bloodTypeLabels,
    datasets: [
      {
        label: 'Blood Type Trend',
        data: bloodTypeCounts,
        borderColor: '#43a047',
        fill: false,
      }
    ]
  };

  return (
    <div className="card">
      {/* Widgets row */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <i className="menu-icon fa fa-bars"></i> Patients
      </Typography>

      {/* Chips for Medical Record Number and Blood Type */}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total Patients</Typography>
          <Typography variant="h6">{totalPatients}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Type A</Typography>
          <Typography variant="h6">{typeCounts['A+'] + typeCounts['A-']}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">Type B</Typography>
          <Typography variant="h6">{typeCounts['B+'] + typeCounts['B-']}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Type O</Typography>
          <Typography variant="h6">{typeCounts['O+'] + typeCounts['O-']}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="error.main">Type AB</Typography>
          <Typography variant="h6">{typeCounts['AB+'] + typeCounts['AB-']}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Patients by Blood Type</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Blood Type Count</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Blood Type Trend</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        {showChart && (
          <div className="card">
            <div className="card-body">
              <h4>Chart</h4>
            </div>
          </div>
        )}

        {showFilter && (
          <div className="row">
            <SummaryWidget />
            <SummaryWidget />
            <SummaryWidget />
            <SummaryWidget />
          </div>
        )}

        

        <Button
          variant="outlined"
          color="primary"
          data-toggle="modal"
          data-target="#addPatient"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
          startIcon={<i className="fas fa-plus"></i>}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={e => updatePatientAction(e, updatedItemId)}
          data-toggle="modal"
          data-target="#editPatient"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
          startIcon={<i className="fas fa-edit"></i>}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={e => removePatientAction(e, updatedItemId)}
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
          startIcon={<i className="fas fa-trash-alt"></i>}
        >
          Remove
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={getAllPatient}
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
          startIcon={<i className="fas fa-refresh"></i>}
        >
          Reload
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => console.log('Search clicked')}
          sx={{ mb: 2, fontWeight: 600 }}
          startIcon={<i className="fas fa-search"></i>}
        >
          Search
        </Button>

        <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />

        {loading ? <LinearProgress /> : (
          <div style={{ width: '100%' }}>
            <DataGrid
              rows={filteredPatients}
              columns={columns}
              pageSize={10} // Show 10 rows visible
              rowsPerPageOptions={[10, 15, 20]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
              autoHeight // <-- Add this prop to remove vertical scroll and fit rows
            />
          </div>
        )}

        {/* Modals */}
        <div className="modal fade" id="addPatient">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Patient</h5>
                <button onClick={resfreshComponent} className="close" data-dismiss="modal">×</button>
              </div>
              <div className="modal-body">
                <AddPatient closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button ref={closeButtonAdd} className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="editPatient">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Patient</h5>
                <button className="close" data-dismiss="modal">×</button>
              </div>
              <div className="modal-body">
                <EditPatient patient={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div className="modal-footer">
                <button ref={closeButtonEdit} className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* View Patient Modal (for detailed view) */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogContent>
            <ViewPatient patient={updatedItem} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogContent>
            <EditPatient patient={updatedItem} closeModal={() => setEditOpen(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default Patient;
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, IconButton, Menu, MenuItem, Chip, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddTreatmentPlan from './AddTreatmentPlan'; // Make sure this path is correct
// import EditTreatmentPlan from './EditTreatmentPlan'; // Uncomment if you have this component

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const TreatmentPlans = () => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  // const [editOpen, setEditOpen] = useState(false); // Uncomment if you implement edit

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchTreatmentPlans = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/treatmentplans`)
      .then(res => setTreatmentPlans(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTreatmentPlans();
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data)).catch(() => setDoctors([]));
  }, []);

  const refresh = () => {
    fetchTreatmentPlans();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const plan = treatmentPlans.find(p => p.id === ids[0]);
      setSelectedPlan(plan);
      setSelectedPlanId(ids[0]);
    } else {
      setSelectedPlan(null);
      setSelectedPlanId(null);
    }
  };

  const handleDelete = () => {
    if (selectedPlanId && window.confirm('Are you sure you want to delete this treatment plan?')) {
      axios.delete(`${BASE_URL}/treatmentplans/${selectedPlanId}`)
        .then(() => refresh());
    }
  };

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  // Uncomment and implement if you have EditTreatmentPlan
  // const handleActionEdit = () => {
  //   setSelectedPlan(actionRow);
  //   setSelectedPlanId(actionRow.id);
  //   setEditOpen(true);
  //   handleActionClose();
  // };

  const handleActionDelete = () => {
    setSelectedPlan(actionRow);
    setSelectedPlanId(actionRow.id);
    handleDelete();
    handleActionClose();
  };

  // Helper functions to get names by id
  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === id);
    return patient ? (patient.fullName || patient.name || patient.id) : 'Unknown';
  };
  const getDoctorName = (id) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? (doctor.fullName || doctor.name || doctor.id) : 'Unknown';
  };

  // Widget summary data
  const totalPlans = treatmentPlans.length;
  const completedPlans = treatmentPlans.filter(p => p.status === 'Completed').length;
  const inProgressPlans = treatmentPlans.filter(p => p.status === 'In Progress').length;
  const pendingPlans = treatmentPlans.filter(p => p.status === 'Pending').length;

  // Group by treatment type (if available)
  const typeCounts = treatmentPlans.reduce((acc, p) => {
    const type = p.treatmentType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const doughnutData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      label: 'Plans per Treatment Type',
      data: Object.values(typeCounts),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'Completed').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'In Progress',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'In Progress').length),
        borderColor: '#1976d2',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient Name',
      width: 220,
      valueGetter: (params) => getPatientName(params.row.patientId),
    },
    {
      field: 'doctorId',
      headerName: 'Doctor Name',
      width: 220,
      valueGetter: (params) => getDoctorName(params.row.doctorId),
    },
    { field: 'estimatedDuration', headerName: 'Est. Duration (days)', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Completed'
              ? 'success'
              : params.value === 'In Progress'
              ? 'primary'
              : params.value === 'Pending'
              ? 'warning'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={e => handleActionClick(e, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-notes-medical"></i> Treatment Plans</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total Plans</Typography>
          <Typography variant="h6">{totalPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Completed</Typography>
          <Typography variant="h6">{completedPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">In Progress</Typography>
          <Typography variant="h6">{inProgressPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">Pending</Typography>
          <Typography variant="h6">{pendingPlans}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Plans by Treatment Type</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Plans per Treatment Type</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Status Trends by Type</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        {/* Material-UI Add Button */}
        <Button
          variant="outlined"
          color="success"
          sx={{ mb: 2, mr: 2 }}
          onClick={() => setAddOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          Add Treatment Plan
        </Button>

        {/* ...other buttons for edit/delete if needed... */}

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={treatmentPlans}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              {/* <MenuItem onClick={handleActionEdit}>Edit</MenuItem> */}
              <MenuItem onClick={handleActionDelete}>Delete</MenuItem>
            </Menu>
          </div>
        )}

        {/* Material-UI Add Treatment Plan Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Treatment Plan</DialogTitle>
          <DialogContent>
            <AddTreatmentPlan
              closeModal={() => setAddOpen(false)}
              onCreate={fetchTreatmentPlans}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default TreatmentPlans;

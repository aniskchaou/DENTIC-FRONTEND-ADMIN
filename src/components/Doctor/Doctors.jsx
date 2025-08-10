import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress, Rating, Typography, IconButton, Menu, MenuItem, Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddDoctor from './AddDoctor';
import EditDoctor from './EditDoctor';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/doctors`)
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleActionEdit = () => {
    setEditOpen(true);
    setSelectedDoctor(actionRow);
    handleActionClose();
  };

  const handleActionView = () => {
    setSelectedDoctor(actionRow); // <-- Make sure to set selectedDoctor!
    setViewOpen(true);
    setActionAnchorEl(null);
  };

  const handleActionDelete = () => {
    // Implement your delete logic here
    handleActionClose();
  };

  const columns = [
    { field: 'licenseNumber', headerName: 'License #', width: 150 },
    {
      field: 'specialization',
      headerName: 'Specialization',
      width: 180,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      ),
    },
    {
      field: 'experienceYears',
      headerName: 'Experience (years)',
      width: 160,
      type: 'number',
      renderCell: (params) => (
        <Chip label={`${params.value} yrs`} color="success" variant="outlined" />
      ),
    },
    {
      field: 'consultationFee',
      headerName: 'Fee ($)',
      width: 120,
      renderCell: (params) => (
        <Chip label={`$${parseFloat(params.value).toFixed(2)}`} color="info" variant="outlined" />
      ),
    },
    {
      field: 'availableDays',
      headerName: 'Available Days',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((day, idx) => (
            <Chip key={idx} label={day} color="default" size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      field: 'availableTimeSlots',
      headerName: 'Time Slots',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((slot, index) => (
            <Chip
              key={index}
              label={`${slot.startTime} - ${slot.endTime}`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={params.value} precision={0.1} readOnly />
          <Chip label={params.value} color="warning" variant="outlined" />
        </Box>
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

  // Widget summary data
  const totalDoctors = doctors.length;
  const specializations = doctors.reduce((acc, d) => {
    acc[d.specialization] = (acc[d.specialization] || 0) + 1;
    return acc;
  }, {});
  const avgRating = doctors.length ? (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(2) : 0;
  const avgExperience = doctors.length ? (doctors.reduce((sum, d) => sum + (d.experienceYears || 0), 0) / doctors.length).toFixed(1) : 0;

  // Chart data
  const doughnutData = {
    labels: Object.keys(specializations),
    datasets: [{
      data: Object.values(specializations),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(specializations),
    datasets: [{
      label: 'Doctors per Specialization',
      data: Object.values(specializations),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(specializations),
    datasets: [
      {
        label: 'Average Rating',
        data: Object.keys(specializations).map(spec =>
          doctors.filter(d => d.specialization === spec).reduce((sum, d) => sum + (d.rating || 0), 0) /
          (doctors.filter(d => d.specialization === spec).length || 1)
        ),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Average Experience',
        data: Object.keys(specializations).map(spec =>
          doctors.filter(d => d.specialization === spec).reduce((sum, d) => sum + (d.experienceYears || 0), 0) /
          (doctors.filter(d => d.specialization === spec).length || 1)
        ),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-user-md"></i> Doctors</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total Doctors</Typography>
          <Typography variant="h6">{totalDoctors}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Avg. Rating</Typography>
          <Typography variant="h6">{avgRating}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">Avg. Experience</Typography>
          <Typography variant="h6">{avgExperience} yrs</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Doctors by Specialization</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Doctors per Specialization</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Rating & Experience Trends</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
          onClick={() => setAddOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          Create Doctor
        </Button>
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={doctors}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
              rowHeight={110}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleActionView}>View</MenuItem>
              <MenuItem onClick={() => {
                setEditOpen(true);
                setSelectedDoctor(actionRow);
                handleActionClose();
              }}>
                Edit
              </MenuItem>
              <MenuItem onClick={handleActionDelete}>Delete</MenuItem>
            </Menu>
          </div>
        )}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Doctor</DialogTitle>
          <DialogContent>
            <AddDoctor
              closeModal={() => setAddOpen(false)}
              onCreate={() => {
                setAddOpen(false);
                setLoading(true);
                axios.get(`${BASE_URL}/doctors`)
                  .then((res) => setDoctors(res.data))
                  .finally(() => setLoading(false));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogContent>
            <EditDoctor
              doctor={selectedDoctor}
              closeModal={() => setEditOpen(false)}
              onEdit={() => {
                setEditOpen(false);
                setLoading(true);
                axios.get(`${BASE_URL}/doctors`)
                  .then((res) => setDoctors(res.data))
                  .finally(() => setLoading(false));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                <i className="fas fa-user-md" style={{ fontSize: 32, color: "#fff" }}></i>
              </Avatar>
              <Typography variant="h5" color="primary">
                {selectedDoctor?.fullName || "Doctor Details"}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedDoctor ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">General Info</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>License #:</b> {selectedDoctor.licenseNumber}</Typography>
                    <Typography><b>Specialization:</b> <Chip label={selectedDoctor.specialization} color="primary" /></Typography>
                    <Typography><b>Experience:</b> <Chip label={`${selectedDoctor.experienceYears} yrs`} color="success" /></Typography>
                    <Typography><b>Consultation Fee:</b> <Chip label={`$${selectedDoctor.consultationFee}`} color="info" /></Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">Availability</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>Available Days:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {(selectedDoctor.availableDays || []).map((day, idx) => (
                        <Chip key={idx} label={day} variant="outlined" />
                      ))}
                    </Box>
                    <Typography><b>Time Slots:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(selectedDoctor.availableTimeSlots || []).map((slot, idx) => (
                        <Chip key={idx} label={`${slot.startTime} - ${slot.endTime}`} color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">Rating</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={selectedDoctor.rating} precision={0.1} readOnly />
                      <Chip label={selectedDoctor.rating} color="warning" />
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <b>Created At:</b> {selectedDoctor.createdAt ? new Date(selectedDoctor.createdAt).toLocaleString() : '-'}<br />
                      <b>Updated At:</b> {selectedDoctor.updatedAt ? new Date(selectedDoctor.updatedAt).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Typography>No doctor selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Doctors;

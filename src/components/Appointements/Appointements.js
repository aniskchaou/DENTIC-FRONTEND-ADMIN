/**
 * Appointments Component
 * 
 * This component manages the appointments list and provides features such as:
 * - Viewing, editing, deleting, and archiving appointments.
 * - Searching and filtering appointments.
 * - Exporting appointments to a CSV file.
 * - Bulk actions like delete and archive.
 * - Dark mode toggle for better user experience.
 * - Dynamic menu actions for each appointment.
 * 
 * Props: None
 * State:
 * - appointmentsList: Array of appointments fetched from the server.
 * - updatedItem: The currently selected appointment for editing.
 * - loading: Boolean indicating whether data is being loaded.
 * - searchQuery: String for filtering appointments.
 * - isDarkMode: Boolean for toggling dark mode.
 * - anchorEl: DOM element for the menu anchor.
 * - selectedRow: The currently selected appointment row.
 * - updatedItemIds: Array of selected appointment IDs for bulk actions.
 * 
 * Functions:
 * - retrieveAppointments: Fetches the list of appointments from the server.
 * - handleSearch: Filters appointments based on the search query.
 * - handleExport: Exports the appointments list to a CSV file.
 * - handleBulkDelete: Deletes selected appointments.
 * - handleBulkArchive: Archives selected appointments.
 * - handleMenuAction: Handles actions like view, edit, delete, etc., from the menu.
 * - handleRowSelection: Tracks selected rows in the DataGrid.
 * 
 * Dependencies:
 * - Material-UI for UI components.
 * - Axios for HTTP requests.
 * - FileSaver for exporting CSV files.
 */

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Appointments.css';
import useForceUpdate from 'use-force-update';
import { TextField, Button, Switch, FormControlLabel, Select, MenuItem, FormControl, Chip, Card, CardContent, Typography, Grid, Paper, List, ListItem, ListItemText, Divider, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';
import { Menu, MenuItem as MuiMenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { saveAs } from 'file-saver';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import AddAppointment from './AddAppointment';
import EditAppointment from './EditAppointment';
import ViewAppointment from './ViewAppointment';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);



export const Appointments = () => {
  const [appointmentsList, setAppointments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const [loading, setLoading] = useState(false);
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);

  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedItem, setViewedItem] = useState(null);

  const retrieveAppointments = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/appointments`)
      .then(response => {
        setAppointments(response.data);
      })
      .finally(() => setLoading(false));
  };

  const resfresh = () => {
    retrieveAppointments();
    forceUpdate();
  };

  const closeModalEdit = () => {
    resfresh();
    closeButtonEdit.current.click();
  };

  const closeModalAdd = () => {
    resfresh();
    closeButtonAdd.current.click();
  };

  useEffect(() => {
    retrieveAppointments();
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data));
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data));
    axios.get(`${BASE_URL}/clinics`).then(res => setClinics(res.data));
  }, []);

  // Helper functions to get names
  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === id);
    return doc ? doc.fullName : 'Doctor not found';
  };
  const getPatientName = (id) => {
    const pat = patients.find(p => p.id === id);
    return pat ? pat.fullName : 'Patient not found';
  };
  const getClinicName = (id) => {
    const clinic = clinics.find(c => c.id === id);
    return clinic && clinic.name ? clinic.name : 'Clinic not found';
  };

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data);
    resfresh();
  };

  const remove = (e, id) => {
    e.preventDefault();
    if (window.confirm(CurrentUser.DELETE_MSG)) {
      axios.delete(`${BASE_URL}/events/${id}`).then(() => resfresh());
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

  // Update handleMenuAction to implement all features
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
      handleMenuClose();
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        axios.delete(`${BASE_URL}/appointments/${selectedRow.id}`)
          .then(() => {
            resfresh();
            alert('Appointment deleted.');
          })
          .catch(() => alert('Failed to delete appointment.'));
      }
    }
    if (action === 'archive') {
      handleMenuClose();
      axios.put(`${BASE_URL}/appointments/${selectedRow.id}/archive`)
        .then(() => {
          resfresh();
          alert('Appointment archived.');
        })
        .catch(() => alert('Failed to archive appointment.'));
    }
    if (action === 'reschedule') {
      handleMenuClose();
      setUpdatedItem(selectedRow);
      setEditModalOpen(true);
    }
    if (action === 'complete') {
      handleMenuClose();
      // Mark as Completed feature
      axios.put(`${BASE_URL}/appointments/${selectedRow.id}/completed`, { status: 'Completed' })
        .then(() => {
          resfresh();
          alert('Appointment marked as completed.');
        })
        .catch(() => alert('Failed to update status.'));
    }
    if (action === 'export') {
      handleMenuClose();
      handleExport();
    }
    if (action === 'sync') {
      handleMenuClose();
      syncWithGoogleCalendar();
    }
    if (action === 'reminder') {
      handleMenuClose();
      sendReminder(selectedRow.id, 'Email');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Patient ID', 'Doctor ID', 'Clinic Location', 'Date', 'Start Time', 'End Time', 'Status', 'Type', 'Reason', 'Notes'],
      ...appointmentsList.map(a => [
        a.id, a.patientId, a.doctorId, a.clinicLocationId, a.appointmentDate, a.startTime, a.endTime, a.status, a.appointmentType, a.reasonForVisit, a.notes
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'appointments.csv');
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete the selected appointments?')) {
      updatedItemIds.forEach(id => {
        axios.delete(`${BASE_URL}/appointments/${id}`)
          .then(() => resfresh())
          .catch(e => console.error(e));
      });
    }
  };

  const handleBulkArchive = () => {
    if (window.confirm('Are you sure you want to archive the selected appointments?')) {
      updatedItemIds.forEach(id => {
        console.log(`Archiving appointment with ID: ${id}`);
        // Add logic to archive appointments
      });
    }
  };

  const sendReminder = (id, type) => {
    axios.post(`${BASE_URL}/appointments/${id}/reminder`, { type }).then(() => {
      alert(`Reminder sent via ${type}`);
    });
  };

  const updateStatus = (id, status) => {
    axios.put(`${BASE_URL}/appointments/${id}/status`, { status }).then(() => resfresh());
  };

  const syncWithGoogleCalendar = () => {
    alert('Syncing with Google Calendar...');
    // Add logic to integrate with Google Calendar API
  };

  const checkAvailability = (doctorId, date, time) => {
    axios.post(`${BASE_URL}/availability`, { doctorId, date, time }).then((response) => {
      alert(response.data.available ? 'Time slot is available' : 'Time slot is not available');
    });
  };

  const predictNoShow = (appointmentId) => {
    axios.get(`${BASE_URL}/appointments/${appointmentId}/predict-no-show`).then((response) => {
      alert(`No-show probability: ${response.data.probability}%`);
    });
  };

  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient',
      width: 200,
      renderCell: (params) => (
        <span>{getPatientName(params.value)}</span>
      )
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      width: 200,
      renderCell: (params) => (
        <span>{getDoctorName(params.value)}</span>
      )
    },
    {
      field: 'clinicLocationId',
      headerName: 'Clinic',
      width: 200,
      renderCell: (params) => (
        <span>{getClinicName(params.value)}</span>
      )
    },
    {
      field: 'appointmentDate',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="info" variant="outlined" />
      )
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      )
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Completed'
              ? 'success'
              : params.value === 'Confirmed'
              ? 'primary'
              : params.value === 'Pending'
              ? 'warning'
              : params.value === 'No-show'
              ? 'error'
              : params.value === 'Archived'
              ? 'secondary'
              : 'default'
          }
          variant="filled"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => handleMenuOpen(event, params.row)}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MuiMenuItem onClick={() => handleMenuAction('view')}>View</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('delete')}>Delete</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('archive')}>Archive</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('reschedule')}>Reschedule</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('complete')}>Mark as Completed</MuiMenuItem>
          </Menu>
        </div>
      )
    },
  ];

  // Card view for appointments
  const renderCardView = () => (
    <Grid container spacing={2}>
      {appointmentsList.map((appt) => (
        <Grid item xs={12} sm={6} md={4} key={appt.id}>
          <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {getPatientName(appt.patientId)}
              </Typography>
              <Typography variant="body2">
                <strong>Doctor:</strong> {getDoctorName(appt.doctorId)}
              </Typography>
              <Typography variant="body2">
                <strong>Clinic:</strong> {getClinicName(appt.clinicLocationId)}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {appt.appointmentDate}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {appt.startTime} - {appt.endTime}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {appt.status}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {appt.appointmentType}
              </Typography>
              <Typography variant="body2">
                <strong>Reason:</strong> {appt.reasonForVisit}
              </Typography>
              <Typography variant="body2">
                <strong>Notes:</strong> {appt.notes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Calendar view for appointments
  const renderCalendarView = () => {
    // Group appointments by date
    const grouped = {};
    appointmentsList.forEach(appt => {
      if (!grouped[appt.appointmentDate]) grouped[appt.appointmentDate] = [];
      grouped[appt.appointmentDate].push(appt);
    });

    const dates = Object.keys(grouped).sort();

    return (
      <div style={{ marginTop: 24 }}>
        <Typography variant="h5" gutterBottom>Calendar View</Typography>
        <Grid container spacing={2}>
          {dates.map(date => (
            <Grid item xs={12} sm={6} md={4} key={date}>
              <Paper elevation={3} style={{ padding: 16 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {date}
                </Typography>
                {grouped[date].map(appt => (
                  <Card key={appt.id} variant="outlined" style={{ marginBottom: 8 }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Patient:</strong> {getPatientName(appt.patientId)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Doctor:</strong> {getDoctorName(appt.doctorId)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Time:</strong> {appt.startTime} - {appt.endTime}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {appt.status}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  // List view for appointments
  const renderListView = () => (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" gutterBottom>List View</Typography>
      <List>
        {appointmentsList.map((appt, idx) => (
          <React.Fragment key={appt.id}>
            <ListItem>
              <ListItemText
                primary={`${getPatientName(appt.patientId)} with ${getDoctorName(appt.doctorId)}`}
                secondary={
                  <>
                    <span><strong>Date:</strong> {appt.appointmentDate}</span><br />
                    <span><strong>Time:</strong> {appt.startTime} - {appt.endTime}</span><br />
                    <span><strong>Status:</strong> {appt.status}</span><br />
                    <span><strong>Clinic:</strong> {getClinicName(appt.clinicLocationId)}</span>
                  </>
                }
              />
            </ListItem>
            {idx < appointmentsList.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  // Timeline view for appointments (simple vertical timeline)
  const renderTimelineView = () => {
    // Create a copy before sorting to avoid mutating state
    const sortedAppointments = [...appointmentsList].sort(
      (a, b) =>
        new Date(a.appointmentDate + ' ' + a.startTime) -
        new Date(b.appointmentDate + ' ' + b.startTime)
    );

    return (
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>Timeline View</Typography>
        <div style={{ borderLeft: '2px solid #1976d2', paddingLeft: 24 }}>
          {sortedAppointments.map(appt => (
            <div key={appt.id} style={{ marginBottom: 32, position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: -32,
                top: 0,
                background: '#1976d2',
                color: '#fff',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}>
                {appt.appointmentDate.split('-')[2]}
              </div>
              <Typography variant="subtitle1" color="primary">
                {appt.appointmentDate} {appt.startTime} - {appt.endTime}
              </Typography>
              <Typography variant="body2">
                <strong>Patient:</strong> {getPatientName(appt.patientId)}<br />
                <strong>Doctor:</strong> {getDoctorName(appt.doctorId)}<br />
                <strong>Status:</strong> {appt.status}
              </Typography>
            </div>
          ))}
        </div>
      </Box>
    );
  };

  // Widget summary data
  const totalAppointments = appointmentsList.length;
  const completed = appointmentsList.filter(a => a.status === 'Completed').length;
  const pending = appointmentsList.filter(a => a.status === 'Pending').length;
  const confirmed = appointmentsList.filter(a => a.status === 'Confirmed').length;
  const noShow = appointmentsList.filter(a => a.status === 'No-show').length;

  // Prepare chart data
  const doughnutData = {
    labels: ['Completed', 'Pending', 'Confirmed', 'No-show'],
    datasets: [{
      data: [completed, pending, confirmed, noShow],
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935'],
    }]
  };

  const barData = {
    labels: Object.keys(
      appointmentsList.reduce((acc, appt) => {
        acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
        acc[appt.appointmentDate]++;
        return acc;
      }, {})
    ),
    datasets: [{
      label: 'Appointments per Day',
      data: Object.values(
        appointmentsList.reduce((acc, appt) => {
          acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
          acc[appt.appointmentDate]++;
          return acc;
        }, {})
      ),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(
      appointmentsList.reduce((acc, appt) => {
        acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
        acc[appt.appointmentDate]++;
        return acc;
      }, {})
    ),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(
          appointmentsList.reduce((acc, appt) => {
            acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
            return acc;
          }, {})
        ).map(date => appointmentsList.filter(a => a.appointmentDate === date && a.status === 'Completed').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(
          appointmentsList.reduce((acc, appt) => {
            acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
            return acc;
          }, {})
        ).map(date => appointmentsList.filter(a => a.appointmentDate === date && a.status === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      },
      {
        label: 'Confirmed',
        data: Object.keys(
          appointmentsList.reduce((acc, appt) => {
            acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
            return acc;
          }, {})
        ).map(date => appointmentsList.filter(a => a.appointmentDate === date && a.status === 'Confirmed').length),
        borderColor: '#1976d2',
        fill: false,
      },
      {
        label: 'No-show',
        data: Object.keys(
          appointmentsList.reduce((acc, appt) => {
            acc[appt.appointmentDate] = acc[appt.appointmentDate] || 0;
            return acc;
          }, {})
        ).map(date => appointmentsList.filter(a => a.appointmentDate === date && a.status === 'No-show').length),
        borderColor: '#e53935',
        fill: false,
      }
    ]
  };

  const filteredAppointments = appointmentsList.filter(appt => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    // You can add more fields as needed for filtering
    return (
      getPatientName(appt.patientId).toLowerCase().includes(q) ||
      getDoctorName(appt.doctorId).toLowerCase().includes(q) ||
      getClinicName(appt.clinicLocationId).toLowerCase().includes(q) ||
      (appt.appointmentType && appt.appointmentType.toLowerCase().includes(q)) ||
      (appt.reasonForVisit && appt.reasonForVisit.toLowerCase().includes(q)) ||
      (appt.status && appt.status.toLowerCase().includes(q)) ||
      (appt.appointmentDate && appt.appointmentDate.toLowerCase().includes(q)) ||
      (appt.startTime && appt.startTime.toLowerCase().includes(q)) ||
      (appt.endTime && appt.endTime.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card-header">
        <h4><i className="menu-icon fas fa-calendar-check"></i> Appointments</h4>
      </div>

      {/* Widget summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total</Typography>
          <Typography variant="h6">{totalAppointments}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Completed</Typography>
          <Typography variant="h6">{completed}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">Pending</Typography>
          <Typography variant="h6">{pending}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Confirmed</Typography>
          <Typography variant="h6">{confirmed}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="error.main">No-show</Typography>
          <Typography variant="h6">{noShow}</Typography>
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Appointments by Status</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Appointments per Day</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Status Trends Over Time</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-plus"></i>}
            data-toggle="modal"
            data-target="#addAppointment"
            style={{ minWidth: 150 }}
          >
            Add Appointment
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            color="primary"
            style={{ minWidth: 120 }}
          >
            Export
          </Button>
          <Button
            onClick={handleBulkArchive}
            variant="outlined"
            color="primary"
            style={{ minWidth: 160 }}
          >
            Archive Selected
          </Button>
          <Button
            onClick={resfresh}
            variant="outlined"
            color="primary"
            style={{ minWidth: 120 }}
            startIcon={<i className="fas fa-sync-alt"></i>}
          >
            Reload
          </Button>
        </Box>

        {/* View Mode Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('table')}
            size="small"
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('cards')}
            size="small"
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('calendar')}
            size="small"
          >
            Calendar View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('list')}
            size="small"
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('timeline')}
            size="small"
          >
            Timeline View
          </Button>
        </Box>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={handleSearch}
        />

        

        {loading ? <LinearProgress /> : (
          <div style={{ width: '100%' }}>
            {viewMode === 'table' ? (
              <DataGrid
                rows={filteredAppointments}
                getRowId={(row) => row.id}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 15, 20]}
                checkboxSelection
                autoHeight
                components={{ Toolbar: GridToolbar }}
              />
            ) : viewMode === 'cards' ? (
              renderCardView()
            ) : viewMode === 'calendar' ? (
              renderCalendarView()
            ) : viewMode === 'list' ? (
              renderListView()
            ) : (
              renderTimelineView()
            )}
          </div>
        )}

        {/* Add Appointment Modal */}
        <div className="modal fade" id="addAppointment" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Appointment</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
               <AddAppointment closeModal={closeModalAdd} doctors={doctors} patients={patients} clinics={clinics} onSuccess={resfresh} />
              </div>
              <div className="modal-footer">
                <button onClick={resfresh} ref={closeButtonAdd} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Appointment Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            <EditAppointment
              appointment={updatedItem}
              closeModal={() => setEditModalOpen(false)}
              doctors={doctors}
              patients={patients}
              clinics={clinics}
              onSuccess={() => {
                resfresh();
                setEditModalOpen(false);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* View Appointment Modal */}
        <ViewAppointment
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          appointment={viewedItem}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
          getClinicName={getClinicName}
        />

      </div>
    </div>
  );
};

export default Appointments;


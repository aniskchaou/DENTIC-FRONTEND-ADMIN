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
import { useTranslation } from 'react-i18next';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);



export const Appointments = () => {
  const { t } = useTranslation();
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
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [noShowPrediction, setNoShowPrediction] = useState(null);
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false);
  const [smartRoutingResult, setSmartRoutingResult] = useState(null);
  const [smartRoutingDialogOpen, setSmartRoutingDialogOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

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

  // Update columns with translation
  const columns = [
    {
      field: 'patientId',
      headerName: t('appointments.patient'),
      width: 200,
      renderCell: (params) => (
        <span>{getPatientName(params.value)}</span>
      )
    },
    {
      field: 'doctorId',
      headerName: t('appointments.doctor'),
      width: 200,
      renderCell: (params) => (
        <span>{getDoctorName(params.value)}</span>
      )
    },
    {
      field: 'clinicLocationId',
      headerName: t('appointments.clinic'),
      width: 200,
      renderCell: (params) => (
        <span>{getClinicName(params.value)}</span>
      )
    },
    {
      field: 'appointmentDate',
      headerName: t('appointments.date'),
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="info" variant="outlined" />
      )
    },
    {
      field: 'startTime',
      headerName: t('appointments.start_time'),
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      )
    },
    {
      field: 'endTime',
      headerName: t('appointments.end_time'),
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      )
    },
    {
      field: 'status',
      headerName: t('appointments.status'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={t(`appointments.${params.value.toLowerCase()}`)}
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
      headerName: t('appointments.actions'),
      width: 260,
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
            <MuiMenuItem onClick={() => handleMenuAction('view')}>{t('appointments.view')}</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('delete')}>{t('appointments.delete')}</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('archive')}>{t('appointments.archive')}</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('reschedule')}>{t('appointments.reschedule')}</MuiMenuItem>
            <MuiMenuItem onClick={() => handleMenuAction('complete')}>{t('appointments.mark_completed')}</MuiMenuItem>
            <MuiMenuItem
              onClick={() => {
                handleMenuClose();
                suggestOptimalSlot(selectedRow.patientId, selectedRow.doctorId);
              }}
            >
              {t('appointments.ai_suggest_slot')}
            </MuiMenuItem>
            <MuiMenuItem
              onClick={() => {
                handleMenuClose();
                predictNoShowAI(selectedRow.patientId);
              }}
            >
              {t('appointments.ai_no_show_prediction')}
            </MuiMenuItem>
            <MuiMenuItem
              onClick={() => {
                handleMenuClose();
                const specialtyNeeded = selectedRow.appointmentType || 'General';
                smartRoutingAI(selectedRow.patientId, specialtyNeeded);
              }}
            >
              {t('appointments.ai_doctor_assignment')}
            </MuiMenuItem>
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
                <strong>{t('appointments.doctor')}:</strong> {getDoctorName(appt.doctorId)}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.clinic')}:</strong> {getClinicName(appt.clinicLocationId)}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.date')}:</strong> {appt.appointmentDate}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.time')}:</strong> {appt.startTime} - {appt.endTime}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.status')}:</strong> {appt.status}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.type')}:</strong> {appt.appointmentType}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.reason')}:</strong> {appt.reasonForVisit}
              </Typography>
              <Typography variant="body2">
                <strong>{t('appointments.notes')}:</strong> {appt.notes}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                style={{ marginTop: 8 }}
                onClick={() => suggestOptimalSlot(appt.patientId, appt.doctorId)}
              >
                {t('appointments.ai_suggest_slot')}
              </Button>
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
        <Typography variant="h5" gutterBottom>{t('appointments.calendar_view')}</Typography>
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
      <Typography variant="h5" gutterBottom>{t('appointments.list_view')}</Typography>
      <List>
        {appointmentsList.map((appt, idx) => (
          <React.Fragment key={appt.id}>
            <ListItem>
              <ListItemText
                primary={`${getPatientName(appt.patientId)} with ${getDoctorName(appt.doctorId)}`}
                secondary={
                  <>
                    <span><strong>{t('appointments.date')}:</strong> {appt.appointmentDate}</span><br />
                    <span><strong>{t('appointments.time')}:</strong> {appt.startTime} - {appt.endTime}</span><br />
                    <span><strong>{t('appointments.status')}:</strong> {appt.status}</span><br />
                    <span><strong>{t('appointments.clinic')}:</strong> {getClinicName(appt.clinicLocationId)}</span>
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
        <Typography variant="h5" gutterBottom>{t('appointments.timeline_view')}</Typography>
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
    labels: [
      t('appointments.completed'),
      t('appointments.pending'),
      t('appointments.confirmed'),
      t('appointments.no_show')
    ],
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
      label: t('appointments.appointments_per_day'),
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
        label: t('appointments.completed'),
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
        label: t('appointments.pending'),
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
        label: t('appointments.confirmed'),
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
        label: t('appointments.no_show'),
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

  // Add AI Scheduling Assistant function
  const suggestOptimalSlot = async (patientId, doctorId) => {
    const doctorAppointments = appointmentsList.filter(a => a.doctorId === doctorId);
    const patientAppointments = appointmentsList.filter(a => a.patientId === patientId);

    const doctorAvailability = Array.from(
      new Set(
        doctorAppointments.map(a => `${a.appointmentDate} ${a.startTime}`)
      )
    );

    const preferredTimes = patientAppointments.map(a => `${a.appointmentDate} ${a.startTime}`);
    const lastVisit = patientAppointments.length > 0
      ? patientAppointments[patientAppointments.length - 1].appointmentDate
      : null;

    const payload = {
      patientId,
      doctorAvailability,
      patientHistory: {
        preferredTimes,
        lastVisit
      }
    };

    try {
      const aiRes = await axios.post(`${BASE_URL}/ai/scheduling-assistant`, payload);
      // Expecting response: { slots: [...] }
      if (aiRes.data && Array.isArray(aiRes.data.slots) && aiRes.data.slots.length > 0) {
        setAiSuggestion(aiRes.data.slots[0]);
      } else {
        setAiSuggestion(null);
      }
    } catch (e) {
      setAiSuggestion(null);
    }
    setAiDialogOpen(true);
  };

  // No-show Prediction AI function
  const predictNoShowAI = async (patientId) => {
    // Build appointmentHistory for this patient
    const appointmentHistory = appointmentsList
      .filter(a => a.patientId === patientId)
      .map(a => ({
        date: a.appointmentDate,
        status: a.status
      }));

    const payload = {
      patientId,
      appointmentHistory
    };

    try {
      const aiRes = await axios.post(`${BASE_URL}/ai/no-show-prediction`, payload);
      setNoShowPrediction(aiRes.data);
    } catch (e) {
      setNoShowPrediction(null);
    }
    setNoShowDialogOpen(true);
  };

  // Smart Routing AI function
  const smartRoutingAI = async (patientId, specialtyNeeded) => {
    // Build doctorList from loaded doctors
    const doctorList = doctors.map(doc => ({
      id: doc.id,
      name: doc.fullName,
      specialty: doc.specialty || 'General',
      available: true, // You can add logic to check availability
      workload: appointmentsList.filter(a => a.doctorId === doc.id && a.status !== 'Completed').length
    }));

    const payload = {
      patientId,
      specialtyNeeded,
      doctorList
    };

    try {
      const aiRes = await axios.post(`${BASE_URL}/ai/smart-routing`, payload);
      setSmartRoutingResult(aiRes.data);
    } catch (e) {
      setSmartRoutingResult(null);
    }
    setSmartRoutingDialogOpen(true);
  };

  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card-header">
        <h4>
          <i className="menu-icon fas fa-calendar-check"></i> {t('appointments.title')}
        </h4>
      </div>

      {/* Widget summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('appointments.total')}</Typography>
          <Typography variant="h6">{totalAppointments}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">{t('appointments.completed')}</Typography>
          <Typography variant="h6">{completed}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">{t('appointments.pending')}</Typography>
          <Typography variant="h6">{pending}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('appointments.confirmed')}</Typography>
          <Typography variant="h6">{confirmed}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="error.main">{t('appointments.no_show')}</Typography>
          <Typography variant="h6">{noShow}</Typography>
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('appointments.appointments_by_status')}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('appointments.appointments_per_day')}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('appointments.status_trends_over_time')}</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-plus"></i>}
            onClick={() => setAddModalOpen(true)}
            style={{ minWidth: 150 }}
          >
            {t('appointments.add_appointment')}
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            color="primary"
            style={{ minWidth: 120 }}
          >
            {t('appointments.export')}
          </Button>
          <Button
            onClick={handleBulkArchive}
            variant="outlined"
            color="primary"
            style={{ minWidth: 160 }}
          >
            {t('appointments.archive_selected')}
          </Button>
          <Button
            onClick={resfresh}
            variant="outlined"
            color="primary"
            style={{ minWidth: 120 }}
            startIcon={<i className="fas fa-sync-alt"></i>}
          >
            {t('appointments.reload')}
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
            {t('appointments.table_view')}
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('cards')}
            size="small"
          >
            {t('appointments.card_view')}
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('calendar')}
            size="small"
          >
            {t('appointments.calendar_view')}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('list')}
            size="small"
          >
            {t('appointments.list_view')}
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setViewMode('timeline')}
            size="small"
          >
            {t('appointments.timeline_view')}
          </Button>
        </Box>

        <TextField
          label={t('appointments.search')}
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
        <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            {t('appointments.new_appointment')}
            <IconButton
              aria-label="close"
              onClick={() => setAddModalOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <span aria-hidden="true">&times;</span>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <AddAppointment
              closeModal={() => setAddModalOpen(false)}
              doctors={doctors}
              patients={patients}
              clinics={clinics}
              onSuccess={() => {
                resfresh();
                setAddModalOpen(false);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddModalOpen(false)} color="secondary">
              {t('appointments.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Appointment Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{t('appointments.edit_appointment')}</DialogTitle>
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

        {/* AI Suggestion Dialog */}
        <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)}>
          <DialogTitle>{t('appointments.ai_suggest_slot')}</DialogTitle>
          <DialogContent>
            {aiSuggestion ? (
              <Typography>
                {t('appointments.suggested_optimal_slot')}: <strong>{aiSuggestion}</strong>
              </Typography>
            ) : (
              <Typography>{t('appointments.no_suggestion_available')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAiDialogOpen(false)} color="primary">{t('appointments.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* AI No-show Prediction Dialog */}
        <Dialog open={noShowDialogOpen} onClose={() => setNoShowDialogOpen(false)}>
          <DialogTitle>{t('appointments.ai_no_show_prediction')}</DialogTitle>
          <DialogContent>
            {noShowPrediction ? (
              <>
                <Typography>
                  {t('appointments.likely_to_no_show')}: <strong>{noShowPrediction.likelyToNoShow ? t('appointments.yes') : t('appointments.no')}</strong>
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  {noShowPrediction.reminderMessage}
                </Typography>
              </>
            ) : (
              <Typography>{t('appointments.no_prediction_available')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNoShowDialogOpen(false)} color="primary">{t('appointments.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* AI Smart Routing Dialog */}
        <Dialog open={smartRoutingDialogOpen} onClose={() => setSmartRoutingDialogOpen(false)}>
          <DialogTitle>{t('appointments.ai_doctor_assignment')}</DialogTitle>
          <DialogContent>
            {smartRoutingResult ? (
              <Typography>
                {t('appointments.assigned_doctor')}: <strong>{smartRoutingResult.doctorName}</strong> (ID: {smartRoutingResult.doctorId})
              </Typography>
            ) : (
              <Typography>{t('appointments.no_routing_suggestion_available')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSmartRoutingDialogOpen(false)} color="primary">{t('appointments.close')}</Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default Appointments;


import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Chip, CircularProgress, Alert,
  Button, Dialog, DialogContent, DialogActions, TextField,
  Stepper, Step, StepLabel, Avatar, Card, CardActionArea, Grid,
  IconButton, Divider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const STEP_LABELS = ['Choose Doctor', 'Date & Time', 'Details'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
});

const STATUS_META = {
  requested:  { color: '#1976d2', bg: '#e3f2fd', label: 'Requested' },
  scheduled:  { color: '#0288d1', bg: '#e1f5fe', label: 'Scheduled' },
  confirmed:  { color: '#388e3c', bg: '#e8f5e9', label: 'Confirmed' },
  completed:  { color: '#616161', bg: '#f5f5f5', label: 'Completed' },
  cancelled:  { color: '#d32f2f', bg: '#ffebee', label: 'Cancelled' },
  'no-show':  { color: '#f57c00', bg: '#fff3e0', label: 'No-Show'  },
};

const STATUS_COLORS = {
  requested: 'info', scheduled: 'primary', confirmed: 'success',
  cancelled: 'error', completed: 'default', 'no-show': 'warning',
};

function MonthCalendar({ year, month, selectedDate, bookedDates, onSelect }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(startDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <Box>
      <Grid container columns={7} sx={{ mb: 0.5 }}>
        {DOW.map(d => (
          <Grid item xs={1} key={d}>
            <Typography align="center" sx={{ fontSize: 11, fontWeight: 700, color: '#888', py: 0.5 }}>{d}</Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container columns={7}>
        {cells.map((d, i) => {
          if (!d) return <Grid item xs={1} key={`e${i}`} />;
          const date = new Date(year, month, d); date.setHours(0,0,0,0);
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isPast = date < today;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isSel = selectedDate === ds;
          const booked = bookedDates[ds] || 0;
          const avail = !isPast && !isWeekend;
          return (
            <Grid item xs={1} key={d}>
              <Box onClick={() => avail && onSelect(ds)} sx={{
                m: '2px', borderRadius: 2, py: 0.6, textAlign: 'center',
                cursor: avail ? 'pointer' : 'default',
                bgcolor: isSel ? '#1976d2' : avail ? '#e8f5e9' : 'transparent',
                border: isSel ? '2px solid #1565c0' : '2px solid transparent',
                opacity: isPast || isWeekend ? 0.3 : 1,
                transition: 'all 0.15s',
                '&:hover': avail ? { bgcolor: isSel ? '#1565c0' : '#c8e6c9' } : {},
              }}>
                <Typography sx={{ fontSize: 13, fontWeight: isSel ? 700 : 400, color: isSel ? '#fff' : '#222' }}>{d}</Typography>
                {avail && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: booked >= 8 ? '#ef9a9a' : '#66bb6a', mx: 'auto', mt: '1px' }} />}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function AppointmentCard({ a, onCancel }) {
  const meta = STATUS_META[a.status] || STATUS_META.requested;
  const dt   = a.startTime ? new Date(a.startTime) : null;
  return (
    <Paper elevation={0} sx={{
      border: '1px solid #e8edf2', borderRadius: 3, p: 2.5, mb: 2,
      borderLeft: `4px solid ${meta.color}`,
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarTodayIcon sx={{ color: meta.color, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography fontWeight={700} sx={{ fontSize: 15 }}>
              {dt ? dt.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dt ? `🕐 ${dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}` : ''}&nbsp;&nbsp;
              {a.appointmentType && `· ${a.appointmentType}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={meta.label} size="small" sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 700, border: `1px solid ${meta.color}30` }} />
          {['confirmed','requested','scheduled'].includes(a.status) && (
            <Button size="small" color="error" variant="outlined" startIcon={<CancelIcon/>} sx={{ borderRadius: 2, fontSize: 12 }}
              onClick={() => onCancel(a)}>Cancel</Button>
          )}
        </Box>
      </Box>
      {(a.doctorId || a.reason || a.notes) && (
        <Box sx={{ mt: 1.5, pl: 8, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {a.doctorId && <Typography variant="body2" color="text.secondary"><PersonIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }}/>Dr. {a.doctorId}</Typography>}
          {a.reason  && <Typography variant="body2" color="text.secondary">Reason: {a.reason}</Typography>}
          {a.notes   && <Typography variant="body2" color="text.secondary">Notes: {a.notes}</Typography>}
        </Box>
      )}
    </Paper>
  );
}

export default function PatientMyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [tab, setTab]           = useState(0);

  const [open, setOpen]                   = useState(false);
  const [step, setStep]                   = useState(0);
  const [doctors, setDoctors]             = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selDoc, setSelDoc]               = useState(null);
  const [calYear, setCalYear]             = useState(new Date().getFullYear());
  const [calMonth, setCalMonth]           = useState(new Date().getMonth());
  const [selDate, setSelDate]             = useState('');
  const [selSlot, setSelSlot]             = useState('');
  const [bookedDates, setBookedDates]     = useState({});
  const [bookedSlots, setBookedSlots]     = useState([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [form, setForm] = useState({ reason: '', notes: '', appointmentType: 'In-Person' });
  const [cancelOpen, setCancelOpen]   = useState(false);
  const [cancelAppt, setCancelAppt]   = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const patientId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.patientId || JSON.parse(localStorage.getItem('user'))?.id || ''; } catch { return ''; }
  })();

  const load = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const r = await axios.get(`${BASE_URL}/patient-portal/appointments/${patientId}`);
      const raw = r.data;
      setAppointments(Array.isArray(raw) ? raw : (raw?.value || raw?.appointments || []));
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!open) return;
    setLoadingDoctors(true);
    axios.get(`${BASE_URL}/doctors`)
      .then(r => setDoctors(Array.isArray(r.data) ? r.data : (r.data.doctors || [])))
      .catch(() => {}).finally(() => setLoadingDoctors(false));
  }, [open]);

  useEffect(() => {
    if (!selDoc) return;
    axios.get(`${BASE_URL}/appointments?doctorId=${selDoc.id}`)
      .then(r => {
        const appts = Array.isArray(r.data) ? r.data : (r.data.appointments || []);
        const counts = {};
        appts.forEach(a => { if (a.startTime) { const d = a.startTime.slice(0,10); counts[d] = (counts[d]||0)+1; } });
        setBookedDates(counts);
      }).catch(() => {});
  }, [selDoc]);

  useEffect(() => {
    if (!selDoc || !selDate) return;
    setLoadingSlots(true);
    axios.get(`${BASE_URL}/appointments?doctorId=${selDoc.id}`)
      .then(r => {
        const appts = Array.isArray(r.data) ? r.data : (r.data.appointments || []);
        setBookedSlots(appts.filter(a => a.startTime?.startsWith(selDate)).map(a => a.startTime.slice(11,16)));
      }).catch(() => {}).finally(() => setLoadingSlots(false));
  }, [selDate, selDoc]);

  const reset = () => { setStep(0); setSelDoc(null); setSelDate(''); setSelSlot(''); setBookedDates({}); setBookedSlots([]); setForm({ reason:'', notes:'', appointmentType:'In-Person' }); };
  const handleOpen  = () => { reset(); setOpen(true); };
  const handleClose = () => { setOpen(false); reset(); };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/patient-portal/appointments/request`, {
        patientId, doctorId: selDoc?.id,
        startTime: `${selDate}T${selSlot}:00`,
        reason: form.reason, notes: form.notes, appointmentType: form.appointmentType,
      });
      setSuccess(`Appointment with ${selDoc?.fullName} on ${selDate} at ${selSlot} requested!`);
      handleClose(); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const handleCancel = async () => {
    try {
      await axios.post(`${BASE_URL}/patient-portal/appointments/${cancelAppt.id}/cancel`, { reason: cancelReason });
      setSuccess('Appointment cancelled'); setCancelOpen(false); setCancelReason(''); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const now      = new Date();
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now && !['cancelled','completed'].includes(a.status));
  const past     = appointments.filter(a => new Date(a.startTime) < now  ||  ['completed','cancelled','no-show'].includes(a.status));
  const lists    = [upcoming, appointments, past];

  const prevMonth = () => { if (calMonth===0){setCalYear(y=>y-1);setCalMonth(11);}else setCalMonth(m=>m-1); };
  const nextMonth = () => { if (calMonth===11){setCalYear(y=>y+1);setCalMonth(0);}else setCalMonth(m=>m+1); };

  // ── STAT CARDS ─────────────────────────────────────────────────
  const stats = [
    { label: 'Upcoming',  value: upcoming.length,                                                          icon: <EventAvailableIcon/>, color: '#1976d2', bg: '#e3f2fd' },
    { label: 'Completed', value: appointments.filter(a=>a.status==='completed').length,                    icon: <CheckCircleIcon/>,    color: '#388e3c', bg: '#e8f5e9' },
    { label: 'Cancelled', value: appointments.filter(a=>a.status==='cancelled').length,                    icon: <CancelIcon/>,         color: '#d32f2f', bg: '#ffebee' },
    { label: 'Total',     value: appointments.length,                                                      icon: <HistoryIcon/>,        color: '#7b1fa2', bg: '#f3e5f5' },
  ];

  return (
    <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100%', p: { xs: 2, md: 3 } }}>

      {/* ── Page header ── */}
      <Box sx={{
        background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 55%, #42a5f5 100%)',
        borderRadius: 4, p: { xs: 3, md: 4 }, mb: 3,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: 0.3 }}>
            🗓 My Appointments
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
            View upcoming visits, request new appointments, and manage your schedule.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ bgcolor: '#fff', color: '#1565c0', fontWeight: 700, borderRadius: 3, px: 3, '&:hover': { bgcolor: '#e3f2fd' } }}
        >
          Request Appointment
        </Button>
      </Box>

      {/* ── Stats row ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ border: '1px solid #e8edf2', borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* ── Appointments list ── */}
      <Paper elevation={0} sx={{ border: '1px solid #e8edf2', borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          sx={{ px: 2, borderBottom: '1px solid #e8edf2', bgcolor: '#fff',
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: 14 },
            '& .Mui-selected': { color: '#1976d2' },
            '& .MuiTabs-indicator': { bgcolor: '#1976d2', height: 3, borderRadius: 2 },
          }}
        >
          <Tab label={`Upcoming  ${upcoming.length > 0 ? `(${upcoming.length})` : ''}`} />
          <Tab label={`All  (${appointments.length})`} />
          <Tab label={`Past  (${past.length})`} />
        </Tabs>

        <Box sx={{ p: 2, bgcolor: '#fafbfc', minHeight: 200 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress sx={{ color: '#1976d2' }} /></Box>
          ) : lists[tab].length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: '#bbb' }}>
              <CalendarTodayIcon sx={{ fontSize: 64, mb: 1.5, opacity: 0.4 }} />
              <Typography variant="h6" sx={{ color: '#aaa', fontWeight: 600 }}>No appointments yet</Typography>
              <Typography variant="body2" sx={{ color: '#bbb', mt: 0.5 }}>
                {tab === 0 ? 'Click "Request Appointment" to book your first visit.' : 'Nothing to show here.'}
              </Typography>
              {tab === 0 && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}
                  sx={{ mt: 3, borderRadius: 3, fontWeight: 700, px: 4 }}>
                  Request Appointment
                </Button>
              )}
            </Box>
          ) : (
            lists[tab].map(a => (
              <AppointmentCard key={a.id} a={a} onCancel={ap => { setCancelAppt(ap); setCancelOpen(true); }} />
            ))
          )}
        </Box>
      </Paper>

      {/* ── Booking Wizard Dialog ── */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        <Box sx={{ background: 'linear-gradient(100deg,#1565c0 0%,#1976d2 60%,#42a5f5 100%)', px: 3, pt: 3, pb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>📅 Request Appointment</Typography>
            <IconButton size="small" onClick={handleClose} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>&times;</span>
            </IconButton>
          </Box>
          <Stepper activeStep={step} alternativeLabel sx={{
            '& .MuiStepLabel-label':           { color: 'rgba(255,255,255,0.55)', fontSize: 12, mt: '4px' },
            '& .MuiStepLabel-label.Mui-active':    { color: '#fff', fontWeight: 700 },
            '& .MuiStepLabel-label.Mui-completed': { color: 'rgba(255,255,255,0.85)' },
            '& .MuiStepIcon-root':              { color: 'rgba(255,255,255,0.2)' },
            '& .MuiStepIcon-root.Mui-active':   { color: '#fff' },
            '& .MuiStepIcon-root.Mui-completed':{ color: '#81c784' },
            '& .MuiStepIcon-text':              { fill: '#1565c0' },
            '& .MuiStepConnector-line':         { borderColor: 'rgba(255,255,255,0.2)' },
          }}>
            {STEP_LABELS.map(l => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 3, minHeight: 380 }}>
          {step === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#1976d2' }}>👨‍⚕️ Select your doctor</Typography>
              {loadingDoctors ? <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box> : (
                <Grid container spacing={2}>
                  {doctors.map(doc => (
                    <Grid item xs={12} sm={6} md={4} key={doc.id}>
                      <Card variant={selDoc?.id === doc.id ? 'elevation' : 'outlined'} elevation={selDoc?.id === doc.id ? 6 : 0}
                        sx={{ cursor: 'pointer', borderRadius: 3, transition: 'all 0.2s', border: selDoc?.id === doc.id ? '2px solid #1976d2' : '1px solid #e0e0e0', bgcolor: selDoc?.id === doc.id ? '#e3f2fd' : '#fff', '&:hover': { borderColor: '#1976d2', bgcolor: '#f0f7ff' } }}
                        onClick={() => setSelDoc(doc)}>
                        <CardActionArea sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Avatar src={doc.img || `https://randomuser.me/api/portraits/med/men/${doc.id % 50}.jpg`}
                            sx={{ width: 64, height: 64, mb: 1.5, border: selDoc?.id === doc.id ? '3px solid #1976d2' : '3px solid #e0e0e0' }}>{doc.fullName?.[0]}</Avatar>
                          <Typography fontWeight={700} align="center" gutterBottom>{doc.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary" align="center">{doc.specialization || '—'}</Typography>
                          {selDoc?.id === doc.id && <CheckCircleIcon sx={{ color: '#1976d2', mt: 1 }} />}
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                  {doctors.length === 0 && <Grid item xs={12}><Alert severity="info">No doctors found. Please contact the clinic.</Alert></Grid>}
                </Grid>
              )}
            </Box>
          )}

          {step === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Box sx={{ bgcolor: '#fafafa', borderRadius: 3, p: 2, border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <IconButton size="small" onClick={prevMonth}><ChevronLeftIcon /></IconButton>
                    <Typography fontWeight={700}>{MONTH_NAMES[calMonth]} {calYear}</Typography>
                    <IconButton size="small" onClick={nextMonth}><ChevronRightIcon /></IconButton>
                  </Box>
                  <MonthCalendar year={calYear} month={calMonth} selectedDate={selDate} bookedDates={bookedDates} onSelect={d => { setSelDate(d); setSelSlot(''); }} />
                  <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                    {[['#66bb6a','Available'],['#ef9a9a','Mostly booked'],['#1976d2','Selected']].map(([c,l]) => (
                      <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c }} />
                        <Typography variant="caption">{l}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography fontWeight={600} sx={{ mb: 1.5, color: '#1976d2' }}>
                  <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                  {selDate ? `Slots — ${selDate}` : 'Pick a date first'}
                </Typography>
                {!selDate ? (
                  <Box sx={{ textAlign: 'center', py: 5, color: '#ccc' }}>
                    <CalendarTodayIcon sx={{ fontSize: 52 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>Select a day on the calendar</Typography>
                  </Box>
                ) : loadingSlots ? <CircularProgress size={26} /> : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, maxHeight: 300, overflowY: 'auto', pr: 0.5 }}>
                    {TIME_SLOTS.map(slot => {
                      const booked = bookedSlots.includes(slot);
                      const sel = selSlot === slot;
                      return (
                        <Box key={slot} onClick={() => !booked && setSelSlot(slot)} sx={{
                          py: 1, borderRadius: 2, textAlign: 'center', fontSize: 13, fontWeight: sel ? 700 : 400,
                          cursor: booked ? 'not-allowed' : 'pointer',
                          bgcolor: sel ? '#1976d2' : booked ? '#f5f5f5' : '#e8f5e9',
                          color: sel ? '#fff' : booked ? '#ccc' : '#2e7d32',
                          border: sel ? '2px solid #1565c0' : '1px solid transparent',
                          textDecoration: booked ? 'line-through' : 'none',
                          transition: 'all 0.12s',
                          '&:hover': !booked ? { bgcolor: sel ? '#1565c0' : '#c8e6c9' } : {},
                        }}>{slot}</Box>
                      );
                    })}
                  </Box>
                )}
                {selDate && selSlot && (
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                    ✅ <strong>{selDate}</strong> at <strong>{selSlot}</strong>
                  </Alert>
                )}
              </Grid>
            </Grid>
          )}

          {step === 2 && (
            <Box>
              <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 3, p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar src={selDoc?.img} sx={{ width: 56, height: 56 }}>{selDoc?.fullName?.[0]}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{selDoc?.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">{selDoc?.specialization}</Typography>
                  <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mt: 0.5 }}>
                    📅 {selDate} &nbsp;🕐 {selSlot}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Appointment Type" select SelectProps={{ native: true }} fullWidth value={form.appointmentType} onChange={e => setForm(p => ({ ...p, appointmentType: e.target.value }))}>
                    <option value="In-Person">🏥 In-Person</option>
                    <option value="Telemedicine">💻 Telemedicine</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Reason for Visit *" fullWidth required value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. Routine checkup, tooth pain…" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Additional Notes" fullWidth multiline rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Allergies, previous treatments, or anything the doctor should know…" />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose} color="inherit" sx={{ color: '#888' }}>Cancel</Button>
            {step > 0 && <Button onClick={() => setStep(s => s - 1)} variant="outlined">← Back</Button>}
          </Box>
          <Box>
            {step < 2 && (
              <Button variant="contained" onClick={() => setStep(s => s + 1)}
                disabled={step === 0 ? !selDoc : (!selDate || !selSlot)}
                sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}>Next →</Button>
            )}
            {step === 2 && (
              <Button variant="contained" onClick={handleSubmit} disabled={!form.reason}
                sx={{ px: 4, borderRadius: 2, fontWeight: 700, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, color: '#fff' }}>
                ✓ Submit Request
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} maxWidth="xs" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Cancel Appointment</Typography>
          <TextField size="small" fullWidth label="Reason for cancellation" value={cancelReason}
            onChange={e => setCancelReason(e.target.value)} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCancelOpen(false)}>Keep It</Button>
            <Button variant="contained" color="error" onClick={handleCancel}>Confirm Cancel</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

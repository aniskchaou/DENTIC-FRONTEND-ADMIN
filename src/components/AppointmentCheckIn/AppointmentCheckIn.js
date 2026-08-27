import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead,
  TableRow, TableContainer, Button, Chip, IconButton, Tooltip,
  TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Alert, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  getTodayBoard, confirmAppointment, checkInAppointment,
  checkOutAppointment, cancelAppointment, assignDoctor, assignRoom
} from '../../main/services/receptionistHTTPService';

const STATUS_COLORS = {
  Pending: 'warning', Confirmed: 'info', 'Checked-In': 'success',
  'Checked-Out': 'default', Cancelled: 'error', Completed: 'success', 'No-show': 'error'
};

export default function AppointmentCheckIn() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelDialog, setCancelDialog] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [assignDialog, setAssignDialog] = useState(null);
  const [assignMode, setAssignMode] = useState('doctor'); // 'doctor' | 'room'
  const [assignValue, setAssignValue] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await getTodayBoard();
      const raw = r.data;
      setAppts(Array.isArray(raw) ? raw : (raw?.value || raw?.appointments || []));
    }
    catch { setError('Failed to load today\'s appointments'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (fn, successMsg) => {
    try { await fn(); setSuccess(successMsg); load(); }
    catch (e) { setError(e?.response?.data?.error || 'Action failed'); }
  };

  const handleCancel = async () => {
    await act(() => cancelAppointment(cancelDialog, cancelReason), 'Appointment cancelled');
    setCancelDialog(null); setCancelReason('');
  };

  const handleAssign = async () => {
    if (assignMode === 'doctor') await act(() => assignDoctor(assignDialog, assignValue), 'Doctor assigned');
    else await act(() => assignRoom(assignDialog, assignValue), 'Room assigned');
    setAssignDialog(null); setAssignValue('');
  };

  const filtered = appts.filter(a =>
    !search ||
    String(a.patientId).includes(search) ||
    (a.appointmentType || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.status || '').toLowerCase().includes(search.toLowerCase())
  );

  // Status stats
  const stats = appts.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Check-In Board — {new Date().toLocaleDateString()}</Typography>
        <Button startIcon={<RefreshIcon />} onClick={load} variant="outlined" size="small">Refresh</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Status summary */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {Object.entries(stats).map(([s, count]) => (
          <Chip key={s} label={`${s}: ${count}`} color={STATUS_COLORS[s] || 'default'} variant="outlined" />
        ))}
        <Chip label={`Total: ${appts.length}`} variant="filled" />
      </Box>

      <TextField size="small" placeholder="Search patient / type / status…" value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, width: 300 }} />

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Room</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{a.startTime}</TableCell>
                  <TableCell>{a.patientId}</TableCell>
                  <TableCell>{a.doctorId}</TableCell>
                  <TableCell>{a.appointmentType}</TableCell>
                  <TableCell>
                    <Chip label={a.status} size="small" color={STATUS_COLORS[a.status] || 'default'} />
                  </TableCell>
                  <TableCell>{a.assignedRoomId || a.roomNumber || '—'}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Confirm">
                      <span><IconButton size="small" color="info" onClick={() => act(() => confirmAppointment(a.id), 'Confirmed')} disabled={a.status === 'Confirmed' || a.status === 'Checked-In' || a.status === 'Cancelled'}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                    <Tooltip title="Check In">
                      <span><IconButton size="small" color="success" onClick={() => act(() => checkInAppointment(a.id), 'Checked in')} disabled={!!a.checkedInAt || a.status === 'Cancelled'}>
                        <LoginIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                    <Tooltip title="Check Out">
                      <span><IconButton size="small" onClick={() => act(() => checkOutAppointment(a.id), 'Checked out')} disabled={!a.checkedInAt || !!a.checkedOutAt}>
                        <LogoutIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                    <Tooltip title="Assign Doctor">
                      <span><IconButton size="small" onClick={() => { setAssignDialog(a.id); setAssignMode('doctor'); }}>
                        <PersonIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                    <Tooltip title="Assign Room">
                      <span><IconButton size="small" onClick={() => { setAssignDialog(a.id); setAssignMode('room'); }}>
                        <MeetingRoomIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <span><IconButton size="small" color="error" onClick={() => { setCancelDialog(a.id); setCancelReason(''); }} disabled={a.status === 'Cancelled' || a.status === 'Checked-Out'}>
                        <CancelIcon fontSize="small" />
                      </IconButton></span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length && <TableRow><TableCell colSpan={7} align="center">No appointments today</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Cancel dialog */}
      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Cancellation reason (optional)" value={cancelReason}
            onChange={e => setCancelReason(e.target.value)} multiline rows={2} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(null)}>Back</Button>
          <Button variant="contained" color="error" onClick={handleCancel}>Cancel Appointment</Button>
        </DialogActions>
      </Dialog>

      {/* Assign dialog */}
      <Dialog open={!!assignDialog} onClose={() => setAssignDialog(null)}>
        <DialogTitle>Assign {assignMode === 'doctor' ? 'Doctor' : 'Room'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth size="small" sx={{ mt: 1 }}
            label={assignMode === 'doctor' ? 'Doctor ID' : 'Room ID or Number'}
            value={assignValue} onChange={e => setAssignValue(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={!assignValue}>Assign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Switch, FormControlLabel,
  Button, Divider, Alert, Snackbar,
} from '@mui/material';
import { getAppointmentRules, saveAppointmentRules } from '../../main/services/clinicOwnerHTTPService';

export default function AppointmentRules() {
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const [form, setForm] = useState({
    clinicId,
    minNoticeHours: 24,
    maxAdvanceDays: 90,
    slotDurationMinutes: 30,
    bufferMinutes: 10,
    maxPerDay: '',
    allowDoubleBooking: false,
    autoConfirm: false,
    requireDeposit: false,
    depositAmount: 0,
    cancellationWindowHours: 24,
    lateCancellationFee: 0,
    noShowFee: 0,
    maxCancellationsPerPatient: '',
    sendReminder24h: true,
    sendReminder1h: true,
  });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    if (!clinicId) return;
    getAppointmentRules(clinicId)
      .then(r => setForm(f => ({ ...f, ...r.data })))
      .catch(() => {});
  }, [clinicId]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      await saveAppointmentRules({ ...form, clinicId });
      setSnack({ open: true, msg: 'Rules saved', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.error || 'Error', severity: 'error' });
    }
  };

  const num = (k, label, min = 0) => (
    <TextField
      label={label} type="number" size="small" fullWidth
      value={form[k]} onChange={e => f(k, e.target.value)}
      inputProps={{ min }}
    />
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>Appointment & Cancellation Rules</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Booking Rules</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>{num('minNoticeHours', 'Minimum notice (hours)', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('maxAdvanceDays', 'Max advance booking (days)', 1)}</Grid>
          <Grid item xs={12} sm={6}>{num('slotDurationMinutes', 'Slot duration (minutes)', 5)}</Grid>
          <Grid item xs={12} sm={6}>{num('bufferMinutes', 'Buffer between appointments (min)', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('maxPerDay', 'Max appointments per day (blank = unlimited)', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('depositAmount', 'Deposit amount', 0)}</Grid>
          <Grid item xs={6} sm={3}>
            <FormControlLabel control={<Switch checked={!!form.allowDoubleBooking} onChange={e => f('allowDoubleBooking', e.target.checked)} />} label="Allow double booking" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControlLabel control={<Switch checked={!!form.autoConfirm} onChange={e => f('autoConfirm', e.target.checked)} />} label="Auto-confirm" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControlLabel control={<Switch checked={!!form.requireDeposit} onChange={e => f('requireDeposit', e.target.checked)} />} label="Require deposit" />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Cancellation Rules</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>{num('cancellationWindowHours', 'Free cancellation window (hours)', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('lateCancellationFee', 'Late cancellation fee', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('noShowFee', 'No-show fee', 0)}</Grid>
          <Grid item xs={12} sm={6}>{num('maxCancellationsPerPatient', 'Max cancellations per patient (blank = unlimited)', 0)}</Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Reminders</Typography>
        <Box display="flex" gap={3}>
          <FormControlLabel control={<Switch checked={!!form.sendReminder24h} onChange={e => f('sendReminder24h', e.target.checked)} />} label="Send 24h reminder" />
          <FormControlLabel control={<Switch checked={!!form.sendReminder1h} onChange={e => f('sendReminder1h', e.target.checked)} />} label="Send 1h reminder" />
        </Box>
      </Paper>

      <Button variant="contained" size="large" onClick={handleSave}>Save Rules</Button>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

import React, { useState } from 'react';
import {
  Box, Button, Grid, TextField, MenuItem, Typography, Paper,
  Tab, Tabs, Alert, CircularProgress, Divider, Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  sendSMS, sendEmail, sendAppointmentReminder, sendConfirmation, sendRecall, sendPaymentReminder
} from '../../main/services/receptionistHTTPService';

const tabs = [
  { label: 'SMS', icon: <SmsIcon /> },
  { label: 'Email', icon: <EmailIcon /> },
  { label: 'Appt Reminder', icon: <NotificationsIcon /> },
  { label: 'Confirmation', icon: <NotificationsIcon /> },
  { label: 'Recall', icon: <NotificationsIcon /> },
  { label: 'Payment Reminder', icon: <PaymentIcon /> },
];

export default function CommunicationCenter() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sentLog, setSentLog] = useState([]);

  // Per-tab form state
  const [smsForm, setSmsForm] = useState({ to: '', message: '' });
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
  const [reminderForm, setReminderForm] = useState({ patientName: '', patientPhone: '', patientEmail: '', appointmentDate: '', startTime: '', doctorName: '', channel: 'sms' });
  const [confirmForm, setConfirmForm] = useState({ patientName: '', patientPhone: '', patientEmail: '', appointmentDate: '', startTime: '', channel: 'sms' });
  const [recallForm, setRecallForm] = useState({ patientName: '', patientPhone: '', patientEmail: '', lastVisit: '', channel: 'sms' });
  const [paymentForm, setPaymentForm] = useState({ patientName: '', patientPhone: '', patientEmail: '', amount: '', dueDate: '', invoiceId: '', channel: 'email' });

  const send = async (fn) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const r = await fn();
      const msg = r.data.message || 'Sent successfully';
      setSuccess(`Sent ✓ ${r.data.channel ? `via ${r.data.channel.toUpperCase()}` : ''}`);
      setSentLog(prev => [{ tab: tabs[tab].label, message: msg, sentAt: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
    } catch (e) { setError(e?.response?.data?.error || 'Send failed'); }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Communication Center</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
              {tabs.map((t, i) => <Tab key={i} icon={t.icon} label={t.label} iconPosition="start" sx={{ fontSize: 12 }} />)}
            </Tabs>
            <Box p={2}>
              {/* SMS */}
              {tab === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth size="small" label="To (phone number)" value={smsForm.to} onChange={e => setSmsForm({ ...smsForm, to: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Message" value={smsForm.message} onChange={e => setSmsForm({ ...smsForm, message: e.target.value })} inputProps={{ maxLength: 160 }} helperText={`${smsForm.message.length}/160`} /></Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !smsForm.to || !smsForm.message} onClick={() => send(() => sendSMS(smsForm))}>{loading ? <CircularProgress size={20} /> : 'Send SMS'}</Button></Grid>
                </Grid>
              )}

              {/* Email */}
              {tab === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth size="small" label="To (email address)" value={emailForm.to} onChange={e => setEmailForm({ ...emailForm, to: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Subject" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth multiline rows={6} label="Body" value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} /></Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !emailForm.to || !emailForm.subject} onClick={() => send(() => sendEmail(emailForm))}>{loading ? <CircularProgress size={20} /> : 'Send Email'}</Button></Grid>
                </Grid>
              )}

              {/* Appointment Reminder */}
              {tab === 2 && (
                <Grid container spacing={2}>
                  {[['patientName', 'Patient Name'], ['patientPhone', 'Phone'], ['patientEmail', 'Email'], ['doctorName', 'Doctor Name'], ['appointmentDate', 'Appointment Date'], ['startTime', 'Start Time']].map(([k, l]) => (
                    <Grid item xs={6} key={k}><TextField fullWidth size="small" label={l} value={reminderForm[k]} onChange={e => setReminderForm({ ...reminderForm, [k]: e.target.value })} /></Grid>
                  ))}
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" select label="Channel" value={reminderForm.channel} onChange={e => setReminderForm({ ...reminderForm, channel: e.target.value })}>
                      <MenuItem value="sms">SMS</MenuItem><MenuItem value="email">Email</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !reminderForm.patientName} onClick={() => send(() => sendAppointmentReminder(reminderForm))}>{loading ? <CircularProgress size={20} /> : 'Send Reminder'}</Button></Grid>
                </Grid>
              )}

              {/* Confirmation */}
              {tab === 3 && (
                <Grid container spacing={2}>
                  {[['patientName', 'Patient Name'], ['patientPhone', 'Phone'], ['patientEmail', 'Email'], ['appointmentDate', 'Appointment Date'], ['startTime', 'Start Time']].map(([k, l]) => (
                    <Grid item xs={6} key={k}><TextField fullWidth size="small" label={l} value={confirmForm[k]} onChange={e => setConfirmForm({ ...confirmForm, [k]: e.target.value })} /></Grid>
                  ))}
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" select label="Channel" value={confirmForm.channel} onChange={e => setConfirmForm({ ...confirmForm, channel: e.target.value })}>
                      <MenuItem value="sms">SMS</MenuItem><MenuItem value="email">Email</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !confirmForm.patientName} onClick={() => send(() => sendConfirmation(confirmForm))}>{loading ? <CircularProgress size={20} /> : 'Send Confirmation'}</Button></Grid>
                </Grid>
              )}

              {/* Recall */}
              {tab === 4 && (
                <Grid container spacing={2}>
                  {[['patientName', 'Patient Name'], ['patientPhone', 'Phone'], ['patientEmail', 'Email'], ['lastVisit', 'Last Visit Date']].map(([k, l]) => (
                    <Grid item xs={6} key={k}><TextField fullWidth size="small" label={l} value={recallForm[k]} onChange={e => setRecallForm({ ...recallForm, [k]: e.target.value })} /></Grid>
                  ))}
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" select label="Channel" value={recallForm.channel} onChange={e => setRecallForm({ ...recallForm, channel: e.target.value })}>
                      <MenuItem value="sms">SMS</MenuItem><MenuItem value="email">Email</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !recallForm.patientName} onClick={() => send(() => sendRecall(recallForm))}>{loading ? <CircularProgress size={20} /> : 'Send Recall'}</Button></Grid>
                </Grid>
              )}

              {/* Payment Reminder */}
              {tab === 5 && (
                <Grid container spacing={2}>
                  {[['patientName', 'Patient Name'], ['patientPhone', 'Phone'], ['patientEmail', 'Email'], ['amount', 'Amount Owed'], ['dueDate', 'Due Date'], ['invoiceId', 'Invoice #']].map(([k, l]) => (
                    <Grid item xs={6} key={k}><TextField fullWidth size="small" label={l} value={paymentForm[k]} onChange={e => setPaymentForm({ ...paymentForm, [k]: e.target.value })} /></Grid>
                  ))}
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" select label="Channel" value={paymentForm.channel} onChange={e => setPaymentForm({ ...paymentForm, channel: e.target.value })}>
                      <MenuItem value="sms">SMS</MenuItem><MenuItem value="email">Email</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}><Button variant="contained" startIcon={<SendIcon />} fullWidth disabled={loading || !paymentForm.patientName || !paymentForm.amount} onClick={() => send(() => sendPaymentReminder(paymentForm))}>{loading ? <CircularProgress size={20} /> : 'Send Payment Reminder'}</Button></Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Send log */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="subtitle2" gutterBottom>Recent Sends</Typography>
            <Divider sx={{ mb: 1 }} />
            {sentLog.length === 0 && <Typography variant="body2" color="text.secondary">No messages sent yet</Typography>}
            {sentLog.map((entry, i) => (
              <Box key={i} mb={1} p={1} sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Chip label={entry.tab} size="small" />
                  <Typography variant="caption" color="text.secondary">{entry.sentAt}</Typography>
                </Box>
                <Typography variant="body2" mt={0.5} sx={{ fontSize: 12 }}>{entry.message}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

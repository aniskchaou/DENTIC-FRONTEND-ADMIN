import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, MenuItem, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  IconButton, Tooltip, Alert, CircularProgress, LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  getPatientForms, createPatientForm, sendPatientForm, deletePatientForm
} from '../../main/services/receptionistHTTPService';

const FORM_TYPES = ['intake', 'medical_history', 'dental_history', 'consent', 'hipaa', 'satisfaction', 'custom'];
const STATUS_COLORS = { draft: 'default', sent: 'info', viewed: 'warning', completed: 'success', expired: 'error' };

const FORM_TEMPLATES = {
  intake: { title: 'New Patient Intake', fields: [
    { label: 'Full Name', type: 'text', required: true },
    { label: 'Date of Birth', type: 'date', required: true },
    { label: 'Address', type: 'text', required: false },
    { label: 'Phone Number', type: 'text', required: true },
    { label: 'Email', type: 'email', required: false },
    { label: 'Emergency Contact Name', type: 'text', required: false },
    { label: 'Emergency Contact Phone', type: 'text', required: false },
  ]},
  consent: { title: 'Treatment Consent Form', fields: [
    { label: 'Patient Name', type: 'text', required: true },
    { label: 'I consent to the proposed treatment', type: 'checkbox', required: true },
    { label: 'I have been informed of risks', type: 'checkbox', required: true },
    { label: 'Signature', type: 'signature', required: true },
  ]},
  hipaa: { title: 'HIPAA Authorization', fields: [
    { label: 'Patient Name', type: 'text', required: true },
    { label: 'I acknowledge receipt of Privacy Notice', type: 'checkbox', required: true },
    { label: 'Signature', type: 'signature', required: true },
  ]},
};

const EMPTY_FORM = { patientId: '', formType: 'intake', title: '', fields: [], appointmentId: '' };

export default function PatientForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sendDialogId, setSendDialogId] = useState(null);
  const [sendVia, setSendVia] = useState('link');
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterPatient, setFilterPatient] = useState('');
  const [viewForm, setViewForm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = filterPatient ? { patientId: filterPatient } : {};
      const r = await getPatientForms(params);
      setForms(r.data);
    } catch { setError('Failed to load forms'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterPatient]);

  const openCreate = () => { setForm(EMPTY_FORM); setDialogOpen(true); };

  const handleTypeChange = (type) => {
    const tpl = FORM_TEMPLATES[type];
    setForm(f => ({ ...f, formType: type, title: tpl?.title || '', fields: tpl?.fields || [] }));
  };

  const handleSave = async () => {
    try { await createPatientForm(form); setSuccess('Form created'); setDialogOpen(false); load(); }
    catch { setError('Failed to create form'); }
  };

  const handleSend = async () => {
    try {
      const r = await sendPatientForm(sendDialogId, sendVia);
      setSuccess(`Form sent! Link: ${window.location.origin}${r.data.link}`);
      setSendDialogId(null);
      load();
    } catch { setError('Failed to send form'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this form?')) return;
    try { await deletePatientForm(id); setSuccess('Deleted'); load(); }
    catch { setError('Delete failed'); }
  };

  const copyLink = (token) => {
    navigator.clipboard.writeText(`${window.location.origin}/patient-form/${token}`);
    setSuccess('Link copied to clipboard');
  };

  const completionRate = forms.length ? Math.round((forms.filter(f => f.status === 'completed').length / forms.length) * 100) : 0;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Patient Forms</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Stats */}
      <Grid container spacing={2} mb={2}>
        {['draft', 'sent', 'viewed', 'completed', 'expired'].map(s => (
          <Grid item key={s}>
            <Chip label={`${s.charAt(0).toUpperCase() + s.slice(1)}: ${forms.filter(f => f.status === s).length}`}
              color={STATUS_COLORS[s]} variant="outlined" />
          </Grid>
        ))}
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color="text.secondary">Completion rate: {completionRate}%</Typography>
          <LinearProgress variant="determinate" value={completionRate} sx={{ mt: 0.5, borderRadius: 2 }} />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth size="small" label="Filter by Patient ID" value={filterPatient} onChange={e => setFilterPatient(e.target.value)} />
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Form</Button>
        </Grid>
      </Grid>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sent</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map(f => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.patientId || '—'}</TableCell>
                  <TableCell>{f.title}</TableCell>
                  <TableCell><Chip label={f.formType} size="small" /></TableCell>
                  <TableCell><Chip label={f.status} size="small" color={STATUS_COLORS[f.status] || 'default'} /></TableCell>
                  <TableCell>{f.sentAt ? new Date(f.sentAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{f.completedAt ? new Date(f.completedAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Tooltip title="View responses"><span><IconButton size="small" onClick={() => setViewForm(f)} disabled={!f.responses}><VisibilityIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Send form"><span><IconButton size="small" color="primary" onClick={() => setSendDialogId(f.id)} disabled={f.status === 'completed'}><SendIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Copy link"><span><IconButton size="small" onClick={() => copyLink(f.accessToken)} disabled={!f.accessToken}><ContentCopyIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Delete"><span><IconButton size="small" color="error" onClick={() => handleDelete(f.id)}><DeleteIcon fontSize="small" /></IconButton></span></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!forms.length && <TableRow><TableCell colSpan={8} align="center">No forms found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Patient Form</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={6}><TextField fullWidth size="small" label="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" select label="Form Type" value={form.formType} onChange={e => handleTypeChange(e.target.value)}>
                {FORM_TYPES.map(t => <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Form Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Linked Appointment ID (optional)" value={form.appointmentId} onChange={e => setForm({ ...form, appointmentId: e.target.value })} /></Grid>
            {form.fields.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Fields ({form.fields.length}):</Typography>
                <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                  {form.fields.map((f, i) => <Chip key={i} label={f.label} size="small" variant={f.required ? 'filled' : 'outlined'} />)}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.title}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Send dialog */}
      <Dialog open={!!sendDialogId} onClose={() => setSendDialogId(null)}>
        <DialogTitle>Send Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth size="small" select label="Send via" value={sendVia} onChange={e => setSendVia(e.target.value)} sx={{ mt: 1 }}>
            <MenuItem value="link">Link (copy & share)</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogId(null)}>Cancel</Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* View responses dialog */}
      <Dialog open={!!viewForm} onClose={() => setViewForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>Form Responses — {viewForm?.title}</DialogTitle>
        <DialogContent>
          {viewForm?.responses ? (
            <pre style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{JSON.stringify(viewForm.responses, null, 2)}</pre>
          ) : <Typography color="text.secondary">No responses yet</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewForm(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, MenuItem, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  IconButton, Tooltip, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  getClinicalReferrals, createClinicalReferral, updateClinicalReferral,
  sendClinicalReferral, deleteClinicalReferral, aiReferralLetter
} from '../../main/services/doctorHTTPService';

const SPECIALTIES = ['Orthodontist', 'Periodontist', 'Endodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Prosthodontist', 'Radiologist', 'Other'];
const URGENCY_COLORS = { routine: 'info', urgent: 'warning', emergency: 'error' };
const STATUS_COLORS = { draft: 'default', sent: 'primary', acknowledged: 'info', completed: 'success', cancelled: 'error' };

const EMPTY_FORM = { patientId: '', referringDoctorId: '', toSpecialty: '', toDoctor: '', toClinic: '', reason: '', urgency: 'routine', clinicalSummary: '', requestedProcedure: '', referralLetterText: '', letterAiGenerated: false };

export default function ClinicalReferral() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [letterDialog, setLetterDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [aiLoading, setAiLoading] = useState(false);
  const [filterPatient, setFilterPatient] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = filterPatient ? { patientId: filterPatient } : {};
      const r = await getClinicalReferrals(params);
      setReferrals(r.data);
    } catch { setError('Failed to load referrals'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterPatient]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm(r); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await updateClinicalReferral(editing.id, form);
      else await createClinicalReferral(form);
      setSuccess('Saved'); setDialogOpen(false); load();
    } catch { setError('Save failed'); }
  };

  const handleSend = async (id) => {
    try { await sendClinicalReferral(id); setSuccess('Referral sent'); load(); }
    catch { setError('Send failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete referral?')) return;
    try { await deleteClinicalReferral(id); setSuccess('Deleted'); load(); }
    catch { setError('Delete failed'); }
  };

  const handleGenerateLetter = async () => {
    setAiLoading(true);
    try {
      const r = await aiReferralLetter({
        patientName: `Patient #${form.patientId}`,
        diagnosis: form.clinicalSummary,
        toSpecialty: form.toSpecialty,
        reason: form.reason,
        clinicalSummary: form.clinicalSummary,
        doctorName: `Doctor #${form.referringDoctorId}`,
      });
      setForm(f => ({ ...f, referralLetterText: r.data.letter, letterAiGenerated: true }));
      setSuccess('Letter generated');
    } catch { setError('AI request failed'); }
    setAiLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Clinical Referrals</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth size="small" label="Filter by Patient ID" value={filterPatient} onChange={e => setFilterPatient(e.target.value)} />
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Referral</Button>
        </Grid>
      </Grid>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>To Specialty</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referrals.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.patientId}</TableCell>
                  <TableCell>{r.toSpecialty}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{r.reason?.slice(0, 60)}{r.reason?.length > 60 ? '…' : ''}</TableCell>
                  <TableCell><Chip label={r.urgency} size="small" color={URGENCY_COLORS[r.urgency] || 'default'} /></TableCell>
                  <TableCell><Chip label={r.status} size="small" color={STATUS_COLORS[r.status] || 'default'} /></TableCell>
                  <TableCell>
                    <Tooltip title="Edit"><span><IconButton size="small" onClick={() => openEdit(r)} disabled={r.status === 'sent' || r.status === 'completed'}><EditIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Send"><span><IconButton size="small" color="primary" onClick={() => handleSend(r.id)} disabled={r.status !== 'draft'}><SendIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="View Letter"><span><IconButton size="small" onClick={() => { setEditing(r); setForm(r); setLetterDialog(true); }} disabled={!r.referralLetterText}><AutoAwesomeIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Delete"><span><IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon fontSize="small" /></IconButton></span></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!referrals.length && <TableRow><TableCell colSpan={7} align="center">No referrals</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit Referral' : 'New Clinical Referral'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={6}><TextField fullWidth size="small" label="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth size="small" label="Doctor ID" value={form.referringDoctorId} onChange={e => setForm({ ...form, referringDoctorId: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" select label="Specialty" value={form.toSpecialty} onChange={e => setForm({ ...form, toSpecialty: e.target.value })}>
                {SPECIALTIES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" select label="Urgency" value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}>
                {['routine', 'urgent', 'emergency'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField fullWidth size="small" label="To Doctor (optional)" value={form.toDoctor} onChange={e => setForm({ ...form, toDoctor: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth size="small" label="To Clinic (optional)" value={form.toClinic} onChange={e => setForm({ ...form, toClinic: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Requested Procedure" value={form.requestedProcedure} onChange={e => setForm({ ...form, requestedProcedure: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Reason for Referral *" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Clinical Summary" value={form.clinicalSummary} onChange={e => setForm({ ...form, clinicalSummary: e.target.value })} /></Grid>
          </Grid>
          <Box mt={2} display="flex" gap={1} alignItems="center">
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} onClick={handleGenerateLetter} disabled={aiLoading || !form.reason}>
              {aiLoading ? 'Generating…' : 'Generate Letter with AI'}
            </Button>
            {aiLoading && <CircularProgress size={20} />}
          </Box>
          {form.referralLetterText && (
            <TextField fullWidth multiline rows={6} label="Referral Letter" value={form.referralLetterText} onChange={e => setForm({ ...form, referralLetterText: e.target.value })} sx={{ mt: 2 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Letter view dialog */}
      <Dialog open={letterDialog} onClose={() => setLetterDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Referral Letter {form.letterAiGenerated && <Chip label="AI Generated" size="small" color="secondary" sx={{ ml: 1 }} />}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{form.referralLetterText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLetterDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

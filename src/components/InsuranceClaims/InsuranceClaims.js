import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, MenuItem, Select, FormControl, InputLabel, Alert, CircularProgress,
  Tabs, Tab, Grid, Divider, Tooltip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ReplayIcon from '@mui/icons-material/Replay';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const STATUS_COLORS = {
  draft: 'default', submitted: 'info', acknowledged: 'primary', under_review: 'warning',
  approved: 'success', partially_approved: 'warning', rejected: 'error',
  resubmitted: 'secondary', paid: 'success', closed: 'default',
};

const STATUSES = ['draft', 'submitted', 'acknowledged', 'under_review', 'approved', 'partially_approved', 'rejected', 'resubmitted', 'paid', 'closed'];

export default function InsuranceClaims() {
  const [claims, setClaims] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ patientId: '', insuranceId: '', claimAmount: '', serviceDate: '', diagnosisCodes: '', procedureCodes: '', clinicalNarrative: '' });

  // Status update dialog
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusClaim, setStatusClaim] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', rejectionReason: '', coveredAmount: '', reimbursementAmount: '' });

  // Resubmit dialog
  const [resubOpen, setResubOpen] = useState(false);
  const [resubClaim, setResubClaim] = useState(null);
  const [resubNote, setResubNote] = useState('');

  // Actions menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuClaim, setMenuClaim] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [claimsRes, analyticsRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/insurance-claims`),
        axios.get(`${BASE_URL}/insurance-claims/analytics`),
      ]);
      if (claimsRes.status === 'fulfilled') setClaims(claimsRes.value.data || []);
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      const payload = {
        ...form,
        diagnosisCodes: form.diagnosisCodes ? form.diagnosisCodes.split(',').map(s => s.trim()) : [],
        procedureCodes: form.procedureCodes ? form.procedureCodes.split(',').map(s => s.trim()) : [],
        claimAmount: parseFloat(form.claimAmount) || 0,
      };
      await axios.post(`${BASE_URL}/insurance-claims`, payload);
      setSuccess('Claim created'); setCreateOpen(false);
      setForm({ patientId: '', insuranceId: '', claimAmount: '', serviceDate: '', diagnosisCodes: '', procedureCodes: '', clinicalNarrative: '' });
      load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const handleSubmit = async (id) => {
    try {
      await axios.post(`${BASE_URL}/insurance-claims/${id}/submit`);
      setSuccess('Claim submitted'); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
    setMenuAnchor(null);
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/insurance-claims/${statusClaim.id}/status`, statusForm);
      setSuccess('Status updated'); setStatusOpen(false); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const handleResubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/insurance-claims/${resubClaim.id}/resubmit`, { resubmitNote: resubNote });
      setSuccess('Claim resubmitted'); setResubOpen(false); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/insurance-claims/${id}`);
      setSuccess('Claim deleted'); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
    setMenuAnchor(null);
  };

  const filtered = tab === 0 ? claims : claims.filter(c => {
    const groups = [null, ['draft'], ['submitted', 'acknowledged', 'under_review'], ['approved', 'partially_approved', 'paid'], ['rejected', 'resubmitted']];
    return groups[tab]?.includes(c.status);
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}><AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Insurance Claims</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>New Claim</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {analytics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Claims', value: analytics.total, color: 'text.primary' },
            { label: 'Total Claimed', value: `$${(analytics.totalClaimed || 0).toFixed(2)}`, color: 'primary.main' },
            { label: 'Total Reimbursed', value: `$${(analytics.totalReimbursed || 0).toFixed(2)}`, color: 'success.main' },
            { label: 'Pending Reimbursement', value: `$${(analytics.pendingReimbursement || 0).toFixed(2)}`, color: 'warning.main' },
          ].map(s => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h6" color={s.color} fontWeight={700}>{s.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All" /><Tab label="Draft" /><Tab label="In Progress" /><Tab label="Approved/Paid" /><Tab label="Rejected" />
      </Tabs>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Claim #</TableCell><TableCell>Patient</TableCell><TableCell>Insurance</TableCell>
              <TableCell>Service Date</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} align="center">No claims</TableCell></TableRow>}
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{c.claimNumber}</TableCell>
                  <TableCell>{c.patientId}</TableCell>
                  <TableCell>{c.providerName || c.insuranceId}</TableCell>
                  <TableCell>{c.serviceDate || '—'}</TableCell>
                  <TableCell>${(parseFloat(c.claimAmount) || 0).toFixed(2)}</TableCell>
                  <TableCell><Chip label={c.status} size="small" color={STATUS_COLORS[c.status] || 'default'} /></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={e => { setMenuAnchor(e.currentTarget); setMenuClaim(c); }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        {menuClaim?.status === 'draft' && <MenuItem onClick={() => handleSubmit(menuClaim.id)}><SendIcon fontSize="small" sx={{ mr: 1 }} />Submit</MenuItem>}
        <MenuItem onClick={() => { setStatusClaim(menuClaim); setStatusForm({ status: menuClaim?.status || '', rejectionReason: '', coveredAmount: '', reimbursementAmount: '' }); setStatusOpen(true); setMenuAnchor(null); }}>Update Status</MenuItem>
        {menuClaim?.status === 'rejected' && <MenuItem onClick={() => { setResubClaim(menuClaim); setResubNote(''); setResubOpen(true); setMenuAnchor(null); }}><ReplayIcon fontSize="small" sx={{ mr: 1 }} />Resubmit</MenuItem>}
        {menuClaim?.status === 'draft' && <MenuItem onClick={() => handleDelete(menuClaim.id)} sx={{ color: 'error.main' }}>Delete</MenuItem>}
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Insurance Claim</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {[
            { key: 'patientId', label: 'Patient ID' },
            { key: 'insuranceId', label: 'Insurance ID' },
            { key: 'providerName', label: 'Provider Name' },
            { key: 'policyNumber', label: 'Policy Number' },
            { key: 'serviceDate', label: 'Service Date', type: 'date' },
            { key: 'claimAmount', label: 'Claim Amount ($)', type: 'number' },
            { key: 'diagnosisCodes', label: 'Diagnosis Codes (comma-separated)' },
            { key: 'procedureCodes', label: 'Procedure Codes (comma-separated)' },
          ].map(f => (
            <TextField key={f.key} label={f.label} type={f.type || 'text'} size="small"
              value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              InputLabelProps={f.type === 'date' ? { shrink: true } : undefined} />
          ))}
          <TextField label="Clinical Narrative" multiline rows={3} size="small"
            value={form.clinicalNarrative} onChange={e => setForm(p => ({ ...p, clinicalNarrative: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Claim Status</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={statusForm.status} label="Status" onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))}>
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          {['rejected', 'resubmitted'].includes(statusForm.status) && (
            <TextField label="Rejection Reason" size="small" multiline rows={2} value={statusForm.rejectionReason} onChange={e => setStatusForm(p => ({ ...p, rejectionReason: e.target.value }))} />
          )}
          {['approved', 'partially_approved'].includes(statusForm.status) && (
            <TextField label="Covered Amount ($)" size="small" type="number" value={statusForm.coveredAmount} onChange={e => setStatusForm(p => ({ ...p, coveredAmount: e.target.value }))} />
          )}
          {statusForm.status === 'paid' && (
            <TextField label="Reimbursement Amount ($)" size="small" type="number" value={statusForm.reimbursementAmount} onChange={e => setStatusForm(p => ({ ...p, reimbursementAmount: e.target.value }))} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Resubmit Dialog */}
      <Dialog open={resubOpen} onClose={() => setResubOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Resubmit Claim</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="Resubmission Note" size="small" multiline rows={3} fullWidth value={resubNote} onChange={e => setResubNote(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResubOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<ReplayIcon />} onClick={handleResubmit}>Resubmit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

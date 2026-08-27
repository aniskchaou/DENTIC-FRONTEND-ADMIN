import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, MenuItem, Select, FormControl, InputLabel, Alert, CircularProgress,
  Grid, Tabs, Tab, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const STATUS_COLORS = { pending: 'default', presented: 'info', accepted: 'success', rejected: 'error', deferred: 'warning', partial: 'primary' };
const FINANCING = ['none', 'in_house', 'third_party', 'insurance', 'payment_plan'];

export default function CaseAcceptance() {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusTab, setStatusTab] = useState('all');

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ patientId: '', treatmentPlanId: '', estimatedValue: '', priority: 'normal', coordinatorNotes: '', followUpDate: '' });

  // Action dialogs
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionCase, setActionCase] = useState(null);
  const [actionForm, setActionForm] = useState({});

  // Objection dialog
  const [objOpen, setObjOpen] = useState(false);
  const [objCase, setObjCase] = useState(null);
  const [objText, setObjText] = useState('');

  // Menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuCase, setMenuCase] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [casesRes, pipelineRes, patientsRes, plansRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/case-acceptance`),
        axios.get(`${BASE_URL}/case-acceptance/pipeline`),
        axios.get(`${BASE_URL}/patients`),
        axios.get(`${BASE_URL}/treatmentplans`),
      ]);
      if (casesRes.status === 'fulfilled') setCases(casesRes.value.data || []);
      if (pipelineRes.status === 'fulfilled') setStats(pipelineRes.value.data?.stats);
      if (patientsRes.status === 'fulfilled') setPatients(patientsRes.value.data || []);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const getPatientName = (id) => {
    const p = patients.find(p => p.id === parseInt(id));
    return p ? (p.fullName || p.name || `Patient ${id}`) : `Patient ${id}`;
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${BASE_URL}/case-acceptance`, { ...form, estimatedValue: parseFloat(form.estimatedValue) || 0 });
      setSuccess('Case created'); setCreateOpen(false);
      setForm({ patientId: '', treatmentPlanId: '', estimatedValue: '', priority: 'normal', coordinatorNotes: '', followUpDate: '' });
      load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const openAction = (type, c) => {
    setActionType(type); setActionCase(c);
    setActionForm({});
    setActionOpen(true); setMenuAnchor(null);
  };

  const runAction = async () => {
    const id = actionCase.id;
    const endpoints = {
      present: `/case-acceptance/${id}/present`,
      accept: `/case-acceptance/${id}/accept`,
      reject: `/case-acceptance/${id}/reject`,
      defer: `/case-acceptance/${id}/defer`,
    };
    try {
      await axios.post(`${BASE_URL}${endpoints[actionType]}`, actionForm);
      setSuccess(`Case ${actionType}ed`); setActionOpen(false); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const addObjection = async () => {
    try {
      await axios.post(`${BASE_URL}/case-acceptance/${objCase.id}/objection`, { text: objText });
      setSuccess('Objection recorded'); setObjOpen(false); setObjText(''); load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const filtered = statusTab === 'all' ? cases : cases.filter(c => c.status === statusTab);

  const renderActionContent = () => {
    switch (actionType) {
      case 'accept': return (
        <>
          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Financing Option</InputLabel>
            <Select value={actionForm.financingOption || 'none'} label="Financing Option" onChange={e => setActionForm(p => ({ ...p, financingOption: e.target.value }))}>
              {FINANCING.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" fullWidth label="Financing Term" value={actionForm.financingTerm || ''} onChange={e => setActionForm(p => ({ ...p, financingTerm: e.target.value }))} sx={{ mb: 2 }} />
          <TextField size="small" fullWidth label="Monthly Payment ($)" type="number" value={actionForm.monthlyPayment || ''} onChange={e => setActionForm(p => ({ ...p, monthlyPayment: e.target.value }))} sx={{ mb: 2 }} />
          <TextField size="small" fullWidth label="Accepted Value ($)" type="number" value={actionForm.acceptedValue || ''} onChange={e => setActionForm(p => ({ ...p, acceptedValue: e.target.value }))} />
        </>
      );
      case 'reject': return <TextField size="small" fullWidth label="Objection / Reason" multiline rows={3} value={actionForm.objection || ''} onChange={e => setActionForm(p => ({ ...p, objection: e.target.value }))} />;
      case 'defer': return (
        <>
          <TextField size="small" fullWidth label="Deferral Reason" multiline rows={2} value={actionForm.reason || ''} onChange={e => setActionForm(p => ({ ...p, reason: e.target.value }))} sx={{ mb: 2 }} />
          <TextField size="small" fullWidth label="Follow-up Date" type="date" value={actionForm.followUpDate || ''} onChange={e => setActionForm(p => ({ ...p, followUpDate: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField size="small" fullWidth label="Follow-up Note" value={actionForm.followUpNote || ''} onChange={e => setActionForm(p => ({ ...p, followUpNote: e.target.value }))} />
        </>
      );
      default: return <TextField size="small" fullWidth label="Notes" value={actionForm.notes || ''} onChange={e => setActionForm(p => ({ ...p, notes: e.target.value }))} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}><AssignmentTurnedInIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Case Acceptance</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>New Case</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Cases', value: stats.total },
            { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%` },
            { label: 'Accepted Value', value: `$${(stats.totalAcceptedValue || 0).toFixed(2)}` },
            { label: 'Est. Pipeline Value', value: `$${(stats.totalEstimatedValue || 0).toFixed(2)}` },
          ].map(s => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h6" fontWeight={700}>{s.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {['all', 'pending', 'presented', 'accepted', 'rejected', 'deferred'].map(s => (
          <Chip key={s} label={s} variant={statusTab === s ? 'filled' : 'outlined'}
            color={s === 'all' ? 'default' : STATUS_COLORS[s] || 'default'}
            onClick={() => setStatusTab(s)} clickable />
        ))}
      </Box>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Patient</TableCell><TableCell>Treatment Plan</TableCell><TableCell>Est. Value</TableCell>
              <TableCell>Status</TableCell><TableCell>Follow-up</TableCell><TableCell>Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} align="center">No cases</TableCell></TableRow>}
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{getPatientName(c.patientId)}</TableCell>
                  <TableCell>{c.treatmentPlanId}</TableCell>
                  <TableCell>${(parseFloat(c.estimatedValue) || 0).toFixed(2)}</TableCell>
                  <TableCell><Chip label={c.status} size="small" color={STATUS_COLORS[c.status] || 'default'} /></TableCell>
                  <TableCell>{c.followUpDate || '—'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={e => { setMenuAnchor(e.currentTarget); setMenuCase(c); }}>
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
        {menuCase?.status === 'pending' && <MenuItem onClick={() => openAction('present', menuCase)}>Mark Presented</MenuItem>}
        {['pending', 'presented'].includes(menuCase?.status) && [
          <MenuItem key="accept" onClick={() => openAction('accept', menuCase)}>Record Acceptance</MenuItem>,
          <MenuItem key="reject" onClick={() => openAction('reject', menuCase)}>Record Rejection</MenuItem>,
          <MenuItem key="defer" onClick={() => openAction('defer', menuCase)}>Defer</MenuItem>,
        ]}
        <MenuItem onClick={() => { setObjCase(menuCase); setObjOpen(true); setMenuAnchor(null); }}>Add Objection</MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Case Acceptance Record</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField size="small" label="Patient ID" value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))} />
          <TextField size="small" label="Treatment Plan ID" value={form.treatmentPlanId} onChange={e => setForm(p => ({ ...p, treatmentPlanId: e.target.value }))} />
          <TextField size="small" label="Estimated Value ($)" type="number" value={form.estimatedValue} onChange={e => setForm(p => ({ ...p, estimatedValue: e.target.value }))} />
          <FormControl size="small" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select value={form.priority} label="Priority" onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              {['low', 'normal', 'high'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" label="Follow-up Date" type="date" value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
          <TextField size="small" label="Coordinator Notes" multiline rows={2} value={form.coordinatorNotes} onChange={e => setForm(p => ({ ...p, coordinatorNotes: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionOpen} onClose={() => setActionOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Case</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>{renderActionContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setActionOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={runAction}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Objection Dialog */}
      <Dialog open={objOpen} onClose={() => setObjOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Patient Objection</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="Objection" size="small" fullWidth multiline rows={3} value={objText} onChange={e => setObjText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setObjOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addObjection}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

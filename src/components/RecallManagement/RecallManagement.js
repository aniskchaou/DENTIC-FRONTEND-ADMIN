import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from '../../libraries/axios/axios';
import BASE_URL from '../../main/urls/urls';

const PRIORITY_COLORS = { low: 'default', normal: 'info', high: 'warning', urgent: 'error' };
const empty = { patientId: '', doctorId: '', type: 'Recall', dueDate: '', notes: '', priority: 'normal' };

export default function RecallManagement() {
  const [tab, setTab] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiPatientId, setAiPatientId] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const loadReminders = () => {
    axios.get(`${BASE_URL}/reminders?type=Recall`).then(r => setReminders(r.data)).catch(() => {});
  };

  useEffect(() => { loadReminders(); }, []);

  const handleCreate = async () => {
    try {
      await axios.post(`${BASE_URL}/reminders`, { ...form, clinicId });
      setOpen(false); setForm({ ...empty }); loadReminders();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const handleAIPrediction = async () => {
    if (!aiPatientId) return;
    setLoading(true); setAiResult(null);
    try {
      const res = await axios.post(`${BASE_URL}/ai/predictive-recall`, { patientId: aiPatientId });
      setAiResult(res.data);
    } catch (e) { setAiResult({ error: e.response?.data?.error || 'AI error' }); }
    finally { setLoading(false); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Recall Management</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Recall Schedule" />
        <Tab label="AI Recall Prediction" />
      </Tabs>

      {tab === 0 && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Recall</Button>
          </Box>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  {['Patient', 'Doctor', 'Type', 'Due Date', 'Priority', 'Notes'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reminders.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.patientId}</TableCell>
                    <TableCell>{r.doctorId || '—'}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—'}</TableCell>
                    <TableCell><Chip label={r.priority || 'normal'} size="small" color={PRIORITY_COLORS[r.priority] || 'default'} /></TableCell>
                    <TableCell>{r.notes || '—'}</TableCell>
                  </TableRow>
                ))}
                {reminders.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center">No recall records</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add Recall</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2} mt={1}>
                <TextField label="Patient ID *" value={form.patientId} onChange={e => f('patientId', e.target.value)} size="small" />
                <TextField label="Doctor ID" value={form.doctorId} onChange={e => f('doctorId', e.target.value)} size="small" />
                <TextField label="Due Date" type="date" value={form.dueDate} onChange={e => f('dueDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                <FormControl size="small" fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select label="Priority" value={form.priority} onChange={e => f('priority', e.target.value)}>
                    {['low', 'normal', 'high', 'urgent'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Notes" value={form.notes} onChange={e => f('notes', e.target.value)} size="small" multiline rows={2} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleCreate}>Save</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>AI-powered Recall Prediction</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter a patient ID to get an AI prediction on whether they are due for a recall visit.
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Patient ID" size="small" sx={{ width: 240 }}
              value={aiPatientId} onChange={e => setAiPatientId(e.target.value)}
            />
            <Button variant="contained" onClick={handleAIPrediction} disabled={loading}>
              {loading ? 'Analysing…' : 'Run Prediction'}
            </Button>
          </Box>
          {aiResult && !aiResult.error && (
            <Alert severity={aiResult.isDue ? 'warning' : 'success'} sx={{ mt: 1 }}>
              <strong>{aiResult.isDue ? 'Recall Recommended' : 'Not due yet'}</strong>
              {aiResult.message && <Box mt={0.5}>{aiResult.message}</Box>}
              {aiResult.suggestedDate && <Box mt={0.5}>Suggested date: <strong>{aiResult.suggestedDate}</strong></Box>}
            </Alert>
          )}
          {aiResult?.error && <Alert severity="error">{aiResult.error}</Alert>}
        </Paper>
      )}
    </Box>
  );
}

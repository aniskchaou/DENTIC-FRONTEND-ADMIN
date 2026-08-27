import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, MenuItem, Typography, Tab, Tabs, Paper, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  IconButton, Tooltip, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DrawIcon from '@mui/icons-material/Draw';
import LockIcon from '@mui/icons-material/Lock';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  getClinicalNotes, createClinicalNote, updateClinicalNote,
  signClinicalNote, deleteClinicalNote, amendClinicalNote,
  aiClinicalNoteDraft, aiSOAPDraft
} from '../../main/services/doctorHTTPService';

const NOTE_TYPES = ['soap', 'progress', 'consultation', 'follow_up', 'discharge', 'referral', 'procedure', 'general'];
const TYPE_LABELS = { soap: 'SOAP', progress: 'Progress', consultation: 'Consultation', follow_up: 'Follow-up', discharge: 'Discharge', referral: 'Referral', procedure: 'Procedure', general: 'General' };

const EMPTY_NOTE = { patientId: '', doctorId: '', appointmentId: '', noteType: 'soap', chiefComplaint: '', subjective: '', objective: '', assessment: '', plan: '', content: '', isDraft: true, aiGenerated: false };

export default function ClinicalNotes() {
  const [notes, setNotes] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [signDialog, setSignDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_NOTE);
  const [tab, setTab] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const load = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const r = await getClinicalNotes({ patientId });
      setNotes(r.data);
    } catch { setError('Failed to load notes'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_NOTE, patientId }); setTab(0); setDialogOpen(true); };
  const openEdit = (n) => { setEditing(n); setForm(n); setTab(0); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await updateClinicalNote(editing.id, form);
      else await createClinicalNote(form);
      setSuccess('Note saved');
      setDialogOpen(false);
      load();
    } catch { setError('Failed to save note'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try { await deleteClinicalNote(id); setSuccess('Deleted'); load(); }
    catch { setError('Cannot delete signed note'); }
  };

  const handleSign = async () => {
    try {
      await signClinicalNote(editing.id, signatureData);
      setSuccess('Note signed'); setSignDialog(false); setSignatureData(''); load();
    } catch { setError('Sign failed'); }
  };

  // Signature canvas helpers
  const startDraw = (e) => {
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const draw = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const endDraw = () => {
    drawing.current = false;
    setSignatureData(canvasRef.current.toDataURL());
  };
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 400, 150);
    setSignatureData('');
  };

  const handleAINoteDraft = async () => {
    setAiLoading(true);
    try {
      const r = await aiClinicalNoteDraft({ symptoms: form.chiefComplaint, diagnosis: form.assessment });
      // Parse SOAP from draft if possible
      const draft = r.data.draft || '';
      setForm(f => ({ ...f, content: draft, aiGenerated: true }));
      setSuccess('AI draft generated');
    } catch { setError('AI request failed'); }
    setAiLoading(false);
  };

  const handleAISOAP = async () => {
    setAiLoading(true);
    try {
      const r = await aiSOAPDraft({ freeText: form.content || form.chiefComplaint });
      const soap = r.data.soap || '';
      // Try to split into sections
      const s = soap.match(/S[:\s]+([\s\S]+?)(?=O[:\s]+|$)/i)?.[1]?.trim() || '';
      const o = soap.match(/O[:\s]+([\s\S]+?)(?=A[:\s]+|$)/i)?.[1]?.trim() || '';
      const a = soap.match(/A[:\s]+([\s\S]+?)(?=P[:\s]+|$)/i)?.[1]?.trim() || '';
      const p = soap.match(/P[:\s]+([\s\S]+?)$/i)?.[1]?.trim() || '';
      setForm(f => ({ ...f, subjective: s || f.subjective, objective: o || f.objective, assessment: a || f.assessment, plan: p || f.plan, aiGenerated: true }));
      setSuccess('SOAP draft generated');
    } catch { setError('AI request failed'); }
    setAiLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Clinical Notes</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} size="small" />
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={load} disabled={!patientId}>Load Notes</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} disabled={!patientId}>New Note</Button>
        </Grid>
      </Grid>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Chief Complaint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map(n => (
                <TableRow key={n.id}>
                  <TableCell>{n.id}</TableCell>
                  <TableCell><Chip label={TYPE_LABELS[n.noteType] || n.noteType} size="small" /></TableCell>
                  <TableCell>{n.chiefComplaint || '—'}</TableCell>
                  <TableCell>
                    {n.isSigned ? <Chip label="Signed" color="success" size="small" icon={<LockIcon />} /> :
                      n.isDraft ? <Chip label="Draft" color="warning" size="small" /> :
                        <Chip label="Final" color="primary" size="small" />}
                    {n.aiGenerated && <Chip label="AI" color="secondary" size="small" sx={{ ml: 0.5 }} />}
                  </TableCell>
                  <TableCell>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit"><span><IconButton size="small" onClick={() => openEdit(n)} disabled={n.isSigned}><EditIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Sign"><span><IconButton size="small" onClick={() => { setEditing(n); setSignDialog(true); }} disabled={n.isSigned}><DrawIcon fontSize="small" /></IconButton></span></Tooltip>
                    <Tooltip title="Delete"><span><IconButton size="small" color="error" onClick={() => handleDelete(n.id)} disabled={n.isSigned}><DeleteIcon fontSize="small" /></IconButton></span></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!notes.length && <TableRow><TableCell colSpan={6} align="center">No notes found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit Clinical Note' : 'New Clinical Note'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={6}>
              <TextField fullWidth label="Patient ID" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Note Type" value={form.noteType} onChange={e => setForm({ ...form, noteType: e.target.value })} size="small">
                {NOTE_TYPES.map(t => <MenuItem key={t} value={t}>{TYPE_LABELS[t]}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Chief Complaint" value={form.chiefComplaint} onChange={e => setForm({ ...form, chiefComplaint: e.target.value })} size="small" />
            </Grid>
          </Grid>

          <Box mt={2} display="flex" gap={1}>
            <Button variant="outlined" size="small" startIcon={<AutoAwesomeIcon />} onClick={handleAINoteDraft} disabled={aiLoading}>AI Note Draft</Button>
            <Button variant="outlined" size="small" startIcon={<AutoAwesomeIcon />} onClick={handleAISOAP} disabled={aiLoading}>AI → SOAP</Button>
            {aiLoading && <CircularProgress size={20} />}
          </Box>

          {form.noteType === 'soap' ? (
            <Box mt={2}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
                <Tab label="Subjective" /><Tab label="Objective" /><Tab label="Assessment" /><Tab label="Plan" />
              </Tabs>
              {tab === 0 && <TextField fullWidth multiline rows={5} label="Subjective" value={form.subjective} onChange={e => setForm({ ...form, subjective: e.target.value })} sx={{ mt: 1 }} />}
              {tab === 1 && <TextField fullWidth multiline rows={5} label="Objective" value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} sx={{ mt: 1 }} />}
              {tab === 2 && <TextField fullWidth multiline rows={5} label="Assessment" value={form.assessment} onChange={e => setForm({ ...form, assessment: e.target.value })} sx={{ mt: 1 }} />}
              {tab === 3 && <TextField fullWidth multiline rows={5} label="Plan" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} sx={{ mt: 1 }} />}
            </Box>
          ) : (
            <TextField fullWidth multiline rows={8} label="Note Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} sx={{ mt: 2 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Sign Dialog */}
      <Dialog open={signDialog} onClose={() => setSignDialog(false)}>
        <DialogTitle>Sign Clinical Note #{editing?.id}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1}>Draw your signature below:</Typography>
          <canvas ref={canvasRef} width={400} height={150} style={{ border: '1px solid #ccc', borderRadius: 4, cursor: 'crosshair', touchAction: 'none' }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />
          <Box mt={1}><Button size="small" onClick={clearCanvas}>Clear</Button></Box>
          <Typography variant="caption" color="warning.main">This action cannot be undone. Signed notes are locked.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSign}>Sign & Lock</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

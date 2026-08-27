import React, { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Paper, Timeline,
  Alert, CircularProgress, Chip, Divider, Accordion, AccordionSummary, AccordionDetails,
  Tab, Tabs
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoteIcon from '@mui/icons-material/Description';
import TreatmentIcon from '@mui/icons-material/MedicalServices';
import AppointmentIcon from '@mui/icons-material/CalendarToday';
import ImageIcon from '@mui/icons-material/Image';
import ReferralIcon from '@mui/icons-material/Forward';
import axios from '../../libraries/axios/axios';
import { getClinicalNotes, getClinicalReferrals, getClinicalAttachments } from '../../main/services/doctorHTTPService';

const SECTION_COLORS = {
  note: '#1976d2',
  appointment: '#388e3c',
  procedure: '#f57c00',
  treatment_plan: '#7b1fa2',
  referral: '#c62828',
  image: '#0288d1',
};

export default function PatientTimeline() {
  const [patientId, setPatientId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [notes, setNotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const load = async () => {
    if (!patientId) return;
    setLoading(true);
    setError('');
    try {
      const [notesR, apptR, procR, tpR, refR, attR] = await Promise.allSettled([
        getClinicalNotes({ patientId }),
        axios.get('/appointments', { params: { patientId } }),
        axios.get('/procedures', { params: { patientId } }),
        axios.get('/treatmentplans', { params: { patientId } }),
        getClinicalReferrals({ patientId }),
        getClinicalAttachments({ patientId }),
      ]);
      if (notesR.status === 'fulfilled') setNotes(notesR.value.data || []);
      if (apptR.status === 'fulfilled') setAppointments(apptR.value.data || []);
      if (procR.status === 'fulfilled') setProcedures(procR.value.data || []);
      if (tpR.status === 'fulfilled') setTreatmentPlans(tpR.value.data || []);
      if (refR.status === 'fulfilled') setReferrals(refR.value.data || []);
      if (attR.status === 'fulfilled') setAttachments(attR.value.data || []);
    } catch { setError('Failed to load patient timeline'); }
    setLoading(false);
  };

  const sections = [
    { label: `Clinical Notes (${notes.length})`, icon: <NoteIcon />, data: notes, color: SECTION_COLORS.note, renderItem: (n) => (
      <Box>
        <Box display="flex" gap={1} alignItems="center" mb={0.5}>
          <Chip label={n.noteType} size="small" />
          {n.isSigned && <Chip label="Signed" size="small" color="success" />}
          {n.aiGenerated && <Chip label="AI" size="small" color="secondary" />}
          <Typography variant="caption" color="text.secondary">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</Typography>
        </Box>
        {n.chiefComplaint && <Typography variant="body2"><b>Chief Complaint:</b> {n.chiefComplaint}</Typography>}
        {n.noteType === 'soap' ? (
          <Box mt={0.5}>
            {n.subjective && <Typography variant="body2"><b>S:</b> {n.subjective.slice(0, 120)}{n.subjective.length > 120 ? '…' : ''}</Typography>}
            {n.assessment && <Typography variant="body2"><b>A:</b> {n.assessment.slice(0, 120)}{n.assessment.length > 120 ? '…' : ''}</Typography>}
          </Box>
        ) : (
          n.content && <Typography variant="body2">{n.content.slice(0, 200)}{n.content.length > 200 ? '…' : ''}</Typography>
        )}
      </Box>
    )},
    { label: `Appointments (${appointments.length})`, icon: <AppointmentIcon />, data: appointments, color: SECTION_COLORS.appointment, renderItem: (a) => (
      <Box>
        <Typography variant="body2"><b>Date:</b> {a.date || a.appointmentDate || a.createdAt}</Typography>
        {a.type && <Typography variant="body2"><b>Type:</b> {a.type}</Typography>}
        {a.status && <Chip label={a.status} size="small" sx={{ mt: 0.5 }} />}
        {a.notes && <Typography variant="body2" mt={0.5}>{a.notes}</Typography>}
      </Box>
    )},
    { label: `Procedures (${procedures.length})`, icon: <TreatmentIcon />, data: procedures, color: SECTION_COLORS.procedure, renderItem: (p) => (
      <Box>
        <Typography variant="body2"><b>{p.name || p.procedureName || 'Procedure'}</b></Typography>
        {p.status && <Chip label={p.status} size="small" sx={{ mt: 0.5 }} />}
        {p.priority && <Chip label={p.priority} size="small" color="warning" sx={{ ml: 0.5 }} />}
        {p.cost && <Typography variant="caption" color="text.secondary" ml={1}>Cost: {p.cost}</Typography>}
      </Box>
    )},
    { label: `Treatment Plans (${treatmentPlans.length})`, icon: <TreatmentIcon />, data: treatmentPlans, color: SECTION_COLORS.treatment_plan, renderItem: (tp) => (
      <Box>
        <Typography variant="body2"><b>{tp.description}</b></Typography>
        {tp.status && <Chip label={tp.status} size="small" sx={{ mt: 0.5 }} />}
        {tp.priority && <Chip label={tp.priority} size="small" color="primary" sx={{ ml: 0.5 }} />}
        {tp.estimatedCost && <Typography variant="caption" color="text.secondary" ml={1}>Est. Cost: {tp.estimatedCost}</Typography>}
        {tp.alternatives && <Typography variant="body2" mt={0.5}><b>Alternatives:</b> {tp.alternatives}</Typography>}
      </Box>
    )},
    { label: `Referrals (${referrals.length})`, icon: <ReferralIcon />, data: referrals, color: SECTION_COLORS.referral, renderItem: (r) => (
      <Box>
        <Typography variant="body2"><b>To: {r.toSpecialty}</b> {r.toDoctor ? `(Dr. ${r.toDoctor})` : ''}</Typography>
        <Chip label={r.status} size="small" sx={{ mt: 0.5 }} />
        <Chip label={r.urgency} size="small" color={r.urgency === 'emergency' ? 'error' : r.urgency === 'urgent' ? 'warning' : 'info'} sx={{ ml: 0.5 }} />
        {r.reason && <Typography variant="body2" mt={0.5}>{r.reason.slice(0, 120)}</Typography>}
      </Box>
    )},
    { label: `Attachments (${attachments.length})`, icon: <ImageIcon />, data: attachments, color: SECTION_COLORS.image, renderItem: (a) => (
      <Box display="flex" gap={1} alignItems="center">
        <ImageIcon fontSize="small" />
        <Box>
          <Typography variant="body2">{a.fileName}</Typography>
          <Typography variant="caption" color="text.secondary">{a.category} · {a.fileType}</Typography>
        </Box>
        {a.fileUrl && <Button size="small" href={a.fileUrl} target="_blank" rel="noopener noreferrer">View</Button>}
      </Box>
    )},
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Patient Timeline</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth size="small" label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={load} disabled={!patientId || loading}>
            {loading ? <CircularProgress size={20} /> : 'Load Timeline'}
          </Button>
        </Grid>
      </Grid>

      {patientId && !loading && (
        <>
          <Paper sx={{ mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
              {sections.map((s, i) => <Tab key={i} label={s.label} icon={s.icon} iconPosition="start" sx={{ fontSize: 12 }} />)}
            </Tabs>
          </Paper>

          {sections.map((sec, i) => (
            activeTab === i && (
              <Box key={i}>
                {sec.data.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No records found</Typography>
                  </Paper>
                ) : (
                  sec.data.map((item, idx) => (
                    <Accordion key={idx} sx={{ mb: 1, borderLeft: `4px solid ${sec.color}` }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" gap={1} alignItems="center">
                          {React.cloneElement(sec.icon, { sx: { color: sec.color } })}
                          <Typography variant="body1">#{item.id || idx + 1}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {sec.renderItem(item)}
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </Box>
            )
          ))}
        </>
      )}

      {!patientId && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Enter a patient ID and click Load Timeline to view their complete clinical history.</Typography>
        </Paper>
      )}
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Rating, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, CircularProgress, Alert, Divider, FormControlLabel, Switch, Slider
} from '@mui/material';
import SurveyIcon from '@mui/icons-material/Poll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useParams } from 'react-router-dom';

// Patient-facing survey form (accessed via token link)
export function PatientSurveyForm() {
  const { token } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ overallRating: 0, painLevel: 0, recoveryRating: 0, staffRating: 0, wouldRecommend: true, comments: '', concerns: '', followUpNeeded: false });

  useEffect(() => {
    axios.get(`${BASE_URL}/patient-portal/surveys/token/${token}`)
      .then(res => setSurvey(res.data))
      .catch(e => setError(e.response?.data?.error || 'Survey not found or expired'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/patient-portal/surveys/submit/${token}`, form);
      setSubmitted(true);
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (submitted) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
      <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
      <Typography variant="h5">Thank you for your feedback!</Typography>
      <Typography color="text.secondary">Your response has been recorded.</Typography>
    </Box>
  );
  if (error) return <Box sx={{ m: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Post-Treatment Survey</Typography>
      {survey?.treatmentType && <Chip label={survey.treatmentType} color="primary" sx={{ mb: 2 }} />}
      <Typography variant="body2" color="text.secondary" gutterBottom>Please take a moment to rate your experience. Your feedback helps us improve.</Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography gutterBottom>Overall Experience</Typography>
          <Rating value={form.overallRating} onChange={(_, v) => setForm(p => ({ ...p, overallRating: v }))} size="large" />
        </Box>
        <Box>
          <Typography gutterBottom>Pain Level (0 = no pain, 10 = severe)</Typography>
          <Slider value={form.painLevel} onChange={(_, v) => setForm(p => ({ ...p, painLevel: v }))} min={0} max={10} marks valueLabelDisplay="auto" />
        </Box>
        <Box>
          <Typography gutterBottom>Recovery Experience</Typography>
          <Rating value={form.recoveryRating} onChange={(_, v) => setForm(p => ({ ...p, recoveryRating: v }))} size="large" />
        </Box>
        <Box>
          <Typography gutterBottom>Staff Rating</Typography>
          <Rating value={form.staffRating} onChange={(_, v) => setForm(p => ({ ...p, staffRating: v }))} size="large" />
        </Box>
        <FormControlLabel control={<Switch checked={form.wouldRecommend} onChange={e => setForm(p => ({ ...p, wouldRecommend: e.target.checked }))} />} label="I would recommend this clinic to friends and family" />
        <TextField label="Comments / Positive Feedback" multiline rows={3} value={form.comments} onChange={e => setForm(p => ({ ...p, comments: e.target.value }))} />
        <TextField label="Concerns or Suggestions" multiline rows={2} value={form.concerns} onChange={e => setForm(p => ({ ...p, concerns: e.target.value }))} />
        <FormControlLabel control={<Switch checked={form.followUpNeeded} onChange={e => setForm(p => ({ ...p, followUpNeeded: e.target.checked }))} />} label="I may need a follow-up" />
        <Button variant="contained" size="large" onClick={handleSubmit} disabled={loading}>Submit Survey</Button>
      </Box>
    </Box>
  );
}

// Admin/Staff survey management view
export default function SurveyManagement() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendOpen, setSendOpen] = useState(false);
  const [form, setForm] = useState({ patientId: '', appointmentId: '', treatmentType: '', doctorId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/patient-portal/surveys`);
      setSurveys(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    try {
      await axios.post(`${BASE_URL}/patient-portal/surveys/send`, form);
      setSuccess('Survey sent'); setSendOpen(false);
      setForm({ patientId: '', appointmentId: '', treatmentType: '', doctorId: '' });
      load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const completed = surveys.filter(s => s.status === 'completed');
  const avgRating = completed.length ? (completed.reduce((s, s2) => s + (s2.overallRating || 0), 0) / completed.length).toFixed(1) : '—';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}><SurveyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Post-Treatment Surveys</Typography>
        <Button variant="contained" onClick={() => setSendOpen(true)}>Send Survey</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Sent', value: surveys.length },
          { label: 'Completed', value: completed.length },
          { label: 'Response Rate', value: surveys.length ? `${((completed.length / surveys.length) * 100).toFixed(0)}%` : '—' },
          { label: 'Avg Rating', value: avgRating },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h6" fontWeight={700}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading ? <CircularProgress /> : (
        <Paper>
          {surveys.map(s => (
            <Box key={s.id} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2">Patient {s.patientId} — {s.treatmentType || 'Survey'}</Typography>
                <Chip label={s.status} size="small" color={s.status === 'completed' ? 'success' : s.status === 'expired' ? 'error' : 'default'} />
              </Box>
              {s.status === 'completed' && (
                <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                  <Box><Typography variant="caption" color="text.secondary">Overall</Typography><Rating value={s.overallRating || 0} readOnly size="small" /></Box>
                  <Box><Typography variant="caption" color="text.secondary">Staff</Typography><Rating value={s.staffRating || 0} readOnly size="small" /></Box>
                  {s.comments && <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>"{s.comments}"</Typography>}
                </Box>
              )}
            </Box>
          ))}
          {surveys.length === 0 && <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="text.disabled">No surveys sent yet</Typography></Box>}
        </Paper>
      )}

      <Dialog open={sendOpen} onClose={() => setSendOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Post-Treatment Survey</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {[
            { key: 'patientId', label: 'Patient ID' },
            { key: 'appointmentId', label: 'Appointment ID' },
            { key: 'treatmentType', label: 'Treatment Type' },
            { key: 'doctorId', label: 'Doctor ID' },
          ].map(f => (
            <TextField key={f.key} size="small" label={f.label} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

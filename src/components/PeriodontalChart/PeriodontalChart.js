import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, TextField, MenuItem, Typography, Paper,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Chip, Alert, CircularProgress, Select, FormControl, InputLabel, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getPerioExamDates, getPerioExam, savePerioExam } from '../../main/services/doctorHTTPService';

// 28 adult teeth in FDI notation
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const SITES = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];
const PERIO_FIELDS = ['pocketDepth', 'recession', 'bleeding'];

function initTooth(toothNumber) {
  const t = { toothNumber };
  SITES.forEach(s => {
    t[`pocketDepth${s}`] = '';
    t[`recession${s}`] = 0;
    t[`bleeding${s}`] = false;
  });
  t.furcation = 'none';
  t.mobility = 'none';
  t.notes = '';
  return t;
}

function initAllTeeth() {
  const all = {};
  [...UPPER_TEETH, ...LOWER_TEETH].forEach(n => { all[n] = initTooth(n); });
  return all;
}

export default function PeriodontalChart() {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [examDates, setExamDates] = useState([]);
  const [teeth, setTeeth] = useState(initAllTeeth());
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadExamDates = async () => {
    if (!patientId) return;
    try {
      const r = await getPerioExamDates(patientId);
      setExamDates(r.data);
    } catch { /* ignore */ }
  };

  const loadExam = async () => {
    if (!patientId || !examDate) return;
    setLoading(true);
    try {
      const r = await getPerioExam(patientId, examDate);
      if (r.data.length) {
        const map = initAllTeeth();
        r.data.forEach(row => { map[row.toothNumber] = row; });
        setTeeth(map);
      }
    } catch { setError('Failed to load exam'); }
    setLoading(false);
  };

  useEffect(() => { loadExamDates(); }, [patientId]);

  const handleLoad = () => { loadExamDates(); loadExam(); };

  const updateTooth = (field, value) => {
    setTeeth(prev => ({ ...prev, [selectedTooth]: { ...prev[selectedTooth], [field]: value } }));
  };

  const handleSave = async () => {
    if (!patientId || !doctorId || !examDate) return setError('Patient ID, Doctor ID and exam date are required');
    setSaving(true);
    try {
      await savePerioExam({ patientId: Number(patientId), doctorId: Number(doctorId), examDate, teeth: Object.values(teeth) });
      setSuccess('Exam saved');
    } catch { setError('Failed to save'); }
    setSaving(false);
  };

  const pocketDepthColor = (val) => {
    const v = parseInt(val);
    if (!v || v <= 3) return '#4caf50';
    if (v <= 5) return '#ff9800';
    return '#f44336';
  };

  const renderTeethRow = (toothList) => (
    <Box display="flex" gap={0.5} flexWrap="nowrap" justifyContent="center">
      {toothList.map(n => {
        const t = teeth[n];
        const maxDepth = Math.max(...SITES.map(s => parseInt(t[`pocketDepth${s}`]) || 0));
        const hasBleeding = SITES.some(s => t[`bleeding${s}`]);
        return (
          <Box key={n} onClick={() => setSelectedTooth(n)} sx={{ width: 44, p: 0.5, textAlign: 'center', cursor: 'pointer', border: `2px solid ${selectedTooth === n ? '#1976d2' : '#ccc'}`, borderRadius: 1, bgcolor: selectedTooth === n ? '#e3f2fd' : '#fff' }}>
            <Typography variant="caption" fontWeight={700} display="block">{n}</Typography>
            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: pocketDepthColor(maxDepth), mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="#fff">{maxDepth || '—'}</Typography>
            </Box>
            {hasBleeding && <Chip label="BOP" size="small" color="error" sx={{ mt: 0.3, fontSize: 9, height: 14 }} />}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Periodontal Chart</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={3}><TextField fullWidth size="small" label="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} /></Grid>
        <Grid item xs={3}><TextField fullWidth size="small" label="Doctor ID" value={doctorId} onChange={e => setDoctorId(e.target.value)} /></Grid>
        <Grid item xs={3}>
          <TextField fullWidth size="small" label="Exam Date" type="date" value={examDate} onChange={e => setExamDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleLoad} disabled={!patientId}>Load</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Exam'}
          </Button>
        </Grid>
      </Grid>

      {examDates.length > 0 && (
        <Box mb={2} display="flex" gap={1} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary" alignSelf="center">Previous exams:</Typography>
          {examDates.map(d => <Chip key={d} label={d} size="small" onClick={() => { setExamDate(d); loadExam(); }} />)}
        </Box>
      )}

      {loading ? <CircularProgress /> : (
        <>
          {/* Tooth chart */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Upper Jaw</Typography>
            {renderTeethRow(UPPER_TEETH)}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Lower Jaw</Typography>
            {renderTeethRow(LOWER_TEETH)}
          </Paper>

          {/* Per-tooth editor */}
          {selectedTooth && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Tooth #{selectedTooth}</Typography>
              <Grid container spacing={1}>
                {SITES.map(s => (
                  <Grid item xs={4} sm={2} key={s}>
                    <TextField fullWidth size="small" label={`PD ${s}`} type="number" inputProps={{ min: 0, max: 12 }}
                      value={teeth[selectedTooth][`pocketDepth${s}`]}
                      onChange={e => updateTooth(`pocketDepth${s}`, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: pocketDepthColor(teeth[selectedTooth][`pocketDepth${s}`]) + '22' } }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={1} mt={1}>
                {SITES.map(s => (
                  <Grid item xs={4} sm={2} key={s}>
                    <TextField fullWidth size="small" label={`Rec ${s}`} type="number" inputProps={{ min: 0, max: 10 }}
                      value={teeth[selectedTooth][`recession${s}`]}
                      onChange={e => updateTooth(`recession${s}`, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {SITES.map(s => (
                  <Chip key={s} label={`BOP ${s}`} clickable size="small"
                    color={teeth[selectedTooth][`bleeding${s}`] ? 'error' : 'default'}
                    onClick={() => updateTooth(`bleeding${s}`, !teeth[selectedTooth][`bleeding${s}`])}
                  />
                ))}
              </Box>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Furcation</InputLabel>
                    <Select value={teeth[selectedTooth].furcation} label="Furcation" onChange={e => updateTooth('furcation', e.target.value)}>
                      {['none', 'class1', 'class2', 'class3'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mobility</InputLabel>
                    <Select value={teeth[selectedTooth].mobility} label="Mobility" onChange={e => updateTooth('mobility', e.target.value)}>
                      {['none', 'grade1', 'grade2', 'grade3'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label="Notes" value={teeth[selectedTooth].notes} onChange={e => updateTooth('notes', e.target.value)} />
                </Grid>
              </Grid>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

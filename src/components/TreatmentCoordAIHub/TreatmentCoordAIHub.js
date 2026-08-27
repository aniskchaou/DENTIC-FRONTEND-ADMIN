import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, TextField, Button, CircularProgress, Alert, Divider
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const TABS = [
  { label: 'Summarize Objections', key: 'objections' },
  { label: 'Follow-up Timing', key: 'followup' },
  { label: 'Financing Explanation', key: 'financing' },
  { label: 'Call Summary', key: 'callsummary' },
  { label: 'Prioritize Follow-ups', key: 'prioritize' },
];

export default function TreatmentCoordAIHub() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const [objForm, setObjForm] = useState({ treatmentPlan: '', objectionsText: '' });
  const [fuForm, setFuForm] = useState({ status: '', lastContactDate: '', objections: '', caseHistory: '' });
  const [finForm, setFinForm] = useState({ treatmentCost: '', financingOption: '', term: '', monthlyPayment: '', patientName: '' });
  const [callForm, setCallForm] = useState({ notes: '', patientName: '', date: '' });
  const [prioJson, setPrioJson] = useState('');

  const call = async (endpoint, body) => {
    setLoading(true); setError(''); setResult('');
    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, body);
      const d = res.data;
      setResult(d.summary || d.suggestion || d.explanation || d.prioritization || JSON.stringify(d, null, 2));
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  const handleRun = () => {
    switch (tab) {
      case 0: {
        const objArr = objForm.objectionsText.split('\n').filter(Boolean).map(t => ({ text: t }));
        call('/ai/treatment-coord/summarize-objections', { treatmentPlan: objForm.treatmentPlan, objections: objArr });
        break;
      }
      case 1: call('/ai/treatment-coord/suggest-follow-up-timing', fuForm); break;
      case 2: call('/ai/treatment-coord/financing-explanation', { ...finForm, treatmentCost: parseFloat(finForm.treatmentCost), monthlyPayment: parseFloat(finForm.monthlyPayment) }); break;
      case 3: call('/ai/treatment-coord/call-summary', callForm); break;
      case 4:
        try { call('/ai/treatment-coord/prioritize-follow-ups', { cases: JSON.parse(prioJson || '[]') }); }
        catch { setError('Invalid JSON array'); } break;
    }
  };

  const renderInput = () => {
    switch (tab) {
      case 0: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField size="small" fullWidth label="Treatment Plan Description" value={objForm.treatmentPlan} onChange={e => setObjForm(p => ({ ...p, treatmentPlan: e.target.value }))} />
          <TextField size="small" fullWidth multiline rows={4} label="Patient Objections (one per line)" value={objForm.objectionsText} onChange={e => setObjForm(p => ({ ...p, objectionsText: e.target.value }))} placeholder={"Too expensive\nAfraid of pain\nNeed to think about it"} />
        </Box>
      );
      case 1: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { key: 'status', label: 'Case Status' },
            { key: 'lastContactDate', label: 'Last Contact Date', type: 'date' },
            { key: 'objections', label: 'Objections Summary' },
            { key: 'caseHistory', label: 'Case History / Notes' },
          ].map(f => (
            <TextField key={f.key} size="small" fullWidth label={f.label} type={f.type || 'text'} multiline={f.key === 'caseHistory'} rows={f.key === 'caseHistory' ? 2 : 1}
              value={fuForm[f.key]} onChange={e => setFuForm(p => ({ ...p, [f.key]: e.target.value }))}
              InputLabelProps={f.type === 'date' ? { shrink: true } : undefined} />
          ))}
        </Box>
      );
      case 2: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { key: 'patientName', label: 'Patient Name' },
            { key: 'treatmentCost', label: 'Total Treatment Cost ($)', type: 'number' },
            { key: 'financingOption', label: 'Financing Option (e.g. in_house, payment_plan)' },
            { key: 'term', label: 'Term (e.g. 12 months)' },
            { key: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number' },
          ].map(f => (
            <TextField key={f.key} size="small" fullWidth label={f.label} type={f.type || 'text'}
              value={finForm[f.key]} onChange={e => setFinForm(p => ({ ...p, [f.key]: e.target.value }))} />
          ))}
        </Box>
      );
      case 3: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField size="small" fullWidth label="Patient Name" value={callForm.patientName} onChange={e => setCallForm(p => ({ ...p, patientName: e.target.value }))} />
          <TextField size="small" fullWidth label="Call Date" type="date" value={callForm.date} onChange={e => setCallForm(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
          <TextField size="small" fullWidth multiline rows={5} label="Call Notes / Transcript" value={callForm.notes} onChange={e => setCallForm(p => ({ ...p, notes: e.target.value }))} />
        </Box>
      );
      case 4: return (
        <TextField fullWidth multiline rows={6} label="Cases JSON array" value={prioJson} onChange={e => setPrioJson(e.target.value)}
          placeholder='[{"id":1,"patientName":"John Doe","status":"deferred","followUpDate":"2025-01-15","estimatedValue":2500,"objections":["Cost concern"]}]'
          sx={{ fontFamily: 'monospace' }} />
      );
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}><SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Treatment Coordinator AI</Typography>

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setResult(''); setError(''); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
        {TABS.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>

      <Paper sx={{ p: 3 }}>
        {renderInput()}
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleRun} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : <SmartToyIcon />}>
          Run AI
        </Button>
      </Paper>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Paper sx={{ p: 3, mt: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>AI Result</Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography whiteSpace="pre-wrap" variant="body2">{result}</Typography>
        </Paper>
      )}
    </Box>
  );
}

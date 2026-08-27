import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, TextField, Button, CircularProgress,
  Alert, Divider
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const tabs = [
  { label: 'Extract Info', key: 'extract' },
  { label: 'Detect Missing', key: 'missing' },
  { label: 'Draft Narrative', key: 'narrative' },
  { label: 'Summarize Rejected', key: 'rejected' },
  { label: 'Verify Eligibility', key: 'eligibility' },
];

export default function InsuranceAIHub() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  // Per-tab form state
  const [extractText, setExtractText] = useState('');
  const [claimJson, setClaimJson] = useState('');
  const [narrativeForm, setNarrativeForm] = useState({ diagnosis: '', procedures: '', patientHistory: '', treatmentReason: '' });
  const [rejectedClaims, setRejectedClaims] = useState('');
  const [eligibilityForm, setEligibilityForm] = useState({ patientName: '', insuranceProvider: '', policyNumber: '', serviceType: '' });

  const call = async (endpoint, body) => {
    setLoading(true); setError(''); setResult('');
    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, body);
      const data = res.data;
      setResult(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  const handleRun = () => {
    switch (tab) {
      case 0: call('/ai/insurance/extract-info', { documentText: extractText }); break;
      case 1:
        try { call('/ai/insurance/detect-missing', { claim: JSON.parse(claimJson || '{}') }); }
        catch { setError('Invalid JSON'); } break;
      case 2: call('/ai/insurance/draft-narrative', narrativeForm); break;
      case 3:
        try { call('/ai/insurance/summarize-rejected', { claims: JSON.parse(rejectedClaims || '[]') }); }
        catch { setError('Invalid JSON array'); } break;
      case 4: call('/ai/insurance/verify-eligibility', eligibilityForm); break;
    }
  };

  const renderInput = () => {
    switch (tab) {
      case 0: return <TextField multiline rows={6} fullWidth label="Insurance document text" value={extractText} onChange={e => setExtractText(e.target.value)} placeholder="Paste insurance card or EOB text here..." />;
      case 1: return <TextField multiline rows={6} fullWidth label="Claim data (JSON)" value={claimJson} onChange={e => setClaimJson(e.target.value)} placeholder='{"procedureCodes":["D0150"],"diagnosisCodes":["K02.1"],"claimAmount":150}' sx={{ fontFamily: 'monospace' }} />;
      case 2: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Diagnosis" size="small" value={narrativeForm.diagnosis} onChange={e => setNarrativeForm(p => ({ ...p, diagnosis: e.target.value }))} />
          <TextField label="Procedures" size="small" value={narrativeForm.procedures} onChange={e => setNarrativeForm(p => ({ ...p, procedures: e.target.value }))} />
          <TextField label="Patient History" size="small" multiline rows={2} value={narrativeForm.patientHistory} onChange={e => setNarrativeForm(p => ({ ...p, patientHistory: e.target.value }))} />
          <TextField label="Treatment Reason / Medical Necessity" size="small" multiline rows={2} value={narrativeForm.treatmentReason} onChange={e => setNarrativeForm(p => ({ ...p, treatmentReason: e.target.value }))} />
        </Box>
      );
      case 3: return <TextField multiline rows={6} fullWidth label="Rejected claims (JSON array)" value={rejectedClaims} onChange={e => setRejectedClaims(e.target.value)} placeholder='[{"claimNumber":"CLM-001","rejectionReason":"Missing diagnosis code","procedureCodes":["D0150"]}]' sx={{ fontFamily: 'monospace' }} />;
      case 4: return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { key: 'patientName', label: 'Patient Name' },
            { key: 'insuranceProvider', label: 'Insurance Provider' },
            { key: 'policyNumber', label: 'Policy Number' },
            { key: 'serviceType', label: 'Service Type (e.g. D1110 Prophylaxis)' },
          ].map(f => (
            <TextField key={f.key} label={f.label} size="small" value={eligibilityForm[f.key]} onChange={e => setEligibilityForm(p => ({ ...p, [f.key]: e.target.value }))} />
          ))}
        </Box>
      );
      default: return null;
    }
  };

  const parseResult = () => {
    if (!result) return null;
    if (tab === 0) {
      try {
        const parsed = JSON.parse(result);
        if (parsed.raw) return <Typography whiteSpace="pre-wrap">{parsed.raw}</Typography>;
        return (
          <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 0.5 }}>
            {Object.entries(parsed).map(([k, v]) => [
              <Typography component="dt" key={`k-${k}`} variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k}</Typography>,
              <Typography component="dd" key={`v-${k}`} variant="body2">{String(v ?? '—')}</Typography>,
            ])}
          </Box>
        );
      } catch { /* fall through */ }
    }
    return <Typography whiteSpace="pre-wrap" variant="body2">{result}</Typography>;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}><SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Insurance AI Hub</Typography>

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setResult(''); setError(''); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
        {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
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
          {parseResult()}
        </Paper>
      )}
    </Box>
  );
}

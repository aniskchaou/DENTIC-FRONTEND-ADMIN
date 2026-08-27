import React, { useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Paper, Tab, Tabs,
  MenuItem, Alert, CircularProgress, Divider, Card, CardContent
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  aiClinicalNoteDraft, aiSOAPDraft, aiSummarizeVisits, aiSuggestMissingDocs,
  aiPatientFriendlyExplanation, aiPostTreatmentInstructions, aiFollowUpMessage,
  aiReferralLetter, aiExtractDocument, aiNLPatientSearch
} from '../../main/services/doctorHTTPService';

function OutputCard({ output }) {
  if (!output) return null;
  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: '#f9fbe7', whiteSpace: 'pre-wrap', maxHeight: 320, overflowY: 'auto' }}>
      <Typography variant="body2">{output}</Typography>
    </Paper>
  );
}

export default function DoctorAIHub() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  // Per-tool form state
  const [noteDraft, setNoteDraft] = useState({ symptoms: '', diagnosis: '', noteType: 'SOAP' });
  const [soapDraft, setSoapDraft] = useState({ freeText: '' });
  const [visits, setVisits] = useState('');
  const [missingDocs, setMissingDocs] = useState('');
  const [friendly, setFriendly] = useState({ treatmentPlan: '', diagnosis: '', procedures: '' });
  const [postTx, setPostTx] = useState({ procedure: '', anesthesiaUsed: false });
  const [followUp, setFollowUp] = useState({ patientName: '', procedure: '', nextAppointmentDate: '', channel: 'sms' });
  const [referralLetter, setReferralLetter] = useState({ patientName: '', patientAge: '', diagnosis: '', toSpecialty: '', reason: '', clinicalSummary: '', doctorName: '' });
  const [docText, setDocText] = useState('');
  const [nlQuery, setNlQuery] = useState('');

  const run = async (fn) => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const r = await fn();
      const result = r.data;
      setOutput(result[Object.keys(result)[0]] || JSON.stringify(result, null, 2));
    } catch (e) { setError(e?.response?.data?.error || 'AI request failed'); }
    setLoading(false);
  };

  const tabs = [
    { label: 'Note Draft', icon: '📝' },
    { label: 'SOAP Draft', icon: '🩺' },
    { label: 'Visit Summary', icon: '📋' },
    { label: 'Missing Docs', icon: '⚠️' },
    { label: 'Patient Explain', icon: '💬' },
    { label: 'Post-TX Care', icon: '🩹' },
    { label: 'Follow-Up', icon: '📱' },
    { label: 'Referral Letter', icon: '✉️' },
    { label: 'Doc Extract', icon: '📄' },
    { label: 'NL Search', icon: '🔍' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={1}>Doctor AI Assistant</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>AI-powered tools to help with clinical documentation and patient communication.</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setOutput(''); }} variant="scrollable" scrollButtons="auto">
          {tabs.map((t, i) => <Tab key={i} label={`${t.icon} ${t.label}`} sx={{ fontSize: 12 }} />)}
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            {/* Note Draft */}
            {tab === 0 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Generate Clinical Note Draft</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}><TextField fullWidth size="small" multiline rows={3} label="Symptoms / Chief Complaint" value={noteDraft.symptoms} onChange={e => setNoteDraft({ ...noteDraft, symptoms: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Diagnosis" value={noteDraft.diagnosis} onChange={e => setNoteDraft({ ...noteDraft, diagnosis: e.target.value })} /></Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" select label="Note Type" value={noteDraft.noteType} onChange={e => setNoteDraft({ ...noteDraft, noteType: e.target.value })}>
                      {['SOAP', 'Progress', 'Consultation'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiClinicalNoteDraft(noteDraft))}>
                  {loading ? <CircularProgress size={20} /> : 'Generate Note Draft'}
                </Button>
              </>
            )}

            {/* SOAP Draft */}
            {tab === 1 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Convert Free Text → SOAP</Typography>
                <TextField fullWidth multiline rows={6} label="Enter free text / spoken notes" value={soapDraft.freeText} onChange={e => setSoapDraft({ freeText: e.target.value })} />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiSOAPDraft(soapDraft))}>
                  {loading ? <CircularProgress size={20} /> : 'Convert to SOAP'}
                </Button>
              </>
            )}

            {/* Visit Summary */}
            {tab === 2 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Summarize Patient Visits</Typography>
                <Typography variant="caption" color="text.secondary">Enter visits as JSON array [{`{date, doctor, procedures, notes}`}]</Typography>
                <TextField fullWidth multiline rows={6} label="Visits JSON" value={visits} onChange={e => setVisits(e.target.value)} sx={{ mt: 1 }} />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading}
                  onClick={() => {
                    try { run(() => aiSummarizeVisits({ visits: JSON.parse(visits) })); }
                    catch { setError('Invalid JSON'); }
                  }}>
                  {loading ? <CircularProgress size={20} /> : 'Summarize Visits'}
                </Button>
              </>
            )}

            {/* Missing Docs */}
            {tab === 3 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Suggest Missing Documentation</Typography>
                <Typography variant="caption" color="text.secondary">Paste patient record summary as JSON</Typography>
                <TextField fullWidth multiline rows={6} label="Patient Record JSON" value={missingDocs} onChange={e => setMissingDocs(e.target.value)} sx={{ mt: 1 }} />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading}
                  onClick={() => {
                    try { run(() => aiSuggestMissingDocs({ patientRecord: JSON.parse(missingDocs) })); }
                    catch { run(() => aiSuggestMissingDocs({ patientRecord: { summary: missingDocs } })); }
                  }}>
                  {loading ? <CircularProgress size={20} /> : 'Suggest Missing Docs'}
                </Button>
              </>
            )}

            {/* Patient-friendly explanation */}
            {tab === 4 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Patient-Friendly Explanation</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Diagnosis" value={friendly.diagnosis} onChange={e => setFriendly({ ...friendly, diagnosis: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Treatment Plan" value={friendly.treatmentPlan} onChange={e => setFriendly({ ...friendly, treatmentPlan: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Procedures" value={friendly.procedures} onChange={e => setFriendly({ ...friendly, procedures: e.target.value })} /></Grid>
                </Grid>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiPatientFriendlyExplanation(friendly))}>
                  {loading ? <CircularProgress size={20} /> : 'Generate Explanation'}
                </Button>
              </>
            )}

            {/* Post-treatment instructions */}
            {tab === 5 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Post-Treatment Instructions</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Procedure performed" value={postTx.procedure} onChange={e => setPostTx({ ...postTx, procedure: e.target.value })} /></Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" select label="Anesthesia used?" value={postTx.anesthesiaUsed ? 'yes' : 'no'} onChange={e => setPostTx({ ...postTx, anesthesiaUsed: e.target.value === 'yes' })}>
                      <MenuItem value="yes">Yes</MenuItem><MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiPostTreatmentInstructions(postTx))}>
                  {loading ? <CircularProgress size={20} /> : 'Generate Instructions'}
                </Button>
              </>
            )}

            {/* Follow-up message */}
            {tab === 6 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Generate Follow-Up Message</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Patient Name" value={followUp.patientName} onChange={e => setFollowUp({ ...followUp, patientName: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Procedure" value={followUp.procedure} onChange={e => setFollowUp({ ...followUp, procedure: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" label="Next Appointment Date (optional)" value={followUp.nextAppointmentDate} onChange={e => setFollowUp({ ...followUp, nextAppointmentDate: e.target.value })} /></Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" select label="Channel" value={followUp.channel} onChange={e => setFollowUp({ ...followUp, channel: e.target.value })}>
                      <MenuItem value="sms">SMS</MenuItem><MenuItem value="email">Email</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiFollowUpMessage(followUp))}>
                  {loading ? <CircularProgress size={20} /> : 'Generate Message'}
                </Button>
              </>
            )}

            {/* Referral letter */}
            {tab === 7 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Generate Referral Letter</Typography>
                <Grid container spacing={1}>
                  {[['patientName', 'Patient Name'], ['patientAge', 'Patient Age'], ['doctorName', 'Referring Doctor'], ['toSpecialty', 'To Specialty'], ['diagnosis', 'Diagnosis']].map(([k, l]) => (
                    <Grid item xs={12} sm={6} key={k}><TextField fullWidth size="small" label={l} value={referralLetter[k]} onChange={e => setReferralLetter({ ...referralLetter, [k]: e.target.value })} /></Grid>
                  ))}
                  <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="Reason" value={referralLetter.reason} onChange={e => setReferralLetter({ ...referralLetter, reason: e.target.value })} /></Grid>
                  <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="Clinical Summary" value={referralLetter.clinicalSummary} onChange={e => setReferralLetter({ ...referralLetter, clinicalSummary: e.target.value })} /></Grid>
                </Grid>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiReferralLetter(referralLetter))}>
                  {loading ? <CircularProgress size={20} /> : 'Generate Referral Letter'}
                </Button>
              </>
            )}

            {/* Document extraction */}
            {tab === 8 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Extract Info from Document</Typography>
                <TextField fullWidth multiline rows={8} label="Paste document text here" value={docText} onChange={e => setDocText(e.target.value)} />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiExtractDocument({ documentText: docText }))}>
                  {loading ? <CircularProgress size={20} /> : 'Extract Information'}
                </Button>
              </>
            )}

            {/* NL Search */}
            {tab === 9 && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Natural Language Patient Search</Typography>
                <TextField fullWidth size="small" label='e.g. "patients with root canal last month"' value={nlQuery} onChange={e => setNlQuery(e.target.value)} />
                <Typography variant="caption" color="text.secondary" mt={1} display="block">This sends the search query + patient index to AI for semantic matching. Works best with loaded patient list.</Typography>
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AutoAwesomeIcon />} fullWidth disabled={loading} onClick={() => run(() => aiNLPatientSearch({ query: nlQuery, patients: [] }))}>
                  {loading ? <CircularProgress size={20} /> : 'Search'}
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>AI Output</Typography>
            <Divider sx={{ mb: 1 }} />
            {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>}
            <OutputCard output={output} />
            {!loading && !output && (
              <Typography variant="body2" color="text.disabled" textAlign="center" mt={4}>Fill in the form and click generate to see AI output here</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

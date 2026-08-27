import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Switch, FormControlLabel,
  TextField, Button, Snackbar, Alert, Divider, LinearProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Chip,
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { getClinicAIConfig, saveClinicAIConfig, getAIUsage } from '../../main/services/clinicOwnerHTTPService';

const FEATURES = [
  { key: 'enableNoShowPrediction', label: 'No-show Prediction' },
  { key: 'enableSlotSuggestions', label: 'Smart Slot Suggestions' },
  { key: 'enablePricingInsights', label: 'Pricing Insights' },
  { key: 'enableRecallSuggestions', label: 'Recall Suggestions' },
  { key: 'enableDentalImaging', label: 'AI Dental Imaging Analysis' },
];

export default function ClinicAIConfig() {
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const [tab, setTab] = useState(0);
  const [cfg, setCfg] = useState({
    clinicId,
    enabled: true,
    enableNoShowPrediction: true,
    enableSlotSuggestions: true,
    enablePricingInsights: true,
    enableRecallSuggestions: true,
    enableDentalImaging: false,
    allowDoctorAccess: true,
    allowStaffAccess: false,
    requireAdminApproval: false,
    monthlyTokenBudget: '',
    alertAtPercent: 80,
  });
  const [usage, setUsage] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    if (!clinicId) return;
    getClinicAIConfig(clinicId).then(r => setCfg(c => ({ ...c, ...r.data }))).catch(() => {});
    getAIUsage(clinicId).then(r => setUsage(r.data)).catch(() => {});
  }, [clinicId]);

  const f = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      await saveClinicAIConfig({ ...cfg, clinicId });
      setSnack({ open: true, msg: 'AI settings saved', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.error || 'Error', severity: 'error' });
    }
  };

  const budgetPct = cfg.monthlyTokenBudget && cfg.monthlyTokensUsed
    ? Math.min(100, (cfg.monthlyTokensUsed / cfg.monthlyTokenBudget) * 100)
    : null;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>AI Assistant Configuration</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Features & Toggle" />
        <Tab label="Permissions" />
        <Tab label="Budget & Limits" />
        <Tab label="Usage Log" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <FormControlLabel
            control={<Switch checked={!!cfg.enabled} onChange={e => f('enabled', e.target.checked)} />}
            label={<Typography fontWeight={700}>{cfg.enabled ? 'AI Assistant is ON' : 'AI Assistant is OFF'}</Typography>}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" mb={2}>Enable / disable individual AI features:</Typography>
          <Grid container spacing={1}>
            {FEATURES.map(feat => (
              <Grid item xs={12} sm={6} key={feat.key}>
                <FormControlLabel
                  control={<Switch checked={!!cfg[feat.key]} disabled={!cfg.enabled} onChange={e => f(feat.key, e.target.checked)} />}
                  label={feat.label}
                />
              </Grid>
            ))}
          </Grid>
          <Box mt={3}><Button variant="contained" onClick={handleSave}>Save</Button></Box>
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Access Permissions</Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <FormControlLabel control={<Switch checked={!!cfg.allowDoctorAccess} onChange={e => f('allowDoctorAccess', e.target.checked)} />} label="Doctors can use AI features" />
            <FormControlLabel control={<Switch checked={!!cfg.allowStaffAccess} onChange={e => f('allowStaffAccess', e.target.checked)} />} label="Staff can use AI features" />
            <FormControlLabel control={<Switch checked={!!cfg.requireAdminApproval} onChange={e => f('requireAdminApproval', e.target.checked)} />} label="Require admin approval for AI-generated content" />
          </Box>
          <Box mt={3}><Button variant="contained" onClick={handleSave}>Save</Button></Box>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Monthly Token Budget</Typography>
          <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
            <TextField
              label="Monthly token budget (blank = unlimited)" type="number" size="small" sx={{ width: 300 }}
              value={cfg.monthlyTokenBudget} onChange={e => f('monthlyTokenBudget', e.target.value)}
            />
            <TextField
              label="Alert when usage reaches (%)" type="number" size="small" sx={{ width: 220 }}
              value={cfg.alertAtPercent} onChange={e => f('alertAtPercent', e.target.value)}
              inputProps={{ min: 1, max: 100 }}
            />
          </Box>
          {budgetPct !== null && (
            <Box mb={2}>
              <Typography variant="body2" mb={0.5}>
                {cfg.monthlyTokensUsed?.toLocaleString()} / {parseInt(cfg.monthlyTokenBudget).toLocaleString()} tokens used ({budgetPct.toFixed(1)}%)
              </Typography>
              <LinearProgress variant="determinate" value={budgetPct} color={budgetPct > cfg.alertAtPercent ? 'error' : 'primary'} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
          )}
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Paper>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>AI Usage This Month</Typography>
          {usage ? (
            <>
              <Box mb={2}>
                <Typography variant="body2">
                  Total calls: <strong>{usage.totals?.totalCalls || 0}</strong> &nbsp;|&nbsp;
                  Total tokens: <strong>{(usage.totals?.totalTokens || 0).toLocaleString()}</strong>
                </Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Feature</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Calls</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tokens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(usage.byFeature || []).map(row => (
                    <TableRow key={row.feature} hover>
                      <TableCell>{row.feature}</TableCell>
                      <TableCell>{row.calls}</TableCell>
                      <TableCell>{parseInt(row.tokens || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {!usage.byFeature?.length && (
                    <TableRow><TableCell colSpan={3} align="center">No AI usage this month</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          ) : <Typography color="text.secondary">Loading…</Typography>}
        </Paper>
      )}

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

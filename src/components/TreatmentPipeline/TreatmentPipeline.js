import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress, Alert, Button,
  Card, CardContent, CardActions, Divider, Tooltip
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const COLS = [
  { key: 'pending', label: 'Pending', color: '#9e9e9e' },
  { key: 'presented', label: 'Presented', color: '#1976d2' },
  { key: 'deferred', label: 'Deferred', color: '#ed6c02' },
  { key: 'accepted', label: 'Accepted', color: '#2e7d32' },
  { key: 'rejected', label: 'Rejected', color: '#d32f2f' },
];

const STATUS_COLORS = { pending: 'default', presented: 'info', accepted: 'success', rejected: 'error', deferred: 'warning', partial: 'primary' };

export default function TreatmentPipeline() {
  const [pipeline, setPipeline] = useState({});
  const [stats, setStats] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [pipeRes, fuRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/case-acceptance/pipeline`),
        axios.get(`${BASE_URL}/case-acceptance/follow-ups`),
      ]);
      if (pipeRes.status === 'fulfilled') {
        setPipeline(pipeRes.value.data?.pipeline || {});
        setStats(pipeRes.value.data?.stats || null);
      }
      if (fuRes.status === 'fulfilled') setFollowUps(fuRes.value.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}><AccountTreeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Treatment Pipeline</Typography>
        <Button variant="outlined" onClick={load} disabled={loading}>Refresh</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total Cases', value: stats.total },
            { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%` },
            { label: 'Accepted Value', value: `$${(stats.totalAcceptedValue || 0).toFixed(2)}` },
            { label: 'Pipeline Value', value: `$${(stats.totalEstimatedValue || 0).toFixed(2)}` },
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

      {followUps.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
          <Typography variant="subtitle2" color="warning.dark" gutterBottom>
            {followUps.length} follow-up{followUps.length > 1 ? 's' : ''} due today or overdue
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {followUps.map(c => (
              <Chip key={c.id} icon={<CalendarTodayIcon />} label={`Patient ${c.patientId} — ${c.followUpDate}`} color="warning" size="small" />
            ))}
          </Box>
        </Paper>
      )}

      {loading ? <CircularProgress /> : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {COLS.map(col => (
            <Box key={col.key} sx={{ minWidth: 260, flex: 1 }}>
              <Paper sx={{ bgcolor: col.color + '18', borderTop: `3px solid ${col.color}`, p: 1.5, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: col.color }}>
                  {col.label} ({(pipeline[col.key] || []).length})
                </Typography>
              </Paper>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(pipeline[col.key] || []).length === 0 && (
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', color: 'text.disabled' }}>Empty</Paper>
                )}
                {(pipeline[col.key] || []).map(c => (
                  <Card key={c.id} variant="outlined" sx={{ borderLeft: `3px solid ${col.color}` }}>
                    <CardContent sx={{ pb: 0, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 14 }} /> Patient {c.patientId}
                        </Typography>
                        <Chip label={c.priority} size="small" variant="outlined"
                          color={c.priority === 'high' ? 'error' : c.priority === 'low' ? 'default' : 'primary'} />
                      </Box>
                      <Typography variant="body2">Plan #{c.treatmentPlanId}</Typography>
                      <Divider sx={{ my: 0.5 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MonetizationOnIcon sx={{ fontSize: 14 }} />${(parseFloat(c.estimatedValue) || 0).toFixed(0)}
                        </Typography>
                        {c.followUpDate && (
                          <Tooltip title="Follow-up date">
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarTodayIcon sx={{ fontSize: 14 }} />{c.followUpDate}
                            </Typography>
                          </Tooltip>
                        )}
                      </Box>
                      {c.objections?.length > 0 && (
                        <Typography variant="caption" color="error.main">{c.objections.length} objection(s)</Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

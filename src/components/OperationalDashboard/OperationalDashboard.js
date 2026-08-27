import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarningIcon from '@mui/icons-material/Warning';
import PeopleIcon from '@mui/icons-material/People';
import { getOperationalDashboard } from '../../main/services/clinicOwnerHTTPService';

const KPICard = ({ label, value, icon, color = '#1976d2', sub }) => (
  <Paper sx={{ p: 2.5, borderLeft: `5px solid ${color}`, height: '100%' }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4" fontWeight={700} color={color}>{value ?? <CircularProgress size={28} />}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </Box>
      <Box sx={{ color, opacity: 0.3, fontSize: 48 }}>{icon}</Box>
    </Box>
  </Paper>
);

export default function OperationalDashboard() {
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getOperationalDashboard({ clinicId })
      .then(r => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h5" fontWeight={700}>Operational Dashboard</Typography>
        <Button startIcon={<RefreshIcon />} onClick={load} disabled={loading}>Refresh</Button>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={3}>{today}</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Today's Appointments" color="#1976d2"
            value={data?.todayAppointments}
            sub={data ? `${data.todayCompleted} completed` : ''}
            icon={<CalendarTodayIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Patients Waiting / Pending" color="#9c27b0"
            value={data?.todayPending}
            icon={<PeopleIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Today's Production" color="#2e7d32"
            value={data ? `$${parseFloat(data.todayProduction || 0).toFixed(0)}` : null}
            icon={<MonetizationOnIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Outstanding Payments" color="#ed6c02"
            value={data ? `$${parseFloat(data.outstanding || 0).toFixed(0)}` : null}
            icon={<WarningIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Cancellations Today" color="#d32f2f"
            value={data?.todayCancelled}
            icon={<WarningIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="No-shows Today" color="#e65100"
            value={data?.todayNoShow}
            icon={<WarningIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <KPICard
            label="Completed Today" color="#00796b"
            value={data?.todayCompleted}
            icon={<CalendarTodayIcon sx={{ fontSize: 48 }} />}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" mb={2}>Quick Status</Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {data && [
            { label: `${data.todayAppointments || 0} scheduled today`, color: 'primary' },
            { label: `${data.todayCancelled || 0} cancelled`, color: 'error' },
            { label: `${data.todayNoShow || 0} no-shows`, color: 'warning' },
            { label: `$${parseFloat(data.outstanding || 0).toFixed(0)} outstanding`, color: 'default' },
          ].map((c, i) => (
            <Chip key={i} label={c.label} color={c.color} variant="outlined" />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

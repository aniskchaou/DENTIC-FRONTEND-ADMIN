import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  getRevenueByDoctor, getRevenueByProcedure, getNewVsReturning,
  getAppointmentStats, getFinancialSummary, getPatientRetention,
} from '../../main/services/clinicOwnerHTTPService';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const KPI = ({ label, value, sub, color = '#1976d2' }) => (
  <Paper sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${color}` }}>
    <Typography variant="h4" fontWeight={700} color={color}>{value ?? '—'}</Typography>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Paper>
);

export default function ClinicAnalytics() {
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const [period, setPeriod] = useState('month');
  const [byDoctor, setByDoctor] = useState([]);
  const [byProc, setByProc] = useState([]);
  const [nvr, setNvr] = useState({});
  const [apptStats, setApptStats] = useState({});
  const [fin, setFin] = useState({});
  const [retention, setRetention] = useState({});

  useEffect(() => {
    const p = { clinicId, period };
    Promise.all([
      getRevenueByDoctor(p).then(r => setByDoctor(r.data)).catch(() => {}),
      getRevenueByProcedure(p).then(r => setByProc(r.data)).catch(() => {}),
      getNewVsReturning(p).then(r => setNvr(r.data)).catch(() => {}),
      getAppointmentStats(p).then(r => setApptStats(r.data)).catch(() => {}),
      getFinancialSummary(p).then(r => setFin(r.data)).catch(() => {}),
      getPatientRetention({ clinicId }).then(r => setRetention(r.data)).catch(() => {}),
    ]);
  }, [clinicId, period]);

  const barData = (items, labelKey, valKey) => ({
    labels: items.slice(0, 10).map(i => i[labelKey] || 'Unknown'),
    datasets: [{ data: items.slice(0, 10).map(i => parseFloat(i[valKey] || 0)), backgroundColor: '#1976d2' }],
  });

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Business Analytics</Typography>
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Period</InputLabel>
          <Select label="Period" value={period} onChange={e => setPeriod(e.target.value)}>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="30">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}><KPI label="Production" value={`$${parseFloat(fin.production || 0).toFixed(0)}`} color="#1976d2" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Collections" value={`$${parseFloat(fin.collections || 0).toFixed(0)}`} color="#2e7d32" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Outstanding" value={`$${parseFloat(fin.outstanding || 0).toFixed(0)}`} color="#ed6c02" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Patient Retention" value={retention.retentionRate != null ? `${retention.retentionRate}%` : '—'} color="#7b1fa2" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Cancellation Rate" value={apptStats.cancellationRate ? `${apptStats.cancellationRate}%` : '—'} color="#d32f2f" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="No-show Rate" value={apptStats.noShowRate ? `${apptStats.noShowRate}%` : '—'} color="#e65100" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Utilization Rate" value={apptStats.utilizationRate ? `${apptStats.utilizationRate}%` : '—'} color="#00796b" /></Grid>
        <Grid item xs={6} sm={3}><KPI label="Total Appointments" value={apptStats.total ?? '—'} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>Revenue by Doctor</Typography>
            {byDoctor.length > 0
              ? <Bar data={barData(byDoctor, 'description', 'total')} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
              : <Typography color="text.secondary" variant="body2">No data</Typography>}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>Revenue by Procedure</Typography>
            {byProc.length > 0
              ? <Bar data={barData(byProc, 'description', 'total')} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
              : <Typography color="text.secondary" variant="body2">No data</Typography>}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>New vs Returning Patients</Typography>
            {nvr.total > 0 ? (
              <Doughnut data={{
                labels: ['New', 'Returning'],
                datasets: [{ data: [nvr.new || 0, nvr.returning || 0], backgroundColor: ['#1976d2', '#2e7d32'] }],
              }} />
            ) : <Typography color="text.secondary" variant="body2">No data</Typography>}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>Appointment Breakdown</Typography>
            {apptStats.total > 0 ? (
              <Pie data={{
                labels: ['Completed', 'Cancelled', 'No-show', 'Other'],
                datasets: [{
                  data: [
                    apptStats.completed || 0,
                    apptStats.cancelled || 0,
                    apptStats.noShow || 0,
                    (apptStats.total || 0) - (apptStats.completed || 0) - (apptStats.cancelled || 0) - (apptStats.noShow || 0),
                  ],
                  backgroundColor: ['#2e7d32', '#d32f2f', '#e65100', '#9e9e9e'],
                }],
              }} />
            ) : <Typography color="text.secondary" variant="body2">No data</Typography>}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

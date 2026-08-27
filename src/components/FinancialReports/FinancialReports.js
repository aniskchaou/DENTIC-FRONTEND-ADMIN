import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, Tabs, Tab, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Divider,
  Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart, BarElement, LineElement, PointElement, CategoryScale, LinearScale,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

Chart.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth() + 1;

export default function FinancialReports() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // Daily collections
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
  // Monthly
  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(thisMonth);
  // Range for production vs collections / payment methods
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  // Tax year
  const [taxYear, setTaxYear] = useState(thisYear);

  const endpoints = [
    `/accounting/daily-collections?date=${dailyDate}`,
    `/accounting/monthly-report?year=${year}&month=${month}`,
    `/accounting/production-vs-collections?startDate=${startDate}&endDate=${endDate}`,
    `/accounting/tax-report?year=${taxYear}`,
    `/accounting/payment-methods-breakdown?startDate=${startDate}&endDate=${endDate}`,
    `/accounting/insurance-receivables`,
  ];

  const tabLabels = ['Daily Collections', 'Monthly Report', 'Production vs Collections', 'Tax Report', 'Payment Methods', 'Insurance Receivables'];

  const fetchReport = async () => {
    setLoading(true); setError(''); setData(null);
    try {
      const res = await axios.get(`${BASE_URL}${endpoints[tab]}`);
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/accounting/export/transactions?startDate=${startDate}&endDate=${endDate}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${startDate}-to-${endDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { setError('Export failed: ' + e.message); }
  };

  const renderControls = () => {
    switch (tab) {
      case 0: return <TextField type="date" label="Date" value={dailyDate} onChange={e => setDailyDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />;
      case 1: return (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField type="number" label="Year" value={year} onChange={e => setYear(e.target.value)} size="small" sx={{ width: 100 }} />
          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select value={month} label="Month" onChange={e => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => <MenuItem key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      );
      case 3: return <TextField type="number" label="Tax Year" value={taxYear} onChange={e => setTaxYear(e.target.value)} size="small" sx={{ width: 100 }} />;
      default: return (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField type="date" label="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
          <TextField type="date" label="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
        </Box>
      );
    }
  };

  const renderData = () => {
    if (!data) return null;
    switch (tab) {
      case 0: return <DailyCollectionsReport data={data} />;
      case 1: return <MonthlyReport data={data} />;
      case 2: return <ProductionVsCollections data={data} />;
      case 3: return <TaxReport data={data} />;
      case 4: return <PaymentMethodsReport data={data} />;
      case 5: return <InsuranceReceivablesReport data={data} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}><AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Financial Reports</Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>Export Transactions CSV</Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setData(null); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {tabLabels.map((l, i) => <Tab key={i} label={l} />)}
      </Tabs>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {renderControls()}
          <Button variant="contained" onClick={fetchReport} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : <BarChartIcon />}>Generate</Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {renderData()}
    </Box>
  );
}

function DailyCollectionsReport({ data }) {
  const methods = Object.entries(data.byMethod || {});
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Daily Collections — {data.date}</Typography>
      <Typography variant="h4" color="success.main" fontWeight={700}>${(data.totalCollected || 0).toFixed(2)}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{data.payments?.length || 0} transactions</Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {methods.map(([method, amount]) => (
          <Grid item xs={6} sm={4} key={method}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{method}</Typography>
              <Typography variant="h6" fontWeight={700}>${amount.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {data.payments?.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Transactions</Typography>
          <TableContainer><Table size="small">
            <TableHead><TableRow>
              <TableCell>Time</TableCell><TableCell>Patient</TableCell><TableCell>Method</TableCell><TableCell align="right">Amount</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {data.payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell>{p.patientId || '—'}</TableCell>
                  <TableCell>{p.paymentMethod || '—'}</TableCell>
                  <TableCell align="right">${(parseFloat(p.amount) || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </Box>
      )}
    </Paper>
  );
}

function MonthlyReport({ data }) {
  const labels = (data.daily || []).map(d => d.date);
  const amounts = (data.daily || []).map(d => d.amount);
  const chartData = { labels, datasets: [{ label: 'Daily Collections', data: amounts, backgroundColor: '#1976d2', borderRadius: 6 }] };
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Monthly Report — {new Date(0, data.month - 1).toLocaleString('default', { month: 'long' })} {data.year}</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Production', value: data.totalProduction, color: 'primary.main' },
          { label: 'Total Collections', value: data.totalCollected, color: 'success.main' },
          { label: 'Total Expenses', value: data.totalExpenses, color: 'error.main' },
          { label: 'Net Profit', value: data.netProfit, color: data.netProfit >= 0 ? 'success.main' : 'error.main' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h6" color={s.color} fontWeight={700}>${(s.value || 0).toFixed(2)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ height: 260 }}>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
      </Box>
    </Paper>
  );
}

function ProductionVsCollections({ data }) {
  const chartData = {
    labels: ['Production', 'Collections'],
    datasets: [{ data: [data.production || 0, data.collections || 0], backgroundColor: ['#1976d2', '#2e7d32'] }],
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Production vs Collections</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Production', value: data.production },
          { label: 'Collections', value: data.collections },
          { label: 'Adjustments', value: data.adjustments },
          { label: 'Collection Rate', value: null, rate: data.collectionRate },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h6" fontWeight={700}>{s.rate !== undefined ? `${s.rate}%` : `$${(s.value || 0).toFixed(2)}`}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ maxWidth: 300, mx: 'auto' }}>
        <Doughnut data={chartData} options={{ responsive: true }} />
      </Box>
    </Paper>
  );
}

function TaxReport({ data }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Tax Report — {data.year}</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Taxable Revenue', value: `$${(data.taxableRevenue || 0).toFixed(2)}` },
          { label: 'Tax Collected', value: `$${(data.totalTaxCollected || 0).toFixed(2)}` },
          { label: 'Invoice Count', value: data.invoiceCount || 0 },
        ].map(s => (
          <Grid item xs={6} sm={4} key={s.label}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h6" fontWeight={700}>{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <TableContainer><Table size="small">
        <TableHead><TableRow>
          <TableCell>Month</TableCell><TableCell align="right">Revenue</TableCell><TableCell align="right">Tax Collected</TableCell>
        </TableRow></TableHead>
        <TableBody>
          {(data.monthly || []).map(m => (
            <TableRow key={m.month}>
              <TableCell>{new Date(0, m.month - 1).toLocaleString('default', { month: 'long' })}</TableCell>
              <TableCell align="right">${(m.revenue || 0).toFixed(2)}</TableCell>
              <TableCell align="right">${(m.tax || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></TableContainer>
    </Paper>
  );
}

function PaymentMethodsReport({ data }) {
  const breakdown = data.breakdown || [];
  const chartData = {
    labels: breakdown.map(b => b.method),
    datasets: [{ data: breakdown.map(b => b.total), backgroundColor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1'] }],
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Payment Methods Breakdown</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Grand Total: <strong>${(data.grandTotal || 0).toFixed(2)}</strong></Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <TableContainer><Table size="small">
            <TableHead><TableRow>
              <TableCell>Method</TableCell><TableCell align="right">Transactions</TableCell><TableCell align="right">Total</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {breakdown.map(b => (
                <TableRow key={b.method}>
                  <TableCell>{b.method}</TableCell>
                  <TableCell align="right">{b.count}</TableCell>
                  <TableCell align="right">${(b.total || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 260, mx: 'auto' }}>
            <Doughnut data={chartData} options={{ responsive: true }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function InsuranceReceivablesReport({ data }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom><MonetizationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Insurance Receivables</Typography>
      <Typography variant="h4" color="warning.main" fontWeight={700}>${(data.totalReceivable || 0).toFixed(2)}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{data.count || 0} outstanding insurance invoices</Typography>
      <TableContainer><Table size="small">
        <TableHead><TableRow>
          <TableCell>Invoice #</TableCell><TableCell>Patient</TableCell><TableCell>Status</TableCell><TableCell align="right">Amount</TableCell>
        </TableRow></TableHead>
        <TableBody>
          {(data.items || []).map(inv => (
            <TableRow key={inv.id}>
              <TableCell>{inv.invoiceNumber || inv.id}</TableCell>
              <TableCell>{inv.patientId}</TableCell>
              <TableCell><Chip label={inv.paymentStatus} size="small" color={inv.paymentStatus === 'Overdue' ? 'error' : 'warning'} /></TableCell>
              <TableCell align="right">${(parseFloat(inv.grandTotal) || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></TableContainer>
    </Paper>
  );
}

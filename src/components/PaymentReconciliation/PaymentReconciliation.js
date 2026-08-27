import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, Button, Chip, CircularProgress, Alert, TextField, Tooltip, IconButton, Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

export default function PaymentReconciliation() {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${BASE_URL}/accounting/reconciliation/unreconciled`);
      setPayments(res.data || []);
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === payments.length ? [] : payments.map(p => p.id));

  const reconcileSelected = async () => {
    if (!selected.length) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      await axios.put(`${BASE_URL}/accounting/reconciliation/bulk`, { ids: selected, note });
      setSuccess(`${selected.length} payment(s) marked as reconciled.`);
      setSelected([]);
      setNote('');
      load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setSaving(false); }
  };

  const reconcileOne = async (id) => {
    setSaving(true); setError(''); setSuccess('');
    try {
      await axios.put(`${BASE_URL}/accounting/reconciliation/${id}`, { note });
      setSuccess('Payment reconciled.');
      load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setSaving(false); }
  };

  const totalSelected = payments.filter(p => selected.includes(p.id)).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const grandTotal = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}><SyncIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Payment Reconciliation</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" label="Reconciliation note" value={note} onChange={e => setNote(e.target.value)} sx={{ minWidth: 220 }} />
          <Button variant="contained" startIcon={<CheckCircleIcon />} onClick={reconcileSelected} disabled={!selected.length || saving}>
            Reconcile Selected ({selected.length})
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption" color="text.secondary">Unreconciled Payments</Typography>
          <Typography variant="h5" fontWeight={700}>{payments.length}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption" color="text.secondary">Total Unreconciled</Typography>
          <Typography variant="h5" fontWeight={700} color="warning.main">${grandTotal.toFixed(2)}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption" color="text.secondary">Selected Total</Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">${totalSelected.toFixed(2)}</Typography>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.length === payments.length && payments.length > 0} onChange={toggleAll} />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center">All payments reconciled ✓</TableCell></TableRow>
              )}
              {payments.map(p => (
                <TableRow key={p.id} selected={selected.includes(p.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                  </TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{p.patientId || '—'}</TableCell>
                  <TableCell>{p.invoiceId || '—'}</TableCell>
                  <TableCell><Chip label={p.paymentMethod || 'N/A'} size="small" /></TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{p.transactionId || '—'}</TableCell>
                  <TableCell align="right">${(parseFloat(p.amount) || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Tooltip title="Mark reconciled">
                      <IconButton size="small" color="success" onClick={() => reconcileOne(p.id)} disabled={saving}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

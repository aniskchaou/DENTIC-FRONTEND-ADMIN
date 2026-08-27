import React, { useState } from 'react';
import {
  Box, Button, Grid, TextField, MenuItem, Typography, Paper,
  Alert, CircularProgress, Divider, IconButton, Tooltip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateReceipt, emailReceipt } from '../../main/services/receptionistHTTPService';

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'Insurance', 'Other'];
const EMPTY_FORM = { invoiceId: '', patientName: '', clinicName: '', clinicAddress: '', date: '', paymentMethod: 'Cash', total: '', amountPaid: '', balance: '0.00', items: [{ description: '', amount: '' }] };

export default function ReceiptManager() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setItem = (i, k, v) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', amount: '' }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const calcTotal = () => {
    const total = form.items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0).toFixed(2);
    setField('total', total);
    const balance = (parseFloat(total) - (parseFloat(form.amountPaid) || parseFloat(total))).toFixed(2);
    setField('balance', balance < 0 ? '0.00' : balance);
  };

  const handlePreview = async () => {
    setLoading(true); setError('');
    try {
      const r = await generateReceipt(form);
      setPreviewHtml(r.data);
    } catch { setError('Failed to generate receipt'); }
    setLoading(false);
  };

  const handlePrint = async () => {
    setLoading(true); setError('');
    try {
      const r = await generateReceipt(form);
      const w = window.open('', '_blank');
      w.document.write(r.data);
      w.document.close();
      w.print();
    } catch { setError('Failed to generate receipt'); }
    setLoading(false);
  };

  const handleEmailReceipt = async () => {
    if (!emailTo) return setError('Please enter recipient email');
    setEmailLoading(true); setError('');
    try {
      await emailReceipt({ ...form, to: emailTo });
      setSuccess(`Receipt emailed to ${emailTo}`);
    } catch { setError('Failed to email receipt'); }
    setEmailLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>Receipt Manager</Typography>

      {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Receipt Details</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><TextField fullWidth size="small" label="Invoice #" value={form.invoiceId} onChange={e => setField('invoiceId', e.target.value)} /></Grid>
              <Grid item xs={6}><TextField fullWidth size="small" label="Date" type="date" InputLabelProps={{ shrink: true }} value={form.date || new Date().toISOString().split('T')[0]} onChange={e => setField('date', e.target.value)} /></Grid>
              <Grid item xs={12}><TextField fullWidth size="small" label="Patient Name" value={form.patientName} onChange={e => setField('patientName', e.target.value)} required /></Grid>
              <Grid item xs={12}><TextField fullWidth size="small" label="Clinic Name" value={form.clinicName} onChange={e => setField('clinicName', e.target.value)} /></Grid>
              <Grid item xs={12}><TextField fullWidth size="small" label="Clinic Address" value={form.clinicAddress} onChange={e => setField('clinicAddress', e.target.value)} /></Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" select label="Payment Method" value={form.paymentMethod} onChange={e => setField('paymentMethod', e.target.value)}>
                  {PAYMENT_METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2">Line Items</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addItem}>Add Item</Button>
            </Box>
            {form.items.map((item, i) => (
              <Grid container spacing={1} key={i} alignItems="center" mb={0.5}>
                <Grid item xs={7}><TextField fullWidth size="small" label="Description" value={item.description} onChange={e => setItem(i, 'description', e.target.value)} /></Grid>
                <Grid item xs={3}><TextField fullWidth size="small" label="Amount" type="number" value={item.amount} onChange={e => { setItem(i, 'amount', e.target.value); }} onBlur={calcTotal} /></Grid>
                <Grid item xs={2}><Tooltip title="Remove"><IconButton size="small" onClick={() => removeItem(i)}><DeleteIcon fontSize="small" /></IconButton></Tooltip></Grid>
              </Grid>
            ))}

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><TextField fullWidth size="small" label="Total" value={form.total} onChange={e => setField('total', e.target.value)} /></Grid>
              <Grid item xs={4}><TextField fullWidth size="small" label="Amount Paid" value={form.amountPaid} onChange={e => { setField('amountPaid', e.target.value); setField('balance', (parseFloat(form.total) - parseFloat(e.target.value) || 0).toFixed(2)); }} /></Grid>
              <Grid item xs={4}><TextField fullWidth size="small" label="Balance" value={form.balance} InputProps={{ readOnly: true }} /></Grid>
            </Grid>

            <Box mt={2} display="flex" gap={1}>
              <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePreview} disabled={loading}>Preview</Button>
              <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading || !form.patientName}>
                {loading ? <CircularProgress size={20} /> : 'Print Receipt'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" mb={1}>Email Receipt</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}><TextField fullWidth size="small" label="Recipient Email" value={emailTo} onChange={e => setEmailTo(e.target.value)} type="email" /></Grid>
              <Grid item xs={4}>
                <Button variant="contained" startIcon={<EmailIcon />} fullWidth onClick={handleEmailReceipt} disabled={emailLoading || !emailTo}>
                  {emailLoading ? <CircularProgress size={20} /> : 'Send'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, minHeight: 300 }}>
            <Typography variant="subtitle2" gutterBottom>Receipt Preview</Typography>
            <Divider sx={{ mb: 2 }} />
            {previewHtml ? (
              <Box sx={{ border: '1px solid #eee', borderRadius: 1, overflow: 'hidden' }}>
                <iframe srcDoc={previewHtml} style={{ width: '100%', minHeight: 500, border: 'none' }} title="Receipt Preview" />
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled" textAlign="center" mt={6}>
                Fill in the form and click Preview to see the receipt
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

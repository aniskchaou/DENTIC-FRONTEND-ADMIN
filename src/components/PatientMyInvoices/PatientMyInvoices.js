import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const STATUS_COLORS = { Paid: 'success', Pending: 'warning', 'Partially Paid': 'info', Overdue: 'error' };

export default function PatientMyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);

  const patientId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.patientId || JSON.parse(localStorage.getItem('user'))?.id || ''; } catch { return ''; }
  })();

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/patient-portal/invoices/${patientId}`)
      .then(res => setInvoices(res.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = invoices.reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
  const paid = invoices.filter(i => i.paymentStatus === 'Paid').reduce((s, i) => s + (parseFloat(i.grandTotal) || 0), 0);
  const outstanding = total - paid;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}><ReceiptLongIcon sx={{ mr: 1, verticalAlign: 'middle' }} />My Invoices</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Billed', value: `$${total.toFixed(2)}` },
          { label: 'Total Paid', value: `$${paid.toFixed(2)}`, color: 'success.main' },
          { label: 'Outstanding Balance', value: `$${outstanding.toFixed(2)}`, color: outstanding > 0 ? 'warning.main' : 'text.primary' },
        ].map(s => (
          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 160 }} key={s.label}>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            <Typography variant="h6" fontWeight={700} color={s.color || 'text.primary'}>{s.value}</Typography>
          </Paper>
        ))}
      </Box>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Invoice #</TableCell><TableCell>Date</TableCell><TableCell>Services</TableCell>
              <TableCell align="right">Total</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {invoices.length === 0 && <TableRow><TableCell colSpan={6} align="center">No invoices</TableCell></TableRow>}
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{inv.invoiceNumber || `#${inv.id}`}</TableCell>
                  <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{Array.isArray(inv.items) ? inv.items.map(i => i.name || i.description || '').filter(Boolean).join(', ').slice(0, 50) || '—' : '—'}</TableCell>
                  <TableCell align="right">${(parseFloat(inv.grandTotal) || 0).toFixed(2)}</TableCell>
                  <TableCell><Chip label={inv.paymentStatus} size="small" color={STATUS_COLORS[inv.paymentStatus] || 'default'} /></TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => setViewInvoice(inv)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Invoice Dialog */}
      <Dialog open={Boolean(viewInvoice)} onClose={() => setViewInvoice(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Invoice {viewInvoice?.invoiceNumber || `#${viewInvoice?.id}`}</DialogTitle>
        <DialogContent>
          {viewInvoice && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Date: {new Date(viewInvoice.createdAt).toLocaleDateString()}</Typography>
                <Chip label={viewInvoice.paymentStatus} color={STATUS_COLORS[viewInvoice.paymentStatus] || 'default'} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>Items</Typography>
              <TableContainer><Table size="small">
                <TableHead><TableRow><TableCell>Description</TableCell><TableCell align="right">Qty</TableCell><TableCell align="right">Price</TableCell></TableRow></TableHead>
                <TableBody>
                  {(Array.isArray(viewInvoice.items) ? viewInvoice.items : []).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name || item.description || 'Item'}</TableCell>
                      <TableCell align="right">{item.quantity || 1}</TableCell>
                      <TableCell align="right">${(parseFloat(item.price || item.unitPrice) || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table></TableContainer>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">Subtotal: ${(parseFloat(viewInvoice.subTotal) || 0).toFixed(2)}</Typography>
                {viewInvoice.taxAmount > 0 && <Typography variant="body2">Tax: ${(parseFloat(viewInvoice.taxAmount) || 0).toFixed(2)}</Typography>}
                <Typography variant="h6" fontWeight={700}>Total: ${(parseFloat(viewInvoice.grandTotal) || 0).toFixed(2)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewInvoice(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

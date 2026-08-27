import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getPatientRefunds, createPatientRefund, updatePatientRefundStatus } from '../../main/services/clinicOwnerHTTPService';

const STATUS_COLORS = { pending: 'warning', approved: 'info', rejected: 'error', processed: 'success' };
const empty = { clinicId: '', patientId: '', invoiceId: '', paymentId: '', amount: '', reason: '', refundMethod: 'cash', notes: '' };

export default function PatientRefund() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id || '';

  const load = () => getPatientRefunds({ clinicId, status: filter || undefined }).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, [filter]);

  const handleCreate = async () => {
    try {
      await createPatientRefund({ ...form, clinicId });
      setOpen(false); setForm({ ...empty, clinicId }); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const updateStatus = async (id, status) => {
    await updatePatientRefundStatus(id, { status, processedBy: userId }); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Patient Refunds</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ width: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={filter} onChange={e => setFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="processed">Processed</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>New Refund</Button>
        </Box>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Patient', 'Invoice', 'Amount', 'Method', 'Reason', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.patientId}</TableCell>
                <TableCell>{r.invoiceId || '—'}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>${parseFloat(r.amount || 0).toFixed(2)}</TableCell>
                <TableCell>{r.refundMethod}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{r.reason}</TableCell>
                <TableCell><Chip label={r.status} size="small" color={STATUS_COLORS[r.status] || 'default'} /></TableCell>
                <TableCell>
                  {r.status === 'pending' && (
                    <>
                      <Button size="small" color="success" onClick={() => updateStatus(r.id, 'approved')}>Approve</Button>
                      <Button size="small" color="error" onClick={() => updateStatus(r.id, 'rejected')}>Reject</Button>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <Button size="small" color="info" onClick={() => updateStatus(r.id, 'processed')}>Mark Processed</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No refunds found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Patient Refund</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Patient ID *" value={form.patientId} onChange={e => f('patientId', e.target.value)} size="small" />
            <TextField label="Invoice ID (optional)" value={form.invoiceId} onChange={e => f('invoiceId', e.target.value)} size="small" />
            <TextField label="Payment ID (optional)" value={form.paymentId} onChange={e => f('paymentId', e.target.value)} size="small" />
            <TextField label="Amount *" type="number" value={form.amount} onChange={e => f('amount', e.target.value)} size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Refund Method</InputLabel>
              <Select label="Refund Method" value={form.refundMethod} onChange={e => f('refundMethod', e.target.value)}>
                {['cash', 'card', 'bank_transfer', 'credit'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Reason *" value={form.reason} onChange={e => f('reason', e.target.value)} size="small" multiline rows={2} />
            <TextField label="Notes" value={form.notes} onChange={e => f('notes', e.target.value)} size="small" multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

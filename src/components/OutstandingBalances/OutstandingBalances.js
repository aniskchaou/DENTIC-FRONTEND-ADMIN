import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead,
  TableRow, Chip, Button, TextField,
} from '@mui/material';
import { getOutstandingBalances } from '../../main/services/clinicOwnerHTTPService';

const STATUS_COLORS = { Pending: 'warning', Overdue: 'error' };

export default function OutstandingBalances() {
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const [data, setData] = useState({ invoices: [], total: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOutstandingBalances({ clinicId }).then(r => setData(r.data)).catch(() => {});
  }, []);

  const filtered = data.invoices.filter(i =>
    !search ||
    (i.invoiceNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.patientId || '').toString().includes(search)
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Outstanding Balances</Typography>
        <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center', borderLeft: '4px solid #ed6c02' }}>
          <Typography variant="h5" fontWeight={700} color="#ed6c02">${parseFloat(data.total || 0).toFixed(2)}</Typography>
          <Typography variant="caption">Total Outstanding</Typography>
        </Paper>
      </Box>

      <TextField
        placeholder="Search by invoice # or patient…" size="small" sx={{ mb: 2, width: 300 }}
        value={search} onChange={e => setSearch(e.target.value)}
      />

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#fff8e1' }}>
              {['Invoice #', 'Patient', 'Amount', 'Due Date', 'Status', 'Age (days)'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(inv => {
              const daysOld = Math.floor((new Date() - new Date(inv.dueDate || inv.createdAt)) / 86400000);
              return (
                <TableRow key={inv.id} hover sx={{ background: inv.paymentStatus === 'Overdue' ? '#fff3f3' : undefined }}>
                  <TableCell>{inv.invoiceNumber || inv.id}</TableCell>
                  <TableCell>{inv.patientId}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>${parseFloat(inv.totalAmount || 0).toFixed(2)}</TableCell>
                  <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</TableCell>
                  <TableCell><Chip label={inv.paymentStatus} size="small" color={STATUS_COLORS[inv.paymentStatus] || 'default'} /></TableCell>
                  <TableCell sx={{ color: daysOld > 30 ? '#d32f2f' : undefined }}>{daysOld}d</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No outstanding invoices</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

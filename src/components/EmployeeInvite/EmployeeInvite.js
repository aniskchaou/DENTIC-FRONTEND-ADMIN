import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Chip, Alert,
} from '@mui/material';
import { getEmployeeInvites, sendEmployeeInvite, revokeEmployeeInvite } from '../../main/services/clinicOwnerHTTPService';

const ROLES = ['ADMIN', 'DOCTOR', 'STAFF', 'ACCOUNTANT', 'TECHNICAL'];
const STATUS_COLORS = { pending: 'warning', accepted: 'success', expired: 'default', revoked: 'error' };
const empty = { email: '', role: 'STAFF' };

export default function EmployeeInvite() {
  const [invites, setInvites] = useState([]);
  const [form, setForm] = useState(empty);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id || '';

  const load = () => getEmployeeInvites(clinicId).then(r => setInvites(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleInvite = async () => {
    setError(''); setLink('');
    try {
      const res = await sendEmployeeInvite({ ...form, clinicId, invitedBy: userId });
      setLink(res.data.inviteLink);
      setForm(empty);
      load();
    } catch (e) { setError(e.response?.data?.error || 'Failed to send invite'); }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this invite?')) return;
    await revokeEmployeeInvite(id); load();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>Employee Invitations</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Send Invite</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
          <TextField
            label="Email address *" size="small" sx={{ minWidth: 240 }}
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleInvite}>Send Invite</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {link && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Invite created!</strong> Share this link with the employee:
            <Box component="code" sx={{ display: 'block', mt: 1, p: 1, background: '#f5f5f5', borderRadius: 1, wordBreak: 'break-all' }}>
              {window.location.origin}{link}
            </Box>
          </Alert>
        )}
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Email', 'Role', 'Status', 'Sent', 'Expires', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {invites.map(inv => (
              <TableRow key={inv.id} hover>
                <TableCell>{inv.email}</TableCell>
                <TableCell>{inv.role}</TableCell>
                <TableCell><Chip label={inv.status} size="small" color={STATUS_COLORS[inv.status] || 'default'} /></TableCell>
                <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(inv.expiresAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {inv.status === 'pending' && (
                    <Button size="small" color="error" onClick={() => handleRevoke(inv.id)}>Revoke</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {invites.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No invitations sent</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import { getAppointmentTypes, createAppointmentType, updateAppointmentType, deactivateAppointmentType } from '../../main/services/clinicOwnerHTTPService';

const empty = { clinicId: '', name: '', durationMinutes: 30, price: 0, color: '#2196f3', description: '', requiresConfirmation: false, isActive: true };

export default function AppointmentTypes() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getAppointmentTypes(clinicId).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleOpen = (row = null) => {
    setEditing(row);
    setForm(row ? { ...row } : { ...empty, clinicId });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await updateAppointmentType(editing.id, form);
      else await createAppointmentType(form);
      setOpen(false); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Appointment Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Type</Button>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Color', 'Name', 'Duration', 'Price', 'Requires Confirmation', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell><Box sx={{ width: 20, height: 20, borderRadius: '50%', background: r.color, border: '1px solid #ccc' }} /></TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.durationMinutes} min</TableCell>
                <TableCell>${parseFloat(r.price || 0).toFixed(2)}</TableCell>
                <TableCell>{r.requiresConfirmation ? '✓' : '—'}</TableCell>
                <TableCell>
                  <Chip label={r.isActive ? 'Active' : 'Inactive'} color={r.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon fontSize="small" /></IconButton>
                  {r.isActive && (
                    <IconButton size="small" color="warning" title="Deactivate" onClick={async () => { await deactivateAppointmentType(r.id); load(); }}>
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No appointment types yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Type' : 'Add Appointment Type'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Name *" value={form.name} onChange={e => f('name', e.target.value)} size="small" />
            <Box display="flex" gap={2}>
              <TextField label="Duration (min)" type="number" value={form.durationMinutes} onChange={e => f('durationMinutes', e.target.value)} size="small" sx={{ flex: 1 }} />
              <TextField label="Price ($)" type="number" value={form.price} onChange={e => f('price', e.target.value)} size="small" sx={{ flex: 1 }} />
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <TextField label="Color" type="color" value={form.color} onChange={e => f('color', e.target.value)} size="small" sx={{ width: 100 }} />
            </Box>
            <TextField label="Description" value={form.description} onChange={e => f('description', e.target.value)} size="small" multiline rows={2} />
            <FormControlLabel control={<Switch checked={!!form.requiresConfirmation} onChange={e => f('requiresConfirmation', e.target.checked)} />} label="Requires confirmation" />
            <FormControlLabel control={<Switch checked={!!form.isActive} onChange={e => f('isActive', e.target.checked)} />} label="Active" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

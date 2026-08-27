import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import {
  getClinicLocations, createClinicLocation, updateClinicLocation,
  deleteClinicLocation, setMainLocation,
} from '../../main/services/clinicOwnerHTTPService';

const empty = { clinicId: '', name: '', address: '', city: '', phone: '', email: '', isActive: true, colorScheme: '' };

export default function ClinicLocations() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getClinicLocations(clinicId).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleOpen = (row = null) => {
    setEditing(row);
    setForm(row ? { ...row } : { ...empty, clinicId });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await updateClinicLocation(editing.id, form);
      else await createClinicLocation(form);
      setOpen(false); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this location?')) return;
    await deleteClinicLocation(id); load();
  };

  const handleSetMain = async (id) => { await setMainLocation(id); load(); };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Clinic Locations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Location</Button>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Name', 'Address', 'City', 'Phone', 'Email', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>
                  {r.name} {r.isMain && <Chip label="Main" size="small" color="primary" sx={{ ml: 1 }} />}
                </TableCell>
                <TableCell>{r.address}</TableCell>
                <TableCell>{r.city}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>
                  <Chip label={r.isActive ? 'Active' : 'Inactive'} color={r.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" title="Set as Main" onClick={() => handleSetMain(r.id)}><StarIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No locations yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Name *" value={form.name} onChange={e => f('name', e.target.value)} size="small" />
            <TextField label="Address *" value={form.address} onChange={e => f('address', e.target.value)} size="small" />
            <TextField label="City *" value={form.city} onChange={e => f('city', e.target.value)} size="small" />
            <TextField label="Phone" value={form.phone} onChange={e => f('phone', e.target.value)} size="small" />
            <TextField label="Email" value={form.email} onChange={e => f('email', e.target.value)} size="small" />
            <Box display="flex" gap={2} alignItems="center">
              <TextField label="Brand Color (hex)" value={form.colorScheme} onChange={e => f('colorScheme', e.target.value)} size="small" sx={{ width: 180 }} />
              {form.colorScheme && <Box sx={{ width: 32, height: 32, borderRadius: 1, background: form.colorScheme, border: '1px solid #ccc' }} />}
            </Box>
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

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Switch, FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getRooms, createRoom, updateRoom, deleteRoom, toggleRoom } from '../../main/services/clinicOwnerHTTPService';

const TYPES = ['chair', 'room', 'lab', 'xray', 'consult'];
const TYPE_COLORS = { chair: '#4caf50', room: '#2196f3', lab: '#9c27b0', xray: '#ff9800', consult: '#607d8b' };
const empty = { clinicId: '', name: '', type: 'chair', isActive: true, notes: '', color: '#4caf50' };

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getRooms(clinicId).then(r => setRooms(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleOpen = (row = null) => {
    setEditing(row);
    setForm(row ? { ...row } : { ...empty, clinicId });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await updateRoom(editing.id, form);
      else await createRoom(form);
      setOpen(false); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const byType = TYPES.reduce((acc, t) => {
    acc[t] = rooms.filter(r => r.type === t);
    return acc;
  }, {});

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Rooms & Chairs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Room</Button>
      </Box>

      {TYPES.map(type => byType[type].length > 0 && (
        <Box key={type} mb={3}>
          <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1, color: TYPE_COLORS[type] }}>
            {type}s ({byType[type].length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {byType[type].map(r => (
              <Paper key={r.id} sx={{ p: 2, minWidth: 160, borderLeft: `4px solid ${r.color || TYPE_COLORS[r.type]}`, opacity: r.isActive ? 1 : 0.5 }}>
                <Typography fontWeight={700}>{r.name}</Typography>
                <Chip label={r.isActive ? 'Available' : 'Inactive'} size="small" color={r.isActive ? 'success' : 'default'} sx={{ mt: 0.5 }} />
                {r.notes && <Typography variant="caption" display="block" mt={0.5}>{r.notes}</Typography>}
                <Box mt={1} display="flex" gap={1}>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={async () => { await toggleRoom(r.id); load(); }} title={r.isActive ? 'Deactivate' : 'Activate'}>
                    <Switch size="small" checked={!!r.isActive} sx={{ pointerEvents: 'none' }} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={async () => { if (window.confirm('Delete?')) { await deleteRoom(r.id); load(); } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      ))}

      {rooms.length === 0 && <Typography color="text.secondary">No rooms or chairs configured yet.</Typography>}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? 'Edit Room' : 'Add Room / Chair'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Name *" value={form.name} onChange={e => f('name', e.target.value)} size="small" placeholder="e.g. Chair 1, Room A" />
            <FormControl size="small" fullWidth>
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={form.type} onChange={e => f('type', e.target.value)}>
                {TYPES.map(t => <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <Box display="flex" gap={2} alignItems="center">
              <TextField label="Color" type="color" value={form.color} onChange={e => f('color', e.target.value)} size="small" sx={{ width: 100 }} />
            </Box>
            <TextField label="Notes" value={form.notes} onChange={e => f('notes', e.target.value)} size="small" multiline rows={2} />
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

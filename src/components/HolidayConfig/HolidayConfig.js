import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from '../../main/services/clinicOwnerHTTPService';

const empty = { clinicId: '', name: '', date: '', isRecurring: false, closedAllDay: true, openTime: '', closeTime: '', note: '' };

export default function HolidayConfig() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getHolidays(clinicId).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleOpen = (row = null) => {
    setEditing(row);
    setForm(row ? { ...row, date: row.date?.slice(0, 10) || '' } : { ...empty, clinicId });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await updateHoliday(editing.id, form);
      else await createHoliday(form);
      setOpen(false); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    await deleteHoliday(id); load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Holidays & Closures</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Holiday</Button>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Name', 'Date', 'Recurring', 'Hours', 'Note', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.isRecurring ? <Chip label="Yearly" size="small" color="primary" /> : '—'}</TableCell>
                <TableCell>{r.closedAllDay ? 'Closed all day' : `${r.openTime} – ${r.closeTime}`}</TableCell>
                <TableCell>{r.note || '—'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No holidays configured</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Name *" value={form.name} onChange={e => f('name', e.target.value)} size="small" />
            <TextField label="Date *" type="date" value={form.date} onChange={e => f('date', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <FormControlLabel control={<Switch checked={!!form.isRecurring} onChange={e => f('isRecurring', e.target.checked)} />} label="Repeats every year" />
            <FormControlLabel control={<Switch checked={!!form.closedAllDay} onChange={e => f('closedAllDay', e.target.checked)} />} label="Closed all day" />
            {!form.closedAllDay && (
              <Box display="flex" gap={2}>
                <TextField label="Open" type="time" value={form.openTime} onChange={e => f('openTime', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                <TextField label="Close" type="time" value={form.closeTime} onChange={e => f('closeTime', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
              </Box>
            )}
            <TextField label="Note" value={form.note} onChange={e => f('note', e.target.value)} size="small" multiline rows={2} />
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

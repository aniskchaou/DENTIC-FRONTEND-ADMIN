import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip,
  Switch, FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import { getServicePrices, createServicePrice, updateServicePrice, deactivateServicePrice } from '../../main/services/clinicOwnerHTTPService';

const CATEGORIES = ['consultation', 'procedure', 'imaging', 'lab', 'other'];
const CATEGORY_COLORS = { consultation: '#1976d2', procedure: '#2e7d32', imaging: '#9c27b0', lab: '#ed6c02', other: '#757575' };
const empty = { clinicId: '', name: '', category: 'procedure', standardPrice: '', minPrice: '', maxPrice: '', insuranceCovered: false, insuranceRate: 0, durationMinutes: '', notes: '', isActive: true };

export default function PricingManagement() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [catFilter, setCatFilter] = useState('');
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getServicePrices({ clinicId, category: catFilter || undefined }).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, [catFilter]);

  const handleOpen = (row = null) => {
    setEditing(row);
    setForm(row ? { ...row } : { ...empty, clinicId });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await updateServicePrice(editing.id, form);
      else await createServicePrice(form);
      setOpen(false); load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const grouped = CATEGORIES.reduce((acc, c) => {
    acc[c] = rows.filter(r => r.category === c);
    return acc;
  }, {});

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Treatment Pricing</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ width: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Service</Button>
        </Box>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              {['Category', 'Service Name', 'Standard Price', 'Range', 'Duration', 'Insurance', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>
                  <Chip label={r.category} size="small" sx={{ background: CATEGORY_COLORS[r.category], color: '#fff', textTransform: 'capitalize' }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#2e7d32' }}>${parseFloat(r.standardPrice || 0).toFixed(2)}</TableCell>
                <TableCell>
                  {r.minPrice && r.maxPrice ? `$${parseFloat(r.minPrice).toFixed(0)} – $${parseFloat(r.maxPrice).toFixed(0)}` : '—'}
                </TableCell>
                <TableCell>{r.durationMinutes ? `${r.durationMinutes} min` : '—'}</TableCell>
                <TableCell>{r.insuranceCovered ? <Chip label={`${r.insuranceRate}%`} size="small" color="info" /> : '—'}</TableCell>
                <TableCell><Chip label={r.isActive ? 'Active' : 'Inactive'} size="small" color={r.isActive ? 'success' : 'default'} /></TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(r)}><EditIcon fontSize="small" /></IconButton>
                  {r.isActive && (
                    <IconButton size="small" color="warning" title="Deactivate" onClick={async () => { await deactivateServicePrice(r.id); load(); }}>
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={8} align="center">No pricing items yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Service Price' : 'Add Service Price'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Service Name *" value={form.name} onChange={e => f('name', e.target.value)} size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={form.category} onChange={e => f('category', e.target.value)}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <Box display="flex" gap={2}>
              <TextField label="Standard Price *" type="number" value={form.standardPrice} onChange={e => f('standardPrice', e.target.value)} size="small" sx={{ flex: 1 }} />
              <TextField label="Duration (min)" type="number" value={form.durationMinutes} onChange={e => f('durationMinutes', e.target.value)} size="small" sx={{ flex: 1 }} />
            </Box>
            <Box display="flex" gap={2}>
              <TextField label="Min Price" type="number" value={form.minPrice} onChange={e => f('minPrice', e.target.value)} size="small" sx={{ flex: 1 }} />
              <TextField label="Max Price" type="number" value={form.maxPrice} onChange={e => f('maxPrice', e.target.value)} size="small" sx={{ flex: 1 }} />
            </Box>
            <FormControlLabel control={<Switch checked={!!form.insuranceCovered} onChange={e => f('insuranceCovered', e.target.checked)} />} label="Insurance covered" />
            {form.insuranceCovered && (
              <TextField label="Insurance rate (%)" type="number" value={form.insuranceRate} onChange={e => f('insuranceRate', e.target.value)} size="small" inputProps={{ min: 0, max: 100 }} />
            )}
            <TextField label="Notes" value={form.notes} onChange={e => f('notes', e.target.value)} size="small" multiline rows={2} />
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

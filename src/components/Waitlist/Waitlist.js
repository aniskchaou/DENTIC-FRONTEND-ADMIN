import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {
  getWaitlist, addToWaitlist, updateWaitlistEntry,
  notifyWaitlistEntry, removeFromWaitlist,
} from '../../main/services/clinicOwnerHTTPService';

const STATUS_META = {
  waiting:   { color: '#f57c00', bg: '#fff3e0', label: 'Waiting'   },
  notified:  { color: '#0288d1', bg: '#e1f5fe', label: 'Notified'  },
  booked:    { color: '#388e3c', bg: '#e8f5e9', label: 'Booked'    },
  expired:   { color: '#616161', bg: '#f5f5f5', label: 'Expired'   },
  cancelled: { color: '#d32f2f', bg: '#ffebee', label: 'Cancelled' },
};
const PRIORITY_META = {
  low:    { color: '#9e9e9e', bg: '#f5f5f5',   dot: '#9e9e9e' },
  normal: { color: '#1976d2', bg: '#e3f2fd',   dot: '#2196f3' },
  urgent: { color: '#d32f2f', bg: '#ffebee',   dot: '#f44336' },
};

const empty = { clinicId: '', patientId: '', doctorId: '', preferredDate: '', preferredTime: '', appointmentType: '', reason: '', priority: 'normal', notes: '' };

export default function Waitlist() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('waiting');
  const clinicId = JSON.parse(localStorage.getItem('user') || '{}').clinicId || '';

  const load = () => getWaitlist({ clinicId, status: filter || undefined }).then(r => setRows(Array.isArray(r.data) ? r.data : (r.data?.value || []))).catch(() => {});
  useEffect(() => { load(); }, [filter]);

  const handleAdd = async () => {
    try { await addToWaitlist({ ...form, clinicId }); setOpen(false); setForm({ ...empty, clinicId }); load(); }
    catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const statusCounts = Object.fromEntries(['waiting','notified','booked','expired','cancelled'].map(s => [s, rows.filter(r=>r.status===s).length]));

  return (
    <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100%', p: { xs: 2, md: 3 } }}>

      {/* Page header */}
      <Box sx={{
        background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 55%, #42a5f5 100%)',
        borderRadius: 3, p: 3, mb: 3,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>
            <PeopleAltIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Waitlist
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
            {rows.length} patient{rows.length !== 1 ? 's' : ''} in queue
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ width: 140, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
            <Select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="">All</MenuItem>
              {['waiting','notified','booked','expired','cancelled'].map(s => (
                <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
            sx={{ bgcolor: '#fff', color: '#1565c0', fontWeight: 700, '&:hover': { bgcolor: '#e3f2fd' } }}>
            Add to Waitlist
          </Button>
        </Box>
      </Box>

      {/* Status summary chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).filter(([,v])=>v>0).map(([s,v]) => {
          const m = STATUS_META[s] || {};
          return (
            <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: m.bg, border: `1px solid ${m.color}30`, borderRadius: 2, px: 1.5, py: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.color }} />
              <Typography variant="caption" sx={{ color: m.color, fontWeight: 700 }}>{m.label}: {v}</Typography>
            </Box>
          );
        })}
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e8edf2', borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['#','Priority','Preferred Date','Type','Reason','Status','Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, borderBottom: '2px solid #e8edf2' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => {
                const pm = PRIORITY_META[r.priority] || PRIORITY_META.normal;
                const sm = STATUS_META[r.status] || {};
                return (
                  <TableRow key={r.id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' }, borderBottom: '1px solid #f1f5f9' }}>
                    {/* sequential row number instead of UUID */}
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: 13 }}>#{rows.indexOf(r) + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, bgcolor: pm.bg, border: `1px solid ${pm.color}30`, borderRadius: 2, px: 1, py: 0.3 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: pm.dot, flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: pm.color, fontWeight: 700, textTransform: 'capitalize' }}>{r.priority}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {r.preferredDate
                        ? <Box>
                            <Typography variant="body2" fontWeight={600}>{r.preferredDate}</Typography>
                            {r.preferredTime && <Typography variant="caption" color="text.secondary">🕐 {r.preferredTime}</Typography>}
                          </Box>
                        : <Typography variant="body2" color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell>
                      {r.appointmentType
                        ? <Chip label={r.appointmentType} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: 11 }} />
                        : <Typography variant="body2" color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 160 }}>
                      <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: sm.bg, border: `1px solid ${(sm.color||'#999')}30`, borderRadius: 2, px: 1.2, py: 0.3 }}>
                        <Typography variant="caption" sx={{ color: sm.color, fontWeight: 700 }}>{sm.label || r.status}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {r.status === 'waiting' && (
                          <Tooltip title="Notify patient">
                            <IconButton size="small" sx={{ color: '#1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' }, borderRadius: 1.5, p: 0.6 }}
                              onClick={async () => { await notifyWaitlistEntry(r.id); load(); }}>
                              <NotificationsIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Remove">
                          <IconButton size="small" sx={{ color: '#d32f2f', bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' }, borderRadius: 1.5, p: 0.6 }}
                            onClick={async () => { if (window.confirm('Remove from waitlist?')) { await removeFromWaitlist(r.id); load(); } }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    <PeopleAltIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3, display: 'block', mx: 'auto' }} />
                    No entries in waitlist
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add to Waitlist</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Patient ID *" value={form.patientId} onChange={e => f('patientId', e.target.value)} size="small" />
            <TextField label="Doctor ID (optional)" value={form.doctorId} onChange={e => f('doctorId', e.target.value)} size="small" />
            <Box display="flex" gap={2}>
              <TextField label="Preferred Date" type="date" value={form.preferredDate} onChange={e => f('preferredDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
              <TextField label="Preferred Time" type="time" value={form.preferredTime} onChange={e => f('preferredTime', e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
            </Box>
            <TextField label="Appointment Type" value={form.appointmentType} onChange={e => f('appointmentType', e.target.value)} size="small" />
            <TextField label="Reason" value={form.reason} onChange={e => f('reason', e.target.value)} size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select label="Priority" value={form.priority} onChange={e => f('priority', e.target.value)}>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Notes" value={form.notes} onChange={e => f('notes', e.target.value)} size="small" multiline rows={2} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAdd} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



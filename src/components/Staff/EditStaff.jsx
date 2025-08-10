import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Chip, Typography } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const roles = ["Admin", "Dentist", "Assistant", "Receptionist", "Accountant"];
const permissionsList = [
  "View Patients", "Edit Patients", "View Appointments", "Edit Appointments",
  "View Billing", "Edit Billing", "Manage Inventory", "Manage Staff"
];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const statusOptions = ["Active", "Inactive", "On Leave"];

const EditStaff = ({ staff, closeModal }) => {
  const [form, setForm] = useState({
    fullName: '',
    role: '',
    email: '',
    phone: '',
    shiftSchedule: {
      Mon: { start: '', end: '' },
      Tue: { start: '', end: '' },
      Wed: { start: '', end: '' },
      Thu: { start: '', end: '' },
      Fri: { start: '', end: '' },
      Sat: { start: '', end: '' },
      Sun: { start: '', end: '' }
    },
    permissions: [],
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setForm({
        fullName: staff.fullName || '',
        role: staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        shiftSchedule: staff.shiftSchedule || {
          Mon: { start: '', end: '' },
          Tue: { start: '', end: '' },
          Wed: { start: '', end: '' },
          Thu: { start: '', end: '' },
          Fri: { start: '', end: '' },
          Sat: { start: '', end: '' },
          Sun: { start: '', end: '' }
        },
        permissions: staff.permissions || [],
        status: staff.status || 'Active'
      });
    }
  }, [staff]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleScheduleChange = (day, field, value) => {
    setForm(f => ({
      ...f,
      shiftSchedule: {
        ...f.shiftSchedule,
        [day]: { ...f.shiftSchedule[day], [field]: value }
      }
    }));
  };

  const handlePermissionToggle = perm => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const staffData = {
      fullName: form.fullName,
      role: form.role,
      email: form.email,
      phone: form.phone,
      shiftSchedule: form.shiftSchedule,
      permissions: form.permissions,
      status: form.status,
      updatedAt: now
    };
    try {
      await axios.put(`${BASE_URL}/staff/${staff.id}`, staffData);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          required
        >
          {roles.map(role => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          type="email"
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
        />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Shift Schedule</Typography>
          <Stack spacing={1}>
            {daysOfWeek.map(day => (
              <Stack direction="row" spacing={1} alignItems="center" key={day}>
                <Typography sx={{ width: 40 }}>{day}</Typography>
                <TextField
                  label="Start"
                  type="time"
                  size="small"
                  value={form.shiftSchedule[day].start}
                  onChange={e => handleScheduleChange(day, 'start', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="End"
                  type="time"
                  size="small"
                  value={form.shiftSchedule[day].end}
                  onChange={e => handleScheduleChange(day, 'end', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 120 }}
                />
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Permissions</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {permissionsList.map(perm => (
              <Chip
                key={perm}
                label={perm}
                color={form.permissions.includes(perm) ? "primary" : "default"}
                variant={form.permissions.includes(perm) ? "filled" : "outlined"}
                onClick={() => handlePermissionToggle(perm)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          required
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditStaff;
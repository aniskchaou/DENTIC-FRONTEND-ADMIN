import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const roles = [ "Assistant", "Receptionist", "Accountant"];
const permissionsList = [
  "View Patients", "Edit Patients", "View Appointments", "Edit Appointments",
  "View Billing", "Edit Billing", "Manage Inventory"
];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const statusOptions = ["Active", "Inactive"];

const AddStaff = ({ closeModal }) => {
  const { t } = useTranslation();
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
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/staff`, staffData);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label={t('staff.full_name')}
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          select
          label={t('staff.role')}
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          required
        >
          {roles.map(role => (
            <MenuItem key={role} value={role}>{t(`staff.role_${role.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('staff.email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          type="email"
          required
        />
        <TextField
          label={t('staff.phone')}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
        />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('staff.shift_schedule')}</Typography>
          <Stack spacing={1}>
            {daysOfWeek.map(day => (
              <Stack direction="row" spacing={1} alignItems="center" key={day}>
                <Typography sx={{ width: 40 }}>{t(`staff.day_${day.toLowerCase()}`)}</Typography>
                <TextField
                  label={t('staff.start')}
                  type="time"
                  size="small"
                  value={form.shiftSchedule[day].start}
                  onChange={e => handleScheduleChange(day, 'start', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label={t('staff.end')}
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
        <TextField
          select
          label={t('staff.status')}
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
            {loading ? 'Saving...' : 'Add Staff'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddStaff;
import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextField, Button, MenuItem, Stack, FormControlLabel, Checkbox } from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const statuses = ['Pending', 'Confirmed', 'Completed', 'No-show', 'Cancelled'];
const types = ['Consultation', 'Follow-up', 'Emergency', 'Routine', 'Other'];

const AddAppointment = ({ closeModal, doctors = [], patients = [], clinics = [], onSuccess }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    clinicLocationId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: 'Pending',
    appointmentType: '',
    reasonForVisit: '',
    notes: '',
    roomNumber: '',
    isFirstVisit: false,
    followUpDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/appointments`, form);
      if (onSuccess) onSuccess();
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        select
        label={t('appointments.patient')}
        name="patientId"
        value={form.patientId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {patients.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.fullName || p.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('appointments.doctor')}
        name="doctorId"
        value={form.doctorId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {doctors.map(d => (
          <MenuItem key={d.id} value={d.id}>{d.fullName || d.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('appointments.clinic')}
        name="clinicLocationId"
        value={form.clinicLocationId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {clinics.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('appointments.date')}
        name="appointmentDate"
        type="date"
        value={form.appointmentDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label={t('appointments.start_time')}
          name="startTime"
          type="time"
          value={form.startTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
        <TextField
          label={t('appointments.end_time')}
          name="endTime"
          type="time"
          value={form.endTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
      </Stack>
      <TextField
        select
        label={t('appointments.status')}
        name="status"
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statuses.map(s => (
          <MenuItem key={s} value={s}>{t(`appointments.status_${s.toLowerCase().replace('-', '_')}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('appointments.type')}
        name="appointmentType"
        value={form.appointmentType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {types.map(ti => (
          <MenuItem key={ti} value={ti}>{t(`appointments.type_${ti.toLowerCase().replace('-', '_')}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('appointments.reason')}
        name="reasonForVisit"
        value={form.reasonForVisit}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label={t('appointments.notes')}
        name="notes"
        value={form.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        label={t('appointments.room_number')}
        name="roomNumber"
        value={form.roomNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.isFirstVisit}
            onChange={handleChange}
            name="isFirstVisit"
            color="primary"
          />
        }
        label={t('appointments.is_first_visit')}
      />
      <TextField
        label={t('appointments.follow_up_date')}
        name="followUpDate"
        type="date"
        value={form.followUpDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? t('appointments.saving') : t('appointments.add_appointment')}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          {t('appointments.cancel')}
        </Button>
      </Stack>
    </form>
  );
};

// Suppress ResizeObserver loop error in development
const ignoreResizeObserverError = (message) => {
  if (message.includes('ResizeObserver loop completed')) return;
  console.error(message);
};
window.addEventListener('error', e => ignoreResizeObserverError(e.message));

export default AddAppointment;
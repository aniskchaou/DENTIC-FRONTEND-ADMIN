import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Chip } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const specializations = [
  'General Dentist', 'Orthodontist', 'Periodontist', 'Endodontist', 'Prosthodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Other'
];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddDoctor = ({ closeModal, onCreate }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: '',
    licenseNumber: '',
    specialization: '',
    experienceYears: '',
    consultationFee: '',
    availableDays: [],
    workingDays: [],
    daysOff: [],
    availableTimeSlots: [],
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState({ startTime: '', endTime: '' });

    // Generate a random license number
      // Generate license number like DENT-2025001, ORTHO-2025002, etc.
      const specializationPrefixes = {
        'General Dentist': 'DENT',
        'Orthodontist': 'ORTHO',
        'Periodontist': 'PERIO',
        'Endodontist': 'ENDO',
        'Prosthodontist': 'PROSTHO',
        'Oral Surgeon': 'SURG',
        'Pediatric Dentist': 'PED',
        'Other': 'SPEC'
      };
      const handleGenerateLicenseNumber = () => {
        const prefix = specializationPrefixes[form.specialization] || 'DENT';
        const year = new Date().getFullYear();
        // Random 3-digit number for uniqueness
        const number = Math.floor(1 + Math.random() * 999).toString().padStart(3, '0');
        const license = `${prefix}-${year}${number}`;
        setForm(f => ({ ...f, licenseNumber: license }));
      };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleDaysChange = e => {
    setForm(f => ({ ...f, availableDays: e.target.value }));
  };

  const handleWorkingDaysChange = e => {
    setForm(f => ({ ...f, workingDays: e.target.value }));
  };

  const handleDaysOffChange = e => {
    setForm(f => ({ ...f, daysOff: e.target.value }));
  };

  const handleAddTimeSlot = () => {
    if (timeSlot.startTime && timeSlot.endTime) {
      setForm(f => ({
        ...f,
        availableTimeSlots: [...f.availableTimeSlots, { ...timeSlot }]
      }));
      setTimeSlot({ startTime: '', endTime: '' });
    }
  };

  const handleRemoveTimeSlot = idx => {
    setForm(f => ({
      ...f,
      availableTimeSlots: f.availableTimeSlots.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      experienceYears: Number(form.experienceYears),
      consultationFee: Number(form.consultationFee),
      rating: Number(form.rating)
    };
    try {
      await axios.post(`${BASE_URL}/doctors`, data);
      if (onCreate) onCreate(data);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label={t('doctor.full_name')}
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          fullWidth
        />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label={t('doctor.license_number')}
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button variant="outlined" onClick={handleGenerateLicenseNumber} sx={{ height: '56px' }}>
              {t('doctor.generate_license_number') || 'Generate License Number'}
            </Button>
          </Stack>
        <TextField
          select
          label={t('doctor.specialization')}
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          required
          fullWidth
        >
          {specializations.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`doctor.specialization_${opt.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('doctor.experience_years')}
          name="experienceYears"
          type="number"
          value={form.experienceYears}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('doctor.consultation_fee')}
          name="consultationFee"
          type="number"
          value={form.consultationFee}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label={t('doctor.working_days')}
          name="workingDays"
          value={form.workingDays}
          onChange={handleWorkingDaysChange}
          SelectProps={{ multiple: true }}
          fullWidth
        >
          {daysOfWeek.map(day => (
            <MenuItem key={day} value={day}>{t(`doctor.day_${day.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('doctor.available_days')}
          name="availableDays"
          value={form.availableDays}
          onChange={handleDaysChange}
          SelectProps={{ multiple: true }}
          required
          fullWidth
        >
          {daysOfWeek.map(day => (
            <MenuItem key={day} value={day}>{t(`doctor.day_${day.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('doctor.days_off')}
          name="daysOff"
          value={form.daysOff}
          onChange={handleDaysOffChange}
          SelectProps={{ multiple: true }}
          fullWidth
        >
          {daysOfWeek.map(day => (
            <MenuItem key={day} value={day}>{t(`doctor.day_${day.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label={t('doctor.start_time')}
              name="startTime"
              type="time"
              value={timeSlot.startTime}
              onChange={e => setTimeSlot(ts => ({ ...ts, startTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <TextField
              label={t('doctor.end_time')}
              name="endTime"
              type="time"
              value={timeSlot.endTime}
              onChange={e => setTimeSlot(ts => ({ ...ts, endTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddTimeSlot}
              disabled={!timeSlot.startTime || !timeSlot.endTime}
            >
              {t('doctor.add_slot')}
            </Button>
          </Stack>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {form.availableTimeSlots.map((slot, idx) => (
              <Chip
                key={idx}
                label={`${slot.startTime} - ${slot.endTime}`}
                onDelete={() => handleRemoveTimeSlot(idx)}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        <TextField
          label={t('doctor.rating')}
          name="rating"
          type="number"
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          value={form.rating}
          onChange={handleChange}
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? t('doctor.saving') : t('doctor.create')}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            {t('doctor.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddDoctor;
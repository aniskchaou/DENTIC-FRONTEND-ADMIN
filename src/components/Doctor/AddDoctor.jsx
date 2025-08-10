import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Chip } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const specializations = [
  'General Dentist', 'Orthodontist', 'Periodontist', 'Endodontist', 'Prosthodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Other'
];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddDoctor = ({ closeModal, onCreate }) => {
  const [form, setForm] = useState({
    fullName: '',
    licenseNumber: '',
    specialization: '',
    experienceYears: '',
    consultationFee: '',
    availableDays: [],
    availableTimeSlots: [],
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState({ startTime: '', endTime: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleDaysChange = e => {
    setForm(f => ({ ...f, availableDays: e.target.value }));
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
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="License Number"
          name="licenseNumber"
          value={form.licenseNumber}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Specialization"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          required
          fullWidth
        >
          {specializations.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Experience (years)"
          name="experienceYears"
          type="number"
          value={form.experienceYears}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Consultation Fee ($)"
          name="consultationFee"
          type="number"
          value={form.consultationFee}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Available Days"
          name="availableDays"
          value={form.availableDays}
          onChange={handleDaysChange}
          SelectProps={{ multiple: true }}
          required
          fullWidth
        >
          {daysOfWeek.map(day => (
            <MenuItem key={day} value={day}>{day}</MenuItem>
          ))}
        </TextField>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={timeSlot.startTime}
              onChange={e => setTimeSlot(ts => ({ ...ts, startTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <TextField
              label="End Time"
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
              Add Slot
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
          label="Rating"
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
            {loading ? 'Saving...' : 'Create Doctor'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddDoctor;
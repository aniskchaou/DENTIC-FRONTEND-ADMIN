import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const anesthesiaTypes = ['Local', 'General', 'Sedation', 'None'];
const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

const AddProcedure = ({ closeModal, onCreate }) => {
  const [form, setForm] = useState({
    procedureName: '',
    procedureDate: '',
    duration: '',
    anesthesiaType: '',
    notes: '',
    status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      procedureName: form.procedureName,
      procedureDate: new Date(form.procedureDate).toISOString(),
      duration: Number(form.duration),
      anesthesiaType: form.anesthesiaType,
      notes: form.notes,
      status: form.status,
      createdAt: now,
      updatedAt: now
    };
    console.log('Procedure object to send:', data); // Show object before sending
    try {
      await axios.post(`${BASE_URL}/procedures`, data);
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
          label="Procedure Name"
          name="procedureName"
          value={form.procedureName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Procedure Date & Time"
          name="procedureDate"
          type="datetime-local"
          value={form.procedureDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Anesthesia Type"
          name="anesthesiaType"
          value={form.anesthesiaType}
          onChange={handleChange}
          required
          fullWidth
        >
          {anesthesiaTypes.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
        />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          fullWidth
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Saving...' : 'Create Procedure'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddProcedure;
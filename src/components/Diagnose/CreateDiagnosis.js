import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const severityOptions = ['Mild', 'Moderate', 'Severe'];

const CreateDiagnosis = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    diagnosisDate: '',
    condition: '',
    severity: 'Mild',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch patients and doctors from backend
    axios.get(`${BASE_URL}/patients`)
      .then(res => setPatients(res.data))
      .catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`)
      .then(res => setDoctors(res.data))
      .catch(() => setDoctors([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/diagnoses`, data);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Diagnosis</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            select
            label="Patient"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.fullName || p.name || p.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Doctor"
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {doctors.map(d => (
              <MenuItem key={d.id} value={d.id}>
                {d.fullName || d.name || d.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Diagnosis Date"
            name="diagnosisDate"
            type="datetime-local"
            value={form.diagnosisDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Severity"
            name="severity"
            value={form.severity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {severityOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="success" disabled={loading}>
              {loading ? 'Saving...' : 'Create Diagnosis'}
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDiagnosis;
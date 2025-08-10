import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, Typography } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const statusOptions = ['Active', 'Expired', 'Pending'];

const AddInsurance = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patientId: '',
    providerName: '',
    policyNumber: '',
    coverageDetails: {
      maxAnnualCoverage: '',
      treatmentCoverage: '',
      medicationCoverage: '',
      consultationCoverage: ''
    },
    validFrom: '',
    validUntil: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name in form.coverageDetails) {
      setForm(f => ({
        ...f,
        coverageDetails: { ...f.coverageDetails, [name]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      coverageDetails: {
        maxAnnualCoverage: Number(form.coverageDetails.maxAnnualCoverage),
        treatmentCoverage: Number(form.coverageDetails.treatmentCoverage),
        medicationCoverage: Number(form.coverageDetails.medicationCoverage),
        consultationCoverage: Number(form.coverageDetails.consultationCoverage)
      },
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/insurances`, data);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Insurance Policy</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Patient ID"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Provider Name"
            name="providerName"
            value={form.providerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Policy Number"
            name="policyNumber"
            value={form.policyNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Coverage Details</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Max Annual Coverage"
              name="maxAnnualCoverage"
              type="number"
              value={form.coverageDetails.maxAnnualCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label="Treatment (%)"
              name="treatmentCoverage"
              type="number"
              value={form.coverageDetails.treatmentCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label="Medication (%)"
              name="medicationCoverage"
              type="number"
              value={form.coverageDetails.medicationCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label="Consultation (%)"
              name="consultationCoverage"
              type="number"
              value={form.coverageDetails.consultationCoverage}
              onChange={handleChange}
              required
            />
          </Stack>
          <TextField
            label="Valid From"
            name="validFrom"
            type="date"
            value={form.validFrom}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Valid Until"
            name="validUntil"
            type="date"
            value={form.validUntil}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="success" disabled={loading}>
              {loading ? 'Saving...' : 'Create Insurance'}
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

export default AddInsurance;
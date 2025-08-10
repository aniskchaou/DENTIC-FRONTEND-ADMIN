import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const insuranceOptions = ['Yes', 'No'];
const paymentStatuses = ['Paid', 'Unpaid', 'Pending'];

const AddLabTest = ({ closeModal, patients = [], doctors = [], clinics = [], laboratories = [], onSuccess }) => {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    clinicId: '',
    testName: '',
    testCategory: '',
    testDescription: '',
    sampleType: '',
    sampleCollectionDate: '',
    sampleCollectedBy: '',
    testStatus: 'Pending',
    result: {},
    laboratoryId: '',
    testCost: 0,
    insuranceCovered: '',
    paymentStatus: '',
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
    const labTestData = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/labtests`, labTestData);
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
        label="Patient"
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
        label="Doctor"
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
        label="Clinic"
        name="clinicId"
        value={form.clinicId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {clinics.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Test Name"
        name="testName"
        value={form.testName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Test Category"
        name="testCategory"
        value={form.testCategory}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Test Description"
        name="testDescription"
        value={form.testDescription}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        label="Sample Type"
        name="sampleType"
        value={form.sampleType}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Sample Collection Date"
        name="sampleCollectionDate"
        type="datetime-local"
        value={form.sampleCollectionDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Sample Collected By"
        name="sampleCollectedBy"
        value={form.sampleCollectedBy}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Test Status"
        name="testStatus"
        value={form.testStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statuses.map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Laboratory"
        name="laboratoryId"
        value={form.laboratoryId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {laboratories.map(l => (
          <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Test Cost"
        name="testCost"
        type="number"
        value={form.testCost}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Insurance Covered"
        name="insuranceCovered"
        value={form.insuranceCovered}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {insuranceOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Payment Status"
        name="paymentStatus"
        value={form.paymentStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {paymentStatuses.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Create Lab Test'}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default AddLabTest;
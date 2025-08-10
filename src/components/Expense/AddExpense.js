import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import expenseHTTPService from '../../main/services/expenseHTTPService';
import BASE_URL from '../../main/urls/urls';

const statusOptions = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
const expenseCategories = ['Consultation', 'Treatment', 'Medication', 'Lab', 'Other'];
const paymentMethods = ['Cash', 'Card', 'Insurance', 'Online'];

const AddExpense = ({ closeModal, onCreate }) => {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    description: '',
    estimatedDuration: '',
    status: 'Planned',
    expenseCategory: '',
    amount: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);

  // Add state for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Replace with your actual endpoints if needed
    fetch(BASE_URL+'/patients').then(res => res.json()).then(setPatients).catch(() => setPatients([]));
    fetch(BASE_URL+'/doctors').then(res => res.json()).then(setDoctors).catch(() => setDoctors([]));
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
      patientId: form.patientId,
      doctorId: form.doctorId,
      description: form.description,
      estimatedDuration: Number(form.estimatedDuration),
      status: form.status,
      expenseCategory: form.expenseCategory,
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      createdAt: now,
      updatedAt: now
    };
    try {
      await expenseHTTPService.createExpense(data);
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
          select
          label="Patient"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          required
          fullWidth
        >
          {patients.map(patient => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.fullName || patient.name || patient.id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Doctor"
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          required
          fullWidth
        >
          {doctors.map(doctor => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.fullName || doctor.name || doctor.id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Estimated Duration (days)"
          name="estimatedDuration"
          type="number"
          value={form.estimatedDuration}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Expense Category"
          name="expenseCategory"
          value={form.expenseCategory}
          onChange={handleChange}
          required
          fullWidth
        >
          {expenseCategories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Payment Method"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          required
          fullWidth
        >
          {paymentMethods.map(method => (
            <MenuItem key={method} value={method}>{method}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Saving...' : 'Create Expense'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddExpense;
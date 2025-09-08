import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const insuranceOptions = ['Yes', 'No'];
const paymentStatuses = ['Paid', 'Unpaid', 'Pending'];
const testCategories = ['Blood', 'Urine', 'Imaging', 'Biopsy', 'Other'];
const sampleTypes = ['Blood', 'Urine', 'Saliva', 'Tissue', 'Other'];

const EditLabTest = ({ closeModal, testLab = {}, patients = [], doctors = [], clinics = [], staffs = [], onSuccess }) => {
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
    testCost: 0,
    insuranceCovered: '',
    paymentStatus: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testLab) {
      setForm({
        patientId: testLab.patientId || '',
        doctorId: testLab.doctorId || '',
        clinicId: testLab.clinicId || '',
        testName: testLab.testName || '',
        testCategory: testLab.testCategory || '',
        testDescription: testLab.testDescription || '',
        sampleType: testLab.sampleType || '',
        sampleCollectionDate: testLab.sampleCollectionDate ? testLab.sampleCollectionDate.slice(0, 16) : '',
        sampleCollectedBy: testLab.sampleCollectedBy || '',
        testStatus: testLab.testStatus || 'Pending',
        result: testLab.result || {},
        testCost: testLab.testCost || 0,
        insuranceCovered: testLab.insuranceCovered || '',
        paymentStatus: testLab.paymentStatus || '',
      });
    }
  }, [testLab]);

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
      updatedAt: now
    };
    try {
      await axios.put(`${BASE_URL}/labtests/${testLab.id}`, labTestData);
      if (onSuccess) onSuccess();
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Stack spacing={2}>
        <TextField
          select
          label="Patient"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          fullWidth
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
          required
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
          required
        />
        <TextField
          select
          label="Test Category"
          name="testCategory"
          value={form.testCategory}
          onChange={handleChange}
          fullWidth
          required
        >
          {testCategories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Test Description"
          name="testDescription"
          value={form.testDescription}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          select
          label="Sample Type"
          name="sampleType"
          value={form.sampleType}
          onChange={handleChange}
          fullWidth
          required
        >
          {sampleTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Sample Collection Date"
          name="sampleCollectionDate"
          type="datetime-local"
          value={form.sampleCollectionDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />
        <TextField
          select
          label="Sample Collected By"
          name="sampleCollectedBy"
          value={form.sampleCollectedBy}
          onChange={handleChange}
          fullWidth
        >
          {staffs.map(staff => (
            <MenuItem key={staff.id} value={staff.id}>
              {staff.fullName || staff.name}
            </MenuItem>
          ))}
        </TextField>
        {form.sampleCollectedBy && (
          <div style={{ margin: '8px 0', color: '#1976d2', fontWeight: 500 }}>
            Selected Staff: {
              staffs.find(s => s.id === form.sampleCollectedBy)?.fullName ||
              staffs.find(s => s.id === form.sampleCollectedBy)?.name ||
              form.sampleCollectedBy
            }
          </div>
        )}
        <TextField
          select
          label="Test Status"
          name="testStatus"
          value={form.testStatus}
          onChange={handleChange}
          fullWidth
          required
        >
          {statuses.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Test Cost"
          name="testCost"
          type="number"
          value={form.testCost}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          label="Insurance Covered"
          name="insuranceCovered"
          value={form.insuranceCovered}
          onChange={handleChange}
          fullWidth
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
        >
          {paymentStatuses.map(opt => (
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
    </form>
  );
};

export default EditLabTest;
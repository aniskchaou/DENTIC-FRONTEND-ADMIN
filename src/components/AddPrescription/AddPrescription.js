import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const refillOptions = ['Yes', 'No'];
const statusOptions = ['Active', 'Expired', 'Completed', 'Pending'];

const AddPrescription = ({ closeModal, onSuccess }) => {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    clinicId: '',
    medications: [{
      dosage: '',
      duration: '',
      frequency: '',
      instructions: '',
      medicationId: '',
      medicationName: ''
    }],
    prescriptionDate: '',
    validUntil: '',
    refillAllowed: 'Yes',
    refillCount: 1,
    pharmacyId: '',
    digitalSignature: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  // Add state for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL+'/patients').then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(BASE_URL+'/doctors').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    axios.get(BASE_URL+'/clinics').then(res => setClinics(res.data)).catch(() => setClinics([]));
  }, []);

  // Add more medications
  const handleAddMedication = () => {
    setForm(f => ({
      ...f,
      medications: [
        ...f.medications,
        { dosage: '', duration: '', frequency: '', instructions: '', medicationId: '', medicationName: '' }
      ]
    }));
  };

  // Change medication fields
  const handleMedicationChange = (idx, e) => {
    const { name, value } = e.target;
    setForm(f => {
      const meds = [...f.medications];
      meds[idx][name] = value;
      return { ...f, medications: meds };
    });
  };

  // Change main fields
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
      createdAt: now,
      updatedAt: now
    };
    try {
      // Replace with your backend endpoint
      await axios.post(BASE_URL+'/prescriptions', data);
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
        fullWidth
        margin="normal"
        required
      >
        {doctors.map(doctor => (
          <MenuItem key={doctor.id} value={doctor.id}>
            {doctor.fullName || doctor.name || doctor.id}
          </MenuItem>
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
        required
      >
        {clinics.map(clinic => (
          <MenuItem key={clinic.id} value={clinic.id}>
            {clinic.name || clinic.clinicName || clinic.id}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Medications</Typography>
      {form.medications.map((med, idx) => (
        <Stack key={idx} direction="row" spacing={1} sx={{ mb: 1 }}>
          <TextField
            label="Medication Name"
            name="medicationName"
            value={med.medicationName}
            onChange={e => handleMedicationChange(idx, e)}
            required
          />
          <TextField
            label="Medication ID"
            name="medicationId"
            value={med.medicationId}
            onChange={e => handleMedicationChange(idx, e)}
            required
          />
          <TextField
            label="Dosage"
            name="dosage"
            value={med.dosage}
            onChange={e => handleMedicationChange(idx, e)}
            required
          />
          <TextField
            label="Duration (days)"
            name="duration"
            type="number"
            value={med.duration}
            onChange={e => handleMedicationChange(idx, e)}
            required
          />
          <TextField
            label="Frequency"
            name="frequency"
            value={med.frequency}
            onChange={e => handleMedicationChange(idx, e)}
            required
          />
          <TextField
            label="Instructions"
            name="instructions"
            value={med.instructions}
            onChange={e => handleMedicationChange(idx, e)}
          />
        </Stack>
      ))}
      <IconButton color="primary" onClick={handleAddMedication} sx={{ mb: 2 }}>
        <AddIcon />
      </IconButton>
      <TextField
        label="Prescription Date"
        name="prescriptionDate"
        type="datetime-local"
        value={form.prescriptionDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Valid Until"
        name="validUntil"
        type="datetime-local"
        value={form.validUntil}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label="Refill Allowed"
        name="refillAllowed"
        value={form.refillAllowed}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {refillOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Refill Count"
        name="refillCount"
        type="number"
        value={form.refillCount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Pharmacy ID"
        name="pharmacyId"
        value={form.pharmacyId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Digital Signature"
        name="digitalSignature"
        value={form.digitalSignature}
        onChange={handleChange}
        fullWidth
        margin="normal"
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
          {loading ? 'Saving...' : 'Create Prescription'}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default AddPrescription;
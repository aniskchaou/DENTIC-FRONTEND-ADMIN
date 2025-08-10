import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const certificateTypes = [
  'Medical Fitness', 'Dental Clearance', 'Vaccination', 'Other'
];

const AddCertificate = ({ closeModal }) => {
  const [form, setForm] = useState({
    certificateNumber: '',
    patientId: '',
    doctorId: '',
    clinicId: '',
    certificateType: '',
    issueDate: '',
    validUntil: '',
    diagnosis: '',
    treatmentDetails: '',
    recommendations: '',
    attachments: '',
    signature: '',
    status: 'Issued',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Add state for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    axios.get(`${BASE_URL}/clinics`).then(res => setClinics(res.data)).catch(() => setClinics([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (
      !form.patientId ||
      !form.doctorId ||
      !form.clinicId ||
      !form.certificateType ||
      !form.diagnosis ||
      !form.treatmentDetails ||
      !form.signature
    ) {
      alert('Please fill all required fields.');
      setLoading(false);
      return;
    }

    const data = {
      certificateNumber: form.certificateNumber,
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      clinicId: Number(form.clinicId),
      certificateType: form.certificateType,
      issueDate: new Date(form.issueDate),
      validUntil: new Date(form.validUntil),
      diagnosis: form.diagnosis,
      treatmentDetails: form.treatmentDetails,
      recommendations: form.recommendations,
      attachments: form.attachments ? [form.attachments] : [],
      signature: form.signature,
      status: form.status,
      notes: form.notes
    };

    console.log('Sent object:', data);

    try {
      await axios.post(`${BASE_URL}/certificates`, data);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        label="Certificate Number"
        name="certificateNumber"
        value={form.certificateNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
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
      <TextField
        select
        label="Certificate Type"
        name="certificateType"
        value={form.certificateType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {certificateTypes.map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Issue Date"
        name="issueDate"
        type="date"
        value={form.issueDate}
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
        label="Diagnosis"
        name="diagnosis"
        value={form.diagnosis}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Treatment Details"
        name="treatmentDetails"
        value={form.treatmentDetails}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Recommendations"
        name="recommendations"
        value={form.recommendations}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Attachment URL"
        name="attachments"
        value={form.attachments}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Signature"
        name="signature"
        value={form.signature}
        onChange={handleChange}
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
        <MenuItem value="Issued">Issued</MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Expired">Expired</MenuItem>
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
          {loading ? 'Saving...' : 'Create Certificate'}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default AddCertificate;
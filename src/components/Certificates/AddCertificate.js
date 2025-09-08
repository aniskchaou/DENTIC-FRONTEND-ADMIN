import React, { useState, useEffect } from 'react';
import SignaturePad from './SignaturePad';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const certificateTypes = [
  'Medical Fitness', 'Dental Clearance', 'Vaccination', 'Other'
];

const AddCertificate = ({ closeModal }) => {
  const { t } = useTranslation();
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
    signature: '', // Will store base64 image data
    status: 'Issued',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Add state for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]); // Added state for diagnoses

  useEffect(() => {
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    axios.get(`${BASE_URL}/clinics`).then(res => setClinics(res.data)).catch(() => setClinics([]));
    axios.get(`${BASE_URL}/diagnoses`) // Fetch diagnoses from the server
      .then(res => {
        // Use res.data for your diagnosis list
        setDiagnoses(res.data);
      })
      .catch(() => setDiagnoses([]));
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
      diagnosis: 'null',
      treatmentDetails: form.treatmentDetails,
      recommendations: form.recommendations,
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

  // Helper to generate random certificate code
    const generateCertificateCode = () => {
      // Example: CERT-YYYYMMDD-XXXX
      const date = new Date();
      const ymd = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;
      const random = Math.floor(1000 + Math.random() * 9000);
      setForm(f => ({ ...f, certificateNumber: `CERT-${ymd}-${random}` }));
    };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
    
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TextField
          label={t('certificate.certificate_number')}
          name="certificateNumber"
          value={form.certificateNumber}
          onChange={handleChange}
          margin="normal"
          required
          sx={{ width: 660 }}
        />
        <Button variant="outlined" size="small" onClick={generateCertificateCode}>
          {t('Generate') || 'Generate'}
        </Button>
      </div>
      <TextField
        select
        label={t('certificate.patient')}
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
        label={t('certificate.doctor')}
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
        label={t('certificate.clinic')}
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
        label={t('certificate.certificate_type')}
        name="certificateType"
        value={form.certificateType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {certificateTypes.map(type => (
          <MenuItem key={type} value={type}>{t(`certificate.type_${type.replace(' ', '_').toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('certificate.issue_date')}
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
        label={t('certificate.valid_until')}
        name="validUntil"
        type="date"
        value={form.validUntil}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
  {/* Diagnosis input removed as requested */}
      <TextField
        label={t('certificate.treatment_details')}
        name="treatmentDetails"
        value={form.treatmentDetails}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label={t('certificate.recommendations')}
        name="recommendations"
        value={form.recommendations}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
  {/* Attachments input removed as requested */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>{t('certificate.signature')}</label>
        <SignaturePad onChange={dataUrl => setForm(f => ({ ...f, signature: dataUrl }))} />
        {form.signature && (
          <div style={{ marginTop: 8 }}>
            <img src={form.signature} alt="Signature preview" style={{ maxWidth: 300, maxHeight: 100, border: '1px solid #eee', borderRadius: 4 }} />
          </div>
        )}
      </div>
      <TextField
        select
        label={t('certificate.status')}
        name="status"
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Issued">{t('certificate.status_issued')}</MenuItem>
        <MenuItem value="Active">{t('certificate.status_active')}</MenuItem>
        <MenuItem value="Expired">{t('certificate.status_expired')}</MenuItem>
      </TextField>
      <TextField
        label={t('certificate.notes')}
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
          {loading ? t('certificate.saving') : t('certificate.create')}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          {t('certificate.cancel')}
        </Button>
      </Stack>
    </form>
  );
};

export default AddCertificate;
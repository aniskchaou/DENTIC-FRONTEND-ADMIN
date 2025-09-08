import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import SignaturePad from '../Certificates/SignaturePad';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const refillOptions = ['Yes', 'No'];
const statusOptions = ['Active', 'Expired', 'Completed', 'Pending'];

const AddPrescription = ({ closeModal, onSuccess }) => {
  // Delete a medication line
  const handleDeleteMedication = (idx) => {
    setForm(f => ({
      ...f,
      medications: f.medications.filter((_, i) => i !== idx)
    }));
  };
  const { t } = useTranslation();
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
    digitalSignature: '', // Will store base64 image data
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  // Add state for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [medicaments, setMedicaments] = useState([]); // Medications from backend

  useEffect(() => {
  axios.get(BASE_URL+'/patients').then(res => setPatients(res.data)).catch(() => setPatients([]));
  axios.get(BASE_URL+'/doctors').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
  axios.get(BASE_URL+'/clinics').then(res => setClinics(res.data)).catch(() => setClinics([]));
  axios.get(BASE_URL+'/medicaments').then(res => setMedicaments(res.data)).catch(() => setMedicaments([]));
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
      // Always store medicationId as string
      meds[idx][name] = name === 'medicationId' ? String(value) : value;
      // If medicationId is changed, update medicationName from medicaments
      if (name === 'medicationId') {
        const selectedMed = medicaments.find(m => String(m.id) === String(value));
        meds[idx].medicationName = selectedMed ? selectedMed.name : '';
      }
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
        label={t('prescription.patient')}
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
        label={t('prescription.doctor')}
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
        label={t('prescription.clinic')}
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
      <Typography variant="subtitle1" sx={{ mt: 2 }}>{t('prescription.medications')}</Typography>
      {form.medications.map((med, idx) => (
        <Stack key={idx} direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            label={t('prescription.medication')}
            name="medicationId"
            value={med.medicationId}
            onChange={e => handleMedicationChange(idx, e)}
            fullWidth
            required
          >
            <MenuItem value="">{t('prescription.select_medication')}</MenuItem>
            {medicaments.map(m => (
              <MenuItem key={m.id} value={String(m.id)}>{m.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('prescription.dosage')}
            name="dosage"
            value={med.dosage}
            onChange={e => handleMedicationChange(idx, e)}
            fullWidth
            required
          />
          <TextField
            label={t('prescription.duration')}
            name="duration"
            value={med.duration}
            onChange={e => handleMedicationChange(idx, e)}
            fullWidth
            required
          />
          <TextField
            label={t('prescription.frequency')}
            name="frequency"
            value={med.frequency}
            onChange={e => handleMedicationChange(idx, e)}
            fullWidth
            required
          />
          <TextField
            label={t('prescription.instructions')}
            name="instructions"
            value={med.instructions}
            onChange={e => handleMedicationChange(idx, e)}
            fullWidth
          />
          <IconButton onClick={handleAddMedication} color="primary" sx={{ alignSelf: 'center' }}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteMedication(idx)} color="error" sx={{ alignSelf: 'center' }}>
            {/* You can use a delete icon from MUI, e.g. DeleteIcon */}
            <span style={{ fontWeight: 'bold', fontSize: 18 }}>-</span>
          </IconButton>
        </Stack>
      ))}
      <IconButton color="primary" onClick={handleAddMedication} sx={{ mb: 2 }}>
        <AddIcon />
      </IconButton>
      <TextField
        label={t('prescription.prescription_date')}
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
        label={t('prescription.valid_until')}
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
        label={t('prescription.refill_allowed')}
        name="refillAllowed"
        value={form.refillAllowed}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {refillOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{t(`prescription.refill_${opt.toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('prescription.refill_count')}
        name="refillCount"
        type="number"
        value={form.refillCount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>{t('prescription.digital_signature') || 'Doctor Signature'}</label>
        <SignaturePad onChange={dataUrl => setForm(f => ({ ...f, digitalSignature: dataUrl }))} />
        {form.digitalSignature && (
          <div style={{ marginTop: 8 }}>
            <img src={form.digitalSignature} alt="Signature preview" style={{ maxWidth: 300, maxHeight: 100, border: '1px solid #eee', borderRadius: 4 }} />
          </div>
        )}
      </div>
      <TextField
        select
        label={t('prescription.status')}
        name="status"
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {statusOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{t(`prescription.status_${opt.toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success" disabled={loading}>
          {loading ? t('prescription.saving') : t('prescription.create')}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          {t('prescription.cancel')}
        </Button>
      </Stack>
    </form>
  );
};

export default AddPrescription;
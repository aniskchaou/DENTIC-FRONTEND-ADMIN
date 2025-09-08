import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack, MenuItem, Divider, Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AddPatient = ({ closeModal }) => {
  const { t } = useTranslation();

  const initialState = {
    fullName: '',
    email: '', // <-- Add email field
    medicalRecordNumber: '',
    insuranceId: '',
    bloodType: '',
    allergies: [''],
    medicalHistory: [{ notes: '', condition: '', diagnosedAt: '' }],
    currentMedications: [{ name: '', dosage: '', frequency: '', prescribedBy: '' }],
    emergencyContact: { name: '', phone: '', relationship: '' },
    nationalId: ''
  };

  const [patient, setPatient] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/insurances`)
      .then(res => res.json())
      .then(data => setInsurances(data))
      .catch(() => setInsurances([]));
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleAllergyChange = (idx, value) => {
    const updated = [...patient.allergies];
    updated[idx] = value;
    setPatient({ ...patient, allergies: updated });
  };

  const handleMedicalHistoryChange = (idx, field, value) => {
    const updated = [...patient.medicalHistory];
    updated[idx][field] = value;
    setPatient({ ...patient, medicalHistory: updated });
  };

  const handleMedicationChange = (idx, field, value) => {
    const updated = [...patient.currentMedications];
    updated[idx][field] = value;
    setPatient({ ...patient, currentMedications: updated });
  };

  const handleEmergencyContactChange = (field, value) => {
    setPatient({ ...patient, emergencyContact: { ...patient.emergencyContact, [field]: value } });
  };

  const addAllergy = () => setPatient({ ...patient, allergies: [...patient.allergies, ''] });
  const removeAllergy = idx => setPatient({ ...patient, allergies: patient.allergies.filter((_, i) => i !== idx) });

  const addMedicalHistory = () => setPatient({ ...patient, medicalHistory: [...patient.medicalHistory, { notes: '', condition: '', diagnosedAt: '' }] });
  const removeMedicalHistory = idx => setPatient({ ...patient, medicalHistory: patient.medicalHistory.filter((_, i) => i !== idx) });

  const addMedication = () => setPatient({ ...patient, currentMedications: [...patient.currentMedications, { name: '', dosage: '', frequency: '', prescribedBy: '' }] });
  const removeMedication = idx => setPatient({ ...patient, currentMedications: patient.currentMedications.filter((_, i) => i !== idx) });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !patient.fullName ||
      !patient.insuranceId ||
      !patient.bloodType
    ) {
      setLoading(false);
      return;
    }

    // ...submit logic...
    setLoading(false);
    if (closeModal) closeModal(patient);
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ p: 2 }}>

      {/* Personal Info */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{t('patient.personal_info')}</Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField fullWidth label={t('patient.full_name')} name="fullName" value={patient.fullName} onChange={handleInputChange} required />
        <TextField
          fullWidth
          label={t('patient.email')}
          name="email"
          value={patient.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          select
          label={t('patient.insurance_id')}
          name="insuranceId"
          value={patient.insuranceId}
          onChange={handleInputChange}
          required
        >
          {insurances.map(ins => (
            <MenuItem key={ins.id} value={ins.id}>
              {ins.providerName ? `${ins.providerName} (${ins.policyNumber})` : ins.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth select label={t('patient.blood_type')} name="bloodType" value={patient.bloodType} onChange={handleInputChange} required>
          {bloodTypes.map(bt => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
        </TextField>
        <TextField fullWidth label={t('patient.national_id')} name="nationalId" value={patient.nationalId} onChange={handleInputChange} />
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            label={t('patient.medical_record_number')}
            name="medicalRecordNumber"
            value={patient.medicalRecordNumber}
            onChange={handleInputChange}
            required
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              // Simple random generator, replace with backend call if needed
              const generated = 'MRN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
              setPatient({ ...patient, medicalRecordNumber: generated });
            }}
            sx={{ height: '56px', whiteSpace: 'nowrap' }}
          >
            {t('patient.generate')}
          </Button>
        </Stack>
      </Stack>

      {/* Allergies */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{t('patient.allergies')}</Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {patient.allergies.map((allergy, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label={`${t('patient.allergy')} ${idx + 1}`}
              value={allergy}
              onChange={e => handleAllergyChange(idx, e.target.value)}
              size="small"
            />
            <IconButton
              color="error"
              onClick={() => removeAllergy(idx)}
              disabled={patient.allergies.length === 1}
              sx={{ height: '40px' }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            {idx === patient.allergies.length - 1 && (
              <IconButton color="primary" onClick={addAllergy} sx={{ height: '40px' }}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>

      {/* Medical History */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{t('patient.medical_history')}</Typography>
      {patient.medicalHistory.map((mh, idx) => (
        <Stack key={idx} spacing={1} sx={{ mb: 1, width: '100%' }}>
          <TextField
            fullWidth
            label={t('patient.condition')}
            value={mh.condition}
            onChange={e => handleMedicalHistoryChange(idx, 'condition', e.target.value)}
            size="small"
            required
          />
          <TextField
            fullWidth
            label={t('patient.diagnosed_at')}
            type="date"
            value={mh.diagnosedAt}
            onChange={e => handleMedicalHistoryChange(idx, 'diagnosedAt', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            required
          />
          <TextField
            fullWidth
            label={t('patient.notes')}
            value={mh.notes}
            onChange={e => handleMedicalHistoryChange(idx, 'notes', e.target.value)}
            size="small"
          />
          <Stack direction="row" spacing={1}>
            <IconButton
              color="error"
              onClick={() => removeMedicalHistory(idx)}
              disabled={patient.medicalHistory.length === 1}
              sx={{ height: '40px' }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            {idx === patient.medicalHistory.length - 1 && (
              <IconButton color="primary" onClick={addMedicalHistory} sx={{ height: '40px' }}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      ))}

      {/* Current Medications */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{t('patient.current_medications')}</Typography>
      {patient.currentMedications.map((med, idx) => (
        <Stack key={idx} spacing={1} sx={{ mb: 1, width: '100%' }}>
          <TextField
            fullWidth
            label={t('patient.medication_name')}
            value={med.name}
            onChange={e => handleMedicationChange(idx, 'name', e.target.value)}
            size="small"
            required
          />
          <TextField
            fullWidth
            label={t('patient.dosage')}
            value={med.dosage}
            onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)}
            size="small"
            required
          />
          <TextField
            fullWidth
            label={t('patient.frequency')}
            value={med.frequency}
            onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label={t('patient.prescribed_by')}
            value={med.prescribedBy}
            onChange={e => handleMedicationChange(idx, 'prescribedBy', e.target.value)}
            size="small"
            required
          />
          <Stack direction="row" spacing={1}>
            <IconButton
              color="error"
              onClick={() => removeMedication(idx)}
              disabled={patient.currentMedications.length === 1}
              sx={{ height: '40px' }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            {idx === patient.currentMedications.length - 1 && (
              <IconButton color="primary" onClick={addMedication} sx={{ height: '40px' }}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      ))}

      {/* Emergency Contact */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3 }}>{t('patient.emergency_contact')}</Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t('patient.contact_name')}
          value={patient.emergencyContact.name}
          onChange={e => handleEmergencyContactChange('name', e.target.value)}
          size="small"
          required
        />
        <TextField
          fullWidth
          label={t('patient.contact_phone')}
          value={patient.emergencyContact.phone}
          onChange={e => handleEmergencyContactChange('phone', e.target.value)}
          size="small"
          required
        />
        <TextField
          fullWidth
          label={t('patient.contact_relationship')}
          value={patient.emergencyContact.relationship}
          onChange={e => handleEmergencyContactChange('relationship', e.target.value)}
          size="small"
          required
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
        <Button type="submit" variant="contained" color="success" size="large" disabled={loading}>
          {t('patient.save')}
        </Button>
        <Button variant="outlined" color="secondary" size="large" onClick={() => closeModal && closeModal()} disabled={loading}>
          {t('patient.cancel')}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddPatient;

import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack, Paper, Divider, Grid, Card, CardContent,
  MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AddPatient = ({ closeModal }) => {
  const initialState = {
    fullName: '',
    medicalRecordNumber: '', // <-- Add this field
    insuranceId: '',
    bloodType: '',
    allergies: [''],
    medicalHistory: [{ notes: '', condition: '', diagnosedAt: '' }],
    currentMedications: [{ name: '', dosage: '', frequency: '', prescribedBy: '' }],
    emergencyContact: { name: '', phone: '', relationship: '' },
    nationalId: '' // <-- new field
  };

  const [patient, setPatient] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Handlers for fields
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

  // Add/Remove for dynamic fields
  const addAllergy = () => setPatient({ ...patient, allergies: [...patient.allergies, ''] });
  const removeAllergy = idx => setPatient({ ...patient, allergies: patient.allergies.filter((_, i) => i !== idx) });

  const addMedicalHistory = () => setPatient({ ...patient, medicalHistory: [...patient.medicalHistory, { notes: '', condition: '', diagnosedAt: '' }] });
  const removeMedicalHistory = idx => setPatient({ ...patient, medicalHistory: patient.medicalHistory.filter((_, i) => i !== idx) });

  const addMedication = () => setPatient({ ...patient, currentMedications: [...patient.currentMedications, { name: '', dosage: '', frequency: '', prescribedBy: '' }] });
  const removeMedication = idx => setPatient({ ...patient, currentMedications: patient.currentMedications.filter((_, i) => i !== idx) });

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation for required fields (remove medicalRecordNumber)
    if (
      !patient.fullName ||
      !patient.insuranceId ||
      !patient.bloodType
    ) {
      showMessage('Error', 'Please fill all required fields.', 'warning');
      setLoading(false);
      return;
    }

    // Do not include medicalRecordNumber in patientData
    const patientData = {
      fullName: patient.fullName,
      medicalRecordNumber: patient.medicalRecordNumber, // <-- Add this field
      insuranceId: patient.insuranceId,
      bloodType: patient.bloodType,
      nationalId: patient.nationalId,
      allergies: patient.allergies.filter(a => a.trim() !== ''),
      medicalHistory: patient.medicalHistory.map(mh => ({
        condition: mh.condition,
        diagnosedAt: mh.diagnosedAt,
        notes: mh.notes
      })),
      currentMedications: patient.currentMedications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        prescribedBy: med.prescribedBy
      })),
      emergencyContact: {
        name: patient.emergencyContact.name,
        relationship: patient.emergencyContact.relationship,
        phone: patient.emergencyContact.phone
      }
    };

    console.log('Sent object:', patientData);

    try {
      await patientHTTPService.createPatient(patientData);
      showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success');
      setPatient(initialState);
      if (closeModal) closeModal(patientData);
    } catch (e) {
      showMessage('Error', CurrentUser.ERR_MSG, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 700, mx: 'auto', bgcolor: '#f8f9fa', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1976d2' }}>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Add New Patient
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                <MedicalServicesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Stack spacing={2}>
                <TextField label="Full Name" name="fullName" value={patient.fullName} onChange={handleInputChange} required fullWidth />
                <TextField label="Insurance ID" name="insuranceId" value={patient.insuranceId} onChange={handleInputChange} required fullWidth />
                <TextField select label="Blood Type" name="bloodType" value={patient.bloodType} onChange={handleInputChange} required fullWidth>
                  {bloodTypes.map(bt => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
                </TextField>
                <TextField
                  label="National ID"
                  name="nationalId"
                  value={patient.nationalId}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Medical Record Number"
                  name="medicalRecordNumber"
                  value={patient.medicalRecordNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                <LocalHospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Allergies
              </Typography>
              {patient.allergies.map((allergy, idx) => (
                <Stack direction="row" spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
                  <TextField
                    label={`Allergy ${idx + 1}`}
                    value={allergy}
                    onChange={e => handleAllergyChange(idx, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeAllergy(idx)}
                    disabled={patient.allergies.length === 1}
                    aria-label="Remove allergy"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  {idx === patient.allergies.length - 1 && (
                    <IconButton color="primary" onClick={addAllergy} aria-label="Add allergy">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                <MedicalServicesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Medical History
              </Typography>
              {patient.medicalHistory.map((mh, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                  <Stack spacing={1}>
                    <TextField
                      label="Condition"
                      value={mh.condition}
                      onChange={e => handleMedicalHistoryChange(idx, 'condition', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Diagnosed At"
                      type="date"
                      value={mh.diagnosedAt}
                      onChange={e => handleMedicalHistoryChange(idx, 'diagnosedAt', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Notes"
                      value={mh.notes}
                      onChange={e => handleMedicalHistoryChange(idx, 'notes', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeMedicalHistory(idx)}
                        disabled={patient.medicalHistory.length === 1}
                        aria-label="Remove medical history"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {idx === patient.medicalHistory.length - 1 && (
                        <IconButton color="primary" onClick={addMedicalHistory} aria-label="Add medical history">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                <MedicalServicesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Current Medications
              </Typography>
              {patient.currentMedications.map((med, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                  <Stack spacing={1}>
                    <TextField
                      label="Name"
                      value={med.name}
                      onChange={e => handleMedicationChange(idx, 'name', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Dosage"
                      value={med.dosage}
                      onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Frequency"
                      value={med.frequency}
                      onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Prescribed By (Doctor ID)"
                      value={med.prescribedBy}
                      onChange={e => handleMedicationChange(idx, 'prescribedBy', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeMedication(idx)}
                        disabled={patient.currentMedications.length === 1}
                        aria-label="Remove medication"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {idx === patient.currentMedications.length - 1 && (
                        <IconButton color="primary" onClick={addMedication} aria-label="Add medication">
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            <ContactPhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Emergency Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Name"
                value={patient.emergencyContact.name}
                onChange={e => handleEmergencyContactChange('name', e.target.value)}
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Phone"
                value={patient.emergencyContact.phone}
                onChange={e => handleEmergencyContactChange('phone', e.target.value)}
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Relationship"
                value={patient.emergencyContact.relationship}
                onChange={e => handleEmergencyContactChange('relationship', e.target.value)}
                fullWidth
                size="small"
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
        <Button type="submit" variant="contained" color="success" size="large" disabled={loading}>
          <i className="fa fa-check"></i> Save Patient
        </Button>
        <Button variant="outlined" color="secondary" size="large" onClick={() => closeModal && closeModal()} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default AddPatient;

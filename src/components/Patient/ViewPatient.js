import React from 'react';
import { Box, Typography, Stack, Paper, Divider, Chip, Avatar, Grid, Tooltip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicationIcon from '@mui/icons-material/Medication';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { useTranslation } from 'react-i18next';

const ViewPatient = ({ patient }) => {
  const { t } = useTranslation();
  if (!patient) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">{t('patient.no_patient_selected') || 'No patient selected.'}</Typography>
    </Box>
  );

  return (
  <Box sx={{ p: 3, maxWidth: 700, mx: 'auto', bgcolor: '#fafdff', borderRadius: 3 }}>
  <Paper sx={{ p: 2, mb: 2, bgcolor: '#f3f6fb', borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              {patient.fullName}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {t('patient.user_id') || 'User ID'}: {patient.userId}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {t('patient.email') || 'Email'}: {patient.email || '-'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Chip icon={<LocalHospitalIcon />} label={`${t('patient.medical_record_number') || 'MRN'}: ${patient.medicalRecordNumber || '-'}`} color="info" variant="outlined" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chip icon={<BloodtypeIcon />} label={`${t('patient.blood_type') || 'Blood'}: ${patient.bloodType || '-'}`} color="error" variant="outlined" sx={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chip label={`${t('patient.insurance_id') || 'Insurance'}: ${patient.insuranceId || '-'}`} color="success" variant="outlined" sx={{ width: '100%' }} />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      {/* Allergies */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={t('patient.allergies') || 'Allergies'}><HistoryEduIcon fontSize="small" color="warning" /></Tooltip> {t('patient.allergies') || 'Allergies'}
      </Typography>
      {patient.allergies && patient.allergies.length > 0 ? (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {patient.allergies.map((allergy, idx) => (
            <Chip key={idx} label={allergy} color="warning" variant="outlined" sx={{ mb: 1 }} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">{t('patient.none') || 'None'}</Typography>
      )}
      {/* Medical History */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={t('patient.medical_history') || 'Medical History'}><HistoryEduIcon fontSize="small" color="primary" /></Tooltip> {t('patient.medical_history') || 'Medical History'}
      </Typography>
      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {patient.medicalHistory.map((mh, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fafdff', borderRadius: 2 }}>
                <Typography><b>{t('patient.condition') || 'Condition'}:</b> {mh.condition}</Typography>
                <Typography><b>{t('patient.diagnosed_at') || 'Diagnosed At'}:</b> {mh.diagnosedAt}</Typography>
                <Typography><b>{t('patient.notes') || 'Notes'}:</b> {mh.notes}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">{t('patient.none') || 'None'}</Typography>
      )}
      {/* Current Medications */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={t('patient.current_medications') || 'Current Medications'}><MedicationIcon fontSize="small" color="info" /></Tooltip> {t('patient.current_medications') || 'Current Medications'}
      </Typography>
      {patient.currentMedications && patient.currentMedications.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {patient.currentMedications.map((med, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fafdff', borderRadius: 2 }}>
                <Typography><b>{t('patient.medication_name') || 'Name'}:</b> {med.name}</Typography>
                <Typography><b>{t('patient.medication_dosage') || 'Dosage'}:</b> {med.dosage}</Typography>
                <Typography><b>{t('patient.medication_frequency') || 'Frequency'}:</b> {med.frequency}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">{t('patient.none') || 'None'}</Typography>
      )}
      {/* Emergency Contact */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={t('patient.emergency_contact') || 'Emergency Contact'}><ContactEmergencyIcon fontSize="small" color="error" /></Tooltip> {t('patient.emergency_contact') || 'Emergency Contact'}
      </Typography>
  <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fff8f0', mb: 2, borderRadius: 2 }}>
        <Typography><b>{t('patient.contact_name') || 'Name'}:</b> {patient.emergencyContact?.name || '-'}</Typography>
        <Typography><b>{t('patient.contact_phone') || 'Phone'}:</b> {patient.emergencyContact?.phone || '-'}</Typography>
        <Typography><b>{t('patient.contact_relationship') || 'Relationship'}:</b> {patient.emergencyContact?.relationship || '-'}</Typography>
      </Paper>
    </Box>
  );
};

export default ViewPatient;
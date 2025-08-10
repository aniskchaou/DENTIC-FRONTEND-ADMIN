import React from 'react';
import { Box, Typography, Stack, Paper, Divider, Chip, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MedicationIcon from '@mui/icons-material/Medication';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

const ViewPatient = ({ patient }) => {
  if (!patient) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">No patient selected.</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 650, mx: 'auto', bgcolor: '#fafdff', borderRadius: 3, boxShadow: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary">
            {patient.fullName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            User ID: {patient.userId}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip icon={<LocalHospitalIcon />} label={`MRN: ${patient.medicalRecordNumber || '-'}`} color="info" variant="outlined" />
        <Chip icon={<BloodtypeIcon />} label={`Blood: ${patient.bloodType || '-'}`} color="error" variant="outlined" />
        <Chip label={`Insurance: ${patient.insuranceId || '-'}`} color="success" variant="outlined" />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Allergies */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryEduIcon fontSize="small" color="warning" /> Allergies
      </Typography>
      {patient.allergies && patient.allergies.length > 0 ? (
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {patient.allergies.map((allergy, idx) => (
            <Chip key={idx} label={allergy} color="warning" variant="outlined" sx={{ ml: 1 }} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">None</Typography>
      )}

      {/* Medical History */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryEduIcon fontSize="small" color="primary" /> Medical History
      </Typography>
      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {patient.medicalHistory.map((mh, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 1.5, bgcolor: '#f3f6fb' }}>
              <Typography><b>Condition:</b> {mh.condition}</Typography>
              <Typography><b>Diagnosed At:</b> {mh.diagnosedAt}</Typography>
              <Typography><b>Notes:</b> {mh.notes}</Typography>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">None</Typography>
      )}

      {/* Current Medications */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MedicationIcon fontSize="small" color="info" /> Current Medications
      </Typography>
      {patient.currentMedications && patient.currentMedications.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {patient.currentMedications.map((med, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 1.5, bgcolor: '#f3f6fb' }}>
              <Typography><b>Name:</b> {med.name}</Typography>
              <Typography><b>Dosage:</b> {med.dosage}</Typography>
              <Typography><b>Frequency:</b> {med.frequency}</Typography>
              <Typography><b>Prescribed By:</b> {med.prescribedBy}</Typography>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ ml: 2, mb: 2 }} color="text.secondary">None</Typography>
      )}

      {/* Emergency Contact */}
      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ContactEmergencyIcon fontSize="small" color="error" /> Emergency Contact
      </Typography>
      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fff8f0', mb: 2 }}>
        <Typography><b>Name:</b> {patient.emergencyContact?.name || '-'}</Typography>
        <Typography><b>Phone:</b> {patient.emergencyContact?.phone || '-'}</Typography>
        <Typography><b>Relationship:</b> {patient.emergencyContact?.relationship || '-'}</Typography>
      </Paper>
    </Box>
  );
};

export default ViewPatient;
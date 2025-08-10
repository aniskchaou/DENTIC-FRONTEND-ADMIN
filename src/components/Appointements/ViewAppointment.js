import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Typography, Chip, Divider, Box, Paper, Tooltip, Stack
} from '@mui/material';

const ViewAppointment = ({
  open,
  onClose,
  appointment,
  getPatientName,
  getDoctorName,
  getClinicName
}) => {
  if (!appointment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: '#e3f2fd', fontWeight: 700, fontSize: 22 }}>
        <i className="fas fa-calendar-check" style={{ color: '#1976d2', marginRight: 10 }} />
        Appointment Details
      </DialogTitle>
      <DialogContent dividers sx={{ background: '#f8fafc' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Tooltip title="Patient">
              <i className="fas fa-user" style={{ color: '#1976d2', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle1" fontWeight={600}>
              {getPatientName(appointment.patientId)}
            </Typography>
            <Chip
              label={appointment.status}
              color={
                appointment.status === 'Completed'
                  ? 'success'
                  : appointment.status === 'Confirmed'
                  ? 'primary'
                  : appointment.status === 'Pending'
                  ? 'warning'
                  : appointment.status === 'No-show'
                  ? 'error'
                  : 'default'
              }
              size="small"
              sx={{ ml: 2 }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Tooltip title="Doctor">
              <i className="fas fa-user-md" style={{ color: '#388e3c', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle2">{getDoctorName(appointment.doctorId)}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Clinic">
              <i className="fas fa-hospital" style={{ color: '#d32f2f', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle2">{getClinicName(appointment.clinicLocationId)}</Typography>
          </Stack>
        </Paper>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Date:</strong> {appointment.appointmentDate}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Room:</strong> {appointment.roomNumber || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Type:</strong> {appointment.appointmentType}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>First Visit:</strong> {appointment.isFirstVisit ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Follow Up Date:</strong> {appointment.followUpDate || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Reason for Visit:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#1976d2' }}>
              {appointment.reasonForVisit || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Notes:</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              {appointment.notes || '-'}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            <i className="fas fa-clock" style={{ marginRight: 4 }} />
            Created: {appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : '-'}
            <br />
            <i className="fas fa-sync-alt" style={{ marginRight: 4 }} />
            Updated: {appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : '-'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: '#f8fafc' }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ minWidth: 100 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAppointment;
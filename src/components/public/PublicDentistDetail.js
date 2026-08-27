import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Avatar, Rating, Divider, CircularProgress, Chip, Paper, List, ListItem, ListItemText
} from '@mui/material';
import { useParams, Link, useHistory } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const PublicDentistDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/doctors/${id}`)
      .then(r => setDoctor(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PublicLayout><Box textAlign="center" py={12}><CircularProgress /></Box></PublicLayout>;
  if (!doctor) return (
    <PublicLayout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Dentist not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} component={Link} to="/dentists">Back to Team</Button>
      </Container>
    </PublicLayout>
  );

  const reviews = Array.isArray(doctor.reviews) ? doctor.reviews : [];
  const availableDays = Array.isArray(doctor.availableDays) ? doctor.availableDays : [];
  const slots = Array.isArray(doctor.availableTimeSlots) ? doctor.availableTimeSlots : [];

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} component={Link} to="/dentists" sx={{ color: '#90caf9', mb: 3 }}>
            All Dentists
          </Button>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md="auto">
              <Avatar src={doctor.profilePicture}
                sx={{ width: 140, height: 140, bgcolor: '#90caf9', fontSize: 56, border: '4px solid #fff' }}>
                {(doctor.fullName || 'D')[0]}
              </Avatar>
            </Grid>
            <Grid item xs={12} md>
              <Typography variant="h3" fontWeight={800} color="#fff">{doctor.fullName}</Typography>
              <Typography variant="h6" color="#90caf9" gutterBottom>{doctor.specialization || 'General Dentist'}</Typography>
              {doctor.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={parseFloat(doctor.rating) || 0} readOnly precision={0.1} sx={{ color: '#fdd835' }} />
                  <Typography color="#fff">{doctor.rating} / 5</Typography>
                </Box>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="secondary" size="large" startIcon={<CalendarMonthIcon />}
                  component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
                  Book Appointment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main info */}
          <Grid item xs={12} md={8}>
            {/* About */}
            <Typography variant="h5" fontWeight={700} gutterBottom>About</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 3 }}>
              {doctor.bio || `Dr. ${doctor.fullName} is a ${doctor.specialization || 'dentist'} with ${doctor.experienceYears || 0} years of experience, dedicated to providing exceptional patient care using the latest dental techniques and technologies.`}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Qualifications */}
            <Typography variant="h6" fontWeight={700} gutterBottom>Qualifications & Specialties</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {doctor.specialization && <Chip label={doctor.specialization} color="primary" />}
              {doctor.licenseNumber && <Chip label={`License: ${doctor.licenseNumber}`} variant="outlined" />}
              {doctor.experienceYears && <Chip label={`${doctor.experienceYears} yrs experience`} variant="outlined" />}
              {doctor.consultationFee && <Chip label={`From $${doctor.consultationFee}`} variant="outlined" color="success" />}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Reviews */}
            <Typography variant="h6" fontWeight={700} gutterBottom>Patient Reviews</Typography>
            {reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet.</Typography>
            ) : reviews.map((rv, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 2, borderLeft: '3px solid #1976d2' }}>
                <Rating value={rv.rating || 5} readOnly size="small" />
                <Typography variant="body2" sx={{ mt: 0.5 }}>{rv.comment}</Typography>
                <Typography variant="caption" color="text.disabled">
                  {rv.reviewDate ? new Date(rv.reviewDate).toLocaleDateString() : ''}
                </Typography>
              </Paper>
            ))}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Availability</Typography>
              {availableDays.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>Available Days</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {availableDays.map(d => <Chip key={d} label={d} size="small" />)}
                  </Box>
                </>
              )}
              {slots.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>Time Slots</Typography>
                  {slots.map((s, i) => (
                    <Typography key={i} variant="body2">{s.startTime} – {s.endTime}</Typography>
                  ))}
                </>
              )}
              <Button fullWidth variant="contained" size="large" startIcon={<CalendarMonthIcon />}
                component={Link} to="/book-appointment" sx={{ mt: 2, fontWeight: 700 }}>
                Book with Dr. {doctor.fullName?.split(' ').pop()}
              </Button>
            </Paper>

            {doctor.consultationFee && (
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Consultation Fee</Typography>
                <Typography variant="h4" fontWeight={800} color="primary">${doctor.consultationFee}</Typography>
                <Typography variant="caption" color="text.secondary">Starting price — varies by procedure</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default PublicDentistDetail;

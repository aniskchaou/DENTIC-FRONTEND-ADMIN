import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Chip,
  CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PublicLocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/clinic-locations/${id}`)
      .then(r => setLocation(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PublicLayout><Box textAlign="center" py={12}><CircularProgress /></Box></PublicLayout>;
  if (!location) return (
    <PublicLayout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Location not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} component={Link} to="/locations">All Locations</Button>
      </Container>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} component={Link} to="/locations" sx={{ color: '#90caf9', mb: 2 }}>
            All Locations
          </Button>
          <Typography variant="h3" fontWeight={800}>{location.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <LocationOnIcon />
            <Typography variant="h6" sx={{ color: '#90caf9' }}>
              {location.address}{location.city ? `, ${location.city}` : ''}{location.state ? `, ${location.state}` : ''}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Description */}
            {location.description && (
              <>
                <Typography variant="h5" fontWeight={700} gutterBottom>About This Location</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 3 }}>{location.description}</Typography>
                <Divider sx={{ my: 3 }} />
              </>
            )}

            {/* Services at this location */}
            <Typography variant="h5" fontWeight={700} gutterBottom>Services Available Here</Typography>
            {location.services?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {location.services.map(s => <Chip key={s} label={s} color="primary" variant="outlined" />)}
              </Box>
            ) : (
              <Typography color="text.secondary" gutterBottom>Full-service dental clinic — all treatments available.</Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Team */}
            <Typography variant="h5" fontWeight={700} gutterBottom>Our Team Here</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Our experienced dental professionals are ready to serve you at this location.
            </Typography>
            <Button variant="outlined" component={Link} to="/dentists">Meet Our Dentists</Button>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Contact & Hours</Typography>
              {location.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <PhoneIcon color="primary" />
                  <Typography variant="body1">{location.phone}</Typography>
                </Box>
              )}
              {location.email && (
                <Typography variant="body2" color="text.secondary" gutterBottom>{location.email}</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              {location.openingHours ? (
                <>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />Opening Hours
                  </Typography>
                  {DAYS.map(d => {
                    const hours = location.openingHours?.[d];
                    if (!hours) return <Box key={d} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                      <Typography variant="body2">{d}</Typography>
                      <Typography variant="body2" color="text.disabled">Closed</Typography>
                    </Box>;
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === d;
                    return (
                      <Box key={d} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                        <Typography variant="body2" fontWeight={isToday ? 700 : 400} color={isToday ? 'primary' : 'inherit'}>{d}</Typography>
                        <Typography variant="body2" fontWeight={isToday ? 700 : 400}>{hours.open} – {hours.close}</Typography>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Mon–Fri 8am–6pm, Sat 9am–1pm</Typography>
              )}
            </Paper>

            <Button fullWidth variant="contained" size="large" startIcon={<CalendarMonthIcon />}
              component={Link} to="/book-appointment" sx={{ fontWeight: 700, borderRadius: 2 }}>
              Book at This Location
            </Button>
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default PublicLocationDetail;

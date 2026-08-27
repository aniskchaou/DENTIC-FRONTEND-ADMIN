import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, CircularProgress, Paper, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const LocationCard = ({ loc }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ bgcolor: '#1976d2', p: 3, color: '#fff' }}>
      <Typography variant="h5" fontWeight={700}>{loc.name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <LocationOnIcon fontSize="small" />
        <Typography variant="body2">{loc.address}{loc.city ? `, ${loc.city}` : ''}{loc.state ? `, ${loc.state}` : ''}</Typography>
      </Box>
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      {loc.phone && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{loc.phone}</Typography>
        </Box>
      )}
      {loc.openingHours && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />Hours
          </Typography>
          {DAYS.map(d => {
            const hours = loc.openingHours?.[d];
            if (!hours) return null;
            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === d;
            return (
              <Box key={d} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                <Typography variant="body2" fontWeight={isToday ? 700 : 400} color={isToday ? 'primary' : 'inherit'}>{d}</Typography>
                <Typography variant="body2" fontWeight={isToday ? 700 : 400}>{hours.open} – {hours.close}</Typography>
              </Box>
            );
          })}
        </Box>
      )}
      {loc.services?.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {loc.services.map(s => <Chip key={s} label={s} size="small" />)}
        </Box>
      )}
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
      <Button fullWidth variant="outlined" component={Link} to={`/locations/${loc.id}`} size="small">
        View Details
      </Button>
      <Button fullWidth variant="contained" component={Link} to="/book-appointment" size="small" startIcon={<CalendarMonthIcon />}>
        Book Here
      </Button>
    </CardActions>
  </Card>
);

const PublicLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/clinic-locations`)
      .then(r => setLocations(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Our Locations</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Conveniently located clinics with flexible hours to fit your schedule.
          </Typography>
        </Container>
      </Box>

      {/* Locations grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress /></Box>
        ) : locations.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>Location details coming soon.</Typography>
            <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Main Clinic</Typography>
              <Typography variant="body2">123 Dental Ave, Metropolis, MS 12345</Typography>
              <Typography variant="body2">Phone: +1 (555) 012-3456</Typography>
              <Typography variant="body2">Mon–Fri 8am–6pm, Sat 9am–1pm</Typography>
              <Button fullWidth variant="contained" sx={{ mt: 2 }} component={Link} to="/book-appointment">Book Appointment</Button>
            </Paper>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {locations.map(loc => (
              <Grid item xs={12} md={6} key={loc.id}>
                <LocationCard loc={loc} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Map placeholder */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>Find Us</Typography>
          <Box sx={{
            bgcolor: '#cfd8dc', borderRadius: 3, height: 300, display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#607d8b'
          }}>
            <Box textAlign="center">
              <LocationOnIcon sx={{ fontSize: 48 }} />
              <Typography variant="body1">Interactive map — contact us for directions</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 6, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Not sure which location?</Typography>
          <Typography variant="body1" sx={{ color: '#bbdefb', mb: 3 }}>Call us and we will help find the most convenient clinic for you.</Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/contact" sx={{ fontWeight: 700 }}>
            Contact Us
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicLocations;

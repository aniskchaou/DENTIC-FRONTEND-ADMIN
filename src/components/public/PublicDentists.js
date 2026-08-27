import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Avatar, Button, Chip, TextField, InputAdornment, Rating,
  CircularProgress, Divider, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const SPECIALTIES = ['All', 'General Dentist', 'Orthodontist', 'Periodontist', 'Oral Surgeon', 'Pediatric Dentist', 'Endodontist'];

const DentistCard = ({ doctor, onBook }) => (
  <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ bgcolor: '#e3f2fd', p: 3, textAlign: 'center' }}>
      <Avatar
        src={doctor.profilePicture}
        sx={{ width: 90, height: 90, mx: 'auto', mb: 1, bgcolor: '#1976d2', fontSize: 36 }}
      >
        {(doctor.fullName || doctor.name || 'D')[0]}
      </Avatar>
      <Typography variant="h6" fontWeight={700}>{doctor.fullName || doctor.name}</Typography>
      <Typography variant="body2" color="primary" fontWeight={600}>{doctor.specialization || 'General Dentist'}</Typography>
      {doctor.rating && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Rating value={parseFloat(doctor.rating) || 0} readOnly size="small" precision={0.1} />
          <Typography variant="caption" color="text.secondary">({doctor.rating})</Typography>
        </Box>
      )}
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      {doctor.experienceYears && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          🏅 {doctor.experienceYears} years experience
        </Typography>
      )}
      {doctor.availableDays?.length > 0 && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📅 Available: {(doctor.availableDays || []).slice(0, 3).join(', ')}
        </Typography>
      )}
      {doctor.licenseNumber && (
        <Typography variant="caption" color="text.disabled">License: {doctor.licenseNumber}</Typography>
      )}
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
      <Button
        fullWidth variant="outlined" size="small"
        component={Link} to={`/dentists/${doctor.id}`}
      >
        View Profile
      </Button>
      <Button
        fullWidth variant="contained" size="small"
        startIcon={<CalendarMonthIcon />}
        onClick={() => onBook(doctor)}
      >
        Book
      </Button>
    </CardActions>
  </Card>
);

const PublicDentists = () => {
  const history = useHistory();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [bookDoctor, setBookDoctor] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/doctors`)
      .then(r => setDoctors(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d => {
    const matchName = (d.fullName || d.name || '').toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === 'All' || (d.specialization || '').toLowerCase().includes(specialty.toLowerCase());
    return matchName && matchSpec;
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Our Dental Team</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Experienced, board-certified dentists committed to your smile.
          </Typography>
        </Container>
      </Box>

      {/* Search & filters */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small" placeholder="Search by name…"
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                sx={{ bgcolor: '#fff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SPECIALTIES.map(s => (
                  <Chip
                    key={s} label={s}
                    color={specialty === s ? 'primary' : 'default'}
                    onClick={() => setSpecialty(s)}
                    sx={{ cursor: 'pointer', fontWeight: specialty === s ? 700 : 400 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dentist grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>No dentists found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(d => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={d.id}>
                <DentistCard doctor={d} onBook={doc => setBookDoctor(doc)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Book confirmation dialog */}
      <Dialog open={Boolean(bookDoctor)} onClose={() => setBookDoctor(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Book with {bookDoctor?.fullName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You'll be taken to our booking page to choose a date and time with {bookDoctor?.fullName}.
          </Typography>
          <Button
            fullWidth variant="contained" sx={{ mt: 2 }}
            onClick={() => { setBookDoctor(null); history.push('/book-appointment'); }}
          >
            Continue to Booking
          </Button>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 6, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={700} gutterBottom>Can't find the right specialist?</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Contact us and we'll match you with the best dentist for your needs.
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/contact" sx={{ mt: 1, fontWeight: 700 }}>
            Contact Us
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicDentists;

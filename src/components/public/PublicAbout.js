import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip,
  Avatar, Paper, Divider, CircularProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const VALUES = [
  { icon: <FavoriteIcon sx={{ fontSize: 32, color: '#e53935' }} />, title: 'Patient-First Care', desc: 'Every decision we make starts with your comfort, safety, and wellbeing.' },
  { icon: <VerifiedIcon sx={{ fontSize: 32, color: '#1976d2' }} />, title: 'Clinical Excellence', desc: 'Board-certified dentists committed to ongoing education and best practices.' },
  { icon: <EmojiObjectsIcon sx={{ fontSize: 32, color: '#f57c00' }} />, title: 'Innovation', desc: 'We invest in the latest technology so your treatment is faster, more precise, and more comfortable.' },
  { icon: <StarIcon sx={{ fontSize: 32, color: '#fdd835' }} />, title: 'Trust & Transparency', desc: 'Clear communication, honest pricing, and treatment plans you understand.' },
];

const CERTS = ['ADA Member', 'OSHA Compliant', 'HIPAA Certified', 'ISO 9001', 'Digital Imaging Certified', 'Invisalign Provider'];

const TEAM_HIGHLIGHTS = [
  { stat: '12+', label: 'Years in Practice' },
  { stat: '15k+', label: 'Happy Patients' },
  { stat: '8', label: 'Specialist Dentists' },
  { stat: '4.9★', label: 'Average Rating' },
];

const PublicAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/aboutus`)
      .then(r => setAbout(r.data?.aboutUs || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>About Our Clinic</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9', maxWidth: 600, mx: 'auto' }}>
            Serving our community with compassionate, high-quality dental care since 2012.
          </Typography>
        </Container>
      </Box>

      {/* Stats banner */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 3 }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            {TEAM_HIGHLIGHTS.map(h => (
              <Grid item xs={6} sm={3} key={h.stat} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} color="primary">{h.stat}</Typography>
                <Typography variant="body2" color="text.secondary">{h.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our story */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" fontWeight={700}>Our Story</Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom>From a Single Chair to a Full-Service Clinic</Typography>
            {loading ? <CircularProgress size={20} /> : (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>
                {about?.description || 'DenticClinic was founded in 2012 with a simple mission: make excellent dental care accessible to every patient. Starting with one dentist and a small team, we have grown into a multi-specialty clinic serving thousands of patients each year. Our commitment to continuous improvement drives every investment in technology and training.'}
              </Typography>
            )}
            {about?.highlights?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {about.highlights.map((h, i) => (
                  <Typography key={i} variant="body2" sx={{ '&:before': { content: '"✓ "', color: 'success.main', fontWeight: 700 } }}>{h}</Typography>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="img" src="/images/3.jpg" alt="Clinic interior"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 4, objectFit: 'cover', maxHeight: 380 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Mission & Values */}
      <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Mission & Values</Typography>
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>What We Stand For</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}>
            Our mission is to deliver exceptional oral healthcare in a welcoming, anxiety-free environment.
          </Typography>
          <Grid container spacing={3}>
            {VALUES.map(v => (
              <Grid item xs={12} sm={6} md={3} key={v.title}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2, boxShadow: 2, borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{v.icon}</Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{v.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why choose us */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Why Choose Us</Typography>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>The DenticClinic Difference</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            'Same-day emergency appointments available',
            'Digital X-rays with 90% less radiation',
            'Sedation dentistry for anxious patients',
            'Flexible payment plans & financing',
            'Evening and Saturday appointments',
            'Dedicated children\'s treatment suite',
            'Multi-language staff',
            'Transparent pricing — no hidden fees',
          ].map(item => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper sx={{ p: 2, borderRadius: 2, borderLeft: '4px solid #1976d2', boxShadow: 1 }}>
                <Typography variant="body2" fontWeight={500}>{item}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Technology */}
      <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Technology</Typography>
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>State-of-the-Art Facilities</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[
              { name: 'Digital Panoramic X-Ray', desc: 'Full-mouth imaging in seconds with minimal radiation.' },
              { name: 'CEREC Same-Day Crowns', desc: 'Computer-milled ceramic restorations in a single visit.' },
              { name: 'Laser Dentistry', desc: 'Precise, less invasive treatment for gum and soft tissue procedures.' },
              { name: '3D CBCT Scanning', desc: 'Detailed 3D imaging for implant planning and complex cases.' },
              { name: 'Intraoral Cameras', desc: 'See exactly what we see with real-time tooth imaging.' },
              { name: 'Digital Impressions', desc: 'No messy putty — accurate digital scans for crowns and aligners.' },
            ].map(t => (
              <Grid item xs={12} sm={6} md={4} key={t.name}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{t.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Certifications */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="overline" color="primary" fontWeight={700} display="block">Certifications & Memberships</Typography>
        <Typography variant="h5" fontWeight={700} gutterBottom>Accredited & Trusted</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 3 }}>
          {CERTS.map(c => (
            <Chip key={c} icon={<VerifiedIcon />} label={c} color="primary" variant="outlined" sx={{ fontSize: 14, py: 1 }} />
          ))}
        </Box>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Ready to Meet Our Team?</Typography>
          <Typography variant="body1" sx={{ color: '#bbdefb', mb: 3 }}>
            Browse our dentists or book your first appointment today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/dentists" sx={{ fontWeight: 700, px: 4 }}>
              Meet Our Team
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/book-appointment"
              sx={{ fontWeight: 700, px: 4, color: '#fff', borderColor: '#fff' }}>
              Book Appointment
            </Button>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicAbout;

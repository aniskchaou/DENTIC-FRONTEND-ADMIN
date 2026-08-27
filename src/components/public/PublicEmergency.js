import React from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Divider,
  List, ListItem, ListItemIcon, ListItemText, Alert, Card, CardContent
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const EMERGENCY_TYPES = [
  { icon: '🦷', title: 'Severe Toothache', desc: 'Intense, persistent pain that may indicate infection or abscess. Do not delay treatment.' },
  { icon: '💔', title: 'Knocked-Out Tooth', desc: 'Handle by the crown, rinse gently, reinsert or keep in milk, and get to us within 1 hour.' },
  { icon: '🩸', title: 'Broken or Cracked Tooth', desc: 'Rinse mouth with warm water, apply cold compress. Come in immediately.' },
  { icon: '😬', title: 'Lost Filling or Crown', desc: 'Cover with dental wax if available. Avoid chewing on that side and call us.' },
  { icon: '🤕', title: 'Dental Abscess', desc: 'Swelling, pus, or fever? This is a medical emergency — seek care immediately.' },
  { icon: '🩹', title: 'Soft Tissue Injury', desc: 'Cuts or tears to lips, cheeks, or gums. Apply pressure and come in or visit ER if bleeding persists.' },
];

const FIRST_AID = [
  'Stay calm and call us immediately',
  'Rinse mouth gently with warm salt water',
  'Apply a cold compress to reduce swelling',
  'Take over-the-counter pain relief if needed (ibuprofen/acetaminophen)',
  'Do NOT put aspirin directly on the tooth or gum',
  'Save any broken tooth fragments',
];

const PublicEmergency = () => (
  <PublicLayout>
    {/* Hero — red for urgency */}
    <Box sx={{ bgcolor: '#c62828', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <LocalHospitalIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h2" fontWeight={800} gutterBottom>Dental Emergency?</Typography>
        <Typography variant="h5" sx={{ color: '#ffcdd2', mb: 4 }}>
          We're here for you — same-day emergency appointments available.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained" size="large"
            sx={{ bgcolor: '#fff', color: '#c62828', fontWeight: 800, fontSize: 18, px: 5, '&:hover': { bgcolor: '#ffcdd2' } }}
            startIcon={<PhoneIcon />}
            href="tel:+15550123456"
          >
            Call Now: +1 (555) 012-3456
          </Button>
          <Button
            variant="outlined" size="large"
            sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700, fontSize: 16, px: 4 }}
            component={Link} to="/book-appointment"
            startIcon={<CalendarMonthIcon />}
          >
            Book Same-Day
          </Button>
        </Box>
      </Container>
    </Box>

    {/* Alert banner */}
    <Box sx={{ bgcolor: '#fff3e0', py: 2 }}>
      <Container maxWidth="md">
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ fontSize: 15 }}>
          <strong>If you are experiencing severe bleeding, difficulty breathing, or swallowing, call 911 immediately.</strong>
        </Alert>
      </Container>
    </Box>

    {/* Hours */}
    <Box sx={{ bgcolor: '#f9fafb', py: 5 }}>
      <Container maxWidth="md">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: '#c62828' }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Emergency Hours</Typography>
            <Typography variant="body2" color="text.secondary">Mon–Fri: 7am–8pm</Typography>
            <Typography variant="body2" color="text.secondary">Saturday: 8am–5pm</Typography>
            <Typography variant="body2" color="text.secondary">Sunday: 9am–2pm</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <PhoneIcon sx={{ fontSize: 40, color: '#c62828' }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Emergency Line</Typography>
            <Typography variant="body1" fontWeight={700} color="error">+1 (555) 012-3456</Typography>
            <Typography variant="body2" color="text.secondary">Available during emergency hours</Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <CalendarMonthIcon sx={{ fontSize: 40, color: '#c62828' }} />
            <Typography variant="h6" fontWeight={700} mt={1}>Same-Day Booking</Typography>
            <Typography variant="body2" color="text.secondary">Call or book online for same-day emergency slots</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Divider />

    {/* Common emergencies */}
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Common Dental Emergencies</Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}>
        Know how to respond before you reach us — quick action can save your tooth.
      </Typography>
      <Grid container spacing={3}>
        {EMERGENCY_TYPES.map(e => (
          <Grid item xs={12} sm={6} md={4} key={e.title}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, borderTop: '3px solid #c62828' }}>
              <CardContent>
                <Typography variant="h3" gutterBottom>{e.icon}</Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>{e.title}</Typography>
                <Typography variant="body2" color="text.secondary">{e.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

    <Divider />

    {/* First aid */}
    <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>First Aid While You Wait</Typography>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2, mt: 3 }}>
          <List dense>
            {FIRST_AID.map((item, i) => (
              <ListItem key={i} sx={{ py: 1 }}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>

    {/* CTA */}
    <Box sx={{ bgcolor: '#c62828', py: 8, textAlign: 'center', color: '#fff' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={800} gutterBottom>Don't Wait — Call Now</Typography>
        <Typography variant="body1" sx={{ color: '#ffcdd2', mb: 3 }}>
          Dental emergencies get worse with time. Our team is ready to help you today.
        </Typography>
        <Button
          variant="contained" size="large"
          sx={{ bgcolor: '#fff', color: '#c62828', fontWeight: 800, px: 5 }}
          href="tel:+15550123456"
          startIcon={<PhoneIcon />}
        >
          +1 (555) 012-3456
        </Button>
      </Container>
    </Box>
  </PublicLayout>
);

export default PublicEmergency;

import React from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Divider,
  List, ListItem, ListItemIcon, ListItemText, Chip, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const STEPS = [
  { label: 'Schedule Your Appointment', desc: 'Book online or call us. Our friendly team will help find the perfect time slot.' },
  { label: 'Complete Your Forms', desc: 'Fill in your medical history and insurance details online before your visit — saves time at the clinic.' },
  { label: 'Arrive & Check In', desc: 'Arrive 10 minutes early. Our team will welcome you and answer any questions.' },
  { label: 'Comprehensive Exam', desc: 'X-rays, oral health assessment, and a chat about your dental goals and concerns.' },
  { label: 'Treatment Plan', desc: 'Your dentist walks you through a personalised treatment plan with clear pricing.' },
  { label: 'Begin Your Journey to a Healthier Smile', desc: 'Start treatment the same day when possible, or schedule follow-up appointments at your convenience.' },
];

const WHAT_TO_BRING = [
  'Photo ID (driver\'s licence or passport)',
  'Insurance card and policy number',
  'List of current medications',
  'Any relevant dental or medical records',
  'List of questions or concerns',
  'Payment method for any co-pays',
];

const FORMS = [
  { name: 'New Patient Registration Form', desc: 'Personal and contact information' },
  { name: 'Medical & Dental History', desc: 'Important for safe, personalised treatment' },
  { name: 'Insurance Verification Form', desc: 'Help us verify your benefits in advance' },
  { name: 'Financial Responsibility Agreement', desc: 'Understand your payment obligations' },
  { name: 'HIPAA Privacy Notice', desc: 'How we protect your health information' },
];

const PublicNewPatient = () => (
  <PublicLayout>
    {/* Hero */}
    <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography variant="h2" fontWeight={800} gutterBottom>Welcome, New Patients!</Typography>
        <Typography variant="h6" sx={{ color: '#90caf9', mb: 4 }}>
          We are so glad you chose DenticClinic for your dental health. Here is everything you need to know before your first visit.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment"
          startIcon={<CalendarMonthIcon />} sx={{ fontWeight: 700, px: 5, fontSize: 16 }}>
          Book First Appointment
        </Button>
      </Container>
    </Box>

    {/* What to Expect */}
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Your First Visit</Typography>
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>What to Expect</Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
        We want your first visit to be relaxing and informative. Here is a step-by-step overview.
      </Typography>
      <Grid container spacing={6} alignItems="flex-start">
        <Grid item xs={12} md={7}>
          <Stepper orientation="vertical" nonLinear>
            {STEPS.map((step, i) => (
              <Step key={step.label} active expanded>
                <StepLabel>
                  <Typography fontWeight={700}>{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ pb: 1 }}>{step.desc}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>What to Bring</Typography>
            <List dense>
              {WHAT_TO_BRING.map(item => (
                <ListItem key={item} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mt: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Office Policies</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Cancellations:</strong> Please give 24 hours notice to avoid a cancellation fee.
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Late arrivals:</strong> We will do our best, but may need to reschedule if you are more than 15 minutes late.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Children:</strong> Parents must accompany children under 18 at initial visits.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>

    <Divider />

    {/* Patient Forms */}
    <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Patient Forms</Typography>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Complete Before Your Visit</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
          Save time by filling out these forms in advance.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {FORMS.map(f => (
            <Grid item xs={12} sm={6} md={4} key={f.name}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <ArticleIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={700}>{f.name}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={4}>
          <Button variant="contained" size="large" component={Link} to="/login" sx={{ fontWeight: 700 }}>
            Complete Forms in Patient Portal
          </Button>
        </Box>
      </Container>
    </Box>

    {/* CTA */}
    <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight={800} gutterBottom>Ready to Get Started?</Typography>
        <Typography sx={{ color: '#bbdefb', mb: 3 }}>Book your first appointment and take the first step toward a healthier smile.</Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
            Book Appointment
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/contact" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>
            Ask a Question
          </Button>
        </Box>
      </Container>
    </Box>
  </PublicLayout>
);

export default PublicNewPatient;

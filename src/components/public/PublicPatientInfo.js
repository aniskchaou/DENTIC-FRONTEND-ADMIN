import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Divider,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const SECTIONS = [
  {
    id: 'first-visit',
    title: 'Your First Visit',
    content: `Your first appointment typically lasts 60–90 minutes. We begin with a comprehensive oral examination, digital X-rays, and a professional cleaning. Your dentist will discuss your dental health, answer your questions, and create a personalised treatment plan. We encourage you to share any anxieties so we can make your experience as comfortable as possible.`,
  },
  {
    id: 'insurance',
    title: 'Dental Insurance',
    content: `We accept most major dental insurance plans. Please bring your insurance card and we will verify your benefits before treatment. We submit claims directly to your insurer. Your responsibility will be any deductibles, co-pays, or non-covered services. We are happy to provide a pre-treatment estimate for larger procedures.`,
  },
  {
    id: 'payment',
    title: 'Payment & Financing',
    content: `We accept cash, all major credit/debit cards, and HSA/FSA cards. We also offer flexible financing through CareCredit and in-house payment plans for larger treatments. Our goal is to make excellent dental care affordable for every patient.`,
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    content: `We understand life happens. If you need to cancel or reschedule, please give us at least 24 hours notice to avoid a cancellation fee. Repeated no-shows may require a deposit for future appointments. We hold reserved time especially for you — last-minute cancellations affect other patients waiting for care.`,
  },
  {
    id: 'children',
    title: 'Children\'s Dental Care',
    content: `We welcome children from their first birthday! Our dedicated pediatric suite is designed to make little ones feel safe and excited about dental visits. We recommend establishing a "dental home" early to build healthy habits. Parents are always welcome to accompany children during treatment.`,
  },
  {
    id: 'emergencies',
    title: 'Dental Emergencies',
    content: `We reserve same-day slots for dental emergencies. Call us as soon as possible — do not wait. For after-hours emergencies, our voicemail provides guidance and an emergency contact number.`,
  },
];

const INSURANCE_ACCEPTED = [
  'Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'United Concordia',
  'Humana', 'Assurant', 'Principal', 'Sun Life', 'Ameritas', 'Careington',
];

const PublicPatientInfo = () => {
  const [expanded, setExpanded] = useState('first-visit');

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Patient Information</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Everything you need to know for a smooth, comfortable experience at DenticClinic.
          </Typography>
        </Container>
      </Box>

      {/* Navigation tabs */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {SECTIONS.map(s => (
              <Chip
                key={s.id} label={s.title}
                onClick={() => setExpanded(s.id)}
                color={expanded === s.id ? 'primary' : 'default'}
                sx={{ cursor: 'pointer', fontWeight: expanded === s.id ? 700 : 400 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {SECTIONS.map(s => (
              <Accordion
                key={s.id}
                expanded={expanded === s.id}
                onChange={() => setExpanded(expanded === s.id ? null : s.id)}
                sx={{ mb: 2, borderRadius: 2, boxShadow: 2, '&:before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: expanded === s.id ? '#e3f2fd' : undefined }}>
                  <Typography variant="h6" fontWeight={700}>{s.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>{s.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Insurance sidebar */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Insurance We Accept</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {INSURANCE_ACCEPTED.map(ins => (
                  <Chip key={ins} label={ins} size="small" variant="outlined" />
                ))}
              </Box>
              <Typography variant="caption" color="text.disabled" display="block" mt={2}>
                Don't see yours? Call us — we work with many more providers.
              </Typography>
            </Paper>

            {/* Quick links */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Quick Links</Typography>
              <List dense>
                {[
                  { label: 'New Patient Guide', to: '/new-patient' },
                  { label: 'Financing Options', to: '/financing' },
                  { label: 'FAQ', to: '/faq' },
                  { label: 'Book Appointment', to: '/book-appointment' },
                  { label: 'Contact Us', to: '/contact' },
                ].map(link => (
                  <ListItem key={link.to} button component={Link} to={link.to} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={link.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 6, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Have More Questions?</Typography>
          <Typography sx={{ color: '#bbdefb', mb: 3 }}>Our team is happy to help before, during, and after your visit.</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
              Book Appointment
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/contact" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicPatientInfo;

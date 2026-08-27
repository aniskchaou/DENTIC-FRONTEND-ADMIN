import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, Divider, Paper, TextField, Alert, CircularProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const OPEN_POSITIONS = [
  { id: 1, title: 'General Dentist', type: 'Full-Time', location: 'Main Clinic', category: 'Clinical', desc: 'Join our team as a general dentist. Experience with digital dentistry preferred. Competitive salary + profit share.' },
  { id: 2, title: 'Dental Hygienist', type: 'Part-Time', location: 'Main Clinic', category: 'Clinical', desc: 'Seeking a friendly, patient-focused hygienist. Flexible scheduling available.' },
  { id: 3, title: 'Orthodontic Specialist', type: 'Full-Time', location: 'Branch Clinic', category: 'Clinical', desc: 'Certified orthodontist to expand our orthodontics program. Invisalign experience required.' },
  { id: 4, title: 'Dental Receptionist', type: 'Full-Time', location: 'Main Clinic', category: 'Administrative', desc: 'Front desk role managing appointments, insurance verification, and patient relations.' },
  { id: 5, title: 'Dental Assistant', type: 'Full-Time', location: 'Both Locations', category: 'Clinical', desc: 'Certified dental assistant to support our clinical team. Radiography certification a plus.' },
  { id: 6, title: 'Treatment Coordinator', type: 'Full-Time', location: 'Main Clinic', category: 'Administrative', desc: 'Help patients understand treatment plans and navigate financing options.' },
];

const BENEFITS = [
  'Competitive salary and performance bonuses',
  'Continuing education and training support',
  'Health, dental, and vision benefits',
  '401k with employer match',
  'Paid time off and holidays',
  'Flexible scheduling options',
  'Positive, supportive team culture',
  'State-of-the-art equipment and technology',
];

const CATEGORY_COLORS = { Clinical: 'primary', Administrative: 'secondary' };

const PublicCareers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApply = job => {
    setSelectedJob(job);
    setForm(prev => ({ ...prev, position: job.title }));
    setTimeout(() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.position) {
      setError('Please fill in all required fields.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await axios.post(`${BASE_URL}/messages`, {
        senderName: form.name,
        senderEmail: form.email,
        senderPhone: form.phone,
        subject: `Career Application: ${form.position}`,
        messageBody: form.message || `Application for ${form.position}`,
        messageType: 'career',
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', position: '', message: '' });
      setSelectedJob(null);
    } catch {
      setError('Failed to submit application. Please email us directly.');
    }
    setSending(false);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <WorkIcon sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h2" fontWeight={800} gutterBottom>Join Our Team</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Build a rewarding career in a clinic that values your expertise, growth, and wellbeing.
          </Typography>
        </Container>
      </Box>

      {/* Benefits */}
      <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Why Work With Us</Typography>
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Benefits & Culture</Typography>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {BENEFITS.map(b => (
              <Grid item xs={12} sm={6} md={3} key={b}>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleIcon color="success" sx={{ mt: 0.3 }} />
                    <Typography variant="body2">{b}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Open positions */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Hiring Now</Typography>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Open Positions</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {OPEN_POSITIONS.map(job => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{job.title}</Typography>
                    <Chip label={job.category} size="small" color={CATEGORY_COLORS[job.category] || 'default'} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">{job.type}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">{job.location}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{job.desc}</Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button variant="contained" onClick={() => handleApply(job)} sx={{ fontWeight: 700 }}>
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Application form */}
      <Box id="apply-form" sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            {selectedJob ? `Apply for: ${selectedJob.title}` : 'General Application'}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Fill in your details and we will be in touch.
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>Application submitted! We will review it and contact you shortly.</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name *" name="name" value={form.name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Position Applying For *" name="position" value={form.position} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Tell Us About Yourself" name="message"
                    value={form.message} onChange={handleChange}
                    multiline rows={5}
                    placeholder="Your experience, qualifications, and why you want to join us…"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit" variant="contained" size="large" fullWidth
                    startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                    disabled={sending} sx={{ fontWeight: 700, py: 1.5 }}
                  >
                    {sending ? 'Submitting…' : 'Submit Application'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicCareers;

import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, TextField,
  Divider, Alert, CircularProgress, Snackbar, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const CONTACT_INFO = [
  { icon: <PhoneIcon color="primary" />, label: 'Phone', value: '+1 (555) 012-3456', href: 'tel:+15550123456' },
  { icon: <EmailIcon color="primary" />, label: 'Email', value: 'hello@denticclinic.com', href: 'mailto:hello@denticclinic.com' },
  { icon: <LocationOnIcon color="primary" />, label: 'Address', value: '123 Dental Ave, Metropolis, MS 12345' },
  { icon: <AccessTimeIcon color="primary" />, label: 'Hours', value: 'Mon–Fri 8am–6pm, Sat 9am–1pm' },
];

const PublicContact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
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
        subject: form.subject || 'Contact form enquiry',
        messageBody: form.message,
        messageType: 'contact',
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Failed to send your message. Please try again or call us directly.');
    }
    setSending(false);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Contact Us</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            We are here to help — reach out by phone, email, or the form below.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact form */}
          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Send Us a Message</Typography>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
                Thank you! We received your message and will be in touch within 1 business day.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
            )}
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
                  <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Message *" name="message" value={form.message}
                    onChange={handleChange} multiline rows={5} required
                    placeholder="Tell us how we can help…"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit" variant="contained" size="large" fullWidth
                    startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                    disabled={sending} sx={{ fontWeight: 700, py: 1.5 }}
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Contact info sidebar */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Contact Information</Typography>
              <List dense>
                {CONTACT_INFO.map(info => (
                  <ListItem key={info.label} sx={{ py: 1.5, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ mt: 0.5 }}>{info.icon}</ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="caption" color="text.disabled" fontWeight={700}>{info.label}</Typography>}
                      secondary={
                        info.href
                          ? <a href={info.href} style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>{info.value}</a>
                          : <Typography variant="body2">{info.value}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Map placeholder */}
            <Box sx={{
              bgcolor: '#cfd8dc', borderRadius: 3, height: 200, display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#607d8b'
            }}>
              <Box textAlign="center">
                <LocationOnIcon sx={{ fontSize: 40 }} />
                <Typography variant="body2">Interactive map</Typography>
                <Typography variant="caption">123 Dental Ave, Metropolis</Typography>
              </Box>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mt: 3, bgcolor: '#e8f5e9' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Emergency?</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                For dental emergencies, call us immediately or visit our emergency page.
              </Typography>
              <Button variant="contained" color="error" fullWidth href="tel:+15550123456" startIcon={<PhoneIcon />}>
                Emergency Line
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default PublicContact;

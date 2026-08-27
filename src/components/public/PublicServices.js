import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, TextField, InputAdornment, CircularProgress, Divider,
  Accordion, AccordionSummary, AccordionDetails, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const CATEGORIES = ['All', 'Preventive', 'Cosmetic', 'Restorative', 'Orthodontics', 'Periodontics', 'Oral Surgery', 'Pediatric', 'Endodontics', 'Implants', 'Emergency'];

const SERVICE_ICONS = {
  Preventive: '🦷', Cosmetic: '✨', Restorative: '🔧', Orthodontics: '📐',
  Periodontics: '💉', 'Oral Surgery': '⚕️', Pediatric: '👶', Endodontics: '🔬',
  Implants: '🦷', Emergency: '🚨',
};

const ServiceCard = ({ service }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ bgcolor: '#e3f2fd', p: 2, textAlign: 'center' }}>
      <Typography variant="h3">{SERVICE_ICONS[service.category] || '🦷'}</Typography>
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      <Chip label={service.category || 'General'} size="small" color="primary" sx={{ mb: 1 }} />
      <Typography variant="h6" fontWeight={700} gutterBottom>{service.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {(service.description || '').substring(0, 120)}{service.description?.length > 120 ? '…' : ''}
      </Typography>
      {service.duration && (
        <Typography variant="caption" color="text.disabled" display="block" mt={1}>⏱ {service.duration} min</Typography>
      )}
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
      <Button
        size="small" variant="outlined" fullWidth
        component={Link} to={`/services/${service.id}`}
      >
        Learn More
      </Button>
      <Button
        size="small" variant="contained" fullWidth
        startIcon={<CalendarMonthIcon />}
        component={Link} to="/book-appointment"
      >
        Book
      </Button>
    </CardActions>
  </Card>
);

const PublicServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios.get(`${BASE_URL}/services`)
      .then(r => setServices(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(s => {
    const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase())
      || (s.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (s.category || '').toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Our Dental Services</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Comprehensive care from routine check-ups to advanced treatments — all under one roof.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <TextField
              size="small"
              placeholder="Search services…"
              value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ bgcolor: '#fff', borderRadius: 1, width: 360 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Category filter */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {CATEGORIES.map(c => (
              <Chip
                key={c} label={c}
                onClick={() => setCategory(c)}
                color={category === c ? 'primary' : 'default'}
                sx={{ cursor: 'pointer', fontWeight: category === c ? 700 : 400 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Service grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>No services found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(s => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <ServiceCard service={s} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Divider />

      {/* Why choose our services */}
      <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Why Patients Choose Us</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[
              { stat: 'Same-Day', label: 'Emergency treatment available' },
              { stat: '1-Visit', label: 'Crowns with CEREC technology' },
              { stat: 'Gentle', label: 'Anxiety-free techniques' },
              { stat: 'Clear', label: 'Transparent, upfront pricing' },
            ].map(item => (
              <Grid item xs={6} md={3} key={item.stat} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} color="primary">{item.stat}</Typography>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ teaser */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">Common Questions</Typography>
        {[
          { q: 'How often should I visit the dentist?', a: 'We recommend a check-up and professional clean every 6 months for most patients.' },
          { q: 'Do you accept insurance?', a: 'Yes, we work with most major dental insurance providers. Contact us to verify your coverage.' },
          { q: 'What if I have dental anxiety?', a: 'We offer sedation dentistry options and gentle techniques to keep you comfortable.' },
        ].map((item, i) => (
          <Accordion key={i} sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <Box textAlign="center" mt={3}>
          <Button variant="outlined" component={Link} to="/faq">View All FAQs</Button>
        </Box>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Ready to Get Started?</Typography>
          <Typography variant="body1" sx={{ color: '#bbdefb', mb: 3 }}>
            Book an appointment or call us to discuss the right treatment for you.
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment" sx={{ fontWeight: 700, px: 5 }}>
            Book Appointment
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicServices;

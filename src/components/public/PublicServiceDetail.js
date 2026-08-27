import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Chip,
  Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const FAQS_BY_CATEGORY = {
  default: [
    { q: 'How long does this treatment take?', a: 'Duration varies by case complexity. We will give you a precise estimate during your consultation.' },
    { q: 'Is it painful?', a: 'We use local anaesthesia and gentle techniques. Most patients report minimal discomfort.' },
    { q: 'How do I prepare?', a: 'Eat lightly beforehand, avoid alcohol, and bring your insurance card and ID.' },
    { q: 'What is the recovery like?', a: 'Recovery depends on the procedure. We will give you detailed aftercare instructions.' },
  ]
};

const PublicServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try by ID first, then search by name in list
    const fetchService = async () => {
      try {
        // If slug looks like a number, fetch by ID
        if (/^\d+$/.test(slug)) {
          const r = await axios.get(`${BASE_URL}/services/${slug}`);
          setService(r.data);
        } else {
          const r = await axios.get(`${BASE_URL}/services`);
          const list = Array.isArray(r.data) ? r.data : [];
          const found = list.find(s => s.name?.toLowerCase().replace(/\s+/g, '-') === slug || String(s.id) === slug);
          setService(found || null);
        }
        const priceRes = await axios.get(`${BASE_URL}/service-prices`);
        setPrices(Array.isArray(priceRes.data) ? priceRes.data : []);
      } catch (_) {}
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  if (loading) return <PublicLayout><Box textAlign="center" py={12}><CircularProgress /></Box></PublicLayout>;
  if (!service) return (
    <PublicLayout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Service not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} component={Link} to="/services">All Services</Button>
      </Container>
    </PublicLayout>
  );

  const relatedPrices = prices.filter(p => p.serviceId === service.id || p.serviceName === service.name);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBackIcon />} component={Link} to="/services" sx={{ color: '#90caf9', mb: 2 }}>
            All Services
          </Button>
          {service.category && <Chip label={service.category} sx={{ bgcolor: '#90caf9', color: '#1a237e', mb: 2 }} />}
          <Typography variant="h2" fontWeight={800}>{service.name}</Typography>
          {service.duration && (
            <Typography variant="subtitle1" sx={{ color: '#bbdefb', mt: 1 }}>⏱ Typical duration: {service.duration} minutes</Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main content */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={700} gutterBottom>About This Treatment</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 3 }}>
              {service.description || `Our ${service.name} treatment uses the latest technology and techniques to deliver outstanding results in a comfortable, anxiety-free environment.`}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>Benefits</Typography>
            <List dense>
              {[
                'Performed by board-certified specialists',
                'Latest technology for precision and comfort',
                'Personalised treatment plan',
                'Transparent pricing with no hidden fees',
                'Post-treatment support and follow-up',
              ].map(b => (
                <ListItem key={b} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={b} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>Frequently Asked Questions</Typography>
            {(FAQS_BY_CATEGORY[service.category] || FAQS_BY_CATEGORY.default).map((item, i) => (
              <Accordion key={i} sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Pricing */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Pricing</Typography>
              {relatedPrices.length > 0 ? (
                relatedPrices.map(p => (
                  <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2">{p.name || p.treatmentType}</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary">
                      {p.price ? `$${p.price}` : 'Ask us'}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Pricing varies by case. Contact us for a personalised quote.
                </Typography>
              )}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }} component={Link} to="/financing">
                Financing Options
              </Button>
            </Paper>

            {/* Book CTA */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: '#1976d2', color: '#fff' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Ready to Book?</Typography>
              <Typography variant="body2" sx={{ color: '#bbdefb', mb: 2 }}>
                Our team is here to help. Book online or call us today.
              </Typography>
              <Button fullWidth variant="contained" color="secondary" size="large"
                startIcon={<CalendarMonthIcon />} component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
                Book Appointment
              </Button>
              <Button fullWidth variant="outlined" sx={{ mt: 1.5, color: '#fff', borderColor: '#90caf9' }}
                component={Link} to="/contact">
                Ask a Question
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default PublicServiceDetail;

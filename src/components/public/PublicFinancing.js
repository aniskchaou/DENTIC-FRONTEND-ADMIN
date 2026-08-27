import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, CircularProgress, Divider, Paper, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const INSURANCE_ACCEPTED = [
  'Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'United Concordia',
  'Humana', 'Assurant', 'Principal', 'Sun Life', 'Ameritas', 'Careington',
];

const PAYMENT_OPTIONS = [
  { icon: '💳', title: 'CareCredit', desc: '0% interest financing for 6, 12, or 18 months for qualified applicants.' },
  { icon: '🏦', title: 'In-House Payment Plans', desc: 'Flexible monthly plans with no credit check required for established patients.' },
  { icon: '🏥', title: 'HSA / FSA Cards', desc: 'Use your health savings or flexible spending account for all dental services.' },
  { icon: '💵', title: 'Cash & All Major Cards', desc: 'Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay accepted.' },
];

const MembershipCard = ({ plan }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', border: plan.featured ? '2px solid #1976d2' : undefined }}>
    {plan.featured && (
      <Box sx={{ bgcolor: '#1976d2', color: '#fff', textAlign: 'center', py: 0.5 }}>
        <Typography variant="caption" fontWeight={800}>MOST POPULAR</Typography>
      </Box>
    )}
    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>{plan.name}</Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="h3" fontWeight={900} color="primary">
          ${plan.price || plan.monthlyFee || '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">/month</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{plan.description}</Typography>
      {Array.isArray(plan.benefits) && (
        <List dense>
          {plan.benefits.map((b, i) => (
            <ListItem key={i} sx={{ py: 0.3, justifyContent: 'center' }}>
              <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary={b} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      )}
    </CardContent>
    <CardActions sx={{ p: 2 }}>
      <Button fullWidth variant={plan.featured ? 'contained' : 'outlined'} size="large" component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
        Get Started
      </Button>
    </CardActions>
  </Card>
);

const FALLBACK_PLANS = [
  {
    name: 'Basic Plan', price: 29, featured: false, description: 'Essential preventive care for one adult.',
    benefits: ['2 routine exams/year', '2 professional cleans/year', '1 set of X-rays/year', '10% off all treatments'],
  },
  {
    name: 'Standard Plan', price: 49, featured: true, description: 'Comprehensive cover including emergency care.',
    benefits: ['2 routine exams/year', '2 professional cleans/year', '2 sets of X-rays/year', '1 emergency exam/year', '15% off all treatments'],
  },
  {
    name: 'Premium Plan', price: 79, featured: false, description: 'Maximum savings and priority scheduling.',
    benefits: ['4 routine exams/year', '4 professional cleans/year', 'Full X-rays/year', '2 emergency exams/year', '25% off all treatments', 'Priority booking'],
  },
];

const PublicFinancing = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/memberships`)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : [];
        setMemberships(data.length > 0 ? data : FALLBACK_PLANS);
      })
      .catch(() => setMemberships(FALLBACK_PLANS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Financing & Payment Options</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Quality dental care should be accessible to everyone — explore our flexible payment solutions.
          </Typography>
        </Container>
      </Box>

      {/* Insurance */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <Typography variant="overline" color="primary" fontWeight={700} display="block">Insurance</Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom>We Accept Your Insurance</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 2 }}>
              We are in-network with most major dental insurance providers. Our team will verify your benefits before treatment and handle all insurance claims on your behalf. We will give you a clear estimate of your out-of-pocket costs in advance.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {INSURANCE_ACCEPTED.map(ins => (
                <Chip key={ins} icon={<HealthAndSafetyIcon />} label={ins} variant="outlined" />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Don't see your provider? Call us — we work with many more insurance plans not listed here.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: '#e3f2fd' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Maximize Your Benefits</Typography>
              <List dense>
                {[
                  'We submit claims directly to your insurer',
                  'Pre-treatment cost estimates available',
                  'Annual maximums — use them before they reset',
                  'Coordinated benefits for dual coverage',
                  'Same-day claims submission',
                ].map(item => (
                  <ListItem key={item} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Payment options */}
      <Box sx={{ bgcolor: '#f9fafb', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">Payment</Typography>
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Flexible Payment Options</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {PAYMENT_OPTIONS.map(opt => (
              <Grid item xs={12} sm={6} md={3} key={opt.title}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>{opt.icon}</Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{opt.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{opt.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Membership plans */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="overline" color="primary" fontWeight={700} display="block" textAlign="center">In-House Plans</Typography>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Dental Membership Plans</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          No insurance? No problem. Our in-house membership plans give you affordable preventive care plus discounts on all treatments.
        </Typography>
        {loading ? (
          <Box textAlign="center" py={6}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
            {memberships.map((plan, i) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id || i}>
                <MembershipCard plan={plan} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <CreditCardIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>Let's Talk About Your Options</Typography>
          <Typography sx={{ color: '#bbdefb', mb: 3 }}>Our financial coordinators are here to help you find an affordable path to the smile you deserve.</Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/contact" sx={{ fontWeight: 700, px: 5 }}>
            Contact Us
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicFinancing;

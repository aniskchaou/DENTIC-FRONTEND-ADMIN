import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Chip, Divider,
  Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const FAQ_DATA = {
  Appointments: [
    { q: 'How do I book an appointment?', a: 'You can book online via our website 24/7, or call us during business hours. New patients are always welcome.' },
    { q: 'How early should I arrive for my first appointment?', a: 'We recommend arriving 10–15 minutes early to complete paperwork and get settled.' },
    { q: 'What is your cancellation policy?', a: 'Please give us at least 24 hours notice to avoid a cancellation fee. Repeated no-shows may require a deposit.' },
    { q: 'Do you offer evening or weekend appointments?', a: 'Yes! We have evening slots Monday–Friday until 7pm and Saturday appointments from 9am–1pm.' },
    { q: 'Can I book for a family group?', a: 'Absolutely. Call us to schedule multiple family members back-to-back for convenience.' },
  ],
  Treatments: [
    { q: 'Are dental X-rays safe?', a: 'Yes. Our digital X-rays use up to 90% less radiation than traditional X-rays. We also use lead aprons for extra protection.' },
    { q: 'How long does a routine check-up take?', a: 'A comprehensive exam with cleaning typically takes 60–90 minutes for new patients, 45–60 minutes for returning patients.' },
    { q: 'Is teeth whitening safe?', a: 'Professional whitening under dentist supervision is safe and effective. We assess your suitability before treatment.' },
    { q: 'What is the difference between Invisalign and braces?', a: 'Invisalign uses clear, removable aligners; traditional braces use fixed metal brackets. Both are effective — your dentist will recommend the best option.' },
    { q: 'Do you offer sedation dentistry?', a: 'Yes. We offer nitrous oxide (laughing gas) and oral conscious sedation for anxious patients or complex procedures.' },
  ],
  Insurance: [
    { q: 'Do you accept my insurance?', a: 'We work with most major dental insurance providers. Call us with your plan details and we will verify your coverage.' },
    { q: 'How do you handle insurance billing?', a: 'We submit claims directly to your insurer on your behalf. You only pay your estimated co-pay at the time of service.' },
    { q: 'Can I get a pre-treatment cost estimate?', a: 'Yes. We can provide a written estimate before treatment so you know your out-of-pocket cost in advance.' },
    { q: 'Do you accept HSA/FSA cards?', a: 'Yes, we accept HSA and FSA payment cards for all dental services.' },
  ],
  Payments: [
    { q: 'What payment methods do you accept?', a: 'Cash, all major credit/debit cards, HSA/FSA cards, Apple Pay, Google Pay, and CareCredit financing.' },
    { q: 'Do you offer payment plans?', a: 'Yes. We offer in-house payment plans for larger treatments. Ask our financial coordinator for details.' },
    { q: 'What is CareCredit?', a: 'CareCredit is a healthcare credit card offering 0% interest financing options. Apply in our office or online at carecredit.com.' },
    { q: 'Do you have a membership plan for uninsured patients?', a: 'Yes! Our in-house dental membership plans provide preventive care plus discounts on treatments. Visit our Financing page for details.' },
  ],
  Emergency: [
    { q: 'What counts as a dental emergency?', a: 'Severe toothache, knocked-out tooth, broken tooth, dental abscess, lost filling/crown, or significant mouth injury.' },
    { q: 'Do you offer same-day emergency appointments?', a: 'Yes. We reserve same-day slots for emergencies. Call us as early as possible.' },
    { q: 'What if I knock out a tooth?', a: 'Hold it by the crown, rinse gently, try to reinsert it or keep in milk. Call us immediately — time is critical.' },
    { q: 'What should I do for a toothache?', a: 'Rinse with warm salt water, take OTC pain relief, and call us. Do not put aspirin directly on the tooth.' },
    { q: 'Do you have after-hours emergency care?', a: 'Call our main line for after-hours guidance. We have extended emergency hours on weekdays and weekends.' },
  ],
  Children: [
    { q: 'When should my child first see a dentist?', a: 'By their first birthday or when the first tooth appears. Early visits build positive associations with dental care.' },
    { q: 'How often should children visit the dentist?', a: 'Every 6 months, just like adults. More frequent visits may be recommended for children prone to cavities.' },
    { q: 'Do you offer fluoride treatments for children?', a: 'Yes. Fluoride treatments and dental sealants are highly effective at preventing cavities in children.' },
    { q: 'Can parents be present during treatment?', a: 'Yes. Parents are always welcome in the treatment room, especially for anxious children.' },
  ],
};

const ALL_CATEGORIES = Object.keys(FAQ_DATA);

const PublicFAQ = () => {
  const [category, setCategory] = useState('Appointments');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const allFAQs = Object.entries(FAQ_DATA).flatMap(([cat, items]) => items.map(item => ({ ...item, category: cat })));
  const displayFAQs = search.trim()
    ? allFAQs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : FAQ_DATA[category];

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Frequently Asked Questions</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9', mb: 4 }}>
            Find quick answers to the most common questions about our clinic and services.
          </Typography>
          <TextField
            size="medium"
            placeholder="Search questions…"
            value={search}
            onChange={e => { setSearch(e.target.value); setExpanded(null); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ bgcolor: '#fff', borderRadius: 1, width: { xs: '100%', sm: 440 } }}
          />
        </Container>
      </Box>

      {/* Category filter — only show when not searching */}
      {!search && (
        <Box sx={{ bgcolor: '#f5f5f5', py: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {ALL_CATEGORIES.map(c => (
                <Chip
                  key={c} label={c}
                  onClick={() => { setCategory(c); setExpanded(null); }}
                  color={category === c ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer', fontWeight: category === c ? 700 : 400 }}
                />
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* FAQ list */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        {search && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            Showing {displayFAQs.length} result(s) for "{search}"
          </Typography>
        )}
        {displayFAQs.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary" gutterBottom>No questions found.</Typography>
            <Button variant="outlined" component={Link} to="/contact">Ask Us Directly</Button>
          </Box>
        ) : (
          displayFAQs.map((item, i) => (
            <Accordion
              key={i}
              expanded={expanded === i}
              onChange={() => setExpanded(expanded === i ? null : i)}
              sx={{ mb: 1.5, borderRadius: 2, boxShadow: 2, '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: expanded === i ? '#e3f2fd' : undefined }}>
                <Box>
                  {search && item.category && <Chip label={item.category} size="small" sx={{ mr: 1, mb: 0.5 }} />}
                  <Typography fontWeight={600}>{item.q}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>{item.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Container>

      <Divider />

      {/* Still have questions CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Still Have Questions?</Typography>
          <Typography sx={{ color: '#bbdefb', mb: 3 }}>
            Our friendly team is always happy to help — give us a call or send a message.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/contact" sx={{ fontWeight: 700 }}>
              Contact Us
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/book-appointment" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700 }}>
              Book Appointment
            </Button>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicFAQ;

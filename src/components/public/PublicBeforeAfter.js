import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  Button, Chip, CircularProgress, Divider, Dialog, DialogContent, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const CATEGORIES = ['All', 'Teeth Whitening', 'Veneers', 'Invisalign', 'Implants', 'Crowns', 'Smile Makeover', 'Gum Contouring'];

const GALLERY = [
  { id: 1, category: 'Teeth Whitening', before: '/images/3.jpg', after: '/images/3.jpg', desc: 'Professional whitening — 8 shades lighter in one session' },
  { id: 2, category: 'Veneers', before: '/images/3.jpg', after: '/images/3.jpg', desc: 'Porcelain veneers for a natural, radiant smile' },
  { id: 3, category: 'Invisalign', before: '/images/3.jpg', after: '/images/3.jpg', desc: '12 months of Invisalign — straighter teeth without braces' },
  { id: 4, category: 'Implants', before: '/images/3.jpg', after: '/images/3.jpg', desc: 'Single implant restoring a missing tooth' },
  { id: 5, category: 'Crowns', before: '/images/3.jpg', after: '/images/3.jpg', desc: 'Same-day CEREC crown — completed in one visit' },
  { id: 6, category: 'Smile Makeover', before: '/images/3.jpg', after: '/images/3.jpg', desc: 'Full smile makeover combining whitening and veneers' },
];

const BeforeAfterCard = ({ item, onClick }) => (
  <Card sx={{ borderRadius: 3, boxShadow: 3, cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => onClick(item)}>
    <Grid container>
      <Grid item xs={6}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia component="img" height="180" image={item.before} alt="Before"
            sx={{ objectFit: 'cover', filter: 'grayscale(30%)' }}
            onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><rect fill="%23ccc" width="200" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23777">Before</text></svg>'; }}
          />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', px: 1.5, py: 0.5 }}>
            <Typography variant="caption" fontWeight={700}>BEFORE</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia component="img" height="180" image={item.after} alt="After" sx={{ objectFit: 'cover' }}
            onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><rect fill="%234caf50" width="200" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23fff">After</text></svg>'; }}
          />
          <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#2e7d32', color: '#fff', px: 1.5, py: 0.5 }}>
            <Typography variant="caption" fontWeight={700}>AFTER</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
    <CardContent sx={{ pb: '12px !important' }}>
      <Chip label={item.category} size="small" color="primary" sx={{ mb: 1 }} />
      <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
    </CardContent>
  </Card>
);

const PublicBeforeAfter = () => {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = category === 'All' ? GALLERY : GALLERY.filter(g => g.category === category);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Before & After Gallery</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Real results from real patients — see the transformations we create every day.
          </Typography>
        </Container>
      </Box>

      {/* Disclaimer */}
      <Box sx={{ bgcolor: '#fff8e1', py: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="caption" color="text.secondary">
            Individual results may vary. All images are from actual patients with their consent. Photos are not retouched.
          </Typography>
        </Container>
      </Box>

      {/* Category filter */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {CATEGORIES.map(c => (
              <Chip key={c} label={c} onClick={() => setCategory(c)}
                color={category === c ? 'primary' : 'default'}
                sx={{ cursor: 'pointer', fontWeight: category === c ? 700 : 400 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Gallery grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {filtered.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <BeforeAfterCard item={item} onClick={setSelected} />
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Typography textAlign="center" color="text.secondary" py={6}>No results in this category yet.</Typography>
        )}
      </Container>

      {/* Lightbox */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        {selected && (
          <DialogContent sx={{ p: 0 }}>
            <Grid container>
              <Grid item xs={6}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="img" image={selected.before} alt="Before" sx={{ width: '100%' }}
                    onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23ccc" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23777" font-size="24">Before</text></svg>'; }}
                  />
                  <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', px: 2, py: 0.5, borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={700}>BEFORE</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="img" image={selected.after} alt="After" sx={{ width: '100%' }}
                    onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%234caf50" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-size="24">After</text></svg>'; }}
                  />
                  <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#2e7d32', color: '#fff', px: 2, py: 0.5, borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={700}>AFTER</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ p: 3 }}>
              <Chip label={selected.category} color="primary" sx={{ mb: 1 }} />
              <Typography variant="body1">{selected.desc}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} component={Link} to="/book-appointment">
                Book a Consultation
              </Button>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Ready for Your Transformation?</Typography>
          <Typography sx={{ color: '#bbdefb', mb: 3 }}>Book a free consultation and let us create a personalised smile plan for you.</Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment" sx={{ fontWeight: 700, px: 5 }}>
            Book Consultation
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicBeforeAfter;

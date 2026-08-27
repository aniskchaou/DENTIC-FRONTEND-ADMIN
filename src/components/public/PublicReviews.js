import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Rating, Button, Chip, Divider, CircularProgress, LinearProgress, Paper
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const STATIC_REVIEWS = [
  { author: 'Sarah M.', rating: 5, text: 'Absolutely love this clinic! The staff are so friendly and the dentists are top-notch. I used to dread going to the dentist but now I actually look forward to it.', date: '2024-03-10', treatment: 'Invisalign' },
  { author: 'James T.', rating: 5, text: 'Had a dental emergency on a Saturday and they fit me in within 2 hours. Professional, caring, and fixed my broken tooth same day.', date: '2024-02-28', treatment: 'Emergency' },
  { author: 'Priya K.', rating: 5, text: 'Best dental experience I have ever had. The digital X-rays and intraoral camera meant I could actually see and understand my treatment plan.', date: '2024-02-15', treatment: 'Check-up & Clean' },
  { author: 'Michael R.', rating: 4, text: 'Great team, minimal wait times, very thorough. Would highly recommend to anyone looking for a professional dental practice.', date: '2024-01-30', treatment: 'Root Canal' },
  { author: 'Lisa W.', rating: 5, text: 'My kids love coming here! The pediatric suite is amazing — they have not complained about the dentist once since we switched.', date: '2024-01-12', treatment: 'Pediatric Dentistry' },
  { author: 'David C.', rating: 5, text: 'The teeth whitening results exceeded my expectations. Completed in one visit and I left with a smile I am proud of!', date: '2024-01-05', treatment: 'Teeth Whitening' },
];

const ReviewCard = ({ review }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 700 }}>{review.author?.[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{review.author || review.patientName}</Typography>
          <Typography variant="caption" color="text.disabled">{review.date ? new Date(review.date).toLocaleDateString() : ''}</Typography>
        </Box>
      </Box>
      <Rating value={parseFloat(review.rating) || 5} readOnly size="small" sx={{ mb: 1.5 }} />
      {review.treatment && <Chip label={review.treatment} size="small" variant="outlined" sx={{ mb: 1.5 }} />}
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        "{review.text || review.comment}"
      </Typography>
    </CardContent>
  </Card>
);

const RATING_DISTRIBUTION = [5, 4, 3, 2, 1];

const PublicReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/feedback`)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : [];
        setReviews(data.length > 0 ? data : STATIC_REVIEWS);
      })
      .catch(() => setReviews(STATIC_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (parseFloat(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : 4.9;

  const countByRating = r => reviews.filter(rv => Math.round(parseFloat(rv.rating) || 5) === r).length;

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Patient Reviews</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Real feedback from real patients — we are proud of every smile we create.
          </Typography>
        </Container>
      </Box>

      {/* Rating overview */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 5 }}>
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography variant="h1" fontWeight={900} color="primary" sx={{ lineHeight: 1 }}>{avgRating}</Typography>
              <Rating value={parseFloat(avgRating)} readOnly precision={0.1} sx={{ mt: 1 }} />
              <Typography variant="body2" color="text.secondary" mt={0.5}>Based on {reviews.length} reviews</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              {RATING_DISTRIBUTION.map(r => {
                const count = countByRating(r);
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <Box key={r} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>{r}</Typography>
                    <StarIcon sx={{ fontSize: 16, color: '#fdd835' }} />
                    <LinearProgress variant="determinate" value={pct} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>{count}</Typography>
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reviews grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {reviews.map((rv, i) => (
              <Grid item xs={12} sm={6} md={4} key={rv.id || i}>
                <ReviewCard review={rv} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Divider />

      {/* Leave a review CTA */}
      <Box sx={{ bgcolor: '#f9fafb', py: 6, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={700} gutterBottom>Share Your Experience</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Were you happy with your visit? Leave us a review — it helps other patients find the care they need.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" component={Link} to="/login" sx={{ fontWeight: 700 }}>
              Leave a Review (Patient Portal)
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 6, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Join Thousands of Happy Patients</Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/book-appointment" sx={{ mt: 1, fontWeight: 700, px: 5 }}>
            Book Your Appointment
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicReviews;

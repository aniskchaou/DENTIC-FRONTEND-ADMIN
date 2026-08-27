import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Chip, Avatar, Button,
  CircularProgress, Divider, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const PublicBlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Try fetching by ID directly
        const r = await axios.get(`${BASE_URL}/educational-content/${slug}`);
        setArticle(r.data);

        // Fetch related articles
        const allRes = await axios.get(`${BASE_URL}/educational-content`);
        const all = Array.isArray(allRes.data) ? allRes.data : [];
        setRelated(all.filter(a => String(a.id) !== String(slug)).slice(0, 3));
      } catch {
        setArticle(null);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <PublicLayout><Box textAlign="center" py={12}><CircularProgress /></Box></PublicLayout>;
  if (!article) return (
    <PublicLayout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Article not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} component={Link} to="/blog">Back to Blog</Button>
      </Container>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBackIcon />} component={Link} to="/blog" sx={{ color: '#90caf9', mb: 2 }}>
            All Articles
          </Button>
          {article.category && <Chip label={article.category} sx={{ bgcolor: '#90caf9', color: '#1a237e', mb: 2 }} />}
          <Typography variant="h2" fontWeight={800}>{article.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Avatar sx={{ bgcolor: '#90caf9', color: '#1a237e', fontWeight: 700 }}>
              {(article.authorName || article.author || 'D')[0]}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={600}>{article.authorName || article.author || 'DenticClinic Team'}</Typography>
              {article.createdAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: '#bbdefb' }} />
                  <Typography variant="caption" sx={{ color: '#bbdefb' }}>
                    {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Article body */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Featured image */}
            {article.imageUrl && (
              <Box component="img" src={article.imageUrl} alt={article.title}
                sx={{ width: '100%', borderRadius: 3, mb: 4, objectFit: 'cover', maxHeight: 400 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}

            {/* Content */}
            <Typography variant="body1" sx={{ lineHeight: 2, fontSize: 17, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
              {article.content || article.summary || 'Article content coming soon.'}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>Tags</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {article.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* CTA */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: '#1976d2', color: '#fff', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Ready to Take Action?</Typography>
              <Typography variant="body2" sx={{ color: '#bbdefb', mb: 2 }}>
                Book an appointment and discuss this treatment with one of our specialists.
              </Typography>
              <Button fullWidth variant="contained" color="secondary" startIcon={<CalendarMonthIcon />}
                component={Link} to="/book-appointment" sx={{ fontWeight: 700 }}>
                Book Appointment
              </Button>
            </Paper>

            {/* Related articles */}
            {related.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Related Articles</Typography>
                {related.map(art => (
                  <Box key={art.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                    {art.category && <Chip label={art.category} size="small" sx={{ mb: 0.5 }} />}
                    <Typography
                      variant="body2" fontWeight={600} component={Link} to={`/blog/${art.id}`}
                      sx={{ display: 'block', color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {art.title}
                    </Typography>
                  </Box>
                ))}
                <Button variant="outlined" size="small" fullWidth component={Link} to="/blog">All Articles</Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default PublicBlogArticle;

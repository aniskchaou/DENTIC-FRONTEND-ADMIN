import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  CardActions, Button, Chip, CircularProgress, Divider, TextField, InputAdornment, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const CATEGORIES = ['All', 'Oral Hygiene', 'Cosmetic', 'Orthodontics', 'Pediatric', 'Nutrition', 'Preventive', 'Restorative'];

const ArticleCard = ({ article }) => (
  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
    <CardMedia
      component="img" height="180"
      image={article.imageUrl || '/images/3.jpg'} alt={article.title}
      sx={{ objectFit: 'cover' }}
      onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="180"><rect fill="%231976d2" width="400" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-size="18">Dental Health</text></svg>'; }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      {article.category && <Chip label={article.category} size="small" color="primary" sx={{ mb: 1 }} />}
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>{article.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {(article.summary || article.content || '').substring(0, 120)}…
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <Avatar sx={{ width: 24, height: 24, bgcolor: '#1976d2', fontSize: 12 }}>
          {(article.authorName || article.author || 'DC')[0]}
        </Avatar>
        <Typography variant="caption" color="text.secondary">
          {article.authorName || article.author || 'DenticClinic Team'}
        </Typography>
        {article.createdAt && (
          <>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled">
              {new Date(article.createdAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </Box>
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0 }}>
      <Button variant="outlined" size="small" fullWidth component={Link} to={`/blog/${article.id}`}>
        Read Article
      </Button>
    </CardActions>
  </Card>
);

const FALLBACK_ARTICLES = [
  { id: 1, title: '10 Tips for a Healthier Smile', category: 'Oral Hygiene', summary: 'Simple daily habits that can dramatically improve your oral health and prevent common dental problems.', author: 'Dr. Smith', createdAt: new Date().toISOString() },
  { id: 2, title: 'Everything You Need to Know About Invisalign', category: 'Orthodontics', summary: 'Discover how clear aligners work, how long treatment takes, and whether you are a good candidate.', author: 'Dr. Johnson', createdAt: new Date().toISOString() },
  { id: 3, title: 'Foods That Damage Your Teeth (And Healthier Alternatives)', category: 'Nutrition', summary: 'Learn which foods and drinks erode enamel and what to eat instead for stronger, healthier teeth.', author: 'Dr. Lee', createdAt: new Date().toISOString() },
  { id: 4, title: 'When Should Your Child First See a Dentist?', category: 'Pediatric', summary: 'Early dental visits set the foundation for a lifetime of good oral health. Here is what you need to know.', author: 'Dr. Williams', createdAt: new Date().toISOString() },
  { id: 5, title: 'Understanding Dental Implants: A Complete Guide', category: 'Restorative', summary: 'Dental implants are the gold standard for replacing missing teeth. Discover the process, costs, and benefits.', author: 'Dr. Brown', createdAt: new Date().toISOString() },
  { id: 6, title: 'Teeth Whitening: Professional vs At-Home Options', category: 'Cosmetic', summary: 'Compare the effectiveness, safety, and value of professional whitening vs over-the-counter products.', author: 'Dr. Davis', createdAt: new Date().toISOString() },
];

const PublicBlog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios.get(`${BASE_URL}/educational-content`)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : [];
        setArticles(data.length > 0 ? data : FALLBACK_ARTICLES);
      })
      .catch(() => setArticles(FALLBACK_ARTICLES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a => {
    const matchSearch = (a.title || '').toLowerCase().includes(search.toLowerCase())
      || (a.summary || a.content || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (a.category || '').toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Dental Health Blog</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9', mb: 4 }}>
            Expert tips, treatment guides, and the latest in dental health — written by our team.
          </Typography>
          <TextField
            size="small" placeholder="Search articles…"
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ bgcolor: '#fff', borderRadius: 1, width: { xs: '100%', sm: 360 } }}
          />
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

      {/* Articles grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress /></Box>
        ) : filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>No articles found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(article => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Newsletter CTA */}
      <Box sx={{ bgcolor: '#1976d2', py: 8, textAlign: 'center', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={800} gutterBottom>Stay Informed</Typography>
          <Typography sx={{ color: '#bbdefb', mb: 3 }}>
            Get the latest dental health tips and clinic news delivered to your inbox.
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/contact" sx={{ fontWeight: 700, px: 5 }}>
            Subscribe to Newsletter
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};

export default PublicBlog;

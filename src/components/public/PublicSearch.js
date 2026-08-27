import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip, TextField, InputAdornment, CircularProgress, Divider, Avatar, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const RESULT_TYPES = ['All', 'Services', 'Dentists', 'Locations', 'Articles'];

const typeConfig = {
  service: { icon: <MedicalServicesIcon />, color: '#1976d2', path: '/services' },
  doctor: { icon: <PersonIcon />, color: '#7b1fa2', path: '/dentists' },
  location: { icon: <LocationOnIcon />, color: '#388e3c', path: '/locations' },
  article: { icon: <ArticleIcon />, color: '#f57c00', path: '/blog' },
};

const ResultCard = ({ result }) => {
  const cfg = typeConfig[result.type] || typeConfig.service;
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
      <Avatar sx={{ bgcolor: `${cfg.color}20`, color: cfg.color, width: 48, height: 48 }}>
        {cfg.icon}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Chip label={result.type} size="small" sx={{ mb: 0.5, textTransform: 'capitalize' }} />
        <Typography variant="subtitle1" fontWeight={700}>{result.name || result.title}</Typography>
        {result.description && (
          <Typography variant="body2" color="text.secondary">
            {(result.description || '').substring(0, 100)}{result.description?.length > 100 ? '…' : ''}
          </Typography>
        )}
      </Box>
      <Button variant="outlined" size="small" component={Link} to={`${cfg.path}/${result.id}`} sx={{ whiteSpace: 'nowrap' }}>
        View
      </Button>
    </Card>
  );
};

const PublicSearch = () => {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('All');

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSubmitted(q);
    try {
      const [servRes, docRes, locRes, blogRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/services`),
        axios.get(`${BASE_URL}/doctors`),
        axios.get(`${BASE_URL}/clinic-locations`),
        axios.get(`${BASE_URL}/educational-content`),
      ]);

      const lower = q.toLowerCase();
      const matches = [];

      if (servRes.status === 'fulfilled') {
        const services = Array.isArray(servRes.value.data) ? servRes.value.data : [];
        services.filter(s => (s.name || '').toLowerCase().includes(lower) || (s.description || '').toLowerCase().includes(lower))
          .forEach(s => matches.push({ ...s, type: 'service' }));
      }
      if (docRes.status === 'fulfilled') {
        const docs = Array.isArray(docRes.value.data) ? docRes.value.data : [];
        docs.filter(d => (d.fullName || d.name || '').toLowerCase().includes(lower) || (d.specialization || '').toLowerCase().includes(lower))
          .forEach(d => matches.push({ ...d, type: 'doctor', name: d.fullName || d.name }));
      }
      if (locRes.status === 'fulfilled') {
        const locs = Array.isArray(locRes.value.data) ? locRes.value.data : [];
        locs.filter(l => (l.name || '').toLowerCase().includes(lower) || (l.address || '').toLowerCase().includes(lower))
          .forEach(l => matches.push({ ...l, type: 'location' }));
      }
      if (blogRes.status === 'fulfilled') {
        const articles = Array.isArray(blogRes.value.data) ? blogRes.value.data : [];
        articles.filter(a => (a.title || '').toLowerCase().includes(lower) || (a.content || a.summary || '').toLowerCase().includes(lower))
          .forEach(a => matches.push({ ...a, type: 'article', name: a.title }));
      }

      setResults(matches);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    doSearch(query);
    setActiveType('All');
  };

  const typeMap = { Services: 'service', Dentists: 'doctor', Locations: 'location', Articles: 'article' };
  const filtered = activeType === 'All' ? results : results.filter(r => r.type === typeMap[activeType]);

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>Search DenticClinic</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9', mb: 4 }}>
            Find services, dentists, locations, and articles all in one place.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, maxWidth: 560, mx: 'auto' }}>
            <TextField
              fullWidth size="medium"
              placeholder="Search…"
              value={query} onChange={e => setQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ bgcolor: '#fff', borderRadius: 1 }}
            />
            <Button type="submit" variant="contained" color="secondary" size="large" sx={{ fontWeight: 700, px: 4 }}>
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Results */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {loading && <Box textAlign="center" py={6}><CircularProgress /></Box>}

        {!loading && submitted && (
          <>
            {/* Filter by type */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight={600} mr={1}>
                {results.length} result(s) for "{submitted}"
              </Typography>
              {RESULT_TYPES.map(t => {
                const count = t === 'All' ? results.length : results.filter(r => r.type === typeMap[t]).length;
                return (
                  <Chip key={t} label={`${t} (${count})`} onClick={() => setActiveType(t)}
                    color={activeType === t ? 'primary' : 'default'} sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Box>

            {filtered.length === 0 ? (
              <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', boxShadow: 1 }}>
                <Typography color="text.secondary" gutterBottom>No {activeType !== 'All' ? activeType.toLowerCase() : 'results'} found for "{submitted}".</Typography>
                <Button variant="outlined" component={Link} to="/contact" sx={{ mt: 1 }}>Ask Our Team</Button>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filtered.map((r, i) => (
                  <Grid item xs={12} key={`${r.type}-${r.id}-${i}`}>
                    <ResultCard result={r} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {!loading && !submitted && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary" variant="h6" gutterBottom>Start typing to search across all clinic content.</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
              {['whitening', 'implants', 'invisalign', 'emergency', 'hygienist', 'children'].map(term => (
                <Chip key={term} label={term} onClick={() => { setQuery(term); doSearch(term); setActiveType('All'); }}
                  sx={{ cursor: 'pointer' }} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </PublicLayout>
  );
};

export default PublicSearch;

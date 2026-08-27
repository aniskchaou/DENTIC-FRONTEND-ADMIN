import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CardMedia, CardActionArea, Chip,
  CircularProgress, Alert, TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const CATEGORY_COLORS = { procedure: 'primary', hygiene: 'success', prevention: 'info', faq: 'warning', aftercare: 'secondary', general: 'default' };
const TYPE_ICONS = { article: <ArticleIcon />, video: <VideoLibraryIcon />, infographic: <ImageIcon />, pdf: <PictureAsPdfIcon /> };

export default function PatientEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const res = await axios.get(`${BASE_URL}/patient-portal/education?${params}`);
      setItems(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') load();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}><SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Patient Education</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" label="Search articles..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} sx={{ flex: 1, minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {['procedure', 'hygiene', 'prevention', 'faq', 'aftercare', 'general'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={load}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {items.length === 0 && (
            <Grid item xs={12}><Typography color="text.secondary" textAlign="center">No articles found</Typography></Grid>
          )}
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea onClick={() => setSelected(item)} sx={{ flex: 1 }}>
                  {item.thumbnailUrl ? (
                    <CardMedia component="img" height="140" image={item.thumbnailUrl} alt={item.title} />
                  ) : (
                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                      {TYPE_ICONS[item.contentType] || <ArticleIcon sx={{ fontSize: 40, color: 'grey.400' }} />}
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip label={item.category} size="small" color={CATEGORY_COLORS[item.category] || 'default'} />
                      <Chip label={item.contentType} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>{item.title}</Typography>
                    {item.body && <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.body}</Typography>}
                    {item.readingTimeMin && <Typography variant="caption" color="text.disabled">~{item.readingTimeMin} min read</Typography>}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Article Dialog */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {TYPE_ICONS[selected?.contentType]}
            {selected?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={selected.category} size="small" color={CATEGORY_COLORS[selected.category] || 'default'} />
                {selected.tags?.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
              </Box>
              <Divider sx={{ mb: 2 }} />
              {selected.contentType === 'video' && selected.videoUrl && (
                <Box sx={{ mb: 2 }}>
                  <video controls width="100%" src={selected.videoUrl} />
                </Box>
              )}
              {selected.contentType === 'pdf' && selected.fileUrl && (
                <Button href={selected.fileUrl} target="_blank" startIcon={<PictureAsPdfIcon />} sx={{ mb: 2 }}>Open PDF</Button>
              )}
              {selected.body && <Typography whiteSpace="pre-wrap" variant="body1">{selected.body}</Typography>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

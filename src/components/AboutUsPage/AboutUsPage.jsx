import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { Button, Typography, TextField, Paper, Stack, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AboutUsPage = () => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [textarea, setTextarea] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch about us on mount
  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(BASE_URL + '/aboutus');
      const about = res.data.aboutUs || {};
      setDescription(about.description || '');
      setHighlights(about.highlights || []);
      setTextarea((about.highlights || []).join('\n'));
    } catch (e) {
      setError('Failed to load About Us.');
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setTextarea(highlights.join('\n'));
    setSuccess('');
    setError('');
  };

  const handleChangeDesc = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeHighlights = (e) => {
    setTextarea(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedHighlights = textarea
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      await axios.post(BASE_URL + '/aboutus', {
        aboutUs: {
          description,
          highlights: updatedHighlights,
        }
      });
      setHighlights(updatedHighlights);
      setEditMode(false);
      setSuccess('About Us updated successfully.');
    } catch (e) {
      setError('Failed to update About Us.');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        <i className="menu-icon fa fa-info-circle"></i> {t('about.title')}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{t('about.load_error')}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{t('about.update_success')}</Alert>}
      <Stack spacing={2}>
        <TextField
          label={t('about.description')}
          multiline
          minRows={3}
          value={description}
          onChange={handleChangeDesc}
          fullWidth
          disabled={!editMode || loading}
        />
        <TextField
          label={t('about.highlights')}
          multiline
          minRows={5}
          value={textarea}
          onChange={handleChangeHighlights}
          fullWidth
          disabled={!editMode || loading}
          helperText={t('about.highlights_helper')}
        />
        {!editMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            disabled={loading}
            sx={{ width: 120 }}
          >
            {t('about.edit')}
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={loading}
            >
              {t('about.save')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              {t('about.cancel')}
            </Button>
          </Stack>
        )}
      </Stack>
      {!editMode && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {t('about.highlights')}:
          </Typography>
          <ul className="list-group list-group-flush">
            {highlights.map((h, idx) => (
              <li className="list-group-item" key={idx}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};

export default AboutUsPage;
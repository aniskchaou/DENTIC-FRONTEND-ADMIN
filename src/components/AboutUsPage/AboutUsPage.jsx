import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { Button, Typography, TextField, Paper, Stack, Alert } from '@mui/material';

const AboutUsPage = () => {
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
        <i className="menu-icon fa fa-info-circle"></i> About Us
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Stack spacing={2}>
        <TextField
          label="Description"
          multiline
          minRows={3}
          value={description}
          onChange={handleChangeDesc}
          fullWidth
          disabled={!editMode || loading}
        />
        <TextField
          label="Highlights"
          multiline
          minRows={5}
          value={textarea}
          onChange={handleChangeHighlights}
          fullWidth
          disabled={!editMode || loading}
          helperText="One highlight per line"
        />
        {!editMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            disabled={loading}
            sx={{ width: 120 }}
          >
            Edit
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </Stack>
      {!editMode && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Highlights:
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
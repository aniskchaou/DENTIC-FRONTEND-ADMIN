import React, { useEffect, useState } from 'react';
import './ServicePage.css';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { Button, Typography, TextField, Paper, Stack, Alert } from '@mui/material';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [textarea, setTextarea] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(BASE_URL + '/services');
      setServices(res.data.services || []);
      setTextarea((res.data.services || []).join('\n'));
    } catch (e) {
      setError('Failed to load services.');
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
    setTextarea(services.join('\n'));
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    setTextarea(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedServices = textarea
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      await axios.post(BASE_URL + '/services', { services: updatedServices });
      setServices(updatedServices);
      setEditMode(false);
      setSuccess('Services updated successfully.');
    } catch (e) {
      setError('Failed to update services.');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        <i className="menu-icon fa fa-bars"></i> Services
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Stack spacing={2}>
        <TextField
          label="Services List"
          multiline
          minRows={8}
          value={textarea}
          onChange={handleChange}
          fullWidth
          disabled={!editMode || loading}
          helperText="One service per line"
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
        <ul className="list-group list-group-flush" style={{ marginTop: 24 }}>
          {services.map((s, idx) => (
            <li className="list-group-item" key={idx}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </Paper>
  );
};

export default ServicePage;

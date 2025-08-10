import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useHistory } from 'react-router-dom';

const SendMessage = () => {
  const [form, setForm] = useState({ name: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);
    try {
      await axios.post(BASE_URL + '/messages', form);
      setSent(true);
      setForm({ name: '', subject: '', message: '' });
      setTimeout(() => {
        history.push('/');
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
          Send a Message
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={4}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {sent && <Alert severity="success">Message sent successfully! Redirecting...</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ fontWeight: 600 }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default SendMessage;
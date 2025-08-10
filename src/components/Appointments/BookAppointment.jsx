import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useHistory } from 'react-router-dom';

const initialState = {
  patientId: '',
  doctorId: '',
  clinicLocationId: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  status: 'Scheduled',
  appointmentType: 'In-Person',
  reasonForVisit: '',
  notes: '',
};

const BookAppointment = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loadingSelects, setLoadingSelects] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSelects(true);
      try {
        const [patientsRes, doctorsRes, clinicsRes] = await Promise.all([
          axios.get(BASE_URL + '/patients'),
          axios.get(BASE_URL + '/doctors'),
          axios.get(BASE_URL + '/clinics'),
        ]);
        setPatients(patientsRes.data || []);
        setDoctors(doctorsRes.data || []);
        setClinics(clinicsRes.data || []);
      } catch (err) {
        setError('Failed to load select options.');
      }
      setLoadingSelects(false);
    };
    fetchData();
  }, []);

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
      await axios.post(BASE_URL + '/appointments', {
        ...form,
        id: undefined, // Let backend handle id
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSent(true);
      setForm(initialState);
      setTimeout(() => history.push('/'), 1500);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
          Book Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Patient"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              fullWidth
              disabled={loadingSelects}
            >
              {loadingSelects ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name || p.fullName || `Patient #${p.id}`}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              select
              label="Doctor"
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
              fullWidth
              disabled={loadingSelects}
            >
              {loadingSelects ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name || d.fullName || `Doctor #${d.id}`}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              select
              label="Clinic Location"
              name="clinicLocationId"
              value={form.clinicLocationId}
              onChange={handleChange}
              required
              fullWidth
              disabled={loadingSelects}
            >
              {loadingSelects ? (
                <MenuItem value="">
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                clinics.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name || c.location || `Clinic #${c.id}`}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              value={form.appointmentDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Time"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Time"
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              label="Status"
              name="status"
              select
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
            <TextField
              label="Appointment Type"
              name="appointmentType"
              select
              value={form.appointmentType}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="In-Person">In-Person</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
            </TextField>
            <TextField
              label="Reason For Visit"
              name="reasonForVisit"
              value={form.reasonForVisit}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {sent && <Alert severity="success">Appointment booked! Redirecting...</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || loadingSelects}
              sx={{ fontWeight: 600 }}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default BookAppointment;
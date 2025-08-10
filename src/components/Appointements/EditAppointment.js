import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack, FormControlLabel, Checkbox } from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const statuses = ['Pending', 'Confirmed', 'Completed', 'No-show', 'Cancelled'];
const types = ['Consultation', 'Follow-up', 'Emergency', 'Routine', 'Other'];
const paymentStatuses = ['Unpaid', 'Paid', 'Pending', 'Partial'];

const EditAppointment = ({ appointment, closeModal, doctors = [], patients = [], clinics = [], onSuccess }) => {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    clinicLocationId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: 'Pending',
    appointmentType: '',
    reasonForVisit: '',
    notes: '',
    roomNumber: '',
    isFirstVisit: false,
    followUpDate: '',
    paymentStatus: 'Unpaid',
    paymentAmount: '',
    insuranceProvider: '',
    insuranceNumber: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setForm({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        clinicLocationId: appointment.clinicLocationId || '',
        appointmentDate: appointment.appointmentDate || '',
        startTime: appointment.startTime || '',
        endTime: appointment.endTime || '',
        status: appointment.status || 'Pending',
        appointmentType: appointment.appointmentType || '',
        reasonForVisit: appointment.reasonForVisit || '',
        notes: appointment.notes || '',
        roomNumber: appointment.roomNumber || '',
        isFirstVisit: !!appointment.isFirstVisit,
        followUpDate: appointment.followUpDate || '',
        paymentStatus: appointment.paymentStatus || 'Unpaid',
        paymentAmount: appointment.paymentAmount || '',
        insuranceProvider: appointment.insuranceProvider || '',
        insuranceNumber: appointment.insuranceNumber || '',
      });
    }
  }, [appointment]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/appointments/${appointment.id}`, form);
      if (onSuccess) onSuccess();
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        select
        label="Patient"
        name="patientId"
        value={form.patientId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {patients.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.fullName || p.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Doctor"
        name="doctorId"
        value={form.doctorId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {doctors.map(d => (
          <MenuItem key={d.id} value={d.id}>{d.fullName || d.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Clinic Location"
        name="clinicLocationId"
        value={form.clinicLocationId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {clinics.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Appointment Date"
        name="appointmentDate"
        type="date"
        value={form.appointmentDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label="Start Time"
          name="startTime"
          type="time"
          value={form.startTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
        <TextField
          label="End Time"
          name="endTime"
          type="time"
          value={form.endTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
      </Stack>
      <TextField
        select
        label="Status"
        name="status"
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statuses.map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Appointment Type"
        name="appointmentType"
        value={form.appointmentType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {types.map(t => (
          <MenuItem key={t} value={t}>{t}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Reason for Visit"
        name="reasonForVisit"
        value={form.reasonForVisit}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        label="Room Number"
        name="roomNumber"
        value={form.roomNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.isFirstVisit}
            onChange={handleChange}
            name="isFirstVisit"
            color="primary"
          />
        }
        label="Is First Visit"
      />
      <TextField
        label="Follow Up Date"
        name="followUpDate"
        type="date"
        value={form.followUpDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Payment Status"
        name="paymentStatus"
        value={form.paymentStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {paymentStatuses.map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Payment Amount"
        name="paymentAmount"
        type="number"
        value={form.paymentAmount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Insurance Provider"
        name="insuranceProvider"
        value={form.insuranceProvider}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Insurance Number"
        name="insuranceNumber"
        value={form.insuranceNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default EditAppointment;
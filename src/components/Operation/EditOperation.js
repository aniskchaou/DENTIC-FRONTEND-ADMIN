import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const operationTypes = ['Surgical', 'Non-Surgical', 'Diagnostic', 'Other'];
const anesthesiaTypes = ['Local', 'General', 'Sedation', 'None'];
const followUpOptions = ['Yes', 'No'];
const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

const EditOperation = ({ operation, closeModal, onEdit }) => {
  const [form, setForm] = useState({
    operationType: '',
    procedureName: '',
    operationDate: '',
    duration: '',
    anesthesiaType: '',
    complications: '',
    postOperationInstructions: '',
    followUpRequired: 'No',
    followUpDate: '',
    status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (operation) {
      setForm({
        operationType: operation.operationType || '',
        procedureName: operation.procedureName || '',
        operationDate: operation.operationDate ? operation.operationDate.slice(0, 16) : '',
        duration: operation.duration || '',
        anesthesiaType: operation.anesthesiaType || '',
        complications: operation.complications || '',
        postOperationInstructions: operation.postOperationInstructions || '',
        followUpRequired: operation.followUpRequired || 'No',
        followUpDate: operation.followUpDate ? operation.followUpDate.slice(0, 16) : '',
        status: operation.status || 'Scheduled'
      });
    }
  }, [operation]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      operationType: form.operationType,
      procedureName: form.procedureName,
      operationDate: new Date(form.operationDate).toISOString(),
      duration: Number(form.duration),
      anesthesiaType: form.anesthesiaType,
      complications: form.complications,
      postOperationInstructions: form.postOperationInstructions,
      followUpRequired: form.followUpRequired,
      followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : null,
      status: form.status,
      updatedAt: now
    };
    try {
      await axios.put(`${BASE_URL}/operations/${operation.id}`, data);
      if (onEdit) onEdit(data);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          select
          label="Operation Type"
          name="operationType"
          value={form.operationType}
          onChange={handleChange}
          required
          fullWidth
        >
          {operationTypes.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Procedure Name"
          name="procedureName"
          value={form.procedureName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Operation Date & Time"
          name="operationDate"
          type="datetime-local"
          value={form.operationDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Anesthesia Type"
          name="anesthesiaType"
          value={form.anesthesiaType}
          onChange={handleChange}
          required
          fullWidth
        >
          {anesthesiaTypes.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Complications"
          name="complications"
          value={form.complications}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Post-Operation Instructions"
          name="postOperationInstructions"
          value={form.postOperationInstructions}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
        />
        <TextField
          select
          label="Follow-Up Required"
          name="followUpRequired"
          value={form.followUpRequired}
          onChange={handleChange}
          required
          fullWidth
        >
          {followUpOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        {form.followUpRequired === 'Yes' && (
          <TextField
            label="Follow-Up Date & Time"
            name="followUpDate"
            type="datetime-local"
            value={form.followUpDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
        )}
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          fullWidth
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditOperation;
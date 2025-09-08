import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const operationTypes = ['Surgical', 'Non-Surgical', 'Diagnostic', 'Other'];
const anesthesiaTypes = ['Local', 'General', 'Sedation', 'None'];
const followUpOptions = ['Yes', 'No'];
const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

const AddOperation = ({ closeModal, onCreate }) => {
  const { t } = useTranslation();
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
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/operations`, data);
      if (onCreate) onCreate(data);
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
          label={t('operation.operation_type')}
          name="operationType"
          value={form.operationType}
          onChange={handleChange}
          required
          fullWidth
        >
          {operationTypes.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`operation.type_${opt.replace('-', '_').replace(' ', '_').toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('operation.procedure_name')}
          name="procedureName"
          value={form.procedureName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('operation.operation_date')}
          name="operationDate"
          type="datetime-local"
          value={form.operationDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label={t('operation.duration')}
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label={t('operation.anesthesia_type')}
          name="anesthesiaType"
          value={form.anesthesiaType}
          onChange={handleChange}
          required
          fullWidth
        >
          {anesthesiaTypes.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`operation.anesthesia_${opt.replace('-', '_').replace(' ', '_').toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('operation.complications')}
          name="complications"
          value={form.complications}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label={t('operation.post_operation_instructions')}
          name="postOperationInstructions"
          value={form.postOperationInstructions}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
        />
        <TextField
          select
          label={t('operation.follow_up_required')}
          name="followUpRequired"
          value={form.followUpRequired}
          onChange={handleChange}
          required
          fullWidth
        >
          {followUpOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`operation.follow_up_${opt.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        {form.followUpRequired === 'Yes' && (
          <TextField
            label={t('operation.follow_up_date')}
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
          label={t('operation.status')}
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          fullWidth
        >
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`operation.status_${opt.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? t('operation.saving') : t('operation.create')}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            {t('operation.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddOperation;
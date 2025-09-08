import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const statusOptions = ['Active', 'Expired', 'Pending'];

const AddInsurance = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    providerName: '',
    policyNumber: '',
    coverageDetails: {
      maxAnnualCoverage: '',
      treatmentCoverage: '',
      medicationCoverage: '',
      consultationCoverage: ''
    },
    validFrom: '',
    validUntil: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch patients from backend
    axios.get(`${BASE_URL}/patients`)
      .then(res => setPatients(res.data))
      .catch(() => setPatients([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name in form.coverageDetails) {
      setForm(f => ({
        ...f,
        coverageDetails: { ...f.coverageDetails, [name]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...form,
      coverageDetails: {
        maxAnnualCoverage: Number(form.coverageDetails.maxAnnualCoverage),
        treatmentCoverage: Number(form.coverageDetails.treatmentCoverage),
        medicationCoverage: Number(form.coverageDetails.medicationCoverage),
        consultationCoverage: Number(form.coverageDetails.consultationCoverage)
      },
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/insurances`, data);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('insurance.title')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            select
            label={t('insurance.patient_id')}
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.fullName || p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('insurance.provider_name')}
            name="providerName"
            value={form.providerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('insurance.policy_number')}
            name="policyNumber"
            value={form.policyNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>{t('insurance.coverage_details')}</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label={t('insurance.max_annual_coverage')}
              name="maxAnnualCoverage"
              type="number"
              value={form.coverageDetails.maxAnnualCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label={t('insurance.treatment_coverage')}
              name="treatmentCoverage"
              type="number"
              value={form.coverageDetails.treatmentCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label={t('insurance.medication_coverage')}
              name="medicationCoverage"
              type="number"
              value={form.coverageDetails.medicationCoverage}
              onChange={handleChange}
              required
            />
            <TextField
              label={t('insurance.consultation_coverage')}
              name="consultationCoverage"
              type="number"
              value={form.coverageDetails.consultationCoverage}
              onChange={handleChange}
              required
            />
          </Stack>
          <TextField
            label={t('insurance.valid_from')}
            name="validFrom"
            type="date"
            value={form.validFrom}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('insurance.valid_until')}
            name="validUntil"
            type="date"
            value={form.validUntil}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label={t('insurance.status')}
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{t(`insurance.status_${opt.toLowerCase()}`)}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="success" disabled={loading}>
              {loading ? t('insurance.saving') : t('insurance.create')}
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              {t('insurance.cancel')}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInsurance;
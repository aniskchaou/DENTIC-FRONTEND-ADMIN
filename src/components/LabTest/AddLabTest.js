import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const insuranceOptions = ['Yes', 'No'];
const paymentStatuses = ['Paid', 'Unpaid', 'Pending'];
const testCategories = ['Blood', 'Urine', 'Imaging', 'Biopsy', 'Other'];
const sampleTypes = ['Blood', 'Urine', 'Saliva', 'Tissue', 'Other'];

const AddLabTest = ({ closeModal, onSuccess }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    clinicId: '',
    testName: '',
    testCategory: '',
    testDescription: '',
    sampleType: '',
    sampleCollectionDate: '',
    sampleCollectedBy: '',
    testStatus: 'Pending',
    result: {},
    testCost: 0,
    insuranceCovered: '',
    paymentStatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(''); // result is a string
  const [imageLoading, setImageLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    axios.get(`${BASE_URL}/clinics`).then(res => setClinics(res.data)).catch(() => setClinics([]));
    axios.get(`${BASE_URL}/staff`).then(res => setStaffs(res.data)).catch(() => setStaffs([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${BASE_URL}/ai/lab-test-report-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // You can choose to show the summary or the raw field
      setResult(res.data.raw || JSON.stringify(res.data));
    } catch (err) {
      setResult(t('labtest.analysis_failed') || 'Analysis failed');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const labTestData = {
      ...form,
      result, // send result as a string
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/labtests`, labTestData);
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
        label={t('labtest.patient')}
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
        label={t('labtest.doctor')}
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
        label={t('labtest.clinic')}
        name="clinicId"
        value={form.clinicId}
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
        label={t('labtest.test_name')}
        name="testName"
        value={form.testName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label={t('labtest.test_category')}
        name="testCategory"
        value={form.testCategory}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {testCategories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('labtest.test_description')}
        name="testDescription"
        value={form.testDescription}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <TextField
        select
        label={t('labtest.sample_type')}
        name="sampleType"
        value={form.sampleType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {sampleTypes.map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('labtest.sample_collection_date')}
        name="sampleCollectionDate"
        type="datetime-local"
        value={form.sampleCollectionDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label={t('labtest.sample_collected_by')}
        name="sampleCollectedBy"
        value={form.sampleCollectedBy}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {staffs.map(staff => (
          <MenuItem key={staff.id} value={staff.id}>
            {staff.fullName || staff.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('labtest.test_status')}
        name="testStatus"
        value={form.testStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statuses.map(s => (
          <MenuItem key={s} value={s}>{t(`labtest.status_${s.toLowerCase().replace(' ', '_')}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('labtest.test_cost')}
        name="testCost"
        type="number"
        value={form.testCost}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label={t('labtest.insurance_covered')}
        name="insuranceCovered"
        value={form.insuranceCovered}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {insuranceOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{t(`labtest.insurance_${opt.toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('labtest.payment_status')}
        name="paymentStatus"
        value={form.paymentStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {paymentStatuses.map(opt => (
          <MenuItem key={opt} value={opt}>{t(`labtest.payment_${opt.toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        component="label"
        sx={{ mt: 2, mb: 1 }}
        disabled={imageLoading}
      >
        {t('labtest.upload_image') || 'Upload Lab Report Image'}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Button>
      {imageLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      <TextField
        label={t('labtest.result_summary') || 'Result Summary'}
        name="result"
        value={result}
        onChange={e => setResult(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={6}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? t('labtest.saving') : t('labtest.create')}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          {t('labtest.cancel')}
        </Button>
      </Stack>
    </form>
  );
};

export default AddLabTest;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const categories = [
  'Dental Tools',
  'Consumables',
  'Medicines',
  'Equipment',
  'Other'
];
const statuses = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
  'Expired'
];
const units = [
  'pcs',
  'box',
  'pack',
  'bottle',
  'tube',
  'ml',
  'g',
  'kg',
  'L',
  'other'
];

const AddInventoryItem = ({ closeModal, onSuccess }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    category: 'Dental Tools',
    quantity: 0,
    unit: 'pcs', // default value for select box
    clinicId: '',
    reorderLevel: 0,
    expiryDate: '',
    status: 'In Stock',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    // Fetch clinics from /clinics endpoint
    axios.get(`${BASE_URL}/clinics`)
      .then(res => setClinics(res.data))
      .catch(() => setClinics([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    // Get clinic name from clinics array
    const clinicObj = clinics.find(c => c.id === form.clinicId);
    const clinicName = clinicObj ? clinicObj.name : '';

    const itemData = {
      ...form,
      clinicId: Number(form.clinicId),
      clinicName
      // id is NOT included, let backend generate it
    };
    console.log('Submitting item:', itemData);
    try {
      await axios.post(`${BASE_URL}/inventory`, itemData);
      if (onSuccess) onSuccess();
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        label={t('inventory.name')}
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label={t('inventory.category')}
        name="category"
        value={form.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {categories.map(c => (
          <MenuItem key={c} value={c}>{t(`inventory.category_${c.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('inventory.quantity')}
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label={t('inventory.unit')}
        name="unit"
        value={form.unit}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {units.map(u => (
          <MenuItem key={u} value={u}>{t(`inventory.unit_${u.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label={t('inventory.clinic')}
        name="clinicId"
        value={form.clinicId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {clinics.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>
      {form.clinicId && (
        <div style={{ margin: '8px 0', color: '#007bff', fontWeight: 'bold' }}>
          {t('inventory.selected_clinic')}: {clinics.find(c => c.id === form.clinicId)?.name || ''}
        </div>
      )}
      <TextField
        label={t('inventory.reorder_level')}
        name="reorderLevel"
        type="number"
        value={form.reorderLevel}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label={t('inventory.expiry_date')}
        name="expiryDate"
        type="date"
        value={form.expiryDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label={t('inventory.status')}
        name="status"
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {statuses.map(s => (
          <MenuItem key={s} value={s}>{t(`inventory.status_${s.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('inventory.notes')}
        name="notes"
        value={form.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? t('inventory.saving') : t('inventory.create')}
        </Button>
        <Button variant="outlined" onClick={closeModal} disabled={loading}>
          {t('inventory.cancel')}
        </Button>
      </Stack>
    </form>
  );
};

export default AddInventoryItem;
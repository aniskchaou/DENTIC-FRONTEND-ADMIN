import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const categories = ['Dental Tools', 'Consumables', 'Medicines', 'Equipment', 'Other'];
const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'];
const units = ['pcs', 'box', 'pack', 'bottle', 'tube', 'ml', 'g', 'kg', 'L', 'other'];

const EditInventoryItem = ({ closeModal, item = {}, clinics = [], onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    category: 'Dental Tools',
    quantity: 0,
    unit: 'pcs',
    clinicId: '',
    reorderLevel: 0,
    expiryDate: '',
    status: 'In Stock',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        category: item.category || 'Dental Tools',
        quantity: item.quantity || 0,
        unit: item.unit || 'pcs',
        clinicId: item.clinicId || '',
        reorderLevel: item.reorderLevel || 0,
        expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : '',
        status: item.status || 'In Stock',
        notes: item.notes || '',
      });
    }
  }, [item]);

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

    const itemData = {
      ...form,
      clinicId: Number(form.clinicId),
      updatedAt: now
      // id is NOT included, let backend handle it
    };
    try {
      await axios.put(`${BASE_URL}/inventory/${item.id}`, itemData);
      if (onSuccess) onSuccess();
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {categories.map(c => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Quantity"
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
          label="Unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {units.map(u => (
            <MenuItem key={u} value={u}>{u}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Clinic"
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
            Selected Clinic: {clinics.find(c => c.id === form.clinicId)?.name || ''}
          </div>
        )}
        <TextField
          label="Reorder Level"
          name="reorderLevel"
          type="number"
          value={form.reorderLevel}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expiry Date"
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
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {statuses.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
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
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default EditInventoryItem;
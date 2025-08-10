import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const statuses = ['In Service', 'Out of Service', 'Maintenance Due', 'In Maintenance', 'Retired'];

const AddEquipmentMaintenance = ({ open, onClose, technicians = [], clinics = [], onSuccess }) => {
  const [form, setForm] = useState({
    clinicId: '',
    equipmentName: '',
    modelNumber: '',
    manufacturer: '',
    purchaseDate: '',
    lastServiceDate: '',
    nextServiceDue: '',
    status: 'In Service',
    assignedTechnician: '',
    maintenanceNotes: '',
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
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/equipments`, data);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Equipment Maintenance</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            select
            label="Clinic"
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
            label="Equipment Name"
            name="equipmentName"
            value={form.equipmentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Model Number"
            name="modelNumber"
            value={form.modelNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacturer"
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Service Date"
            name="lastServiceDate"
            type="date"
            value={form.lastServiceDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Next Service Due"
            name="nextServiceDue"
            type="date"
            value={form.nextServiceDue}
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
            select
            label="Assigned Technician"
            name="assignedTechnician"
            value={form.assignedTechnician}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {technicians.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Maintenance Notes"
            name="maintenanceNotes"
            value={form.maintenanceNotes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create'}
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentMaintenance;
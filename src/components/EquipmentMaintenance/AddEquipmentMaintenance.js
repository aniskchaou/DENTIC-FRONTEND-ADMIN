import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const statuses = ['In Service', 'Out of Service', 'Maintenance Due', 'In Maintenance', 'Retired'];

const AddEquipmentMaintenance = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [clinics, setClinics] = useState([]);
  const [technicians, setTechnicians] = useState([]);
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

  useEffect(() => {
    // Fetch clinics from backend
    const fetchClinics = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/clinics`);
        setClinics(res.data);
      } catch (err) {
        setClinics([]);
      }
    };
    fetchClinics();

    // Fetch staff with role 'technical'
    const fetchTechnicians = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users`);
        const technicalStaff = res.data.filter(staff => staff.role?.toUpperCase() === 'TECHNICAL');
        setTechnicians(technicalStaff);
      } catch (err) {
        setTechnicians([]);
      }
    };
    fetchTechnicians();
  }, []);

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
      createdAt: now,
      updatedAt: now
    };
    try {
      await axios.post(`${BASE_URL}/equipment`, data);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('equipment_maintenance.title')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            select
            label={t('equipment_maintenance.clinic')}
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
            label={t('equipment_maintenance.equipment_name')}
            name="equipmentName"
            value={form.equipmentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('equipment_maintenance.model_number')}
            name="modelNumber"
            value={form.modelNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('equipment_maintenance.manufacturer')}
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('equipment_maintenance.purchase_date')}
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('equipment_maintenance.last_service_date')}
            name="lastServiceDate"
            type="date"
            value={form.lastServiceDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('equipment_maintenance.next_service_due')}
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
            label={t('equipment_maintenance.status')}
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {statuses.map(s => (
              <MenuItem key={s} value={s}>{t(`equipment_maintenance.status_${s.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('equipment_maintenance.assigned_technician')}
            name="assignedTechnician"
            value={form.assignedTechnician}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {technicians.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.fullName}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('equipment_maintenance.maintenance_notes')}
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
              {loading ? t('equipment_maintenance.saving') : t('equipment_maintenance.create')}
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              {t('equipment_maintenance.cancel')}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentMaintenance;
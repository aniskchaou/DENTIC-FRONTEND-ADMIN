import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';

const certificationOptions = ['GMP', 'ISO', 'Other'];
const manufactureStatusOptions = ['Active', 'Inactive'];

const EditMedicamentManufacture = ({ closeModal, medicamentManufacture = {}, onSuccess }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    contactPerson: {
      fullName: '',
      phone: '',
      email: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    phone: '',
    email: '',
    website: '',
    licenseNumber: '',
    certifications: [],
    medicamentsSupplied: [{ name: '', batchNumber: '' }],
    contractStartDate: '',
    contractEndDate: '',
    manufactureStatus: 'Active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicamentManufacture) {
      setForm({
        name: medicamentManufacture.name || '',
        contactPerson: medicamentManufacture.contactPerson || { fullName: '', phone: '', email: '' },
        address: medicamentManufacture.address || { street: '', city: '', state: '', postalCode: '', country: '' },
        phone: medicamentManufacture.phone || '',
        email: medicamentManufacture.email || '',
        website: medicamentManufacture.website || '',
        licenseNumber: medicamentManufacture.licenseNumber || '',
        certifications: Array.isArray(medicamentManufacture.certifications)
          ? medicamentManufacture.certifications
          : typeof medicamentManufacture.certifications === 'string'
            ? medicamentManufacture.certifications.split(',').map(s => s.trim())
            : [],
        medicamentsSupplied: Array.isArray(medicamentManufacture.medicamentsSupplied)
          ? medicamentManufacture.medicamentsSupplied
          : [{ name: '', batchNumber: '' }],
        contractStartDate: medicamentManufacture.contractStartDate ? medicamentManufacture.contractStartDate.slice(0, 10) : '',
        contractEndDate: medicamentManufacture.contractEndDate ? medicamentManufacture.contractEndDate.slice(0, 10) : '',
        manufactureStatus: medicamentManufacture.manufactureStatus || medicamentManufacture.status || 'Active'
      });
    }
  }, [medicamentManufacture]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setForm(f => ({
        ...f,
        contactPerson: { ...f.contactPerson, [field]: value }
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm(f => ({
        ...f,
        address: { ...f.address, [field]: value }
      }));
    } else if (name === 'certifications') {
      setForm(f => ({
        ...f,
        certifications: typeof value === 'string' ? value.split(',') : value
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Medicaments Supplied handlers
  const handleMedicamentSuppliedChange = (idx, field, value) => {
    const medicamentsSupplied = [...form.medicamentsSupplied];
    medicamentsSupplied[idx][field] = value;
    setForm(f => ({ ...f, medicamentsSupplied }));
  };
  const addMedicamentSupplied = () => setForm(f => ({
    ...f,
    medicamentsSupplied: [...f.medicamentsSupplied, { name: '', batchNumber: '' }]
  }));
  const removeMedicamentSupplied = idx => setForm(f => ({
    ...f,
    medicamentsSupplied: f.medicamentsSupplied.length > 1
      ? f.medicamentsSupplied.filter((_, i) => i !== idx)
      : [{ name: '', batchNumber: '' }]
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...form,
      contractStartDate: form.contractStartDate ? new Date(form.contractStartDate).toISOString() : '',
      contractEndDate: form.contractEndDate ? new Date(form.contractEndDate).toISOString() : '',
      updatedAt: now
    };
    try {
      await medicamentManufactureHTTPService.editMedicamentManufacture(medicamentManufacture.id, data);
      if (onSuccess) onSuccess(data);
      if (closeModal) closeModal();
    } catch (e) {
      showMessage('Error', CurrentUser.ERR_MSG, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, minWidth: 400 }}>
      <Stack spacing={2}>
        <TextField label={t('medicament.name')} name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField
          label={t('medicament.contact_person')}
          name="contactPerson.fullName"
          value={form.contactPerson.fullName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.email')}
          name="contactPerson.email"
          value={form.contactPerson.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.phone')}
          name="contactPerson.phone"
          value={form.contactPerson.phone}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.street')}
          name="address.street"
          value={form.address.street}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.city')}
          name="address.city"
          value={form.address.city}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.state')}
          name="address.state"
          value={form.address.state}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.postal_code')}
          name="address.postalCode"
          value={form.address.postalCode}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.country')}
          name="address.country"
          value={form.address.country}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.phone')}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.website')}
          name="website"
          value={form.website}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.license_number')}
          name="licenseNumber"
          value={form.licenseNumber}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          select
          label={t('medicament.certifications')}
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
          required
          fullWidth
          SelectProps={{ multiple: true }}
        >
          {certificationOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`medicament.certification_${opt.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        {/* Medicaments Supplied */}
        <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('medicament.medicaments_supplied')}</Typography>
        {Array.isArray(form.medicamentsSupplied) && form.medicamentsSupplied.map((med, idx) => (
          <Stack direction="row" spacing={2} key={idx} sx={{ mb: 1 }}>
            <TextField
              label={t('medicament.medicament_name')}
              name={`medicamentsSupplied.${idx}.name`}
              value={med.name}
              onChange={e => handleMedicamentSuppliedChange(idx, 'name', e.target.value)}
              fullWidth
            />
            <TextField
              label={t('medicament.batch_number')}
              name={`medicamentsSupplied.${idx}.batchNumber`}
              value={med.batchNumber}
              onChange={e => handleMedicamentSuppliedChange(idx, 'batchNumber', e.target.value)}
              fullWidth
            />
            <IconButton
              color="error"
              onClick={() => removeMedicamentSupplied(idx)}
              disabled={form.medicamentsSupplied.length === 1}
            >
              <i className="fas fa-trash" />
            </IconButton>
          </Stack>
        ))}
        <Button
          variant="outlined"
          onClick={addMedicamentSupplied}
          sx={{ mb: 2 }}
        >
          {t('medicament.add_medicament_supplied')}
        </Button>
        <TextField
          label={t('medicament.contract_start_date')}
          name="contractStartDate"
          type="date"
          value={form.contractStartDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label={t('medicament.contract_end_date')}
          name="contractEndDate"
          type="date"
          value={form.contractEndDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          select
          label={t('medicament.manufacture_status')}
          name="manufactureStatus"
          value={form.manufactureStatus}
          onChange={handleChange}
          required
          fullWidth
        >
          {manufactureStatusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{t(`medicament.manufacture_status_${opt.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? t('medicament.saving') : t('medicament.save')}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            {t('medicament.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditMedicamentManufacture;

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';

const statusOptions = ['Available', 'Unavailable', 'Expired'];
const prescriptionOptions = ['Yes', 'No'];
const certificationOptions = ['GMP', 'ISO', 'Other'];
const manufactureStatusOptions = ['Active', 'Inactive'];

const AddMedicament = ({ closeModal, onCreate }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    genericName: '',
    category: '',
    description: '',
    activeIngredients: [{ ingredient: '', concentration: '' }],
    dosageForm: '',
    strength: '',
    manufacturerId: '',
    requiresPrescription: 'Yes',
    sideEffects: [''],
    contraindications: [''],
    usageInstructions: '',
    stockQuantity: '',
    pricePerUnit: '',
    expirationDate: '',
    storageConditions: '',
    barcode: '',
    batchNumber: '',
    status: 'Available',
    // Add missing fields for manufacturer
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
    contractStartDate: '',
    contractEndDate: '',
    manufactureStatus: 'Active' // renamed to avoid conflict with medicament status
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Replace with your actual service/API for medicament categories
    // Example: medicamentCategoryHTTPService.getAllCategories()
    fetch(BASE_URL+'/medicament-categories')
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  // Handlers for main fields
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

  // Active Ingredients
  const handleIngredientChange = (idx, field, value) => {
    const activeIngredients = [...form.activeIngredients];
    activeIngredients[idx][field] = value;
    setForm(f => ({ ...f, activeIngredients }));
  };
  const addIngredient = () => setForm(f => ({
    ...f,
    activeIngredients: [...f.activeIngredients, { ingredient: '', concentration: '' }]
  }));
  const removeIngredient = idx => setForm(f => ({
    ...f,
    activeIngredients: f.activeIngredients.length > 1
      ? f.activeIngredients.filter((_, i) => i !== idx)
      : [{ ingredient: '', concentration: '' }]
  }));

  // Side Effects
  const handleSideEffectChange = (idx, value) => {
    const sideEffects = [...form.sideEffects];
    sideEffects[idx] = value;
    setForm(f => ({ ...f, sideEffects }));
  };
  const addSideEffect = () => setForm(f => ({ ...f, sideEffects: [...f.sideEffects, ''] }));
  const removeSideEffect = idx => setForm(f => ({
    ...f,
    sideEffects: f.sideEffects.length > 1
      ? f.sideEffects.filter((_, i) => i !== idx)
      : ['']
  }));

  // Contraindications
  const handleContraindicationChange = (idx, value) => {
    const contraindications = [...form.contraindications];
    contraindications[idx] = value;
    setForm(f => ({ ...f, contraindications }));
  };
  const addContraindication = () => setForm(f => ({ ...f, contraindications: [...f.contraindications, ''] }));
  const removeContraindication = idx => setForm(f => ({
    ...f,
    contraindications: f.contraindications.length > 1
      ? f.contraindications.filter((_, i) => i !== idx)
      : ['']
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();

    const data = {
      name: form.name,
      genericName: form.genericName,
      category: form.category,
      description: form.description,
      activeIngredients: form.activeIngredients.filter(ai => ai.ingredient && ai.concentration),
      dosageForm: form.dosageForm,
      strength: form.strength,
      manufacturerId: Number(form.manufacturerId),
      requiresPrescription: form.requiresPrescription,
      sideEffects: form.sideEffects.filter(s => s.trim() !== ''),
      contraindications: form.contraindications.filter(c => c.trim() !== ''),
      usageInstructions: form.usageInstructions,
      stockQuantity: Number(form.stockQuantity),
      pricePerUnit: Number(form.pricePerUnit),
      expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : '',
      storageConditions: form.storageConditions,
      barcode: form.barcode,
      batchNumber: form.batchNumber,
      status: form.status,
      contactPerson: form.contactPerson,
      address: form.address,
      phone: form.phone,
      email: form.email,
      website: form.website,
      licenseNumber: form.licenseNumber,
      certifications: form.certifications,
      contractStartDate: form.contractStartDate ? new Date(form.contractStartDate).toISOString() : '',
      contractEndDate: form.contractEndDate ? new Date(form.contractEndDate).toISOString() : '',
      manufactureStatus: form.manufactureStatus,
      createdAt: now,
      updatedAt: now
    };

    try {
      await medicamentManufactureHTTPService.createMedicamentManufacture(data);
      showMessage('Success', 'Medicament created successfully', 'success');
      if (onCreate) onCreate(data);
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
                
        {/* Manufacturer Details Section */}
        <TextField label={t('medicament.name')} name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.contact_person')} name="contactPerson.fullName" value={form.contactPerson.fullName} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.email')} name="contactPerson.email" value={form.contactPerson.email} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.phone')} name="contactPerson.phone" value={form.contactPerson.phone} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.street')} name="address.street" value={form.address.street} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.city')} name="address.city" value={form.address.city} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.state')} name="address.state" value={form.address.state} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.postal_code')} name="address.postalCode" value={form.address.postalCode} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.country')} name="address.country" value={form.address.country} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.phone')} name="phone" value={form.phone} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.email')} name="email" value={form.email} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.website')} name="website" value={form.website} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.license_number')} name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required fullWidth />

        {/* Certifications */}
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
              onChange={e => {
                const newArr = [...form.medicamentsSupplied];
                newArr[idx].name = e.target.value;
                setForm(f => ({ ...f, medicamentsSupplied: newArr }));
              }}
              fullWidth
            />
            <TextField
              label={t('medicament.batch_number')}
              name={`medicamentsSupplied.${idx}.batchNumber`}
              value={med.batchNumber}
              onChange={e => {
                const newArr = [...form.medicamentsSupplied];
                newArr[idx].batchNumber = e.target.value;
                setForm(f => ({ ...f, medicamentsSupplied: newArr }));
              }}
              fullWidth
            />
            <IconButton
              color="error"
              onClick={() => {
                setForm(f => ({
                  ...f,
                  medicamentsSupplied: f.medicamentsSupplied.filter((_, i) => i !== idx)
                }));
              }}
              disabled={form.medicamentsSupplied.length === 1}
            >
              <i className="fas fa-trash" />
            </IconButton>
          </Stack>
        ))}
        <Button
          variant="outlined"
          onClick={() =>
            setForm(f => ({
              ...f,
              medicamentsSupplied: [
                ...(f.medicamentsSupplied || []),
                { name: '', batchNumber: '' }
              ]
            }))
          }
          sx={{ mb: 2 }}
        >
          {t('medicament.add_medicament_supplied')}
        </Button>

        {/* Contract Dates and Status */}
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
            {loading ? t('medicament.saving') : t('medicament.create')}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            {t('medicament.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddMedicament;
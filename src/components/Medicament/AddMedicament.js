import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Stack, Typography, MenuItem } from '@mui/material';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const categories = [
  'Antibiotic',
  'Analgesic',
  'Antipyretic',
  'Antiseptic',
  'Antimalarial',
  'Antiviral',
  'Antifungal',
  'Vaccine',
  'Other'
];

const dosageForms = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Gel",
  "Spray"
];

const AddMedicament = ({ closeModal, onCreate, initialData, isEdit }) => {
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
    status: 'Available'
  });
  const [loading, setLoading] = useState(false);
  const [manufactures, setManufactures] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/medicament-manufactures`)
      .then(res => setManufactures(res.data))
      .catch(() => setManufactures([]));
  }, []);

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        ...form,
        ...initialData,
        activeIngredients: initialData.activeIngredients?.length > 0 ? initialData.activeIngredients : [{ ingredient: '', concentration: '' }],
        sideEffects: initialData.sideEffects?.length > 0 ? initialData.sideEffects : [''],
        contraindications: initialData.contraindications?.length > 0 ? initialData.contraindications : [''],
        expirationDate: initialData.expirationDate ? initialData.expirationDate.split('T')[0] : '',
      });
    }
  }, [isEdit, initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
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
      expirationDate: new Date(form.expirationDate).toISOString(),
      storageConditions: form.storageConditions,
      barcode: form.barcode,
      batchNumber: form.batchNumber,
      status: form.status,
      createdAt: now,
      updatedAt: now
    };
    try {
      await medicamentHTTPService.createMedicament(data);
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
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, minWidth: 350 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{t('medicament.title')}</Typography>
        <TextField label={t('medicament.name')} name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.generic_name')} name="genericName" value={form.genericName} onChange={handleChange} required fullWidth />
        <TextField
          select
          label={t('medicament.category')}
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          fullWidth
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField label={t('medicament.description')} name="description" value={form.description} onChange={handleChange} multiline rows={3} required fullWidth />

        <Typography variant="subtitle2">{t('medicament.active_ingredients')}</Typography>
        {form.activeIngredients.map((ai, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              label={t('medicament.ingredient')}
              value={ai.ingredient}
              onChange={e => handleIngredientChange(idx, 'ingredient', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <TextField
              label={t('medicament.concentration')}
              value={ai.concentration}
              onChange={e => handleIngredientChange(idx, 'concentration', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
              onClick={() => removeIngredient(idx)}
              disabled={form.activeIngredients.length === 1}
            >
              -
            </Button>
            {idx === form.activeIngredients.length - 1 && (
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
                onClick={addIngredient}
              >
                +
              </Button>
            )}
          </Stack>
        ))}

        <TextField
          select
          label={t('medicament.dosage_form')}
          name="dosageForm"
          value={form.dosageForm}
          onChange={handleChange}
          required
          fullWidth
        >
          {dosageForms.map(df => (
            <MenuItem key={df} value={df}>
              {df}
            </MenuItem>
          ))}
        </TextField>
        <TextField label={t('medicament.strength')} name="strength" value={form.strength} onChange={handleChange} required fullWidth />
        <TextField
          select
          label={t('medicament.manufacturer')}
          name="manufacturerId"
          value={form.manufacturerId}
          onChange={handleChange}
          required
          fullWidth
        >
          {manufactures.length === 0 ? (
            <MenuItem value="" disabled>Loading...</MenuItem>
          ) : (
            manufactures.map(m => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))
          )}
        </TextField>
        <TextField
          select
          label={t('medicament.requires_prescription')}
          name="requiresPrescription"
          value={form.requiresPrescription}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Yes">{t('yes')}</MenuItem>
          <MenuItem value="No">{t('no')}</MenuItem>
        </TextField>

        <Typography variant="subtitle2">{t('medicament.side_effects')}</Typography>
        {form.sideEffects.map((side, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              value={side}
              onChange={e => handleSideEffectChange(idx, e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
              onClick={() => removeSideEffect(idx)}
              disabled={form.sideEffects.length === 1}
            >
              -
            </Button>
            {idx === form.sideEffects.length - 1 && (
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
                onClick={addSideEffect}
              >
                +
              </Button>
            )}
          </Stack>
        ))}

        <Typography variant="subtitle2">{t('medicament.contraindications')}</Typography>
        {form.contraindications.map((contra, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              value={contra}
              onChange={e => handleContraindicationChange(idx, e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
              onClick={() => removeContraindication(idx)}
              disabled={form.contraindications.length === 1}
            >
              -
            </Button>
            {idx === form.contraindications.length - 1 && (
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ minWidth: 32, borderRadius: 2, fontWeight: 700, px: 0 }}
                onClick={addContraindication}
              >
                +
              </Button>
            )}
          </Stack>
        ))}

        <TextField label={t('medicament.usage_instructions')} name="usageInstructions" value={form.usageInstructions} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.stock_quantity')} name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.price_per_unit')} name="pricePerUnit" type="number" value={form.pricePerUnit} onChange={handleChange} required fullWidth />
        <TextField
          label={t('medicament.expiration_date')}
          name="expirationDate"
          type="date"
          value={form.expirationDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField label={t('medicament.storage_conditions')} name="storageConditions" value={form.storageConditions} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.barcode')} name="barcode" value={form.barcode} onChange={handleChange} required fullWidth />
        <TextField label={t('medicament.batch_number')} name="batchNumber" value={form.batchNumber} onChange={handleChange} required fullWidth />
        <TextField
          select
          label={t('medicament.status')}
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Available">{t('medicament.available')}</MenuItem>
          <MenuItem value="Unavailable">{t('medicament.unavailable')}</MenuItem>
          <MenuItem value="Expired">{t('medicament.expired')}</MenuItem>
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
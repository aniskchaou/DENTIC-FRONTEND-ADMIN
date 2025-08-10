import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Stack, Typography, MenuItem } from '@mui/material';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';

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

const AddMedicament = ({ closeModal, onCreate }) => {
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
      id: Math.random().toString(36).substr(2, 9),
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
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField label="Generic Name" name="genericName" value={form.genericName} onChange={handleChange} required fullWidth />
        <TextField
          select
          label="Category"
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
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} required fullWidth />

        <Typography variant="subtitle2">Active Ingredients</Typography>
        {form.activeIngredients.map((ai, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              label="Ingredient"
              value={ai.ingredient}
              onChange={e => handleIngredientChange(idx, 'ingredient', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Concentration"
              value={ai.concentration}
              onChange={e => handleIngredientChange(idx, 'concentration', e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button color="error" onClick={() => removeIngredient(idx)} disabled={form.activeIngredients.length === 1}>-</Button>
            {idx === form.activeIngredients.length - 1 && (
              <Button color="success" onClick={addIngredient}>+</Button>
            )}
          </Stack>
        ))}

        <TextField
          select
          label="Dosage Form"
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
        <TextField label="Strength" name="strength" value={form.strength} onChange={handleChange} required fullWidth />
        <TextField label="Manufacturer ID" name="manufacturerId" value={form.manufacturerId} onChange={handleChange} required fullWidth />
        <TextField
          select
          label="Requires Prescription"
          name="requiresPrescription"
          value={form.requiresPrescription}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>

        <Typography variant="subtitle2">Side Effects</Typography>
        {form.sideEffects.map((side, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              value={side}
              onChange={e => handleSideEffectChange(idx, e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button color="error" onClick={() => removeSideEffect(idx)} disabled={form.sideEffects.length === 1}>-</Button>
            {idx === form.sideEffects.length - 1 && (
              <Button color="success" onClick={addSideEffect}>+</Button>
            )}
          </Stack>
        ))}

        <Typography variant="subtitle2">Contraindications</Typography>
        {form.contraindications.map((contra, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            <TextField
              value={contra}
              onChange={e => handleContraindicationChange(idx, e.target.value)}
              fullWidth
              size="small"
              required
            />
            <Button color="error" onClick={() => removeContraindication(idx)} disabled={form.contraindications.length === 1}>-</Button>
            {idx === form.contraindications.length - 1 && (
              <Button color="success" onClick={addContraindication}>+</Button>
            )}
          </Stack>
        ))}

        <TextField label="Usage Instructions" name="usageInstructions" value={form.usageInstructions} onChange={handleChange} required fullWidth />
        <TextField label="Stock Quantity" name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required fullWidth />
        <TextField label="Price Per Unit" name="pricePerUnit" type="number" value={form.pricePerUnit} onChange={handleChange} required fullWidth />
        <TextField
          label="Expiration Date"
          name="expirationDate"
          type="date"
          value={form.expirationDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField label="Storage Conditions" name="storageConditions" value={form.storageConditions} onChange={handleChange} required fullWidth />
        <TextField label="Barcode" name="barcode" value={form.barcode} onChange={handleChange} required fullWidth />
        <TextField label="Batch Number" name="batchNumber" value={form.batchNumber} onChange={handleChange} required fullWidth />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Unavailable">Unavailable</MenuItem>
          <MenuItem value="Expired">Expired</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Saving...' : 'Create Medicament'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddMedicament;
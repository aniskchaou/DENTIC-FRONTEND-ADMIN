import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack, Typography, IconButton } from '@mui/material';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';

const statusOptions = ['Available', 'Unavailable', 'Expired'];

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
    medicamentsSupplied: [],
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

    // Validation for required fields
    if (
      !form.name ||
      !form.genericName ||
      !form.category ||
      !form.description ||
      !form.dosageForm ||
      !form.strength ||
      !form.manufacturerId ||
      !form.usageInstructions ||
      !form.stockQuantity ||
      !form.pricePerUnit ||
      !form.expirationDate ||
      !form.storageConditions ||
      !form.barcode ||
      !form.batchNumber ||
      !form.status
    ) {
      showMessage('Error', 'Please fill all required fields.', 'warning');
      setLoading(false);
      return;
    }

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
      contactPerson: form.contactPerson,
      address: form.address,
      phone: form.phone,
      email: form.email,
      website: form.website,
      licenseNumber: form.licenseNumber,
      certifications: form.certifications,
      medicamentsSupplied: form.medicamentsSupplied,
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
            <MenuItem key={cat.id || cat._id || cat.name} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} required fullWidth />

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
            <IconButton color="error" onClick={() => removeIngredient(idx)} disabled={form.activeIngredients.length === 1}>
              <span className="fa fa-minus" />
            </IconButton>
            {idx === form.activeIngredients.length - 1 && (
              <IconButton color="success" onClick={addIngredient}>
                <span className="fa fa-plus" />
              </IconButton>
            )}
          </Stack>
        ))}

        <TextField label="Dosage Form" name="dosageForm" value={form.dosageForm} onChange={handleChange} required fullWidth />
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
            <IconButton color="error" onClick={() => removeSideEffect(idx)} disabled={form.sideEffects.length === 1}>
              <span className="fa fa-minus" />
            </IconButton>
            {idx === form.sideEffects.length - 1 && (
              <IconButton color="success" onClick={addSideEffect}>
                <span className="fa fa-plus" />
              </IconButton>
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
            <IconButton color="error" onClick={() => removeContraindication(idx)} disabled={form.contraindications.length === 1}>
              <span className="fa fa-minus" />
            </IconButton>
            {idx === form.contraindications.length - 1 && (
              <IconButton color="success" onClick={addContraindication}>
                <span className="fa fa-plus" />
              </IconButton>
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
          {statusOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>

        {/* Manufacturer Details Section */}
        <Typography variant="h6" sx={{ mt: 3 }}>Manufacturer Details</Typography>
        <TextField label="Contact Person" name="contactPerson.fullName" value={form.contactPerson.fullName} onChange={handleChange} required fullWidth />
        <TextField label="Phone" name="contactPerson.phone" value={form.contactPerson.phone} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="contactPerson.email" value={form.contactPerson.email} onChange={handleChange} required fullWidth />
        <TextField label="Street" name="address.street" value={form.address.street} onChange={handleChange} required fullWidth />
        <TextField label="City" name="address.city" value={form.address.city} onChange={handleChange} required fullWidth />
        <TextField label="State" name="address.state" value={form.address.state} onChange={handleChange} required fullWidth />
        <TextField label="Postal Code" name="address.postalCode" value={form.address.postalCode} onChange={handleChange} required fullWidth />
        <TextField label="Country" name="address.country" value={form.address.country} onChange={handleChange} required fullWidth />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth />
        <TextField label="Website" name="website" value={form.website} onChange={handleChange} required fullWidth />
        <TextField label="License Number" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required fullWidth />
        <TextField
          select
          label="Certifications"
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="GMP">GMP</MenuItem>
          <MenuItem value="ISO">ISO</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          select
          label="Medicaments Supplied"
          name="medicamentsSupplied"
          value={form.medicamentsSupplied}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Medicament A">Medicament A</MenuItem>
          <MenuItem value="Medicament B">Medicament B</MenuItem>
          <MenuItem value="Medicament C">Medicament C</MenuItem>
        </TextField>
        <TextField
          label="Contract Start Date"
          name="contractStartDate"
          type="date"
          value={form.contractStartDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label="Contract End Date"
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
          label="Manufacture Status"
          name="manufactureStatus"
          value={form.manufactureStatus}
          onChange={handleChange}
          required
          fullWidth
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
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
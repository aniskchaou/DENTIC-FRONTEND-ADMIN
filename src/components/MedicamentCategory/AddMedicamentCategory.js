import React, { useState } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';

const AddMedicamentCategory = ({ closeModal, onCreate }) => {
  const [form, setForm] = useState({
    name: '',
    description: ''
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
      id: Math.random().toString(36).substr(2, 9),
      name: form.name,
      description: form.description,
      createdAt: now,
      updatedAt: now
    };
    try {
      await medicamentCategoryHTTPService.createMedicamentCayegory(data);
      showMessage('Success', 'Category created successfully', 'success');
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
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Saving...' : 'Create Category'}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddMedicamentCategory;
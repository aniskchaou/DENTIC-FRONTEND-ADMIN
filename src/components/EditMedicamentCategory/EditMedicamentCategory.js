import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const EditMedicamentCategory = ({ closeModal, medicamentCategory = {}, onSuccess }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicamentCategory) {
      setForm({
        name: medicamentCategory.name || '',
        description: medicamentCategory.description || ''
      });
    }
  }, [medicamentCategory]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: form.name,
      description: form.description
    };
    try {
      await fetch(`${BASE_URL}/medicament-categories/${medicamentCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(data)
      });
      if (onSuccess) onSuccess(data);
      if (closeModal) closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, minWidth: 350 }}>
      <Stack spacing={2}>
        <TextField
          label={t('medicament_category.name')}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label={t('medicament_category.description')}
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? t('medicament_category.saving') : t('medicament_category.save')}
          </Button>
          <Button variant="outlined" onClick={closeModal} disabled={loading}>
            {t('medicament_category.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditMedicamentCategory;

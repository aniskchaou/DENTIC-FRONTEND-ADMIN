import PropTypes from 'prop-types';
import './ConfigurationContent.css';
import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

// Only keep important settings
const defaultSettings = {
  system: {
    appName: 'Dentic',
    address: '123 Dentic St',
    email: 'support@dentic.com',
    showLogo: false,
  },
  localisation: {
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    currencySymbol: '$',
  },
  openHours: [
    { day: 'Monday', hours: '08:00 - 18:00' },
    { day: 'Tuesday', hours: '08:00 - 18:00' },
    { day: 'Wednesday', hours: '08:00 - 18:00' },
    { day: 'Thursday', hours: '08:00 - 18:00' },
    { day: 'Friday', hours: '08:00 - 18:00' },
    { day: 'Saturday', hours: '09:00 - 14:00' },
    { day: 'Sunday', hours: 'Closed' },
  ]
};

const SETTINGS_FILE_KEY = 'dentic_settings_json';
const CLINIC_SETTINGS_API_URL = BASE_URL + '/clinicsettings';

const dateFormatOptions = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'MAD', label: 'MAD - Moroccan Dirham' },
];

const currencySymbolOptions = [
  { value: '$', label: '$' },
  { value: '€', label: '€' },
  { value: '£', label: '£' },
  { value: 'د.م.', label: 'د.م.' },
];

const ConfigurationContent = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [tab, setTab] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, section: null });
  const [loadingOpenHours, setLoadingOpenHours] = useState(false);

  // Load from backend on mount
  useEffect(() => {
    axios.get(CLINIC_SETTINGS_API_URL)
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(() => {
        const saved = localStorage.getItem(SETTINGS_FILE_KEY);
        if (saved) setSettings(JSON.parse(saved));
      });
  }, []);

  // Save to backend when user clicks Save in dialog
  const handleEditSave = () => {
    axios.put(CLINIC_SETTINGS_API_URL, settings)
      .then(() => {
        closeEdit();
      })
      .catch(() => {
        // fallback to localStorage if backend fails
        localStorage.setItem(SETTINGS_FILE_KEY, JSON.stringify(settings));
        closeEdit();
      });
  };

  const convertToYesNoValue = (value) => value ? 'Yes' : 'No';

  // Restore default for a section
  const restoreSection = (section) => {
    setSettings(prev => ({ ...prev, [section]: defaultSettings[section] }));
  };

  // Dialog open/close helpers
  const openEdit = (section) => setEditDialog({ open: true, section });
  const closeEdit = () => setEditDialog({ open: false, section: null });

  // Simple edit dialog for demonstration
  const EditDialogContent = () => {
    const section = editDialog.section;
    const sectionSettings = settings[section] ?? {};

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    };

    // For openHours, handle array of days
    if (section === 'openHours') {
      const handleHoursChange = (idx, value) => {
        setSettings(prev => ({
          ...prev,
          openHours: prev.openHours.map((item, i) =>
            i === idx ? { ...item, hours: value } : item
          )
        }));
      };
      return (
        <Stack spacing={2} sx={{ mt: 1 }}>
          {settings.openHours.map((item, idx) => (
            <TextField
              key={item.day}
              label={item.day}
              value={item.hours}
              onChange={e => handleHoursChange(idx, e.target.value)}
              fullWidth
            />
          ))}
        </Stack>
      );
    }

    return (
      <Stack spacing={2} sx={{ mt: 1 }}>
        {section === 'system' && (
          <>
            <TextField label="App Name" name="appName" value={sectionSettings.appName ?? ''} onChange={handleChange} fullWidth />
            <TextField label="Address" name="address" value={sectionSettings.address ?? ''} onChange={handleChange} fullWidth />
            <TextField label="Email" name="email" value={sectionSettings.email ?? ''} onChange={handleChange} fullWidth />
            <label>
              <input type="checkbox" name="showLogo" checked={sectionSettings.showLogo ?? false} onChange={handleChange} />
              Show Logo
            </label>
          </>
        )}
        {section === 'localisation' && (
          <>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                label="Language"
                name="language"
                value={sectionSettings.language ?? ''}
                onChange={handleChange}
              >
                {languageOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Date Format</InputLabel>
              <Select
                label="Date Format"
                name="dateFormat"
                value={sectionSettings.dateFormat ?? ''}
                onChange={handleChange}
              >
                {dateFormatOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                label="Currency"
                name="currency"
                value={sectionSettings.currency ?? ''}
                onChange={handleChange}
              >
                {currencyOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Currency Symbol</InputLabel>
              <Select
                label="Currency Symbol"
                name="currencySymbol"
                value={sectionSettings.currencySymbol ?? ''}
                onChange={handleChange}
              >
                {currencySymbolOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Stack>
    );
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box sx={{ minWidth: 220 }}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(_, v) => setTab(v)}
            aria-label="Settings Tabs"
            variant="scrollable"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="System" />
            <Tab label="Localisation" />
            <Tab label="Open Hours" />
          </Tabs>
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* System */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6">System Settings</Typography><hr />
              <Typography>App Title: {settings?.system?.appName ?? ''}</Typography>
              <Typography>Show logo: {convertToYesNoValue(settings?.system?.showLogo ?? false)}</Typography>
              <Typography>Address: {settings?.system?.address ?? ''}</Typography>
              <Typography>Email: {settings?.system?.email ?? ''}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('system')}>Edit</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('system')}>Restore Default</Button>
              </Stack>
            </Box>
          )}
          {/* Localisation */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6">Localisation Settings</Typography><hr />
              <Typography>Language: {settings?.localisation?.language ?? ''}</Typography>
              <Typography>Date format: {settings?.localisation?.dateFormat ?? ''}</Typography>
              <Typography>Currency: {settings?.localisation?.currency ?? ''}</Typography>
              <Typography>Currency symbol: {settings?.localisation?.currencySymbol ?? ''}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('localisation')}>Edit</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('localisation')}>Restore Default</Button>
              </Stack>
            </Box>
          )}
          {/* Open Hours */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6">Open Hours</Typography><hr />
              {loadingOpenHours ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box>
                  {settings.openHours && settings.openHours.map((item, idx) => (
                    <Typography key={item.day}>
                      <b>{item.day}:</b> {item.hours}
                    </Typography>
                  ))}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="contained" color="info" onClick={() => openEdit('openHours')}>Edit</Button>
                  </Stack>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Stack>

      {/* Material-UI Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Settings</DialogTitle>
        <DialogContent>
          <EditDialogContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save
          </Button>
          <Button onClick={closeEdit} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
};

ConfigurationContent.propTypes = {};

ConfigurationContent.defaultProps = {};

export default ConfigurationContent

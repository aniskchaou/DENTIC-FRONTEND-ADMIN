import PropTypes from 'prop-types';
import './ConfigurationContent.css';
import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import CurrentUser from '../../main/config/user';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

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
  ],
  ia: {
    OPEN_API_KEY: ''
  },
  telemedicine: {
    GOOGLE_MEET_KEY: ''
  },
  email: {
    service: "gmail",
    from: "no-reply@dentic.com",
    auth: {
      user: "",
      pass: ""
    }
  },
  cronJobs: [
    {
      name: "marketingPatientMatcher",
      schedule: "* * * * *",
      enabled: true
    }
  ],
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
  const { t } = useTranslation();

  const [settings, setSettings] = useState(defaultSettings);
  const [tab, setTab] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, section: null });
  const [loadingOpenHours, setLoadingOpenHours] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false); // <-- Add this state

  // Load from backend on mount
  useEffect(() => {
    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/clinicssettings.json')
        .then(res => res.json())
        .then(data => {
          if (data) setSettings(data);
        })
        .catch(() => {
          const saved = localStorage.getItem(SETTINGS_FILE_KEY);
          if (saved) setSettings(JSON.parse(saved));
        });
    } else {
      axios.get(CLINIC_SETTINGS_API_URL)
        .then(res => {
          if (res.data) setSettings(res.data);
        })
        .catch(() => {
          const saved = localStorage.getItem(SETTINGS_FILE_KEY);
          if (saved) setSettings(JSON.parse(saved));
        });
    }
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

  // Edit dialog content
  const EditDialogContent = () => {
    const section = editDialog.section;
    const sectionSettings = settings[section] ?? {};

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (section === "email" && (name === "user" || name === "pass")) {
        setSettings(prev => ({
          ...prev,
          email: {
            ...prev.email,
            auth: {
              ...prev.email.auth,
              [name]: value
            }
          }
        }));
      } else if (section === "cronJobs") {
        // Only one job for now, update by index 0
        setSettings(prev => ({
          ...prev,
          cronJobs: [
            {
              ...prev.cronJobs[0],
              [name]: type === "checkbox" ? checked : value
            }
          ]
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: type === 'checkbox' ? checked : value
          }
        }));
      }
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

    if (section === 'ia') {
      return (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Open IA API Key"
            name="OPEN_API_KEY"
            value={sectionSettings.OPEN_API_KEY ?? ''}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      );
    }

    if (section === 'telemedicine') {
      return (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Google Meet API Key"
            name="GOOGLE_MEET_KEY"
            value={sectionSettings.GOOGLE_MEET_KEY ?? ''}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      );
    }

    if (section === "email") {
      return (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Service"
            name="service"
            value={sectionSettings.service ?? ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="From"
            name="from"
            value={sectionSettings.from ?? ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Auth User"
            name="user"
            value={sectionSettings.auth?.user ?? ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Auth Password"
            name="pass"
            type="password"
            value={sectionSettings.auth?.pass ?? ''}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      );
    }

    if (section === "cronJobs") {
      const job = sectionSettings[0] || {};
      return (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Job Name"
            name="name"
            value={job.name ?? ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Schedule"
            name="schedule"
            value={job.schedule ?? ''}
            onChange={handleChange}
            fullWidth
            helperText="Cron format (e.g. * * * * *)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={job.enabled ?? false}
                onChange={handleChange}
                name="enabled"
              />
            }
            label="Enabled"
          />
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
            aria-label={t('configuration.tabs')}
            variant="scrollable"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label={t('configuration.system')} />
            <Tab label={t('configuration.localisation')} />
            <Tab label={t('configuration.open_hours')} />
            <Tab label={t('configuration.ia')} />
            <Tab label={t('configuration.telemedicine')} />
            <Tab label="Email" />
            <Tab label="Cron Jobs" /> {/* NEW TAB */}
          </Tabs>
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* System */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6">{t('configuration.system_settings')}</Typography><hr />
              <Typography>{t('configuration.app_title')}: {settings?.system?.appName ?? ''}</Typography>
              <Typography>{t('configuration.show_logo')}: {convertToYesNoValue(settings?.system?.showLogo ?? false)}</Typography>
              <Typography>{t('configuration.address')}: {settings?.system?.address ?? ''}</Typography>
              <Typography>{t('configuration.email')}: {settings?.system?.email ?? ''}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('system')}>{t('configuration.edit')}</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('system')}>{t('configuration.restore_default')}</Button>
              </Stack>
            </Box>
          )}
          {/* Localisation */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6">{t('configuration.localisation_settings')}</Typography><hr />
              <Typography>{t('configuration.language')}: {settings?.localisation?.language ?? ''}</Typography>
              <Typography>{t('configuration.date_format')}: {settings?.localisation?.dateFormat ?? ''}</Typography>
              <Typography>{t('configuration.currency')}: {settings?.localisation?.currency ?? ''}</Typography>
              <Typography>{t('configuration.currency_symbol')}: {settings?.localisation?.currencySymbol ?? ''}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('localisation')}>{t('configuration.edit')}</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('localisation')}>{t('configuration.restore_default')}</Button>
              </Stack>
            </Box>
          )}
          {/* Open Hours */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6">{t('configuration.open_hours')}</Typography><hr />
              {loadingOpenHours ? (
                <Typography>{t('configuration.loading')}</Typography>
              ) : (
                <Box>
                  {settings.openHours && settings.openHours.map((item, idx) => (
                    <Typography key={item.day}>
                      <b>{t(`configuration.days.${item.day}`)}:</b> {item.hours}
                    </Typography>
                  ))}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="contained" color="info" onClick={() => openEdit('openHours')}>{t('configuration.edit')}</Button>
                  </Stack>
                </Box>
              )}
            </Box>
          )}
          {/* IA Tab */}
          {tab === 3 && (
            <Box>
              <Typography variant="h6">{t('configuration.ia_settings')}</Typography><hr />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>
                  <b>{t('configuration.open_ia_api_key')}</b>:
                </Typography>
                <Typography sx={{ ml: 1 }}>
                  {showApiKey
                    ? settings?.ia?.OPEN_API_KEY ?? ''
                    : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowApiKey(v => !v)}
                  aria-label={showApiKey ? t('configuration.hide_api_key') : t('configuration.show_api_key')}
                >
                  {showApiKey ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('ia')}>{t('configuration.edit')}</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('ia')}>{t('configuration.restore_default')}</Button>
              </Stack>
            </Box>
          )}
          {/* Telemedicine Tab */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6">{t('configuration.telemedicine_settings')}</Typography><hr />
              <Typography>
                <b>{t('configuration.google_meet_api_key')}</b>: {settings?.telemedicine?.GOOGLE_MEET_KEY ?? ''}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('telemedicine')}>
                  {t('configuration.edit')}
                </Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('telemedicine')}>
                  {t('configuration.restore_default')}
                </Button>
              </Stack>
            </Box>
          )}
          {/* Email Section */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6">Email Settings</Typography><hr />
              <Typography><b>Service:</b> {settings?.email?.service ?? ''}</Typography>
              <Typography><b>From:</b> {settings?.email?.from ?? ''}</Typography>
              <Typography><b>Auth User:</b> {settings?.email?.auth?.user ?? ''}</Typography>
              <Typography><b>Auth Password:</b> {settings?.email?.auth?.pass ? "••••••••" : ""}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('email')}>Edit</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('email')}>Restore Default</Button>
              </Stack>
            </Box>
          )}
          {/* Cron Jobs Section */}
          {tab === 6 && (
            <Box>
              <Typography variant="h6">Cron Jobs</Typography><hr />
              {settings.cronJobs && settings.cronJobs.map((job, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography><b>Name:</b> {job.name}</Typography>
                  <Typography><b>Schedule:</b> {job.schedule}</Typography>
                  <Typography><b>Enabled:</b> {job.enabled ? "Yes" : "No"}</Typography>
                </Box>
              ))}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="info" onClick={() => openEdit('cronJobs')}>Edit</Button>
                <Button variant="contained" color="warning" onClick={() => restoreSection('cronJobs')}>Restore Default</Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Material-UI Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeEdit} maxWidth="md" fullWidth>
        <DialogTitle>{t('configuration.edit_settings')}</DialogTitle>
        <DialogContent>
          <EditDialogContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            {t('configuration.save')}
          </Button>
          <Button onClick={closeEdit} color="secondary">
            {t('configuration.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ConfigurationContent.propTypes = {};

ConfigurationContent.defaultProps = {};

export default ConfigurationContent

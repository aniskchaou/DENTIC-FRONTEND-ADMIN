import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { LinearProgress, TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Divider, IconButton, Menu, MenuItem, Box, Chip, Avatar } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BASE_URL from '../../main/urls/urls';

const initialForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  contactNumber: '',
  email: '',
  workingHours: {},
  doctorsAvailable: [],
};

const Clinic = () => {
  const { t } = useTranslation();
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const closeButtonAdd = useRef(null);
  const closeButtonEdit = useRef(null);

  const fetchClinics = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/clinics`)
      .then(res => setClinics(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const refresh = () => fetchClinics();

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const clinic = clinics.find(c => c.id === ids[0]);
      setSelectedClinic(clinic);
      setSelectedId(ids[0]);
    } else {
      setSelectedClinic(null);
      setSelectedId(null);
    }
  };

  const handleDelete = async () => {
    if (selectedId && window.confirm(t('clinic.confirm_delete'))) {
      try {
        await axios.delete(`${BASE_URL}/clinics/${selectedId}`);
        refresh();
        setSelectedClinic(null);
        setSelectedId(null);
        // Optionally show a success message (e.g., toast/snackbar)
      } catch (error) {
        // Optionally show an error message (e.g., toast/snackbar)
        console.error('Failed to delete clinic:', error);
      }
    }
  };

  // Create Clinic Feature
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddClinic = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${BASE_URL}/clinics`, form)
      .then(() => {
        setAddOpen(false);
        setForm(initialForm);
        refresh();
      })
      .finally(() => setLoading(false));
  };

  const handleViewClinic = (clinic) => {
    setSelectedClinic(clinic);
    setViewOpen(true);
  };

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleMenuEdit = () => {
    const clinic = clinics.find(c => c.id === menuRowId);
    setSelectedClinic(clinic);
    setForm(clinic); // Pre-fill form with clinic data
    setSelectedId(menuRowId);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    setSelectedId(menuRowId);
    handleDelete();
    handleMenuClose();
  };

  const handleMenuView = () => {
    const clinic = clinics.find(c => c.id === menuRowId);
    setSelectedClinic(clinic);
    setViewOpen(true);
    handleMenuClose();
  };

  // Edit Clinic handler
  const handleEditClinic = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`${BASE_URL}/clinics/${selectedId}`, form)
      .then(() => {
        setEditOpen(false);
        setForm(initialForm);
        refresh();
      })
      .finally(() => setLoading(false));
  };

  const columns = [
    { field: 'name', headerName: t('clinic.name'), width: 220 },
    { field: 'address', headerName: t('clinic.address'), width: 250 },
    {
      field: 'city',
      headerName: t('clinic.city'),
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'state',
      headerName: t('clinic.state'),
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="info" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    { 
      field: 'zipCode', 
      headerName: t('clinic.zip_code'), 
      width: 110 
    },
    {
      field: 'country',
      headerName: t('clinic.country'),
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color="success" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'contactNumber',
      headerName: t('clinic.contact_number'),
      width: 160,
      renderCell: (params) => (
        <Chip label={params.value} color="secondary" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'email',
      headerName: t('clinic.email'),
      width: 220,
      renderCell: (params) => (
        <Chip label={params.value} color="default" size="small" sx={{ fontWeight: 600 }} />
      )
    },
    {
      field: 'workingHours',
      headerName: t('clinic.working_hours'),
      width: 400,
      renderCell: (params) => {
        const wh = params.value || {};
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Object.entries(wh).map(([day, hours]) => (
              <Chip
                key={day}
                label={`${t(`clinic.day_${day.toLowerCase()}`)}: ${hours}`}
                color="primary"
                size="small"
                sx={{ mb: 0.5 }}
              />
            ))}
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: t('clinic.actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label={t('clinic.more')}
            aria-controls="clinic-row-menu"
            aria-haspopup="true"
            onClick={(e) => handleMenuOpen(e, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-clinic-medical"></i> {t('clinic.title')}</h4>
      </div>
      <div className="card-body">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<i className="far fa-plus-square"></i>}
          onClick={() => setAddOpen(true)}
          sx={{ mr: 1 }}
        >
          {t('clinic.create')}
        </Button>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 480, width: '100%', marginTop: 10 }}>
            <DataGrid
              rows={clinics}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Clinic Modal */}
        {addOpen && (
          <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
            <form onSubmit={handleAddClinic}>
              <DialogTitle>{t('clinic.create')}</DialogTitle>
              <DialogContent dividers>
                <Stack spacing={2}>
                  <TextField label={t('clinic.name')} name="name" value={form.name} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.address')} name="address" value={form.address} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.city')} name="city" value={form.city} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.state')} name="state" value={form.state} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.zip_code')} name="zipCode" value={form.zipCode} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.country')} name="country" value={form.country} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.contact_number')} name="contactNumber" value={form.contactNumber} onChange={handleFormChange} required fullWidth />
                  <TextField label={t('clinic.email')} name="email" value={form.email} onChange={handleFormChange} required fullWidth />
                  {/* Add more fields for workingHours and doctorsAvailable if needed */}
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button type="submit" variant="contained" color="success" disabled={loading}>
                  {loading ? t('clinic.saving') : t('clinic.create')}
                </Button>
                <Button variant="outlined" onClick={() => setAddOpen(false)} disabled={loading}>
                  {t('clinic.cancel')}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )}

        {/* View Clinic Modal */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                <i className="fas fa-clinic-medical" style={{ fontSize: 28, color: "#fff" }}></i>
              </Avatar>
              <Typography variant="h5" color="primary">{selectedClinic?.name || t('clinic.details')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedClinic ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('clinic.general_info')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>{t('clinic.address')}:</b> {selectedClinic.address}</Typography>
                    <Typography><b>{t('clinic.city')}:</b> {selectedClinic.city}</Typography>
                    <Typography><b>{t('clinic.state')}:</b> {selectedClinic.state}</Typography>
                    <Typography><b>{t('clinic.zip_code')}:</b> {selectedClinic.zipCode}</Typography>
                    <Typography><b>{t('clinic.country')}:</b> {selectedClinic.country}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('clinic.contact')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>{t('clinic.contact_number')}:</b> <Chip label={selectedClinic.contactNumber} color="info" /></Typography>
                    <Typography><b>{t('clinic.email')}:</b> <Chip label={selectedClinic.email} color="success" /></Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('clinic.working_hours')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      {selectedClinic.workingHours && Object.entries(selectedClinic.workingHours).map(([day, hours]) => (
                        <li key={day}>
                          <Chip label={`${t(`clinic.day_${day.toLowerCase()}`)}: ${hours}`} color="primary" sx={{ mr: 1, mb: 1 }} />
                        </li>
                      ))}
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <b>{t('clinic.created_at')}:</b> {selectedClinic.createdAt ? new Date(selectedClinic.createdAt).toLocaleString() : '-'}<br />
                      <b>{t('clinic.updated_at')}:</b> {selectedClinic.updatedAt ? new Date(selectedClinic.updatedAt).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Typography>{t('clinic.no_clinic_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="contained">
              {t('clinic.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Clinic Modal (MUI Dialog) */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <form onSubmit={handleEditClinic}>
            <DialogTitle>{t('clinic.edit')}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <TextField label={t('clinic.name')} name="name" value={form.name} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.address')} name="address" value={form.address} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.city')} name="city" value={form.city} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.state')} name="state" value={form.state} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.zip_code')} name="zipCode" value={form.zipCode} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.country')} name="country" value={form.country} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.contact_number')} name="contactNumber" value={form.contactNumber} onChange={handleFormChange} required fullWidth />
                <TextField label={t('clinic.email')} name="email" value={form.email} onChange={handleFormChange} required fullWidth />
                {/* Add more fields for workingHours and doctorsAvailable if needed */}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" color="info" disabled={loading}>
                {loading ? t('clinic.saving') : t('clinic.update')}
              </Button>
              <Button variant="outlined" onClick={() => setEditOpen(false)} disabled={loading}>
                {t('clinic.cancel')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Menu
          id="clinic-row-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuView}>{t('clinic.view')}</MenuItem>
          <MenuItem onClick={handleMenuEdit}>{t('clinic.edit')}</MenuItem>
          <MenuItem onClick={handleMenuDelete}>{t('clinic.delete')}</MenuItem>
        </Menu>

      </div>
    </div>
  );
};

export default Clinic;

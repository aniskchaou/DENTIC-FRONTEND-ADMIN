import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Medicament.css';
import { LoadJSFiles } from './../init';
import showMessage from '../../libraries/messages/messages';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import { Button, LinearProgress, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch, FormControlLabel, Menu, MenuItem, IconButton, Stack, Divider, Chip, Box, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddMedicament from './AddMedicament'; // <-- Import the AddMedicament component
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';

const Medicament = () => {
  const { t } = useTranslation();
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicaments, setSelectedMedicaments] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewMedicament, setViewMedicament] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editMedicament, setEditMedicament] = useState(null);

  useEffect(() => {
    LoadJSFiles();
    getAllMedicament();
  }, []);

  const getAllMedicament = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/medicaments.json')
        .then(res => res.json())
        .then(data => {
          setMedicaments(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', e.message, 'warning');
          setLoading(false);
        });
    } else {
      medicamentHTTPService.getAllMedicament()
        .then(response => {
          setMedicaments(response.data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', e.message, 'warning');
          setLoading(false);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMedicaments = medicaments.filter(medicament =>
    medicament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicament.producer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Producer', 'Category'],
      ...medicaments.map(m => [m.id, m.name, m.producer, m.group])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'medicaments.csv');
  };

  const handleBulkDelete = () => {
    setOpenConfirmDialog(true);
  };

  const confirmBulkDelete = () => {
    const axios = require('axios');
    const deletePromises = selectedMedicaments.map(id =>
      axios.delete(`http://localhost:5000/medicaments/${id}`)
        .then(() => {
          showMessage('Success', 'Medicament deleted successfully', 'success');
        })
        .catch(e => {
          showMessage('Error', e.message, 'warning');
        })
    );
    Promise.all(deletePromises).then(() => {
      getAllMedicament();
      setOpenConfirmDialog(false);
    });
  };

  const handleDuplicate = (row) => {
    const duplicate = { ...row, id: Date.now() };
    medicamentHTTPService.createMedicament(duplicate)
      .then(() => {
        showMessage('Success', 'Medicament duplicated successfully', 'success');
        getAllMedicament();
      })
      .catch(e => {
        showMessage('Error', e.message, 'warning');
      });
  };

  const toggleActive = (row) => {
    const updated = { ...row, active: !row.active };
    medicamentHTTPService.updateMedicament(updated)
      .then(() => {
        showMessage('Success', 'Medicament status updated successfully', 'success');
        getAllMedicament();
      })
      .catch(e => {
        showMessage('Error', e.message, 'warning');
      });
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split("\n").slice(1);
      rows.forEach(row => {
        const [id, name, producer, group] = row.split(",");
        const medicament = { id, name, producer, group };
        medicamentHTTPService.createMedicament(medicament)
          .then(() => getAllMedicament())
          .catch(e => showMessage('Error', e.message, 'warning'));
      });
    };
    reader.readAsText(file);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuAction = (action) => {
    if (action === 'view') handleView(selectedRow);
    if (action === 'edit') handleEdit(selectedRow);
    if (action === 'duplicate') handleDuplicate(selectedRow);
    if (action === 'toggle') toggleActive(selectedRow);
    if (action === 'delete') handleDelete(selectedRow); // <-- pass row, not just id
    if (action === 'archive') handleArchive(selectedRow);
    if (action === 'restore') handleRestore(selectedRow);
    if (action === 'history') handleViewHistory(selectedRow);
    handleMenuClose();
  };

  const handleView = (row) => {
    setViewMedicament(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setEditMedicament(row);
    setEditOpen(true);
  };

  const handleDelete = (row) => {
    if (window.confirm('Are you sure you want to delete this medicament?')) {
      const axios = require('axios');
      axios.delete(`${BASE_URL}/medicaments/${row.id}`)
        .then(() => {
          showMessage('Success', 'Medicament deleted successfully', 'success');
          getAllMedicament();
        })
        .catch(e => {
          showMessage('Error', e.message, 'warning');
        });
    }
  };

  const handleArchive = (row) => {
    showMessage('Info', `Archiving ${row.name}`, 'info');
    // Add logic to archive the medicament
  };

  const handleRestore = (row) => {
    showMessage('Info', `Restoring ${row.name}`, 'info');
    // Add logic to restore the medicament
  };

  const handleViewHistory = (row) => {
    showMessage('Info', `Viewing history for ${row.name}`, 'info');
    // Add logic to view the history of the medicament
  };

  const columns = [
    { field: 'name', headerName: t('medicament.name'), width: 150 },
    { field: 'genericName', headerName: t('medicament.generic_name'), width: 130 },
    { field: 'category', headerName: t('medicament.category'), width: 120 },
    {
      field: 'expirationDate',
      headerName: t('medicament.expiration'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={new Date(params.value).toLocaleDateString()}
          color="warning"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'status',
      headerName: t('medicament.status'),
      width: 100,
      renderCell: (params) => (
        <Chip
          label={t(`medicament.status_${params.value.toLowerCase()}`)}
          color={
            params.value === t('medicament.status_available')
              ? 'success'
              : params.value === t('medicament.status_expired')
              ? 'warning'
              : 'default'
          }
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    }, 
    {
      field: 'actions',
      headerName: t('medicament.actions'),
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => handleMenuOpen(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuAction('view')}>{t('medicament.view')}</MenuItem>
            <MenuItem onClick={() => handleMenuAction('edit')}>{t('medicament.edit')}</MenuItem>
            <MenuItem onClick={() => handleDelete(params.row)}>{t('medicament.delete')}</MenuItem>
          </Menu>
        </div>
      )
    }
  ];

  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> {t('medicament.title')}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setAddOpen(true)}
            startIcon={<i className="fas fa-plus"></i>}
          >
            {t('medicament.add')}
          </Button>
        </Stack>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={filteredMedicaments}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={(ids) => setSelectedMedicaments(ids)}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row.id || row.barcode || row.batchNumber}
            />
          </div>
        )}

        <Dialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t('medicament.add')}</DialogTitle>
          <DialogContent>
            <AddMedicament
              closeModal={() => setAddOpen(false)}
              onCreate={getAllMedicament}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">
              {t('medicament.close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t('medicament.edit')}</DialogTitle>
          <DialogContent>
            <AddMedicament
              closeModal={() => setEditOpen(false)}
              onCreate={getAllMedicament}
              initialData={editMedicament}
              isEdit={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">
              {t('medicament.close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 8,
              bgcolor: '#f5f7fa',
              p: 0
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <i className="fas fa-capsules" style={{ fontSize: 24, color: '#fff' }} />
              <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                {t('medicament.details')}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: 600, overflowY: 'auto', bgcolor: '#fff', px: { xs: 2, sm: 4 }, py: 3 }}>
            {viewMedicament ? (
              <Box sx={{ minWidth: 320 }}>
                {/* Basic Info Section */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={viewMedicament.name} color="primary" icon={<i className="fas fa-capsules"></i>} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewMedicament.genericName} color="info" icon={<i className="fas fa-flask"></i>} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewMedicament.category} color="success" icon={<i className="fas fa-tags"></i>} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={t(`medicament.status_${viewMedicament.status?.toLowerCase()}`)} color={viewMedicament.status === 'Available' ? 'success' : viewMedicament.status === 'Expired' ? 'warning' : 'default'} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`${t('medicament.expires')}: ${viewMedicament.expirationDate ? new Date(viewMedicament.expirationDate).toLocaleDateString() : '-'}`} color="warning" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {/* Stock & Manufacturer Section */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.stock')}</Typography>
                    <Chip label={viewMedicament.stockQuantity ?? '-'} color="info" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.price_per_unit')}</Typography>
                    <Chip label={viewMedicament.pricePerUnit ?? '-'} color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.manufacturer')}</Typography>
                    <Chip label={viewMedicament.manufacturerId || '-'} color="primary" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.batch')}</Typography>
                    <Chip label={viewMedicament.batchNumber || '-'} color="info" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.barcode')}</Typography>
                    <Chip label={viewMedicament.barcode || '-'} color="default" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.prescription')}</Typography>
                    <Chip label={viewMedicament.requiresPrescription ? t('medicament.yes') : t('medicament.no')} color={viewMedicament.requiresPrescription ? 'success' : 'default'} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 2 }} />
                {/* Dosage & Strength Section */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.dosage')}</Typography>
                    <Chip label={viewMedicament.dosageForm || '-'} color="default" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('medicament.strength')}</Typography>
                    <Chip label={viewMedicament.strength || '-'} color="info" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 2 }} />
                {/* Description Section */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.description')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.description || '-'}</Typography>
                <Divider sx={{ mb: 2 }} />
                {/* Active Ingredients Section */}
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.active_ingredients')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMedicament.activeIngredients || []).length > 0 ? (
                    viewMedicament.activeIngredients.map((ai, i) => (
                      <Chip
                        key={i}
                        label={`${ai.ingredient} (${ai.concentration})`}
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">{t('medicament.no_active_ingredients')}</Typography>
                  )}
                </Stack>
                {/* Side Effects Section */}
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.side_effects')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMedicament.sideEffects || []).length > 0 ? (
                    viewMedicament.sideEffects.map((s, i) => (
                      <Chip key={i} label={s} color="error" variant="outlined" size="small" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">{t('medicament.no_side_effects')}</Typography>
                  )}
                </Stack>
                {/* Contraindications Section */}
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.contraindications')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMedicament.contraindications || []).length > 0 ? (
                    viewMedicament.contraindications.map((c, i) => (
                      <Chip key={i} label={c} color="warning" variant="outlined" size="small" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">{t('medicament.no_contraindications')}</Typography>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {/* Usage Instructions & Storage Section */}
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.usage_instructions')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.usageInstructions || '-'}</Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t('medicament.storage_conditions')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.storageConditions || '-'}</Typography>
                <Divider sx={{ mb: 2 }} />
                {/* Timestamps Section */}
                <Typography variant="caption">
                  <b>{t('medicament.created_at')}</b> {viewMedicament.createdAt ? new Date(viewMedicament.createdAt).toLocaleString() : '-'}<br />
                  <b>{t('medicament.updated_at')}</b> {viewMedicament.updatedAt ? new Date(viewMedicament.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            ) : (
              <Typography>{t('medicament.no_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#f5f7fa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="contained" sx={{ fontWeight: 600 }}>
              {t('medicament.close')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>{t('medicament.confirm_delete')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('medicament.confirm_delete_text')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              {t('medicament.cancel')}
            </Button>
            <Button onClick={confirmBulkDelete} color="secondary">
              {t('medicament.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

Medicament.propTypes = {};
Medicament.defaultProps = {};

export default Medicament;

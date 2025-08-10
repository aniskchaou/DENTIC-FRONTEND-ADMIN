import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Medicament.css';
import { LoadJSFiles } from './../init';
import showMessage from '../../libraries/messages/messages';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import { Button, LinearProgress, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch, FormControlLabel, Menu, MenuItem, IconButton, Stack, Divider, Chip, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddMedicament from './AddMedicament'; // <-- Import the AddMedicament component

const Medicament = () => {
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

  useEffect(() => {
    LoadJSFiles();
    getAllMedicament();
  }, []);

  const getAllMedicament = () => {
    setLoading(true);
    medicamentHTTPService.getAllMedicament()
      .then(response => {
        setMedicaments(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', e.message, 'warning');
        setLoading(false);
      });
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
    selectedMedicaments.forEach(id => {
      medicamentHTTPService.removeMedicament(id)
        .then(() => {
          showMessage('Success', 'Medicament deleted successfully', 'success');
          getAllMedicament();
        })
        .catch(e => {
          showMessage('Error', e.message, 'warning');
        });
    });
    setOpenConfirmDialog(false);
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
    if (action === 'delete') handleDelete(selectedRow.id);
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
    showMessage('Info', `Editing ${row.name}`, 'info');
    // Add logic to open an edit modal or navigate to an edit page
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicament?')) {
      medicamentHTTPService.removeMedicament(id)
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
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'genericName', headerName: 'Generic Name', width: 130 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'expirationDate',
      headerName: 'Expiration',
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
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Available'
              ? 'success'
              : params.value === 'Expired'
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
      headerName: 'Actions',
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
            <MenuItem onClick={() => handleMenuAction('view')}>View</MenuItem>
            <MenuItem onClick={() => handleMenuAction('edit')}>Edit</MenuItem>
            <MenuItem onClick={() => handleMenuAction('delete')}>Delete</MenuItem>
          </Menu>
        </div>
      )
    }
  ];

  return (
    <div className={`card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> Medicaments
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setAddOpen(true)}
            startIcon={<i className="fas fa-plus"></i>}
          >
            Add Medicament
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
          <DialogTitle>Add Medicament</DialogTitle>
          <DialogContent>
            <AddMedicament
              closeModal={() => setAddOpen(false)}
              onCreate={getAllMedicament}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <i className="fas fa-capsules" style={{ color: '#1976d2', fontSize: 22 }} />
              Medicament Details
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            {viewMedicament ? (
              <Box
                sx={{
                  bgcolor: '#fafdff',
                  borderRadius: 2,
                  boxShadow: 1,
                  p: { xs: 2, sm: 3 },
                  minWidth: 320,
                  minHeight: 200,
                  mb: 2
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={viewMedicament.name} color="primary" icon={<i className="fas fa-capsules"></i>} sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewMedicament.genericName} color="info" icon={<i className="fas fa-flask"></i>} sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewMedicament.category} color="success" icon={<i className="fas fa-tags"></i>} sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={viewMedicament.status} color={viewMedicament.status === 'Available' ? 'success' : viewMedicament.status === 'Expired' ? 'warning' : 'default'} sx={{ fontWeight: 600, fontSize: 15 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Dosage: ${viewMedicament.dosageForm || '-'}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Strength: ${viewMedicament.strength || '-'}`} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Manufacturer: ${viewMedicament.manufacturerId || '-'}`} color="primary" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Batch: ${viewMedicament.batchNumber || '-'}`} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Barcode: ${viewMedicament.barcode || '-'}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Stock: ${viewMedicament.stockQuantity ?? '-'}`} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Price/Unit: ${viewMedicament.pricePerUnit ?? '-'}`} color="success" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Expires: ${viewMedicament.expirationDate ? new Date(viewMedicament.expirationDate).toLocaleDateString() : '-'}`} color="warning" sx={{ fontWeight: 600, fontSize: 15 }} />
                  <Chip label={`Prescription: ${viewMedicament.requiresPrescription ? 'Yes' : 'No'}`} color={viewMedicament.requiresPrescription ? 'success' : 'default'} sx={{ fontWeight: 600, fontSize: 15 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Description:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.description || '-'}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Active Ingredients:
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
                    <Typography variant="body2" color="text.secondary">No active ingredients listed.</Typography>
                  )}
                </Stack>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Side Effects:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMedicament.sideEffects || []).length > 0 ? (
                    viewMedicament.sideEffects.map((s, i) => (
                      <Chip key={i} label={s} color="error" variant="outlined" size="small" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No side effects listed.</Typography>
                  )}
                </Stack>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Contraindications:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMedicament.contraindications || []).length > 0 ? (
                    viewMedicament.contraindications.map((c, i) => (
                      <Chip key={i} label={c} color="warning" variant="outlined" size="small" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No contraindications listed.</Typography>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Usage Instructions:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.usageInstructions || '-'}</Typography>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Storage Conditions:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{viewMedicament.storageConditions || '-'}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="caption">
                  <b>Created At:</b> {viewMedicament.createdAt ? new Date(viewMedicament.createdAt).toLocaleString() : '-'}<br />
                  <b>Updated At:</b> {viewMedicament.updatedAt ? new Date(viewMedicament.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            ) : (
              <Typography>No medicament selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the selected medicaments?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} color="secondary">
              Confirm
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

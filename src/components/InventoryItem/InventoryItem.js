import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Paper, LinearProgress, Button, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material'; // <-- Add Chip import
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddInventoryItem from './AddInventoryItem'; // Import at the top
import EditInventoryItem from './EditInventoryItem'; // Import EditInventoryItem
import CurrentUser from '../../main/config/user'; // Import DEMO_MODE
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

// Example demo data
const DEMO_ITEMS = [
  {
    id: 1,
    name: "Demo Item",
    category: "Consumables",
    quantity: 10,
    unit: "pcs",
    reorderLevel: 5,
    expiryDate: "2025-12-31",
    status: "In Stock",
    clinicId: 1,
    notes: "Demo notes"
  }
  // Add more demo items if needed
];

const DEMO_CLINICS = [
  {
    id: 1,
    name: "Demo Clinic"
  }
  // Add more demo clinics if needed
];

const InventoryItem = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (CurrentUser.DEMO_MODE) {
      setItems(DEMO_ITEMS);
      setLoading(false);
    } else {
      axios.get(`${BASE_URL}/inventory`)
        .then(res => setItems(res.data))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (CurrentUser.DEMO_MODE) {
      setClinics(DEMO_CLINICS);
    } else {
      axios.get(`${BASE_URL}/clinics`)
        .then(res => setClinics(res.data))
        .catch(() => setClinics([]));
    }
  }, []);

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleEdit = () => {
    setEditItem(actionRow);
    setEditModalOpen(true);
    handleActionClose();
  };

  const handleDelete = async () => {
    if (!actionRow) return;
    if (window.confirm(`Are you sure you want to delete "${actionRow.name}"?`)) {
      setLoading(true);
      try {
        await axios.delete(`${BASE_URL}/inventory/${actionRow.id}`);
        setItems(prev => prev.filter(item => item.id !== actionRow.id));
      } catch (err) {
        alert('Failed to delete item.');
      }
      setLoading(false);
    }
    handleActionClose();
  };

  const handleView = () => {
    setViewItem(actionRow);
    setViewModalOpen(true);
    handleActionClose();
  };

  // Add/Update Inventory Item
  const handleAddSuccess = async () => {
    // Refetch items after add to ensure IDs are present
    try {
      const res = await axios.get(`${BASE_URL}/inventory`);
      setItems(res.data);
    } catch {
      // fallback: do nothing or show error
    }
    setAddModalOpen(false);
  };

  // Fix for handleEditSuccess to avoid error if updatedItem is undefined/null
  const handleEditSuccess = (updatedItem) => {
    if (updatedItem && updatedItem.id !== undefined) {
      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }
    setEditModalOpen(false);
    setEditItem(null);
  };

  const columns = [
    { field: 'name', headerName: t('inventory.name'), width: 180 },
    { field: 'category', headerName: t('inventory.category'), width: 140 },
    {
      field: 'quantity',
      headerName: t('inventory.quantity'),
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 0 ? 'error' : params.value < 10 ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    { field: 'unit', headerName: t('inventory.unit'), width: 90 },
    { field: 'reorderLevel', headerName: t('inventory.reorder_level'), width: 120 },
    {
      field: 'expiryDate',
      headerName: t('inventory.expiry_date'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? new Date(params.value).toLocaleDateString() : '-'}
          color={params.value && new Date(params.value) < new Date() ? 'error' : 'info'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: t('inventory.status'),
      width: 110,
      renderCell: (params) => (
        <Chip
          label={t(`inventory.status_${params.value.replace(/\s/g, '_').toLowerCase()}`)}
          color={
            params.value === 'In Stock'
              ? 'success'
              : params.value === 'Low Stock'
              ? 'warning'
              : params.value === 'Out of Stock'
              ? 'error'
              : params.value === 'Expired'
              ? 'default'
              : 'primary'
          }
          size="small"
        />
      ),
    },
    {
      field: 'clinicId',
      headerName: t('inventory.clinic'),
      width: 220,
      valueGetter: (params) => {
        const clinic = clinics.find(c => c.id === params.value);
        return clinic ? clinic.name : params.value;
      }
    },
    {
      field: 'actions',
      headerName: t('inventory.actions'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label={t('inventory.more')}
            aria-controls="action-menu"
            aria-haspopup="true"
            onClick={(event) => handleActionClick(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    }
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          <Inventory2OutlinedIcon sx={{ mr: 1 }} />
          {t('inventory.title')}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddModalOpen(true)}
          sx={{ mb: 2 }}
        >
          <i className="fas fa-plus"></i> {t('inventory.create')}
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            background: "#fff",
            mb: 2,
            ml: 2,
            '&:hover': {
              borderColor: "#1565c0",
              background: "#e3f2fd",
              color: "#1565c0"
            }
          }}
          onClick={() => {
            setLoading(true);
            if (CurrentUser.DEMO_MODE) {
              setItems(DEMO_ITEMS);
              setLoading(false);
            } else {
              axios.get(`${BASE_URL}/inventory`)
                .then(res => setItems(res.data))
                .finally(() => setLoading(false));
            }
          }}
        >
          {t('inventory.refresh')}
        </Button>
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={items}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              components={{ Toolbar: GridToolbar }}
              getRowId={row => row.id}
            />
            <Menu
              id="action-menu"
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleView}>
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                {t('inventory.view')}
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                {t('inventory.edit')}
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                {t('inventory.delete')}
              </MenuItem>
            </Menu>
            {/* Add Inventory Item Modal */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>{t('inventory.create')}</DialogTitle>
              <DialogContent>
                <AddInventoryItem
                  closeModal={() => setAddModalOpen(false)}
                  onSuccess={handleAddSuccess}
                />
              </DialogContent>
            </Dialog>
            {/* Edit Inventory Item Modal */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>{t('inventory.edit')}</DialogTitle>
              <DialogContent>
                <EditInventoryItem
                  closeModal={() => setEditModalOpen(false)}
                  item={editItem}
                  clinics={clinics}
                  onSuccess={handleEditSuccess}
                />
              </DialogContent>
            </Dialog>
            {/* View Inventory Item Modal */}
            <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>
                <Inventory2OutlinedIcon sx={{ mr: 1, color: "#1976d2" }} />
                <span style={{ color: "#1976d2", fontWeight: 700 }}>{t('inventory.details')}</span>
              </DialogTitle>
              <DialogContent>
                {viewItem && (
                  <Box
                    sx={{
                      p: 2,
                      background: "#f5faff",
                      borderRadius: 2,
                      boxShadow: 2,
                      border: "1px solid #90caf9",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}>
                      {viewItem.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Chip label={`${t('inventory.id')}: ${viewItem.id}`} color="primary" />
                      <Chip label={`${t('inventory.category')}: ${viewItem.category}`} color="info" />
                      <Chip label={`${t('inventory.unit')}: ${viewItem.unit}`} color="default" />
                      <Chip label={`${t('inventory.status')}: ${t(`inventory.status_${viewItem.status.replace(/\s/g, '_').toLowerCase()}`)}`} color={
                        viewItem.status === 'In Stock'
                          ? 'success'
                          : viewItem.status === 'Low Stock'
                          ? 'warning'
                          : viewItem.status === 'Out of Stock'
                          ? 'error'
                          : viewItem.status === 'Expired'
                          ? 'default'
                          : 'primary'
                      } />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography><strong>{t('inventory.quantity')}:</strong> {viewItem.quantity}</Typography>
                      <Typography><strong>{t('inventory.reorder_level')}:</strong> {viewItem.reorderLevel}</Typography>
                      <Typography>
                        <strong>{t('inventory.expiry_date')}:</strong> {viewItem.expiryDate ? new Date(viewItem.expiryDate).toLocaleDateString() : '-'}
                      </Typography>
                      <Typography>
                        <strong>{t('inventory.clinic')}:</strong> {
                          (() => {
                            const clinic = clinics.find(c => c.id === viewItem.clinicId);
                            return clinic ? clinic.name : viewItem.clinicId;
                          })()
                        }
                      </Typography>
                      <Typography sx={{ mt: 1 }}>
                        <strong>{t('inventory.notes')}:</strong> {viewItem.notes || <span style={{ color: "#aaa" }}>{t('inventory.no_notes')}</span>}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Paper>
    </Box>
  );
};

export default InventoryItem;
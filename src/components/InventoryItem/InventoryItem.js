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
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'category', headerName: 'Category', width: 140 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 0 ? 'error' : params.value < 10 ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    { field: 'unit', headerName: 'Unit', width: 90 },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 120 },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
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
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
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
      headerName: 'Clinic',
      width: 220,
      valueGetter: (params) => {
        const clinic = clinics.find(c => c.id === params.value);
        return clinic ? clinic.name : params.value;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
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
          Inventory Items
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddModalOpen(true)}
          sx={{ mb: 2 }}
        >
          <i className="fas fa-plus"></i> Create Inventory Item
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
          Refresh
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
                View
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                Delete
              </MenuItem>
            </Menu>
            {/* Add Inventory Item Modal */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Create Inventory Item</DialogTitle>
              <DialogContent>
                <AddInventoryItem
                  closeModal={() => setAddModalOpen(false)}
                  onSuccess={handleAddSuccess}
                />
              </DialogContent>
            </Dialog>
            {/* Edit Inventory Item Modal */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogContent>
                <EditInventoryItem
                  closeModal={() => setEditModalOpen(false)}
                  item={editItem} // <-- Pass selected object here!
                  clinics={clinics}
                  onSuccess={handleEditSuccess}
                />
              </DialogContent>
            </Dialog>
            {/* View Inventory Item Modal */}
            <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>
                <Inventory2OutlinedIcon sx={{ mr: 1, color: "#1976d2" }} />
                <span style={{ color: "#1976d2", fontWeight: 700 }}>Inventory Item Details</span>
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
                      <Chip label={`ID: ${viewItem.id}`} color="primary" />
                      <Chip label={`Category: ${viewItem.category}`} color="info" />
                      <Chip label={`Unit: ${viewItem.unit}`} color="default" />
                      <Chip label={`Status: ${viewItem.status}`} color={
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
                      <Typography><strong>Quantity:</strong> {viewItem.quantity}</Typography>
                      <Typography><strong>Reorder Level:</strong> {viewItem.reorderLevel}</Typography>
                      <Typography>
                        <strong>Expiry Date:</strong> {viewItem.expiryDate ? new Date(viewItem.expiryDate).toLocaleDateString() : '-'}
                      </Typography>
                      <Typography>
                        <strong>Clinic:</strong> {
                          (() => {
                            const clinic = clinics.find(c => c.id === viewItem.clinicId);
                            return clinic ? clinic.name : viewItem.clinicId;
                          })()
                        }
                      </Typography>
                      <Typography sx={{ mt: 1 }}>
                        <strong>Notes:</strong> {viewItem.notes || <span style={{ color: "#aaa" }}>No notes</span>}
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
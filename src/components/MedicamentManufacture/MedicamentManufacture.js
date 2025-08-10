import React, { useEffect, useRef, useState } from 'react';
import './MedicamentManufacture.css';
import { LoadJSFiles } from '../init';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import AddMedicamentManufacture from './AddMedicamentManufacture';
import EditMedicamentManufacture from '../EditMedicamentManufacture/EditMedicamentManufacture';
import { Button, Chip, LinearProgress, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Box, Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

const MedicamentManufacture = () => {
  const [medicamentManufactures, setMedicamentManufactures] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);

  useEffect(() => {
    LoadJSFiles();
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    medicamentManufactureHTTPService.getAllMedicamentManufacture()
      .then(response => {
        // Ensure every row has a unique id
        const formatted = response.data.map((item, index) => ({
          ...item,
          id: item.id ? item.id : (item.barcode ? item.barcode : index + 1) // Use id, else barcode, else index
        }));
        setMedicamentManufactures(formatted);
        setLoading(false);
      })
      .catch(() => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        setLoading(false);
      });
  };

  const handleRowSelection = (ids) => {
    setUpdatedItemIds(ids);
    if (ids.length === 1) {
      const selected = medicamentManufactures.find(item => item.id === ids[0]);
      setUpdatedItemId(ids[0]);
      setUpdatedItem(selected || {});
    }
  };

  const removeMedicamentManufactureAction = (e, ids) => {
    e.preventDefault();
    if (!ids.length) return;
    if (window.confirm("Etes-vous sûr que vous voulez supprimer ?")) {
      // You may want to loop and delete each or support batch delete
      medicamentManufactureHTTPService.removeMedicamentManufacture(ids[0])
        .then(() => {
          fetchData();
          showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success');
        }).catch(() => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        });
    }
  };

  const closeModalEdit = () => {
    fetchData();
    closeButtonEdit.current.click();
  };

  const closeModalAdd = () => {
    fetchData();
    closeButtonAdd.current.click();
  };

  // Update actions menu for View
  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => { setAnchorEl(event.currentTarget); setSelectedRow(params.row); }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => {
          setViewItem(params.row);
          setViewOpen(true);
          setAnchorEl(null);
        }}>View</MenuItem>
        <MenuItem onClick={() => {/* Edit logic */}}>Edit</MenuItem>
        <MenuItem onClick={() => {/* Delete logic */}}>Delete</MenuItem>
      </Menu>
    </div>
  );

  // Columns for MedicamentManufacture table (delete id column, add chip for status, add actions column)
  const columns = [
    // { field: 'id', headerName: '#', width: 60 }, // deleted
    { field: 'name', headerName: 'Manufacture', width: 150 },
    { field: 'licenseNumber', headerName: 'License No.', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Active'
              ? 'success'
              : params.value === 'Inactive'
              ? 'default'
              : 'warning'
          }
          size="small"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'website',
      headerName: 'Website',
      width: 180,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      )
    },
    {
      field: 'contactPerson',
      headerName: 'Contact',
      width: 230,
      renderCell: (params) => {
        const cp = params.row.contactPerson;
        return cp ? (
          <div>
            <div><strong>{cp.fullName}</strong></div>
            <div>{cp.email}</div>
            <div>{cp.phone}</div>
          </div>
        ) : 'N/A';
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 300,
      renderCell: (params) => {
        const addr = params.row.address;
        return addr ? `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} ${addr.postalCode}` : 'N/A';
      }
    },
    {
      field: 'certifications',
      headerName: 'Certifications',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(params.row.certifications || []).map((cert, i) => (
            <Chip key={i} label={cert} color="warning" variant="outlined" size="small" sx={{ mb: 0.5 }} />
          ))}
        </Box>
      )
    },
    {
      field: 'medicamentsSupplied',
      headerName: 'Medicaments',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(params.row.medicamentsSupplied || []).map((med, i) => (
            <Chip key={i} label={`${med.name} (${med.batchNumber})`} color="success" variant="outlined" size="small" sx={{ mb: 0.5 }} />
          ))}
        </Box>
      )
    },
    {
      field: 'contractStartDate',
      headerName: 'Start Date',
      width: 120,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'contractEndDate',
      headerName: 'End Date',
      width: 120,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 160,
      valueGetter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: renderActionsMenu
    }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> Medicaments Manufactures
        </Typography>

        <Button
          type="button"
          data-toggle="modal"
          data-target="#addModal"
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-plus"></i> Create
        </Button>
        <Button
          type="button"
          data-toggle="modal"
          data-target="#editModal"
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-edit"></i> Edit
        </Button>
        <Button
          onClick={e => removeMedicamentManufactureAction(e, updatedItemIds)}
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-trash-alt"></i> Remove
        </Button>
        <Button
          onClick={fetchData}
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-refresh"></i> Reload
        </Button>

        <br /><br />
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={medicamentManufactures}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Modal */}
        <div className="modal fade" id="addModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Manufacture</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddMedicamentManufacture closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button type="button" ref={closeButtonAdd} className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="editModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Manufacture</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditMedicamentManufacture medicamentManufacture={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div className="modal-footer">
                <button type="button" ref={closeButtonEdit} className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-industry" style={{ color: '#1976d2', fontSize: 22 }} />
              Manufacture Details
            </span>
          </DialogTitle>
          <DialogContent>
            {viewItem ? (
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
                  <Chip
                    label={viewItem.status}
                    color={viewItem.status === 'Active' ? 'success' : viewItem.status === 'Inactive' ? 'default' : 'warning'}
                    icon={<i className="fas fa-check-circle"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`License: ${viewItem.licenseNumber || '-'}`}
                    color="info"
                    icon={<i className="fas fa-id-card"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`Phone: ${viewItem.phone || '-'}`}
                    color="primary"
                    icon={<i className="fas fa-phone"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`Email: ${viewItem.email || '-'}`}
                    color="primary"
                    icon={<i className="fas fa-envelope"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  General Info:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Name: ${viewItem.name || '-'}`}
                    color="default"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`Website: ${viewItem.website || '-'}`}
                    color="info"
                    icon={<i className="fas fa-globe"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                    component="a"
                    href={viewItem.website}
                    target="_blank"
                    clickable={!!viewItem.website}
                  />
                </Stack>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Contact Person:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={viewItem.contactPerson?.fullName || '-'}
                    color="primary"
                    icon={<i className="fas fa-user"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={viewItem.contactPerson?.email || '-'}
                    color="info"
                    icon={<i className="fas fa-envelope"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={viewItem.contactPerson?.phone || '-'}
                    color="success"
                    icon={<i className="fas fa-phone"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Address:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {viewItem.address
                    ? `${viewItem.address.street}, ${viewItem.address.city}, ${viewItem.address.state}, ${viewItem.address.country} ${viewItem.address.postalCode}`
                    : '-'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Certifications:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewItem.certifications || []).length > 0 ? (
                    viewItem.certifications.map((cert, i) => (
                      <Chip key={i} label={cert} color="warning" variant="outlined" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No certifications listed.</Typography>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Medicaments Supplied:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewItem.medicamentsSupplied || []).length > 0 ? (
                    viewItem.medicamentsSupplied.map((med, i) => (
                      <Chip key={i} label={`${med.name} (${med.batchNumber})`} color="success" variant="outlined" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No medicaments listed.</Typography>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Contract Start: ${viewItem.contractStartDate ? new Date(viewItem.contractStartDate).toLocaleDateString() : '-'}`}
                    color="info"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`Contract End: ${viewItem.contractEndDate ? new Date(viewItem.contractEndDate).toLocaleDateString() : '-'}`}
                    color="warning"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`Created: ${viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : '-'}`}
                    color="default"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
              </Box>
            ) : (
              <Typography>No manufacture selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="secondary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};
export default MedicamentManufacture;

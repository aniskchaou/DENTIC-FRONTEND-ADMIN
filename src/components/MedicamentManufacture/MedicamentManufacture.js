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
import { useTranslation } from 'react-i18next';

const MedicamentManufacture = () => {
  const { t } = useTranslation();
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

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/medicament-manufactures.json')
        .then(res => res.json())
        .then(data => {
          // Ensure every row has a unique id
          const formatted = data.map((item, index) => ({
            ...item,
            id: item.id ? item.id : (item.barcode ? item.barcode : index + 1)
          }));
          setMedicamentManufactures(formatted);
          setLoading(false);
        })
        .catch(() => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    } else {
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
    }
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

  const handleEditMedicamentManufacture = (row) => {
    setUpdatedItem(row);
    setUpdatedItemId(row.id);
    // Open the edit modal (React Dialog recommended)
    document.querySelector('[data-target="#editModal"]').click();
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
        }}>{t('manufacture.view')}</MenuItem>
        <MenuItem onClick={() => {
          handleEditMedicamentManufacture(params.row);
          setAnchorEl(null);
        }}>{t('manufacture.edit')}</MenuItem>
        <MenuItem onClick={() => {
          removeMedicamentManufactureAction({ preventDefault: () => {} }, [params.row.id]);
          setAnchorEl(null);
        }}>{t('manufacture.delete')}</MenuItem>
      </Menu>
    </div>
  );

  // Columns for MedicamentManufacture table (delete id column, add chip for status, add actions column)
  const columns = [
    { field: 'name', headerName: t('manufacture.name'), width: 150 },
    { field: 'licenseNumber', headerName: t('manufacture.license_number'), width: 130 },
    {
      field: 'status',
      headerName: t('manufacture.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`manufacture.status_${params.value?.toLowerCase()}`)}
          color={
            params.value === t('manufacture.status_active')
              ? 'success'
              : params.value === t('manufacture.status_inactive')
              ? 'default'
              : 'warning'
          }
          size="small"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { field: 'phone', headerName: t('manufacture.phone'), width: 140 },
    { field: 'email', headerName: t('manufacture.email'), width: 200 },
    {
      field: 'website',
      headerName: t('manufacture.website'),
      width: 180,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      )
    },
    {
      field: 'contractStartDate',
      headerName: t('manufacture.contract_start'),
      width: 120,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'contractEndDate',
      headerName: t('manufacture.contract_end'),
      width: 120,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: t('manufacture.actions'),
      width: 120,
      renderCell: renderActionsMenu
    }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> {t('manufacture.title')}
        </Typography>

        <Button
          type="button"
          data-toggle="modal"
          data-target="#addModal"
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-plus"></i> {t('manufacture.create')}
        </Button>
        <Button
          type="button"
          data-toggle="modal"
          data-target="#editModal"
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-edit"></i> {t('manufacture.edit')}
        </Button>
        <Button
          onClick={e => removeMedicamentManufactureAction(e, updatedItemIds)}
          variant="outlined"
          color="primary"
          sx={{ mr: 1, mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-trash-alt"></i> {t('manufacture.remove')}
        </Button>
        <Button
          onClick={fetchData}
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          <i className="fas fa-refresh"></i> {t('manufacture.reload')}
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
                <h5 className="modal-title">{t('manufacture.new')}</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddMedicamentManufacture closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button type="button" ref={closeButtonAdd} className="btn btn-secondary" data-dismiss="modal">{t('manufacture.close')}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="editModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('manufacture.edit')}</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditMedicamentManufacture
                  medicamentManufacture={updatedItem}
                  closeModal={closeModalEdit}
                />
              </div>
              <div className="modal-footer">
                <button type="button" ref={closeButtonEdit} className="btn btn-secondary" data-dismiss="modal">{t('manufacture.close')}</button>
              </div>
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-industry" style={{ color: '#1976d2', fontSize: 22 }} />
              {t('manufacture.details')}
            </span>
          </DialogTitle>
          <DialogContent>
            {viewItem ? (
              <Box
                sx={{
                  bgcolor: '#fafdff',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  minWidth: 320,
                  minHeight: 200,
                  mb: 2
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={t(`manufacture.status_${viewItem.status?.toLowerCase()}`)}
                    color={viewItem.status === 'Active' ? 'success' : viewItem.status === 'Inactive' ? 'default' : 'warning'}
                    icon={<i className="fas fa-check-circle"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.license')}: ${viewItem.licenseNumber || '-'}`}
                    color="info"
                    icon={<i className="fas fa-id-card"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.phone')}: ${viewItem.phone || '-'}`}
                    color="primary"
                    icon={<i className="fas fa-phone"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.email')}: ${viewItem.email || '-'}`}
                    color="primary"
                    icon={<i className="fas fa-envelope"></i>}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {t('manufacture.general_info')}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${t('manufacture.name')}: ${viewItem.name || '-'}`}
                    color="default"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.website')}: ${viewItem.website || '-'}`}
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
                  {t('manufacture.contact_person')}
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
                  {t('manufacture.address')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {viewItem.address
                    ? `${viewItem.address.street}, ${viewItem.address.city}, ${viewItem.address.state}, ${viewItem.address.country} ${viewItem.address.postalCode}`
                    : '-'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  {t('manufacture.certifications')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  {t('manufacture.medicaments_supplied')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewItem.medicamentsSupplied || []).length > 0 ? (
                    viewItem.medicamentsSupplied.map((med, i) => (
                      <Chip key={i} label={`${med.name} (${med.batchNumber})`} color="success" variant="outlined" sx={{ mb: 1 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">{t('manufacture.no_medicaments')}</Typography>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${t('manufacture.contract_start')}: ${viewItem.contractStartDate ? new Date(viewItem.contractStartDate).toLocaleDateString() : '-'}`}
                    color="info"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.contract_end')}: ${viewItem.contractEndDate ? new Date(viewItem.contractEndDate).toLocaleDateString() : '-'}`}
                    color="warning"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('manufacture.created_at')}: ${viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : '-'}`}
                    color="default"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
              </Box>
            ) : (
              <Typography>{t('manufacture.no_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="secondary" variant="outlined">
              {t('manufacture.close')}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};
export default MedicamentManufacture;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DataGrid, GridToolbar
} from '@mui/x-data-grid';
import {
  LinearProgress, IconButton, Menu, MenuItem, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Drawer, TextField, Select, InputLabel, FormControl, Box, Snackbar, Alert, Tooltip, useMediaQuery,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RefreshIcon from '@mui/icons-material/Refresh';
import BASE_URL from '../../main/urls/urls';
import AddEquipmentMaintenance from './AddEquipmentMaintenance';
import EditEquipmentMaintenance from './EditEquipmentMaintenance';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';

const statusColors = {
  'In Service': 'success',
  'Out of Service': 'error',
  'Maintenance Due': 'warning',
  'In Maintenance': 'info',
  'Retired': 'default',
};

const EquipmentMaintenance = () => {
  const { t } = useTranslation();
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Feature states
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTechnician, setFilterTechnician] = useState('');
  const [filterClinic, setFilterClinic] = useState('');
  const [bulkSelection, setBulkSelection] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEquipment, setEditEquipment] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEquipment, setViewEquipment] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchData();
    // Fetch clinics for displaying full name
    axios.get(`${BASE_URL}/clinics`)
      .then(res => setClinics(res.data))
      .catch(() => setClinics([]));
  }, []);

  // Fetch technicians with role TECHNICAL
  useEffect(() => {
    axios.get(`${BASE_URL}/users`)
      .then(res => {
        const technicalUsers = res.data.filter(u => u.role?.toUpperCase() === 'TECHNICAL');
        setTechnicians(technicalUsers);
      })
      .catch(() => setTechnicians([]));
  }, []);

  const fetchData = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/equipement.json')
        .then(res => res.json())
        .then(data => {
          setMaintenanceData(data);
          setLoading(false);
        })
        .catch(() => {
          setMaintenanceData([]);
          setLoading(false);
        });
    } else {
      axios.get(`${BASE_URL}/equipment`)
        .then((res) => setMaintenanceData(res.data))
        .finally(() => setLoading(false));
    }
  };

  const getClinicName = (id) => {
    const c = clinics.find(cl => cl.id === id);
    return c ? c.name : id;
  };

  // --- Actions ---
  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleEdit = () => {
    setEditEquipment(actionRow);
    setEditDialogOpen(true);
    handleActionClose();
  };

  const handleDelete = async () => {
    if (!actionRow) return;
    if (!window.confirm(`Are you sure you want to delete equipment "${actionRow.equipmentName}"?`)) {
      handleActionClose();
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/equipment/${actionRow.id}`);
      setNotification({ open: true, message: t('equipment.deleted_success'), severity: 'success' });
      fetchData();
    } catch (err) {
      setNotification({ open: true, message: t('equipment.delete_failed'), severity: 'error' });
    } finally {
      setLoading(false);
      handleActionClose();
    }
  };

  const handleViewHistory = () => {
    setSelectedHistory(actionRow.maintenanceHistory || []);
    setHistoryDrawerOpen(true);
    handleActionClose();
  };

  const handleScheduleMaintenance = () => {
    setScheduleDialogOpen(true);
    handleActionClose();
  };

  const handleAssignTechnician = () => {
    setAssignDialogOpen(true);
    handleActionClose();
  };

  const handleFileDialog = () => {
    setFileDialogOpen(true);
    handleActionClose();
  };

  const handleQrDialog = () => {
    setQrDialogOpen(true);
    handleActionClose();
  };

  const handleAddDialog = () => {
    setAddDialogOpen(true);
    handleActionClose();
  };

  const handleView = () => {
    setViewEquipment(actionRow);
    setViewDialogOpen(true);
    handleActionClose();
  };

  // --- Bulk Actions ---
  const handleBulkDelete = () => {
    setNotification({ open: true, message: `Deleted ${bulkSelection.length} items`, severity: 'success' });
    // Implement backend call
  };

  const handleBulkStatusUpdate = (status) => {
    setNotification({ open: true, message: `Updated status for ${bulkSelection.length} items`, severity: 'success' });
    // Implement backend call
     handleAddMaintenance()
  };

  // --- Export/Import ---
  const handleExport = () => {
    setNotification({ open: true, message: 'Exported equipment data (CSV/Excel)', severity: 'success' });
    // Implement export logic
  };

  const handleImport = (e) => {
    setNotification({ open: true, message: 'Imported equipment data', severity: 'success' });
    // Implement import logic
  };

  // --- Add Maintenance ---
  const maintenanceTypes = [
    'Routine Check',
    'Repair',
    'Calibration',
    'Cleaning',
    'Software Update',
    'Other'
  ];

  const handleAddMaintenance = async () => {
    if (!selectedEquipment) return;
    setLoading(true);
    try {
      const newHistory = [
        ...(selectedEquipment.maintenanceHistory || []),
        {
          date: maintenanceDate,
          type: maintenanceType,
          notes: maintenanceNotes
        }
      ];
      await axios.put(`${BASE_URL}/equipments/${selectedEquipment.id}`, {
        ...selectedEquipment,
        maintenanceHistory: newHistory,
        status: 'In Maintenance' // <-- Set status to "In Maintenance"
      });
      setNotification({ open: true, message: 'Maintenance record added.', severity: 'success' });
      fetchData();
    } catch (err) {
      setNotification({ open: true, message: 'Failed to add maintenance record.', severity: 'error' });
    } finally {
      setLoading(false);
      setMaintenanceDialogOpen(false);
      setMaintenanceDate('');
      setMaintenanceType('');
      setMaintenanceNotes('');
    }
  };

  const handleAddMaintenanceDialog = () => {
    setSelectedEquipment(actionRow);
    setMaintenanceDialogOpen(true);
    handleActionClose();
  };

  // --- Search/Filter ---
  const filteredData = maintenanceData.filter(row =>
    (!search || row.equipmentName?.toLowerCase().includes(search.toLowerCase()))
    && (!filterStatus || row.status === filterStatus)
    && (!filterTechnician || row.assignedTechnician === filterTechnician)
    && (!filterClinic || row.clinicId === filterClinic)
  );

  // --- Status/Date Alerts ---
  const isOverdue = (row) => {
    if (!row.nextServiceDue) return false;
    return new Date(row.nextServiceDue) < new Date() && row.status !== 'Retired';
  };

  // --- Columns ---
  const columns = [
    {
      field: 'clinicId',
      headerName: t('equipment.clinic'),
      width: isMobile ? 120 : 230,
      renderCell: (params) => getClinicName(params.value)
    },
    { field: 'equipmentName', headerName: t('equipment.name'), width: isMobile ? 100 : 180 },
    { field: 'modelNumber', headerName: t('equipment.model_number'), width: isMobile ? 80 : 130 },
    { field: 'manufacturer', headerName: t('equipment.manufacturer'), width: isMobile ? 90 : 150 },
    {
      field: 'purchaseDate',
      headerName: t('equipment.purchase_date'),
      width: isMobile ? 90 : 140,
      renderCell: (params) => dateChip(params.value, 'info')
    },
    {
      field: 'lastServiceDate',
      headerName: t('equipment.last_service_date'),
      width: isMobile ? 90 : 140,
      renderCell: (params) => dateChip(params.value, 'success')
    },
    {
      field: 'nextServiceDue',
      headerName: t('equipment.next_service_due'),
      width: isMobile ? 100 : 150,
      renderCell: (params) => (
        <Tooltip title={isOverdue(params.row) ? t('equipment.overdue') : ''}>
          <span>
            {dateChip(params.value, isOverdue(params.row) ? 'error' : 'warning')}
            {isOverdue(params.row) && <Chip label={t('equipment.overdue')} color="error" size="small" sx={{ ml: 1 }} />}
          </span>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: t('equipment.status'),
      width: isMobile ? 90 : 140,
      renderCell: (params) => (
        <Chip
          label={t(`equipment.status_${params.value.replace(/\s/g, '_').toLowerCase()}`)}
          color={statusColors[params.value] || 'default'}
          size="small"
          variant={isOverdue(params.row) ? 'filled' : 'outlined'}
        />
      )
    },
    {
      field: 'actions',
      headerName: t('equipment.actions'),
      width: isMobile ? 60 : 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label={t('equipment.more')}
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

  function dateChip(value, color = 'default') {
    return value ? (
      <Chip
        label={new Date(value).toLocaleDateString()}
        color={color}
        size="small"
        variant="outlined"
      />
    ) : '';
  }

  // --- Responsive Box ---
  const containerSx = isMobile
    ? { p: 1, width: '100vw', maxWidth: '100vw', bgcolor: '#fff' } // <-- add bgcolor
    : { p: 3, maxWidth: 1200, mx: 'auto', bgcolor: '#fff' };       // <-- add bgcolor

  return (
    <Box sx={containerSx}>
      <div className="card-header" style={{ marginBottom: 24 }}>
        <h4><i className="fas fa-tools"></i> {t('equipment.title')}</h4>
      </div>
      <Box
        sx={{
          mb: 2,
          mt: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center'
        }}
      >
        <TextField
          label={t('equipment.search')}
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t('equipment.status')}</InputLabel>
          <Select
            value={filterStatus}
            label={t('equipment.status')}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">{t('equipment.all_status')}</MenuItem>
            {Object.keys(statusColors).map(s => (
              <MenuItem key={s} value={s}>{t(`equipment.status_${s.replace(/\s/g, '_').toLowerCase()}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t('equipment.technician')}</InputLabel>
          <Select
            value={filterTechnician}
            label={t('equipment.technician')}
            onChange={e => setFilterTechnician(e.target.value)}
          >
            <MenuItem value="">{t('equipment.all_technicians')}</MenuItem>
            {/* {technicians.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))} */}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
          onClick={handleExport}
        >
          {t('equipment.export')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
          onClick={handleBulkDelete}
          disabled={bulkSelection.length === 0}
        >
          {t('equipment.delete_selected')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
          onClick={() => handleBulkStatusUpdate('In Maintenance')}
          disabled={bulkSelection.length === 0}
        >
          {t('equipment.mark_in_maintenance')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
          onClick={() => setAddDialogOpen(true)}
        >
          <i className="fas fa-plus" style={{ marginRight: 8 }}></i> {t('equipment.create')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          sx={{ minWidth: 120, height: 40, fontWeight: 600 }}
          onClick={fetchData}
        >
          {t('equipment.reload')}
        </Button>
      </Box>
      <div className="card-body">
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: isMobile ? 400 : 600, width: '100%' }}>
            <DataGrid
              rows={filteredData}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={isMobile ? 5 : 10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
              onSelectionModelChange={setBulkSelection}
              sx={{
                '& .MuiDataGrid-row': {
                  bgcolor: (theme) => theme.palette.background.paper,
                },
                '& .MuiDataGrid-row.Mui-selected': {
                  bgcolor: (theme) => theme.palette.action.selected,
                },
              }}
            />
            <Menu
              id="action-menu"
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleEdit}>{t('equipment.edit')}</MenuItem>
              <MenuItem onClick={handleDelete}>{t('equipment.delete')}</MenuItem>
              <MenuItem onClick={handleView}>{t('equipment.view')}</MenuItem>
              <MenuItem onClick={handleScheduleMaintenance}>{t('equipment.schedule_maintenance')}</MenuItem>
              <MenuItem onClick={() => handleBulkStatusUpdate('In Maintenance')}>
                {t('equipment.mark_in_maintenance')}
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('equipment.schedule_maintenance')}</DialogTitle>
        <DialogContent>
          <TextField label={t('equipment.date')} type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('equipment.technician')}</InputLabel>
            <Select label={t('equipment.technician')}>
              {technicians.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.fullName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label={t('equipment.notes')} fullWidth margin="normal" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={() => { setScheduleDialogOpen(false); setNotification({ open: true, message: t('equipment.maintenance_scheduled'), severity: 'success' }); }}>{t('equipment.schedule')}</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance History Drawer */}
      <Drawer anchor="right" open={historyDrawerOpen} onClose={() => setHistoryDrawerOpen(false)}>
        <Box sx={{ width: isMobile ? 280 : 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>{t('equipment.maintenance_history')}</Typography>
          {selectedHistory.length === 0 ? (
            <Typography>{t('equipment.no_history')}</Typography>
          ) : (
            selectedHistory.map((h, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle2">{h.date ? new Date(h.date).toLocaleDateString() : '-'}</Typography>
                <Typography variant="body2">{t('equipment.technician')}: {h.technician || '-'}</Typography>
                <Typography variant="body2">{t('equipment.notes')}: {h.notes || '-'}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Drawer>

      {/* Assign Technician Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('equipment.assign_technician')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('equipment.technician')}</InputLabel>
            <Select label={t('equipment.technician')}>
              {/* {technicians.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))} */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={() => { setAssignDialogOpen(false); setNotification({ open: true, message: t('equipment.technician_assigned'), severity: 'success' }); }}>{t('equipment.assign')}</Button>
        </DialogActions>
      </Dialog>

      {/* File Attachment Dialog */}
      <Dialog open={fileDialogOpen} onClose={() => setFileDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('equipment.attach_file')}</DialogTitle>
        <DialogContent>
          <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
            {t('equipment.upload_file')}
            <input type="file" hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileDialogOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('equipment.qr_code')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <QrCodeIcon sx={{ fontSize: 80 }} />
          </Box>
          <Typography align="center" variant="caption">{t('equipment.scan_to_identify')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Add Equipment Maintenance Dialog */}
      <AddEquipmentMaintenance
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        technicians={[]}
        clinics={[]}
        onSuccess={fetchData}
      />

      {/* Edit Equipment Dialog */}
      <EditEquipmentMaintenance
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        equipment={editEquipment}
        technicians={[]}
        clinics={[]}
        onSuccess={fetchData}
      />

      {/* View Equipment Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="fas fa-tools" style={{ color: '#1976d2', fontSize: 24 }} />
            <span>{t('equipment.details')}</span>
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewEquipment ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                py: 2
              }}
            >
              <Box sx={{ flex: 1, minWidth: 260 }}>
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>
                  {viewEquipment.equipmentName}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <b>{t('equipment.clinic')}:</b> {getClinicName(viewEquipment.clinicId)}
                  </li>
                  <li>
                    <b>{t('equipment.model_number')}:</b> {viewEquipment.modelNumber || <span style={{ color: '#888' }}>-</span>}
                  </li>
                  <li>
                    <b>{t('equipment.manufacturer')}:</b> {viewEquipment.manufacturer || <span style={{ color: '#888' }}>-</span>}
                  </li>
                  <li>
                    <b>{t('equipment.purchase_date')}:</b> {viewEquipment.purchaseDate ? new Date(viewEquipment.purchaseDate).toLocaleDateString() : <span style={{ color: '#888' }}>-</span>}
                  </li>
                  <li>
                    <b>{t('equipment.last_service_date')}:</b> {viewEquipment.lastServiceDate ? new Date(viewEquipment.lastServiceDate).toLocaleDateString() : <span style={{ color: '#888' }}>-</span>}
                  </li>
                  <li>
                    <b>{t('equipment.next_service_due')}:</b> {viewEquipment.nextServiceDue ? new Date(viewEquipment.nextServiceDue).toLocaleDateString() : <span style={{ color: '#888' }}>-</span>}
                  </li>
                  <li>
                    <b>{t('equipment.status')}:</b>{' '}
                    <Chip
                      label={t(`equipment.status_${viewEquipment.status.replace(/\s/g, '_').toLowerCase()}`)}
                      color={statusColors[viewEquipment.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </li>
                </Box>
              </Box>
              <Box sx={{
                flex: 1,
                minWidth: 260,
                bgcolor: '#f5faff',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                boxShadow: 1
              }}>
                <Typography variant="subtitle1" sx={{ color: '#1976d2', mb: 1 }}>
                  {t('equipment.additional_info')}
                </Typography>
                <Box>
                  <b>{t('equipment.technician')}:</b> {viewEquipment.assignedTechnician || <span style={{ color: '#888' }}>-</span>}
                </Box>
                <Box>
                  <b>{t('equipment.notes')}:</b>
                  <Typography variant="body2" sx={{ color: '#444', mt: 0.5 }}>
                    {viewEquipment.maintenanceNotes || <span style={{ color: '#888' }}>{t('equipment.no_notes')}</span>}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>{t('equipment.no_equipment_selected')}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="secondary" variant="outlined">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onClose={() => setMaintenanceDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('equipment.add_maintenance')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('equipment.date')}
            type="date"
            value={maintenanceDate}
            onChange={e => setMaintenanceDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('equipment.type')}</InputLabel>
            <Select
              value={maintenanceType}
              label={t('equipment.type')}
              onChange={e => setMaintenanceType(e.target.value)}
            >
              {maintenanceTypes.map(type => (
                <MenuItem key={type} value={type}>{t(`equipment.maintenance_type_${type.replace(/\s/g, '_').toLowerCase()}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('equipment.notes')}
            value={maintenanceNotes}
            onChange={e => setMaintenanceNotes(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddMaintenance}
            disabled={!maintenanceDate || !maintenanceType}
            sx={{ fontWeight: 600, minWidth: 100 }}
          >
            {t('equipment.add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EquipmentMaintenance;

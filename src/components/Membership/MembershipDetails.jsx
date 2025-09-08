import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, IconButton, Menu, MenuItem, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateMembership from './CreateMembership';
import EditMembership from './EditMembership';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const planColors = {
  Premium: 'success',
  Standard: 'primary',
  Basic: 'default'
};

const statusColors = {
  Active: 'success',
  Inactive: 'default',
  Expired: 'warning',
  Cancelled: 'error'
};

const Memberships = () => {
  const { t } = useTranslation();
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Add state for view dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewMembership, setViewMembership] = useState(null);

  const closeButtonAdd = useRef(null);
  const closeButtonEdit = useRef(null);

  // Fetch memberships from /memberships endpoint
  const fetchMemberships = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/memberships`)
      .then(res => setMemberships(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const refresh = () => {
    fetchMemberships();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const membership = memberships.find(m => m.id === ids[0]);
      setSelectedMembership(membership);
      setSelectedMembershipId(ids[0]);
    } else {
      setSelectedMembership(null);
      setSelectedMembershipId(null);
    }
  };

  const handleDelete = () => {
    if (selectedMembershipId && window.confirm('Are you sure you want to delete this membership?')) {
      axios.delete(`${BASE_URL}/memberships/${selectedMembershipId}`)
        .then(() => refresh());
    }
  };

  // Actions menu handlers
  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  // Edit from actions menu
  const handleEditMenu = () => {
    setSelectedMembership(actionRow);
    setSelectedMembershipId(actionRow.id);
    document.querySelector('[data-target="#editMembershipModal"]').click();
    handleActionClose();
  };

  const handleDeleteRow = () => {
    if (actionRow && window.confirm('Are you sure you want to delete this membership?')) {
      axios.delete(`${BASE_URL}/memberships/${actionRow.id}`)
        .then(() => refresh());
    }
    handleActionClose();
  };

  const handleSuccess = () => {
    setOpen(false);
    // Optionally refresh memberships list here
  };

  // Add handler for view action
  const handleViewMenu = () => {
    setViewMembership(actionRow);
    setViewDialogOpen(true);
    handleActionClose();
  };

  const columns = [
    {
      field: 'membershipPlan',
      headerName: t('membership.plan'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={planColors[params.value] || 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'paymentStatus',
      headerName: t('membership.payment_status'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    { 
      field: 'benefits', 
      headerName: t('membership.benefits'), 
      width: 300,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {params.value?.map((b, i) => (
            <Chip key={i} label={b} size="small" variant="outlined" />
          ))}
        </Stack>
      )
    },
    {
      field: 'validityStart',
      headerName: t('membership.start_date'),
      width: 140,
      valueGetter: (params) => params.row.validityPeriod?.startDate,
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={new Date(params.value).toLocaleDateString()}
            color="info"
            size="small"
            variant="outlined"
          />
        ) : ''
    },
    {
      field: 'validityEnd',
      headerName: t('membership.end_date'),
      width: 140,
      valueGetter: (params) => params.row.validityPeriod?.endDate,
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={new Date(params.value).toLocaleDateString()}
            color="warning"
            size="small"
            variant="outlined"
          />
        ) : ''
    },
    {
      field: 'renewalDate',
      headerName: t('membership.renewal_date'),
      width: 140,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'lastPaymentAmount',
      headerName: t('membership.last_payment_amount'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? `$${params.value}` : '$0'}
          color="primary"
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'lastPaymentDate',
      headerName: t('membership.last_payment_date'),
      width: 160,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'actions',
      headerName: t('membership.actions'),
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
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-id-card-alt"></i> {t('membership.title')}</h4>
      </div>

      <div className="card-body">
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<i className="fas fa-sync-alt"></i>}
            onClick={refresh}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<i className="far fa-plus-square"></i>}
            onClick={() => setOpen(true)}
          >
            {t('membership.add')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<i className="fas fa-edit"></i>}
            data-toggle="modal"
            data-target="#editMembershipModal"
            disabled={!selectedMembership}
          >
            {t('membership.edit')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<i className="fas fa-trash-alt"></i>}
            onClick={handleDelete}
            disabled={!selectedMembershipId}
          >
            {t('membership.delete')}
          </Button>
        </Stack>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={memberships}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
            <Menu
              id="action-menu"
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleViewMenu}>{t('membership.view')}</MenuItem>
              <MenuItem onClick={handleEditMenu}>{t('membership.edit')}</MenuItem>
              <MenuItem onClick={handleDeleteRow}>{t('membership.delete')}</MenuItem>
            </Menu>
          </div>
        )}

        {/* Edit Membership Modal */}
        <div className="modal fade" id="editMembershipModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('membership.edit')}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label={t('membership.close')}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditMembership
                  membership={selectedMembership}
                  closeModal={() => closeButtonEdit.current.click()}
                  onSuccess={refresh}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonEdit}
                >
                  {t('membership.close')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('membership.create')}</DialogTitle>
          <DialogContent>
            <CreateMembership onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* View Membership Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <i className="fas fa-id-card-alt" style={{ color: '#1976d2', fontSize: 22 }} />
              <span>{t('membership.details')}</span>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {viewMembership ? (
              <Box
                sx={{
                  bgcolor: '#fafdff',
                  borderRadius: 2,
                  boxShadow: 1,
                  p: { xs: 2, sm: 3 },
                  minWidth: 320,
                  minHeight: 200
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={viewMembership.membershipPlan}
                    color={planColors[viewMembership.membershipPlan] || 'default'}
                    icon={<i className="fas fa-crown" />}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={viewMembership.paymentStatus}
                    color={statusColors[viewMembership.paymentStatus] || 'default'}
                    icon={<i className="fas fa-credit-card" />}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('membership.status')}: ${viewMembership.status || '-'}`}
                    color={statusColors[viewMembership.status] || 'default'}
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {t('membership.benefits')}:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {(viewMembership.benefits || []).map((b, i) => (
                    <Chip key={i} label={b} color="info" variant="outlined" size="small" sx={{ mb: 1 }} />
                  ))}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    label={`${t('membership.start')}: ${viewMembership.validityPeriod?.startDate ? new Date(viewMembership.validityPeriod.startDate).toLocaleDateString() : '-'}`}
                    color="info"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('membership.end')}: ${viewMembership.validityPeriod?.endDate ? new Date(viewMembership.validityPeriod.endDate).toLocaleDateString() : '-'}`}
                    color="warning"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('membership.renewal')}: ${viewMembership.renewalDate ? new Date(viewMembership.renewalDate).toLocaleDateString() : '-'}`}
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    label={`${t('membership.last_payment')}: ${viewMembership.lastPaymentAmount ? `$${viewMembership.lastPaymentAmount}` : '-'}`}
                    color="success"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                  <Chip
                    label={`${t('membership.last_payment_date')}: ${viewMembership.lastPaymentDate ? new Date(viewMembership.lastPaymentDate).toLocaleDateString() : '-'}`}
                    color="default"
                    sx={{ fontWeight: 600, fontSize: 15 }}
                  />
                </Stack>
              </Box>
            ) : (
              <Typography>{t('membership.no_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)} color="secondary" variant="outlined">
              {t('membership.close')}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default Memberships;

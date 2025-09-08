import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  LinearProgress, Chip, IconButton, Menu, MenuItem, Box, Typography, Button,
  Dialog, DialogTitle, DialogContent, Paper, Stack, Tooltip, Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';
import AddInsurance from './AddInsurance';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const InsuranceInfo = () => {
  const { t } = useTranslation();
  const [insuranceData, setInsuranceData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [coverageModalData, setCoverageModalData] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/insurances`)
      .then((res) => setInsuranceData(res.data))
      .finally(() => setLoading(false));
    // Fetch patients from backend
    axios.get(`${BASE_URL}/patients`)
      .then(res => setPatients(res.data))
      .catch(() => setPatients([]));
  }, []);

  // Helper to get patient name by id
  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.fullName || patient.name : t('insurance.na');
  };

  // Feature: Verify Coverage
  const verifyCoverage = async (insuranceId, serviceType) => {
    try {
      const res = await axios.get(`${BASE_URL}/insurances/${insuranceId}/coverage/${serviceType}`);
      setCoverageModalData({
        title: `Coverage for ${serviceType}`,
        content: res.data && typeof res.data.coverage !== 'undefined'
          ? `${res.data.coverage}%`
          : 'Coverage information not available.'
      });
      setCoverageModalOpen(true);
    } catch (err) {
      setCoverageModalData({
        title: 'Error',
        content: 'Failed to verify coverage.'
      });
      setCoverageModalOpen(true);
    }
  };

  // Feature: Generate Claim
  const generateClaim = async (insuranceId, claimDetails) => {
    try {
      await axios.post(`${BASE_URL}/insurances/${insuranceId}/claims`, claimDetails);
      setCoverageModalData({
        title: 'Claim',
        content: 'Claim generated successfully!'
      });
      setCoverageModalOpen(true);
    } catch (err) {
      setCoverageModalData({
        title: 'Error',
        content: 'Failed to generate claim.'
      });
      setCoverageModalOpen(true);
    }
  };

  // Feature: View Coverage (all details)
  const viewCoverage = (coverageDetails) => {
    if (!coverageDetails) {
      setCoverageModalData({
        title: 'Coverage Details',
        content: 'No coverage details available.'
      });
    } else {
      let content = '';
      if (typeof coverageDetails === 'object') {
        Object.entries(coverageDetails).forEach(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace('Coverage', ' Coverage');
          content += `${label}: ${value}%\n`;
        });
      } else {
        content = 'No coverage details available.';
      }
      setCoverageModalData({
        title: 'Coverage Details',
        content: content.trim()
      });
    }
    setCoverageModalOpen(true);
  };

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  // Widget summary data
  const totalInsurances = insuranceData.length;
  const activeInsurances = insuranceData.filter(i => i.status === 'Active').length;
  const expiredInsurances = insuranceData.filter(i => i.status === 'Expired').length;
  const providers = insuranceData.reduce((acc, i) => {
    acc[i.providerName] = (acc[i.providerName] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const doughnutData = {
    labels: Object.keys(providers),
    datasets: [{
      data: Object.values(providers),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(providers),
    datasets: [{
      label: 'Policies per Provider',
      data: Object.values(providers),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(providers),
    datasets: [
      {
        label: 'Active',
        data: Object.keys(providers).map(provider => insuranceData.filter(i => i.providerName === provider && i.status === 'Active').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Expired',
        data: Object.keys(providers).map(provider => insuranceData.filter(i => i.providerName === provider && i.status === 'Expired').length),
        borderColor: '#e53935',
        fill: false,
      }
    ]
  };

  const columns = [
    { field: 'providerName', headerName: t('insurance.provider'), width: 160 },
    { field: 'policyNumber', headerName: t('insurance.policy_number'), width: 180 },
    {
      field: 'patientId',
      headerName: t('insurance.patient'),
      width: 180,
      valueGetter: (params) => getPatientName(params.row.patientId)
    },
    {
      field: 'validFrom',
      headerName: t('insurance.valid_from'),
      width: 120,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'validUntil',
      headerName: t('insurance.valid_until'),
      width: 120,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'status',
      headerName: t('insurance.status'),
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={t(`insurance.status_${value.toLowerCase()}`)}
          color={value === 'Active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: t('insurance.actions'),
      width: 100,
      renderCell: (params) => (
        <Tooltip title={t('insurance.actions')}>
          <IconButton
            size="small"
            onClick={e => handleActionClick(e, params.row)}
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  // Enhanced View Coverage Modal
  const CoverageModalContent = ({ coverageDetails, insurance }) => {
    if (!coverageDetails || typeof coverageDetails !== 'object') {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" fontWeight={600} sx={{ mb: 2 }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
            {t('insurance.no_coverage_details')}
          </Typography>
        </Box>
      );
    }

    const mainChips = [
      {
        label: `${t('insurance.consultation')}: ${coverageDetails.consultationCoverage ?? t('insurance.na')}%`,
        color: 'primary',
        icon: <i className="fas fa-user-md" />
      },
      {
        label: `${t('insurance.treatment')}: ${coverageDetails.treatmentCoverage ?? t('insurance.na')}%`,
        color: 'success',
        icon: <i className="fas fa-stethoscope" />
      },
      {
        label: `${t('insurance.medication')}: ${coverageDetails.medicationCoverage ?? t('insurance.na')}%`,
        color: 'info',
        icon: <i className="fas fa-pills" />
      }
    ];

    const additional = Object.entries(coverageDetails).filter(
      ([key]) => !['consultationCoverage', 'treatmentCoverage', 'medicationCoverage'].includes(key)
    );

    return (
      <Box sx={{
        p: { xs: 1, sm: 3 },
        bgcolor: '#fafdff',
        borderRadius: 2,
        boxShadow: 1,
        minHeight: 200
      }}>
        <Typography variant="h5" color="primary" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          <i className="fas fa-eye" style={{ marginRight: 10 }} />
          {t('insurance.coverage_details')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`${t('insurance.provider')}: ${insurance?.providerName || t('insurance.na')}`} color="primary" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`${t('insurance.policy_number')}: ${insurance?.policyNumber || t('insurance.na')}`} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`${t('insurance.patient')}: ${insurance?.patientFullName || t('insurance.na')}`} color="success" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`${t('insurance.status')}: ${insurance?.status ? t(`insurance.status_${insurance.status.toLowerCase()}`) : t('insurance.na')}`} color={insurance?.status === 'Active' ? 'success' : 'default'} sx={{ fontWeight: 600, fontSize: 15 }} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`${t('insurance.valid_from')}: ${insurance?.validFrom ? new Date(insurance.validFrom).toLocaleDateString() : t('insurance.na')}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`${t('insurance.valid_until')}: ${insurance?.validUntil ? new Date(insurance.validUntil).toLocaleDateString() : t('insurance.na')}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {t('insurance.coverage_percentages')}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {mainChips.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              color={chip.color}
              icon={chip.icon}
              sx={{ fontWeight: 600, fontSize: 16, minWidth: 170, mb: 1 }}
            />
          ))}
        </Stack>
        {additional.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {t('insurance.additional_info')}
            </Typography>
            <Stack spacing={1} direction="row" flexWrap="wrap">
              {additional.map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`}
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: 15, mb: 1, mr: 1 }}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    );
  };

  return (
    <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
          <i className="fas fa-shield-alt" style={{ marginRight: 10 }} /> {t('insurance.title')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Paper sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="primary">{t('insurance.total_policies')}</Typography>
            <Typography variant="h6">{totalInsurances}</Typography>
          </Paper>
          <Paper sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="success.main">{t('insurance.active')}</Typography>
            <Typography variant="h6">{activeInsurances}</Typography>
          </Paper>
          <Paper sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="error.main">{t('insurance.expired')}</Typography>
            <Typography variant="h6">{expiredInsurances}</Typography>
          </Paper>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>{t('insurance.policies_by_provider')}</Typography>
          <Doughnut data={doughnutData} />
        </Paper>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>{t('insurance.policies_per_provider')}</Typography>
          <Bar data={barData} />
        </Paper>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>{t('insurance.status_trends_by_provider')}</Typography>
          <Line data={lineData} />
        </Paper>
      </Box>

      <Box className="card-body" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2, fontWeight: 600, boxShadow: 2 }}
          onClick={() => setAddDialogOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          {t('insurance.create')}
        </Button>

        {loading ? (
          <LinearProgress sx={{ my: 3 }} />
        ) : (
          <Box sx={{ height: 550, width: '100%', bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <DataGrid
              rows={insuranceData}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5', fontWeight: 700 },
                '& .MuiDataGrid-row': { bgcolor: '#f9f9f9' },
                '& .MuiDataGrid-cell': { fontSize: 15 }
              }}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={() => {
                viewCoverage(actionRow.coverageDetails);
                handleActionClose();
              }}>
                <i className="fas fa-eye" style={{ marginRight: 8, color: '#ffa000' }} />
                {t('insurance.view_coverage')}
              </MenuItem>
              <MenuItem onClick={() => {
                setCoverageModalData({
                  title: t('insurance.policy_details'),
                  content: `${t('insurance.policy_number')}: ${actionRow.policyNumber}`
                });
                setCoverageModalOpen(true);
                handleActionClose();
              }}>
                <i className="fas fa-id-card" style={{ marginRight: 8, color: '#8e24aa' }} />
                {t('insurance.view_policy_details')}
              </MenuItem>
              
            </Menu>
          </Box>
        )}
        <Dialog open={coverageModalOpen} onClose={() => setCoverageModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{coverageModalData?.title}</DialogTitle>
          <DialogContent>
            {coverageModalData?.title === t('insurance.coverage_details') && actionRow ? (
              <CoverageModalContent coverageDetails={actionRow.coverageDetails} insurance={actionRow} />
            ) : (
              <Typography sx={{ fontSize: 16, color: '#1976d2', fontWeight: 600 }}>
                {coverageModalData?.content}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>

      <AddInsurance
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => {
          setAddDialogOpen(false);
          axios.get(`${BASE_URL}/insurances`)
            .then((res) => setInsuranceData(res.data));
        }}
      />
    </Paper>
  );
};

export default InsuranceInfo;

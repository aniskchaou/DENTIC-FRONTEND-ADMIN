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
import BASE_URL from '../../main/urls/urls';
import AddInsurance from './AddInsurance';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const InsuranceInfo = () => {
  const [insuranceData, setInsuranceData] = useState([]);
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
  }, []);

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
    { field: 'providerName', headerName: 'Provider', width: 160 },
    { field: 'policyNumber', headerName: 'Policy No.', width: 180 },
    {
      field: 'validFrom',
      headerName: 'Valid From',
      width: 120,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'validUntil',
      headerName: 'Valid Until',
      width: 120,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={value === 'Active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Actions">
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
            No coverage details available.
          </Typography>
        </Box>
      );
    }

    // Prepare main coverage chips
    const mainChips = [
      {
        label: `Consultation: ${coverageDetails.consultationCoverage ?? 'N/A'}%`,
        color: 'primary',
        icon: <i className="fas fa-user-md" />
      },
      {
        label: `Treatment: ${coverageDetails.treatmentCoverage ?? 'N/A'}%`,
        color: 'success',
        icon: <i className="fas fa-stethoscope" />
      },
      {
        label: `Medication: ${coverageDetails.medicationCoverage ?? 'N/A'}%`,
        color: 'info',
        icon: <i className="fas fa-pills" />
      }
    ];

    // Prepare additional info
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
          Coverage Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Provider: ${insurance?.providerName || 'N/A'}`} color="primary" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`Policy No: ${insurance?.policyNumber || 'N/A'}`} color="info" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`Patient: ${insurance?.patientFullName || 'N/A'}`} color="success" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`Status: ${insurance?.status || 'N/A'}`} color={insurance?.status === 'Active' ? 'success' : 'default'} sx={{ fontWeight: 600, fontSize: 15 }} />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Valid From: ${insurance?.validFrom ? new Date(insurance.validFrom).toLocaleDateString() : 'N/A'}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
          <Chip label={`Valid Until: ${insurance?.validUntil ? new Date(insurance.validUntil).toLocaleDateString() : 'N/A'}`} color="default" sx={{ fontWeight: 600, fontSize: 15 }} />
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Coverage Percentages:
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
              Additional Info:
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
          <i className="fas fa-shield-alt" style={{ marginRight: 10 }} /> Insurance Records
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Paper sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="primary">Total Policies</Typography>
            <Typography variant="h6">{totalInsurances}</Typography>
          </Paper>
          <Paper sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="success.main">Active</Typography>
            <Typography variant="h6">{activeInsurances}</Typography>
          </Paper>
          <Paper sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }} elevation={2}>
            <Typography variant="subtitle2" color="error.main">Expired</Typography>
            <Typography variant="h6">{expiredInsurances}</Typography>
          </Paper>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>Policies by Provider</Typography>
          <Doughnut data={doughnutData} />
        </Paper>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>Policies per Provider</Typography>
          <Bar data={barData} />
        </Paper>
        <Paper sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }} elevation={1}>
          <Typography variant="subtitle1" align="center" fontWeight={600}>Status Trends by Provider</Typography>
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
          Create Insurance
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
                View Coverage
              </MenuItem>
              <MenuItem onClick={() => {
                setCoverageModalData({
                  title: 'Policy Details',
                  content: `Policy Number: ${actionRow.policyNumber}`
                });
                setCoverageModalOpen(true);
                handleActionClose();
              }}>
                <i className="fas fa-id-card" style={{ marginRight: 8, color: '#8e24aa' }} />
                View Policy Details
              </MenuItem>
              <MenuItem onClick={() => {
                setCoverageModalData({
                  title: 'Download',
                  content: `Download for policy ${actionRow.policyNumber} started.`
                });
                setCoverageModalOpen(true);
                handleActionClose();
              }}>
                <i className="fas fa-download" style={{ marginRight: 8, color: '#00bcd4' }} />
                Download Policy PDF
              </MenuItem>
              <MenuItem onClick={() => {
                setCoverageModalData({
                  title: 'Renewal Reminder',
                  content: `Send renewal reminder to ${actionRow.patientFullName}`
                });
                setCoverageModalOpen(true);
                handleActionClose();
              }}>
                <i className="fas fa-bell" style={{ marginRight: 8, color: '#e53935' }} />
                Send Renewal Reminder
              </MenuItem>
            </Menu>
          </Box>
        )}
        <Dialog open={coverageModalOpen} onClose={() => setCoverageModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{coverageModalData?.title}</DialogTitle>
          <DialogContent>
            {coverageModalData?.title === 'Coverage Details' && actionRow ? (
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

import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  LinearProgress, Chip, Menu, MenuItem, Button, IconButton, Box, Typography, Drawer, Snackbar, Alert, TextField, Stack, Skeleton, Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import CreateDiagnosis from './CreateDiagnosis';
import BASE_URL from '../../main/urls/urls';
Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);


const Diagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDiagnosis, setDrawerDiagnosis] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editRowsModel, setEditRowsModel] = useState({});
  const [auditTrail, setAuditTrail] = useState({});
  const [chartFilter, setChartFilter] = useState({ condition: '', severity: '' });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Simulate user role
  const userRole = 'admin'; // or 'doctor', 'viewer', etc.

  // Fetch diagnoses
  const fetchDiagnoses = useCallback(() => {
    setLoading(true);
    setSkeleton(true);
    axios.get(`${BASE_URL}/diagnoses`)
      .then((res) => {
        setDiagnoses(res.data);
        setTimeout(() => setSkeleton(false), 800); // Simulate skeleton loading
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to load diagnoses', severity: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDiagnoses();
  }, [fetchDiagnoses]);

  // Filtering logic
  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSeverity = severityFilter ? diagnosis.severity === severityFilter : true;
    const matchesCondition = conditionFilter ? diagnosis.condition === conditionFilter : true;
    const matchesDoctor = doctorFilter ? (diagnosis.doctorName || '').toLowerCase().includes(doctorFilter.toLowerCase()) : true;
    const matchesSearch = Object.values(diagnosis).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesDate =
      (!dateRange.from || new Date(diagnosis.diagnosisDate) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(diagnosis.diagnosisDate) <= new Date(dateRange.to));
    const matchesChart =
      (!chartFilter.condition || diagnosis.condition === chartFilter.condition) &&
      (!chartFilter.severity || diagnosis.severity === chartFilter.severity);
    return matchesSeverity && matchesCondition && matchesDoctor && matchesSearch && matchesDate && matchesChart;
  });

  // Inline editing
  const handleEditRowsModelChange = (model) => {
    setEditRowsModel(model);
  };
  const handleRowEditCommit = async (id) => {
    const changes = editRowsModel[id];
    if (changes) {
      const updated = { ...diagnoses.find(d => d.id === id), ...Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.value])) };
      await axios.put(`${BASE_URL}/diagnoses/${id}`, updated);
      setAuditTrail(a => ({
        ...a,
        [id]: [...(a[id] || []), { date: new Date().toISOString(), user: 'CurrentUser', changes }]
      }));
      setSnackbar({ open: true, message: 'Diagnosis updated', severity: 'success' });
      fetchDiagnoses();
    }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (status) => {
    await Promise.all(selectedIds.map(id =>
      axios.patch(`${BASE_URL}/diagnoses/${id}`, { severity: status })
    ));
    setSnackbar({ open: true, message: `Marked selected as ${status}`, severity: 'success' });
    fetchDiagnoses();
  };

  // Export to Excel (simple CSV for demo)
  const exportToExcel = () => {
    const csvContent = [
      Object.keys(diagnoses[0] || {}).join(','),
      ...diagnoses.map(diagnosis => Object.values(diagnosis).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    saveAs(blob, 'diagnoses.xlsx');
    setSnackbar({ open: true, message: 'Exported to Excel', severity: 'success' });
  };

  // Export to PDF (simple print for demo)
  const exportToPDF = () => {
    window.print();
    setSnackbar({ open: true, message: 'Print dialog opened for PDF export', severity: 'info' });
  };

  // Chart interactivity
  const handleChartClick = (elems, chart) => {
    if (elems.length > 0) {
      const idx = elems[0].index;
      const label = chart.data.labels[idx];
      setChartFilter({ ...chartFilter, condition: label });
    }
  };

  // Columns with inline editing and role-based actions
  const columns = [
    {
      field: 'diagnosisDate',
      headerName: 'Date',
      width: 160,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 200,
      editable: userRole === 'admin',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      editable: userRole === 'admin' || userRole === 'doctor',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Severe'
              ? 'error'
              : params.value === 'Moderate'
              ? 'warning'
              : 'success'
          }
          variant="outlined"
        />
      )
    },
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 180
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => {
                setDrawerDiagnosis(params.row);
                setDrawerOpen(true);
              }}
              aria-label="View details"
            >
              <i className="fas fa-eye"></i>
            </IconButton>
          </Tooltip>
          {(userRole === 'admin' || userRole === 'doctor') && (
            <IconButton
              size="small"
              onClick={e => {
                setActionAnchorEl(e.currentTarget);
                setActionRow(params.row);
              }}
              aria-label="More actions"
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  // Chart data calculations (place before your component return)
  const conditionCounts = diagnoses.reduce((acc, d) => {
    const cond = d.condition || 'Other';
    acc[cond] = (acc[cond] || 0) + 1;
    return acc;
  }, {});
  const severityCounts = diagnoses.reduce((acc, d) => {
    const sev = d.severity || 'Other';
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});
  const doctorCounts = diagnoses.reduce((acc, d) => {
    const doc = d.doctorName || 'Unknown';
    acc[doc] = (acc[doc] || 0) + 1;
    return acc;
  }, {});
  const dateCounts = diagnoses.reduce((acc, d) => {
    const date = d.diagnosisDate ? new Date(d.diagnosisDate).toLocaleDateString() : 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(conditionCounts),
    datasets: [{
      data: Object.values(conditionCounts),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };
  const pieData = {
    labels: Object.keys(severityCounts),
    datasets: [{
      data: Object.values(severityCounts),
      backgroundColor: ['#43a047', '#ffa000', '#e53935', '#1976d2'],
    }]
  };
  const barData = {
    labels: Object.keys(doctorCounts),
    datasets: [{
      label: 'Diagnoses per Doctor',
      data: Object.values(doctorCounts),
      backgroundColor: '#1976d2',
    }]
  };
  const lineData = {
    labels: Object.keys(dateCounts),
    datasets: [{
      label: 'Diagnoses per Date',
      data: Object.values(dateCounts),
      borderColor: '#e53935',
      backgroundColor: 'rgba(229,57,53,0.2)',
      fill: true,
      tension: 0.4,
    }]
  };

  // Responsive skeletons
  if (skeleton) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={500} />
      </Box>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-notes-medical"></i> Diagnoses</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="primary">Total Diagnoses</Typography>
          <Typography variant="h6">{diagnoses.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="success.main">Mild</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === 'Mild').length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="warning.main">Moderate</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === 'Moderate').length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="error.main">Severe</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === 'Severe').length}</Typography>
        </Box>
      </Box>

      {/* Charts Section - MOVE HERE, just below widgets and above filters/table */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4, mt: 2, justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Diagnoses by Condition</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Diagnoses by Severity</Typography>
          <Pie data={pieData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Diagnoses per Doctor</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fce4ec', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Diagnoses Over Time</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        {/* Create Diagnosis Button */}
        <Button
          variant="outlined"
          color="success"
          sx={{ mb: 2 }}
          onClick={() => setAddDialogOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          Create Diagnosis
        </Button>

        {/* Advanced Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Severity"
            select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">All Severities</MenuItem>
            <MenuItem value="Mild">Mild</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Severe">Severe</MenuItem>
          </TextField>
          <TextField
            label="Condition"
            select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">All Conditions</MenuItem>
            {Object.keys(conditionCounts).map(cond => (
              <MenuItem key={cond} value={cond}>{cond}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Doctor"
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="From"
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To"
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        {/* DataGrid with inline editing */}
        {loading ? <LinearProgress /> : (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredDiagnoses}
              getRowId={row => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              onRowSelectionModelChange={ids => setSelectedIds(ids)}
              components={{ Toolbar: GridToolbar }}
              editMode="row"
              onRowEditCommit={handleRowEditCommit}
              onEditRowsModelChange={handleEditRowsModelChange}
              aria-label="Diagnoses Table"
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={() => setActionAnchorEl(null)}
            >
              {(userRole === 'admin' || userRole === 'doctor') && (
                <MenuItem onClick={() => {
                  setDrawerDiagnosis(actionRow);
                  setDrawerOpen(true);
                  setActionAnchorEl(null);
                }}>View</MenuItem>
              )}
              {userRole === 'admin' && (
                <MenuItem onClick={async () => {
                  await axios.delete(`${BASE_URL}/diagnoses/${actionRow.id}`);
                  setSnackbar({ open: true, message: 'Diagnosis deleted', severity: 'success' });
                  fetchDiagnoses();
                  setActionAnchorEl(null);
                }}>Delete</MenuItem>
              )}
            </Menu>
          </div>
        )}

        {/* Detailed Drawer View */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: { xs: 320, sm: 480 } } }}
        >
          <Box sx={{ p: 3, maxWidth: 480 }}>
            {drawerDiagnosis && (
              <>
                <Typography variant="h6" gutterBottom>
                  Diagnosis Details
                </Typography>
                <Typography variant="subtitle2">Condition: {drawerDiagnosis.condition}</Typography>
                <Typography variant="subtitle2">Severity: {drawerDiagnosis.severity}</Typography>
                <Typography variant="subtitle2">Doctor: {drawerDiagnosis.doctorName}</Typography>
                <Typography variant="subtitle2">Date: {new Date(drawerDiagnosis.diagnosisDate).toLocaleString()}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Results:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{drawerDiagnosis.diagnosisResults}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Notes:</Typography>
                <Typography variant="body2">{drawerDiagnosis.notes}</Typography>
                {/* Audit Trail */}
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Audit Trail:</Typography>
                <Box sx={{ maxHeight: 120, overflow: 'auto', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                  {(auditTrail[drawerDiagnosis.id] || []).length === 0
                    ? <Typography variant="caption">No changes yet.</Typography>
                    : auditTrail[drawerDiagnosis.id].map((entry, idx) => (
                      <Typography key={idx} variant="caption" sx={{ display: 'block' }}>
                        {entry.date}: {entry.user} changed {Object.keys(entry.changes).join(', ')}
                      </Typography>
                    ))}
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={exportToPDF}>Print</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToExcel}>Download Excel</Button>
                </Stack>
              </>
            )}
          </Box>
        </Drawer>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Add Diagnosis Dialog - NEW SECTION */}
        <CreateDiagnosis
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={() => {
            setAddDialogOpen(false);
            // Refresh diagnoses data
            fetchDiagnoses();
          }}
        />
      </div>
    </div>
  );
};

export default Diagnoses;

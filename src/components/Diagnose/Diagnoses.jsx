import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  LinearProgress, Chip, Menu, MenuItem, Button, IconButton, Box, Typography, Drawer, Snackbar, Alert, TextField, Stack, Skeleton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { saveAs } from 'file-saver';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import CreateDiagnosis from './CreateDiagnosis';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';
Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);


const Diagnoses = () => {
  const { t } = useTranslation();
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
  const [symptomDialogOpen, setSymptomDialogOpen] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);
  const [symptomLoading, setSymptomLoading] = useState(false);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [decisionDiagnosis, setDecisionDiagnosis] = useState('');
  const [decisionHistory, setDecisionHistory] = useState({ age: '', smoker: false, previousTreatments: '' });
  const [decisionResult, setDecisionResult] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const [riskInput, setRiskInput] = useState({
    age: '',
    smoker: false,
    diabetic: false,
    oralHygiene: '',
    lastVisit: ''
  });
  const [riskResult, setRiskResult] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

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

  // AI Symptom Checker function
  const handleSymptomCheck = async () => {
    setSymptomLoading(true);
    setSymptomResult(null);
    try {
      const symptomsArr = symptomsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = { symptoms: symptomsArr };
      const res = await axios.post(`${BASE_URL}/ai/symptom-checker`, payload);

      let conditions = [];
      let urgency = '';
      if (res.data) {
        // Parse urgency if it's a code block
        if (typeof res.data.urgency === 'string' && res.data.urgency.startsWith('```json')) {
          try {
            const parsed = JSON.parse(res.data.urgency.replace(/```json|```/g, ''));
            conditions = parsed.conditions || [];
            urgency = parsed.urgency || '';
          } catch {
            urgency = res.data.urgency;
          }
        } else {
          conditions = res.data.conditions || [];
          urgency = res.data.urgency || '';
        }
      }
      setSymptomResult({ conditions, urgency });
    } catch {
      setSymptomResult({ error: 'Error checking symptoms.' });
    }
    setSymptomLoading(false);
  };

  // AI Decision Support function
  const handleDecisionSupport = async () => {
    setDecisionLoading(true);
    setDecisionResult(null);
    try {
      const payload = {
        diagnosis: decisionDiagnosis,
        history: {
          age: Number(decisionHistory.age),
          smoker: Boolean(decisionHistory.smoker),
          previousTreatments: decisionHistory.previousTreatments
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/decision-support`, payload);

      let treatmentPlan = '';
      if (res.data && typeof res.data.treatmentPlan === 'string' && res.data.treatmentPlan.startsWith('```json')) {
        try {
          const parsed = JSON.parse(res.data.treatmentPlan.replace(/```json|```/g, ''));
          treatmentPlan = parsed.treatmentPlan || '';
        } catch {
          treatmentPlan = res.data.treatmentPlan;
        }
      } else {
        treatmentPlan = res.data.treatmentPlan || '';
      }
      setDecisionResult({ treatmentPlan });
    } catch {
      setDecisionResult({ error: 'Error getting treatment plan.' });
    }
    setDecisionLoading(false);
  };

  // AI Risk Prediction function
  const handleRiskPrediction = async () => {
    setRiskLoading(true);
    setRiskResult(null);
    try {
      const payload = {
        patientData: {
          age: Number(riskInput.age),
          smoker: Boolean(riskInput.smoker),
          diabetic: Boolean(riskInput.diabetic),
          oralHygiene: riskInput.oralHygiene,
          lastVisit: riskInput.lastVisit
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/risk-prediction`, payload);

      let risks = [];
      let screeningPrompt = '';
      if (res.data) {
        // Parse screeningPrompt if it's a code block
        if (typeof res.data.screeningPrompt === 'string' && res.data.screeningPrompt.startsWith('```json')) {
          try {
            const parsed = JSON.parse(res.data.screeningPrompt.replace(/```json|```/g, ''));
            risks = parsed.risks || [];
            screeningPrompt = parsed.screeningPrompt || '';
          } catch {
            screeningPrompt = res.data.screeningPrompt;
          }
        } else {
          risks = res.data.risks || [];
          screeningPrompt = res.data.screeningPrompt || '';
        }
      }
      setRiskResult({ risks, screeningPrompt });
    } catch {
      setRiskResult({ error: 'Error predicting risks.' });
    }
    setRiskLoading(false);
  };

  // Columns with inline editing and role-based actions
  const columns = [
    {
      field: 'diagnosisDate',
      headerName: t('diagnosis.date'),
      width: 160,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'condition',
      headerName: t('diagnosis.condition'),
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
      headerName: t('diagnosis.severity'),
      width: 120,
      editable: userRole === 'admin' || userRole === 'doctor',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === t('diagnosis.severity_severe')
              ? 'error'
              : params.value === t('diagnosis.severity_moderate')
              ? 'warning'
              : 'success'
          }
          variant="outlined"
        />
      )
    },
    {
      field: 'doctorName',
      headerName: t('diagnosis.doctor'),
      width: 180
    },
    {
      field: 'actions',
      headerName: t('diagnosis.actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title={t('diagnosis.view_details')}>
            <IconButton
              size="small"
              onClick={() => {
                setDrawerDiagnosis(params.row);
                setDrawerOpen(true);
              }}
              aria-label={t('diagnosis.view_details')}
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
              aria-label={t('diagnosis.more_actions')}
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
        <h4><i className="fas fa-notes-medical"></i> {t('diagnosis.title')}</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="primary">{t('diagnosis.total')}</Typography>
          <Typography variant="h6">{diagnoses.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="success.main">{t('diagnosis.severity_mild')}</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === t('diagnosis.severity_mild')).length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="warning.main">{t('diagnosis.severity_moderate')}</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === t('diagnosis.severity_moderate')).length}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography variant="subtitle2" color="error.main">{t('diagnosis.severity_severe')}</Typography>
          <Typography variant="h6">{diagnoses.filter(d => d.severity === t('diagnosis.severity_severe')).length}</Typography>
        </Box>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4, mt: 2, justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('diagnosis.by_condition')}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('diagnosis.by_severity')}</Typography>
          <Pie data={pieData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('diagnosis.per_doctor')}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fce4ec', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('diagnosis.over_time')}</Typography>
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
          {t('diagnosis.create')}
        </Button>

        {/* Add AI Symptom Checker Button */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<MedicalServicesIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setSymptomDialogOpen(true)}
        >
          {t('diagnosis.ai_symptom_checker')}
        </Button>

        {/* Add Decision Support System Button */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<SupportAgentIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setDecisionDialogOpen(true)}
        >
          {t('diagnosis.ai_decision_support')}
        </Button>

        {/* Add Risk Prediction Button */}
        <Button
          variant="outlined"
          color="warning"
          startIcon={<WarningAmberIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setRiskDialogOpen(true)}
        >
          {t('diagnosis.ai_risk_prediction')}
        </Button>

        {/* Advanced Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label={t('diagnosis.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label={t('diagnosis.severity')}
            select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">{t('diagnosis.all_severities')}</MenuItem>
            <MenuItem value={t('diagnosis.severity_mild')}>{t('diagnosis.severity_mild')}</MenuItem>
            <MenuItem value={t('diagnosis.severity_moderate')}>{t('diagnosis.severity_moderate')}</MenuItem>
            <MenuItem value={t('diagnosis.severity_severe')}>{t('diagnosis.severity_severe')}</MenuItem>
          </TextField>
          <TextField
            label={t('diagnosis.condition')}
            select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">{t('diagnosis.all_conditions')}</MenuItem>
            {Object.keys(conditionCounts).map(cond => (
              <MenuItem key={cond} value={cond}>{cond}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('diagnosis.doctor')}
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label={t('diagnosis.from')}
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label={t('diagnosis.to')}
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
              aria-label={t('diagnosis.table_aria')}
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
                }}>{t('diagnosis.view')}</MenuItem>
              )}
              {userRole === 'admin' && (
                <MenuItem onClick={async () => {
                  await axios.delete(`${BASE_URL}/diagnoses/${actionRow.id}`);
                  setSnackbar({ open: true, message: t('diagnosis.deleted'), severity: 'success' });
                  fetchDiagnoses();
                  setActionAnchorEl(null);
                }}>{t('diagnosis.delete')}</MenuItem>
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
                  {t('diagnosis.details')}
                </Typography>
                <Typography variant="subtitle2">{t('diagnosis.condition')}: {drawerDiagnosis.condition}</Typography>
                <Typography variant="subtitle2">{t('diagnosis.severity')}: {drawerDiagnosis.severity}</Typography>
                <Typography variant="subtitle2">{t('diagnosis.doctor')}: {drawerDiagnosis.doctorName}</Typography>
                <Typography variant="subtitle2">{t('diagnosis.date')}: {new Date(drawerDiagnosis.diagnosisDate).toLocaleString()}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('diagnosis.results')}:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{drawerDiagnosis.diagnosisResults}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('diagnosis.notes')}:</Typography>
                <Typography variant="body2">{drawerDiagnosis.notes}</Typography>
                {/* Audit Trail */}
                <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('diagnosis.audit_trail')}:</Typography>
                <Box sx={{ maxHeight: 120, overflow: 'auto', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                  {(auditTrail[drawerDiagnosis.id] || []).length === 0
                    ? <Typography variant="caption">{t('diagnosis.no_changes')}</Typography>
                    : auditTrail[drawerDiagnosis.id].map((entry, idx) => (
                      <Typography key={idx} variant="caption" sx={{ display: 'block' }}>
                        {entry.date}: {entry.user} {t('diagnosis.changed')} {Object.keys(entry.changes).join(', ')}
                      </Typography>
                    ))}
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={exportToPDF}>{t('diagnosis.print')}</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToExcel}>{t('diagnosis.download_excel')}</Button>
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

        {/* Add Diagnosis Dialog */}
        <CreateDiagnosis
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={() => {
            setAddDialogOpen(false);
            fetchDiagnoses();
          }}
        />

        {/* AI Symptom Checker Dialog */}
        <Dialog open={symptomDialogOpen} onClose={() => setSymptomDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('diagnosis.ai_symptom_checker')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('diagnosis.symptom_instruction')}
            </Typography>
            <TextField
              label={t('diagnosis.symptoms')}
              value={symptomsInput}
              onChange={e => setSymptomsInput(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
              placeholder={t('diagnosis.symptoms_placeholder')}
            />
            {symptomLoading && <LinearProgress sx={{ mb: 2 }} />}
            {symptomResult && (
              <Box sx={{ mt: 2 }}>
                {symptomResult.error ? (
                  <Alert severity="error">{symptomResult.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('diagnosis.possible_conditions')}</Typography>
                    <ul>
                      {(symptomResult.conditions || []).map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>{t('diagnosis.urgency')}</Typography>
                    <Typography variant="body2">{symptomResult.urgency}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSymptomDialogOpen(false)}>{t('diagnosis.close')}</Button>
            <Button
              variant="contained"
              onClick={handleSymptomCheck}
              disabled={!symptomsInput || symptomLoading}
            >
              {t('diagnosis.check')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* AI Decision Support Dialog */}
        <Dialog open={decisionDialogOpen} onClose={() => setDecisionDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('diagnosis.ai_decision_support')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('diagnosis.decision_instruction')}
            </Typography>
            <TextField
              label={t('diagnosis.diagnosis')}
              value={decisionDiagnosis}
              onChange={e => setDecisionDiagnosis(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('diagnosis.diagnosis_placeholder')}
            />
            <TextField
              label={t('diagnosis.age')}
              type="number"
              value={decisionHistory.age}
              onChange={e => setDecisionHistory(h => ({ ...h, age: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('diagnosis.smoker')}
              select
              value={decisionHistory.smoker ? 'true' : 'false'}
              onChange={e => setDecisionHistory(h => ({ ...h, smoker: e.target.value === 'true' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="false">{t('diagnosis.no')}</MenuItem>
              <MenuItem value="true">{t('diagnosis.yes')}</MenuItem>
            </TextField>
            <TextField
              label={t('diagnosis.previous_treatments')}
              value={decisionHistory.previousTreatments}
              onChange={e => setDecisionHistory(h => ({ ...h, previousTreatments: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('diagnosis.previous_treatments_placeholder')}
            />
            {decisionLoading && <LinearProgress sx={{ mb: 2 }} />}
            {decisionResult && (
              <Box sx={{ mt: 2 }}>
                {decisionResult.error ? (
                  <Alert severity="error">{decisionResult.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('diagnosis.recommended_treatment_plan')}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                      {decisionResult.treatmentPlan}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDecisionDialogOpen(false)}>{t('diagnosis.close')}</Button>
            <Button
              variant="contained"
              onClick={handleDecisionSupport}
              disabled={!decisionDiagnosis || !decisionHistory.age || decisionLoading}
            >
              {t('diagnosis.get_plan')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* AI Risk Prediction Dialog */}
        <Dialog open={riskDialogOpen} onClose={() => setRiskDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('diagnosis.ai_risk_prediction')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('diagnosis.risk_instruction')}
            </Typography>
            <TextField
              label={t('diagnosis.age')}
              type="number"
              value={riskInput.age}
              onChange={e => setRiskInput(r => ({ ...r, age: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('diagnosis.smoker')}
              select
              value={riskInput.smoker ? 'true' : 'false'}
              onChange={e => setRiskInput(r => ({ ...r, smoker: e.target.value === 'true' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="false">{t('diagnosis.no')}</MenuItem>
              <MenuItem value="true">{t('diagnosis.yes')}</MenuItem>
            </TextField>
            <TextField
              label={t('diagnosis.diabetic')}
              select
              value={riskInput.diabetic ? 'true' : 'false'}
              onChange={e => setRiskInput(r => ({ ...r, diabetic: e.target.value === 'true' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="false">{t('diagnosis.no')}</MenuItem>
              <MenuItem value="true">{t('diagnosis.yes')}</MenuItem>
            </TextField>
            <TextField
              label={t('diagnosis.oral_hygiene')}
              select
              value={riskInput.oralHygiene}
              onChange={e => setRiskInput(r => ({ ...r, oralHygiene: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('diagnosis.select')}</MenuItem>
              <MenuItem value="good">{t('diagnosis.oral_hygiene_good')}</MenuItem>
              <MenuItem value="average">{t('diagnosis.oral_hygiene_average')}</MenuItem>
              <MenuItem value="poor">{t('diagnosis.oral_hygiene_poor')}</MenuItem>
            </TextField>
            <TextField
              label={t('diagnosis.last_visit')}
              type="date"
              value={riskInput.lastVisit}
              onChange={e => setRiskInput(r => ({ ...r, lastVisit: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            {riskLoading && <LinearProgress sx={{ mb: 2 }} />}
            {riskResult && (
              <Box sx={{ mt: 2 }}>
                {riskResult.error ? (
                  <Alert severity="error">{riskResult.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('diagnosis.predicted_risks')}</Typography>
                    <ul>
                      {(riskResult.risks || []).map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>{t('diagnosis.screening_prompt')}</Typography>
                    <Typography variant="body2">{riskResult.screeningPrompt}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRiskDialogOpen(false)}>{t('diagnosis.close')}</Button>
            <Button
              variant="contained"
              onClick={handleRiskPrediction}
              disabled={!riskInput.age || !riskInput.oralHygiene || !riskInput.lastVisit || riskLoading}
            >
              {t('diagnosis.predict')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Diagnoses;

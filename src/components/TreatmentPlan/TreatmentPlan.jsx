import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, IconButton, Menu, MenuItem, Chip, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddTreatmentPlan from './AddTreatmentPlan'; // Make sure this path is correct
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslation } from 'react-i18next';

// import EditTreatmentPlan from './EditTreatmentPlan'; // Uncomment if you have this component

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const TreatmentPlans = () => {
  const { t } = useTranslation();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  // const [editOpen, setEditOpen] = useState(false); // Uncomment if you implement edit

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Patient-Friendly Explainer AI state
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [explainerLoading, setExplainerLoading] = useState(false);
  const [explainerResult, setExplainerResult] = useState(null);
  const [explainerPlanText, setExplainerPlanText] = useState('');

  // Outcome Prediction AI state
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [outcomeLoading, setOutcomeLoading] = useState(false);
  const [outcomeResult, setOutcomeResult] = useState(null);

  // Patient data for prediction (example: you can fetch or ask user for these)
  const [patientData, setPatientData] = useState({
    age: '',
    smoker: false,
    diabetic: false,
    oralHygiene: '',
    previousTreatments: ''
  });

  const fetchTreatmentPlans = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/treatmentplans`)
      .then(res => setTreatmentPlans(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTreatmentPlans();
    axios.get(`${BASE_URL}/patients`).then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(`${BASE_URL}/doctors`).then(res => setDoctors(res.data)).catch(() => setDoctors([]));
  }, []);

  const refresh = () => {
    fetchTreatmentPlans();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const plan = treatmentPlans.find(p => p.id === ids[0]);
      setSelectedPlan(plan);
      setSelectedPlanId(ids[0]);
    } else {
      setSelectedPlan(null);
      setSelectedPlanId(null);
    }
  };

  const handleDelete = () => {
    if (selectedPlanId && window.confirm('Are you sure you want to delete this treatment plan?')) {
      axios.delete(`${BASE_URL}/treatmentplans/${selectedPlanId}`)
        .then(() => refresh());
    }
  };

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  // Uncomment and implement if you have EditTreatmentPlan
  // const handleActionEdit = () => {
  //   setSelectedPlan(actionRow);
  //   setSelectedPlanId(actionRow.id);
  //   setEditOpen(true);
  //   handleActionClose();
  // };

  const handleActionDelete = () => {
    setSelectedPlan(actionRow);
    setSelectedPlanId(actionRow.id);
    handleDelete();
    handleActionClose();
  };

  // Patient-Friendly Explainer AI function
  const handleExplainer = async () => {
    setExplainerLoading(true);
    setExplainerResult(null);
    try {
      const payload = { treatmentPlan: explainerPlanText };
      const res = await axios.post(`${BASE_URL}/ai/treatment-explainer`, payload);

      let explanation = '';
      let visuals = [];
      if (res.data && typeof res.data.explanation === 'string' && res.data.explanation.startsWith('```json')) {
        try {
          const parsed = JSON.parse(res.data.explanation.replace(/```json|```/g, ''));
          explanation = parsed.explanation || '';
          visuals = parsed.visuals || [];
        } catch {
          explanation = res.data.explanation;
        }
      } else {
        explanation = res.data.explanation || '';
        visuals = res.data.visuals || [];
      }
      setExplainerResult({ explanation, visuals });
    } catch {
      setExplainerResult({ error: 'Error generating explanation.' });
    }
    setExplainerLoading(false);
  };

  // Outcome Prediction AI function
  const handleOutcomePrediction = async () => {
    setOutcomeLoading(true);
    setOutcomeResult(null);
    try {
      const payload = {
        treatmentPlan: selectedPlan?.treatmentPlan || '',
        patientData: {
          age: Number(patientData.age),
          smoker: Boolean(patientData.smoker),
          diabetic: Boolean(patientData.diabetic),
          oralHygiene: patientData.oralHygiene,
          previousTreatments: patientData.previousTreatments
            ? patientData.previousTreatments.split(',').map(t => t.trim()).filter(Boolean)
            : []
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/treatment-outcome-prediction`, payload);

      let successRate = '';
      let recoveryTime = '';
      let longTermBenefits = '';
      if (res.data && typeof res.data.longTermBenefits === 'string' && res.data.longTermBenefits.startsWith('```json')) {
        try {
          const parsed = JSON.parse(res.data.longTermBenefits.replace(/```json|```/g, ''));
          successRate = parsed.successRate || '';
          recoveryTime = parsed.recoveryTime || '';
          longTermBenefits = parsed.longTermBenefits || '';
        } catch {
          longTermBenefits = res.data.longTermBenefits;
        }
      } else {
        successRate = res.data.successRate || '';
        recoveryTime = res.data.recoveryTime || '';
        longTermBenefits = res.data.longTermBenefits || '';
      }
      setOutcomeResult({ successRate, recoveryTime, longTermBenefits });
    } catch {
      setOutcomeResult({ error: 'Error predicting outcome.' });
    }
    setOutcomeLoading(false);
  };

  // Helper functions to get names by id
  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === id);
    return patient ? (patient.fullName || patient.name || patient.id) : 'Unknown';
  };
  const getDoctorName = (id) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? (doctor.fullName || doctor.name || doctor.id) : 'Unknown';
  };

  // Widget summary data
  const totalPlans = treatmentPlans.length;
  const completedPlans = treatmentPlans.filter(p => p.status === 'Completed').length;
  const inProgressPlans = treatmentPlans.filter(p => p.status === 'In Progress').length;
  const pendingPlans = treatmentPlans.filter(p => p.status === 'Pending').length;

  // Group by treatment type (if available)
  const typeCounts = treatmentPlans.reduce((acc, p) => {
    const type = p.treatmentType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const doughnutData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      label: 'Plans per Treatment Type',
      data: Object.values(typeCounts),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'Completed').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'In Progress',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'In Progress').length),
        borderColor: '#1976d2',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(typeCounts).map(type => treatmentPlans.filter(p => (p.treatmentType || 'Other') === type && p.status === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  const columns = [
    {
      field: 'patientId',
      headerName: t('treatment.patient_name'),
      width: 220,
      valueGetter: (params) => getPatientName(params.row.patientId),
    },
    {
      field: 'doctorId',
      headerName: t('treatment.doctor_name'),
      width: 220,
      valueGetter: (params) => getDoctorName(params.row.doctorId),
    },
    { field: 'estimatedDuration', headerName: t('treatment.estimated_duration'), width: 160 },
    {
      field: 'status',
      headerName: t('treatment.status'),
      width: 140,
      renderCell: (params) => (
        <Chip
          label={t(`treatment.status_${params.value.replace(/\s/g, '_').toLowerCase()}`)}
          color={
            params.value === 'Completed'
              ? 'success'
              : params.value === 'In Progress'
              ? 'primary'
              : params.value === 'Pending'
              ? 'warning'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('treatment.actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={e => handleActionClick(e, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: 'description',
      headerName: t('treatment.description'),
      width: 280,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {params.row.description || t('treatment.no_description')}
        </Typography>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-notes-medical"></i> {t('treatment.title')}</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('treatment.total_plans')}</Typography>
          <Typography variant="h6">{totalPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">{t('treatment.completed')}</Typography>
          <Typography variant="h6">{completedPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('treatment.in_progress')}</Typography>
          <Typography variant="h6">{inProgressPlans}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">{t('treatment.pending')}</Typography>
          <Typography variant="h6">{pendingPlans}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('treatment.plans_by_type')}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('treatment.plans_per_type')}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('treatment.status_trends_by_type')}</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Button
          variant="outlined"
          color="success"
          sx={{ mb: 2, mr: 2 }}
          onClick={() => setAddOpen(true)}
          startIcon={<i className="fas fa-plus"></i>}
        >
          {t('treatment.add')}
        </Button>

        <Button
          variant="outlined"
          color="info"
          startIcon={<InfoOutlinedIcon />}
          sx={{ mb: 2, mr: 2 }}
          onClick={() => {
            let planText = selectedPlan?.treatmentPlan || '';
            if (selectedPlan?.description) {
              planText += `${selectedPlan.description}`;
            }
            setExplainerPlanText(planText);
            setExplainerOpen(true);
          }}
          disabled={!selectedPlan}
        >
          {t('treatment.patient_friendly_explainer')}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<TrendingUpIcon />}
          sx={{ mb: 2, mr: 2 }}
          onClick={() => setOutcomeOpen(true)}
          disabled={!selectedPlan}
        >
          {t('treatment.ai_outcome_prediction')}
        </Button>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={treatmentPlans}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              {/* <MenuItem onClick={handleActionEdit}>{t('treatment.edit')}</MenuItem> */}
              <MenuItem onClick={handleActionDelete}>{t('treatment.delete')}</MenuItem>
            </Menu>
          </div>
        )}

        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('treatment.add_new')}</DialogTitle>
          <DialogContent>
            <AddTreatmentPlan
              closeModal={() => setAddOpen(false)}
              onCreate={fetchTreatmentPlans}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">{t('treatment.close')}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={explainerOpen} onClose={() => setExplainerOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('treatment.patient_friendly_explainer')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('treatment.explainer_instruction')}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <textarea
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
                value={explainerPlanText}
                onChange={e => setExplainerPlanText(e.target.value)}
                placeholder={t('treatment.explainer_placeholder')}
              />
            </Box>
            {explainerLoading && <LinearProgress sx={{ mb: 2 }} />}
            {explainerResult && (
              <Box sx={{ mt: 2 }}>
                {explainerResult.error ? (
                  <Typography color="error">{explainerResult.error}</Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('treatment.explanation')}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                      {explainerResult.explanation}
                    </Typography>
                    {explainerResult.visuals && explainerResult.visuals.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('treatment.visuals')}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {explainerResult.visuals.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={t('treatment.visual_alt', { idx: idx + 1 })}
                              style={{ maxWidth: 180, borderRadius: 8, border: '1px solid #eee' }}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExplainerOpen(false)}>{t('treatment.close')}</Button>
            <Button
              variant="contained"
              onClick={handleExplainer}
              disabled={!explainerPlanText || explainerLoading}
            >
              {t('treatment.explain')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={outcomeOpen} onClose={() => setOutcomeOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('treatment.ai_outcome_prediction')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('treatment.outcome_instruction')}
            </Typography>
            <TextField
              label={t('treatment.age')}
              type="number"
              value={patientData.age}
              onChange={e => setPatientData(d => ({ ...d, age: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('treatment.smoker')}
              select
              value={patientData.smoker ? 'true' : 'false'}
              onChange={e => setPatientData(d => ({ ...d, smoker: e.target.value === 'true' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="false">{t('treatment.no')}</MenuItem>
              <MenuItem value="true">{t('treatment.yes')}</MenuItem>
            </TextField>
            <TextField
              label={t('treatment.diabetic')}
              select
              value={patientData.diabetic ? 'true' : 'false'}
              onChange={e => setPatientData(d => ({ ...d, diabetic: e.target.value === 'true' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="false">{t('treatment.no')}</MenuItem>
              <MenuItem value="true">{t('treatment.yes')}</MenuItem>
            </TextField>
            <TextField
              label={t('treatment.oral_hygiene')}
              select
              value={patientData.oralHygiene}
              onChange={e => setPatientData(d => ({ ...d, oralHygiene: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">{t('treatment.select')}</MenuItem>
              <MenuItem value="good">{t('treatment.good')}</MenuItem>
              <MenuItem value="average">{t('treatment.average')}</MenuItem>
              <MenuItem value="poor">{t('treatment.poor')}</MenuItem>
            </TextField>
            <TextField
              label={t('treatment.previous_treatments')}
              value={patientData.previousTreatments}
              onChange={e => setPatientData(d => ({ ...d, previousTreatments: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('treatment.previous_treatments_placeholder')}
            />
            {outcomeLoading && <LinearProgress sx={{ mb: 2 }} />}
            {outcomeResult && (
              <Box sx={{ mt: 2 }}>
                {outcomeResult.error ? (
                  <Typography color="error">{outcomeResult.error}</Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('treatment.success_rate')}</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>{outcomeResult.successRate}</Typography>
                    <Typography variant="subtitle2">{t('treatment.recovery_time')}</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>{outcomeResult.recoveryTime}</Typography>
                    <Typography variant="subtitle2">{t('treatment.long_term_benefits')}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                      {outcomeResult.longTermBenefits}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOutcomeOpen(false)}>{t('treatment.close')}</Button>
            <Button
              variant="contained"
              onClick={handleOutcomePrediction}
              disabled={!selectedPlan || outcomeLoading}
            >
              {t('treatment.predict_outcome')}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default TreatmentPlans;

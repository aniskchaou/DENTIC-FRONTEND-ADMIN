import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Chip, IconButton, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';
import AddProcedure from './AddProcedure';
import EditProcedure from './EditProcedure';

const ViewProcedure = ({ procedure, onClose }) => {
  const { t } = useTranslation();
  if (!procedure) return null;
  return (
    <Dialog open={!!procedure} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TipsAndUpdatesIcon sx={{ fontSize: 28, color: '#fff' }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>{t('procedure.view')}</span>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#f5f7fa', px: { xs: 2, sm: 4 }, py: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip label={procedure.procedureName} color="primary" icon={<TipsAndUpdatesIcon />} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
            <Chip label={`${procedure.duration} ${t('procedure.minutes')}`} color="info" icon={<AccessTimeIcon />} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
            <Chip label={procedure.anesthesiaType || t('procedure.no_anesthesia')} color="success" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
            <Chip label={t(`procedure.status_${procedure.status?.toLowerCase()}`)} color={procedure.status === 'Active' ? 'success' : procedure.status === 'Inactive' ? 'warning' : 'default'} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 15 }} />
          </Stack>
          <hr />
          {procedure.description && (
            <>
              <strong>{t('procedure.description')}</strong>
              <div style={{ marginBottom: 8 }}>{procedure.description}</div>
            </>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {procedure.createdAt && (
              <Chip label={`${t('procedure.created_at')}: ${new Date(procedure.createdAt).toLocaleString()}`} color="default" size="small" variant="outlined" />
            )}
            {procedure.updatedAt && (
              <Chip label={`${t('procedure.updated_at')}: ${new Date(procedure.updatedAt).toLocaleString()}`} color="default" size="small" variant="outlined" />
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f5f7fa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ fontWeight: 600 }}>
          {t('procedure.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Procedures = () => {
  const { t } = useTranslation();
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedProcedureId, setSelectedProcedureId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Material-UI modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [recommendOpen, setRecommendOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);

  // AI Procedure Recommendation state
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendDiagnosis, setRecommendDiagnosis] = useState('');
  const [recommendHistory, setRecommendHistory] = useState({
    age: '',
    smoker: false,
    previousProcedures: '',
    allergies: ''
  });
  const [recommendResult, setRecommendResult] = useState(null);

  // Time/Cost Estimation AI state
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimateProcedure, setEstimateProcedure] = useState('');
  const [estimatePatientData, setEstimatePatientData] = useState({
    age: '',
    smoker: false,
    insurance: '',
    previousProcedures: ''
  });

  const fetchProcedures = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/procedures`)
      .then(res => setProcedures(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const refresh = () => {
    fetchProcedures();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const proc = procedures.find(p => p.id === ids[0]);
      setSelectedProcedure(proc);
      setSelectedProcedureId(ids[0]);
    } else {
      setSelectedProcedure(null);
      setSelectedProcedureId(null);
    }
  };

  const handleDelete = () => {
    if (selectedProcedureId && window.confirm('Delete selected procedure?')) {
      axios.delete(`${BASE_URL}/procedures/${selectedProcedureId}`)
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

  const handleActionEdit = () => {
    setSelectedProcedure(actionRow);
    setSelectedProcedureId(actionRow.id);
    setEditOpen(true);
    handleActionClose();
  };

  const handleActionDelete = () => {
    setSelectedProcedure(actionRow);
    setSelectedProcedureId(actionRow.id);
    handleDelete();
    handleActionClose();
  };

  const handleActionView = () => {
    setSelectedProcedure(actionRow);
    setViewOpen(true);
    handleActionClose();
  };

  // Procedure Recommendation AI function
  const handleProcedureRecommend = async () => {
    setRecommendLoading(true);
    setRecommendResult(null);
    try {
      const payload = {
        diagnosis: recommendDiagnosis,
        history: {
          age: Number(recommendHistory.age),
          smoker: Boolean(recommendHistory.smoker),
          previousProcedures: recommendHistory.previousProcedures
            ? recommendHistory.previousProcedures.split(',').map(p => p.trim()).filter(Boolean)
            : [],
          allergies: recommendHistory.allergies
            ? recommendHistory.allergies.split(',').map(a => a.trim()).filter(Boolean)
            : []
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/procedure-recommendation`, payload);

      let procedures = [];
      if (res.data && Array.isArray(res.data.procedures) && res.data.procedures.length > 0) {
        // Parse code block if present
        try {
          if (typeof res.data.procedures[0] === 'string' && res.data.procedures[0].startsWith('```json')) {
            const parsed = JSON.parse(res.data.procedures[0].replace(/```json|```/g, ''));
            procedures = parsed.procedures || [];
          } else {
            procedures = res.data.procedures;
          }
        } catch {
          procedures = res.data.procedures;
        }
      }
      setRecommendResult({ procedures });
    } catch {
      setRecommendResult({ error: 'Error getting recommendations.' });
    }
    setRecommendLoading(false);
  };

  // Time/Cost Estimation AI function
  const handleProcedureEstimation = async () => {
    setEstimateLoading(true);
    setEstimateResult(null);
    try {
      const payload = {
        procedure: estimateProcedure,
        patientData: {
          age: Number(estimatePatientData.age),
          smoker: Boolean(estimatePatientData.smoker),
          insurance: estimatePatientData.insurance,
          previousProcedures: estimatePatientData.previousProcedures
            ? estimatePatientData.previousProcedures.split(',').map(p => p.trim()).filter(Boolean)
            : []
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/procedure-estimation`, payload);

      setEstimateResult({
        estimatedTime: res.data.estimatedTime || '',
        estimatedCost: res.data.estimatedCost || 0
      });
    } catch {
      setEstimateResult({ error: 'Error estimating procedure.' });
    }
    setEstimateLoading(false);
  };

  const columns = [
    { field: 'procedureName', headerName: t('procedure.name'), width: 150 },
    { field: 'duration', headerName: t('procedure.duration_label'), width: 130 },
    { field: 'anesthesiaType', headerName: t('procedure.anesthesia'), width: 150 },
    {
      field: 'status',
      headerName: t('procedure.status'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={t(`procedure.status_${params.value.toLowerCase()}`)}
          color={
            params.value === 'Completed'
              ? 'success'
              : params.value === 'Scheduled'
              ? 'primary'
              : params.value === 'Cancelled'
              ? 'error'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('procedure.actions'),
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
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-procedures"></i> {t('procedure.title')}</h4>
      </div>

      <div className="card-body">
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setAddOpen(true)}
            startIcon={<i className="far fa-plus-square"></i>}
          >
            {t('procedure.add')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditOpen(true)}
            startIcon={<i className="fas fa-edit"></i>}
            disabled={!selectedProcedure}
          >
            {t('procedure.edit')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDelete}
            startIcon={<i className="fas fa-trash-alt"></i>}
            disabled={!selectedProcedureId}
          >
            {t('procedure.delete')}
          </Button>
          {/* AI Procedure Recommendation Button */}
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<TipsAndUpdatesIcon />}
            onClick={() => setRecommendOpen(true)}
            sx={{ ml: 2 }}
          >
            {t('procedure.recommend_ai')}
          </Button>
          {/* Time/Cost Estimation AI Button */}
          <Button
            variant="outlined"
            color="info"
            startIcon={<AccessTimeIcon />}
            onClick={() => setEstimateOpen(true)}
            sx={{ ml: 2 }}
          >
            {t('procedure.estimate_ai')}
          </Button>
        </Stack>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={procedures}
              getRowId={row => row.id}
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
              <MenuItem onClick={handleActionView}>
                <i className="fas fa-eye" style={{ marginRight: 8, color: '#1976d2' }} />
                {t('procedure.view')}
              </MenuItem>
              <MenuItem onClick={handleActionEdit}>
                <i className="fas fa-edit" style={{ marginRight: 8, color: '#ffa000' }} />
                {t('procedure.edit')}
              </MenuItem>
              <MenuItem onClick={handleActionDelete}>
                <i className="fas fa-trash-alt" style={{ marginRight: 8, color: '#e53935' }} />
                {t('procedure.delete')}
              </MenuItem>
            </Menu>
          </div>
        )}

        {/* Material-UI Add Procedure Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('procedure.add_new')}</DialogTitle>
          <DialogContent>
            <AddProcedure
              closeModal={() => setAddOpen(false)}
              onCreate={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">{t('procedure.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI Edit Procedure Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('procedure.edit')}</DialogTitle>
          <DialogContent>
            <EditProcedure
              procedure={selectedProcedure}
              closeModal={() => setEditOpen(false)}
              onSuccess={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">{t('procedure.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI View Procedure Dialog */}
        <ViewProcedure
          procedure={viewOpen ? selectedProcedure : null}
          onClose={() => setViewOpen(false)}
        />

        {/* Procedure Recommendation AI Dialog */}
        <Dialog open={recommendOpen} onClose={() => setRecommendOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('procedure.recommend_ai')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                label={t('procedure.diagnosis')}
                value={recommendDiagnosis}
                onChange={e => setRecommendDiagnosis(e.target.value)}
                fullWidth
                placeholder={t('procedure.diagnosis_placeholder')}
              />
              <TextField
                label={t('procedure.age')}
                type="number"
                value={recommendHistory.age}
                onChange={e => setRecommendHistory(h => ({ ...h, age: e.target.value }))}
                fullWidth
              />
              <TextField
                label={t('procedure.smoker')}
                select
                value={recommendHistory.smoker ? 'true' : 'false'}
                onChange={e => setRecommendHistory(h => ({ ...h, smoker: e.target.value === 'true' }))}
                fullWidth
              >
                <MenuItem value="false">{t('procedure.no')}</MenuItem>
                <MenuItem value="true">{t('procedure.yes')}</MenuItem>
              </TextField>
              <TextField
                label={t('procedure.previous_procedures')}
                value={recommendHistory.previousProcedures}
                onChange={e => setRecommendHistory(h => ({ ...h, previousProcedures: e.target.value }))}
                fullWidth
                placeholder={t('procedure.previous_procedures_placeholder')}
              />
              <TextField
                label={t('procedure.allergies')}
                value={recommendHistory.allergies}
                onChange={e => setRecommendHistory(h => ({ ...h, allergies: e.target.value }))}
                fullWidth
                placeholder={t('procedure.allergies_placeholder')}
              />
            </Stack>
            {recommendLoading && <LinearProgress sx={{ mb: 2 }} />}
            {recommendResult && (
              <Stack sx={{ mt: 2 }}>
                {recommendResult.error ? (
                  <span style={{ color: 'red' }}>{recommendResult.error}</span>
                ) : (
                  <>
                    <strong>{t('procedure.recommended_procedures')}</strong>
                    <ul>
                      {(recommendResult.procedures || []).map((proc, idx) => (
                        <li key={idx}>{proc}</li>
                      ))}
                    </ul>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecommendOpen(false)}>{t('procedure.close')}</Button>
            <Button
              variant="contained"
              onClick={handleProcedureRecommend}
              disabled={
                !recommendDiagnosis ||
                !recommendHistory.age ||
                recommendLoading
              }
            >
              {t('procedure.recommend')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Time/Cost Estimation AI Dialog */}
        <Dialog open={estimateOpen} onClose={() => setEstimateOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('procedure.estimate_ai')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                label={t('procedure.procedure')}
                value={estimateProcedure}
                onChange={e => setEstimateProcedure(e.target.value)}
                fullWidth
                placeholder={t('procedure.procedure_placeholder')}
              />
              <TextField
                label={t('procedure.age')}
                type="number"
                value={estimatePatientData.age}
                onChange={e => setEstimatePatientData(d => ({ ...d, age: e.target.value }))}
                fullWidth
              />
              <TextField
                label={t('procedure.smoker')}
                select
                value={estimatePatientData.smoker ? 'true' : 'false'}
                onChange={e => setEstimatePatientData(d => ({ ...d, smoker: e.target.value === 'true' }))}
                fullWidth
              >
                <MenuItem value="false">{t('procedure.no')}</MenuItem>
                <MenuItem value="true">{t('procedure.yes')}</MenuItem>
              </TextField>
              <TextField
                label={t('procedure.insurance')}
                value={estimatePatientData.insurance}
                onChange={e => setEstimatePatientData(d => ({ ...d, insurance: e.target.value }))}
                fullWidth
                placeholder={t('procedure.insurance_placeholder')}
              />
              <TextField
                label={t('procedure.previous_procedures')}
                value={estimatePatientData.previousProcedures}
                onChange={e => setEstimatePatientData(d => ({ ...d, previousProcedures: e.target.value }))}
                fullWidth
                placeholder={t('procedure.previous_procedures_placeholder')}
              />
            </Stack>
            {estimateLoading && <LinearProgress sx={{ mb: 2 }} />}
            {estimateResult && (
              <Stack sx={{ mt: 2 }}>
                {estimateResult.error ? (
                  <span style={{ color: 'red' }}>{estimateResult.error}</span>
                ) : (
                  <>
                    <strong>{t('procedure.estimated_time')}</strong>
                    <div>{estimateResult.estimatedTime}</div>
                    <strong>{t('procedure.estimated_cost')}</strong>
                    <div>{estimateResult.estimatedCost} USD</div>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEstimateOpen(false)}>{t('procedure.close')}</Button>
            <Button
              variant="contained"
              onClick={handleProcedureEstimation}
              disabled={
                !estimateProcedure ||
                !estimatePatientData.age ||
                estimateLoading
              }
            >
              {t('procedure.estimate')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Procedures;

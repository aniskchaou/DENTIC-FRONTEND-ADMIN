import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Chip, IconButton, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useTranslation } from 'react-i18next';
import BASE_URL from '../../main/urls/urls';
import AddOperation from './AddOperation'; // Make sure this path is correct
import EditOperation from './EditOperation'; // <-- Import your EditOperation component

const Operations = () => {
  const { t } = useTranslation();
  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedOperationId, setSelectedOperationId] = useState(null);
  const [loading, setLoading] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Material-UI modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // <-- Add edit modal state

  // Surgery Assistant AI states
  const [surgeryOpen, setSurgeryOpen] = useState(false);
  const [surgeryLoading, setSurgeryLoading] = useState(false);
  const [surgeryType, setSurgeryType] = useState('');
  const [surgeryAge, setSurgeryAge] = useState('');
  const [surgerySmoker, setSurgerySmoker] = useState(false);
  const [surgeryMedicalConditions, setSurgeryMedicalConditions] = useState('');
  const [surgeryPreviousSurgeries, setSurgeryPreviousSurgeries] = useState('');
  const [surgeryChecklist, setSurgeryChecklist] = useState(null);

  const fetchOperations = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/operations`)
      .then(res => setOperations(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const refresh = () => {
    fetchOperations();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const op = operations.find(op => op.id === ids[0]);
      setSelectedOperation(op);
      setSelectedOperationId(ids[0]);
    } else {
      setSelectedOperation(null);
      setSelectedOperationId(null);
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

  const handleActionEdit = () => {
    setSelectedOperation(actionRow);
    setSelectedOperationId(actionRow.id);
    setEditOpen(true); // <-- Open edit modal
    handleActionClose();
  };

  const handleActionDelete = () => {
    setSelectedOperation(actionRow);
    setSelectedOperationId(actionRow.id);
    if (actionRow?.id && window.confirm('Are you sure you want to delete this operation?')) {
      axios.delete(`${BASE_URL}/operations/${actionRow.id}`)
        .then(() => refresh());
    }
    handleActionClose();
  };

  // Surgery Assistant AI function
  const handleSurgeryAssistant = async () => {
    setSurgeryLoading(true);
    setSurgeryChecklist(null);
    try {
      const payload = {
        surgeryType,
        patientHistory: {
          age: Number(surgeryAge),
          smoker: Boolean(surgerySmoker),
          medicalConditions: surgeryMedicalConditions
            ? surgeryMedicalConditions.split(',').map(c => c.trim()).filter(Boolean)
            : [],
          previousSurgeries: surgeryPreviousSurgeries
            ? surgeryPreviousSurgeries.split(',').map(s => s.trim()).filter(Boolean)
            : []
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/surgery-assistant`, payload);
      setSurgeryChecklist(res.data.checklist || []);
    } catch {
      setSurgeryChecklist({ error: 'Error generating checklist.' });
    }
    setSurgeryLoading(false);
  };

  const columns = [
    { field: 'operationType', headerName: t('operation.type'), width: 150 },
    { field: 'procedureName', headerName: t('operation.procedure'), width: 200 },
    {
      field: 'operationDate',
      headerName: t('operation.date'),
      width: 180,
      valueFormatter: params => new Date(params.value).toLocaleString()
    },
    { field: 'duration', headerName: t('operation.duration'), width: 150 },
    { field: 'anesthesiaType', headerName: t('operation.anesthesia'), width: 150 },
    { field: 'complications', headerName: t('operation.complications'), width: 200 },
    {
      field: 'status',
      headerName: t('operation.status'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={t(`operation.status_${params.value.toLowerCase()}`)}
          color={
            params.value === t('operation.status_completed')
              ? 'success'
              : params.value === t('operation.status_scheduled')
              ? 'primary'
              : params.value === t('operation.status_cancelled')
              ? 'error'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'followUpRequired',
      headerName: t('operation.follow_up_required'),
      width: 170
    },
    {
      field: 'followUpDate',
      headerName: t('operation.follow_up_date'),
      width: 180,
      valueFormatter: params => params.value ? new Date(params.value).toLocaleString() : ''
    },
    {
      field: 'actions',
      headerName: t('operation.actions'),
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
        <h4><i className="fas fa-procedures"></i> {t('operation.title')}</h4>
      </div>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setAddOpen(true)}
            startIcon={<i className="far fa-plus-square"></i>}
          >
            {t('operation.add')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<ChecklistIcon />}
            onClick={() => setSurgeryOpen(true)}
          >
            {t('operation.surgery_assistant_ai')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-sync-alt"></i>}
            onClick={refresh}
          >
            {t('operation.refresh')}
          </Button>
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={operations}
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
              <MenuItem onClick={handleActionEdit}>{t('operation.edit')}</MenuItem>
              <MenuItem onClick={handleActionDelete}>{t('operation.delete')}</MenuItem>
            </Menu>
          </div>
        )}

        {/* Material-UI Add Operation Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('operation.add_new')}</DialogTitle>
          <DialogContent>
            <AddOperation
              closeModal={() => setAddOpen(false)}
              onCreate={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">{t('operation.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI Edit Operation Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('operation.edit')}</DialogTitle>
          <DialogContent>
            <EditOperation
              operation={selectedOperation}
              closeModal={() => setEditOpen(false)}
              onEdit={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">{t('operation.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Surgery Assistant Dialog */}
        <Dialog open={surgeryOpen} onClose={() => setSurgeryOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('operation.surgery_assistant_ai')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('operation.surgery_assistant_description')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSurgeryAssistant();
              }}
              style={{ marginBottom: 16 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">{t('operation.surgery_type')}</Typography>
                  <input
                    type="text"
                    value={surgeryType}
                    onChange={e => setSurgeryType(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. Dental implant placement"
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('operation.patient_age')}</Typography>
                  <input
                    type="number"
                    value={surgeryAge}
                    onChange={e => setSurgeryAge(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. 55"
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('operation.smoker')}</Typography>
                  <select
                    value={surgerySmoker ? 'true' : 'false'}
                    onChange={e => setSurgerySmoker(e.target.value === 'true')}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                  >
                    <option value="false">{t('operation.no')}</option>
                    <option value="true">{t('operation.yes')}</option>
                  </select>
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('operation.medical_conditions')}</Typography>
                  <input
                    type="text"
                    value={surgeryMedicalConditions}
                    onChange={e => setSurgeryMedicalConditions(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. Hypertension, Diabetes"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('operation.previous_surgeries')}</Typography>
                  <input
                    type="text"
                    value={surgeryPreviousSurgeries}
                    onChange={e => setSurgeryPreviousSurgeries(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. Appendectomy, Cholecystectomy"
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={surgeryLoading}
                  sx={{ borderRadius: 6, padding: '10px 20px', fontSize: 16 }}
                >
                  {surgeryLoading ? t('operation.generating') : t('operation.get_checklist')}
                </Button>
              </Box>
            </form>

            {/* Surgery checklist display */}
            {surgeryChecklist && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid #90caf9', backgroundColor: '#f9f9f9' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>{t('operation.surgery_checklist')}</Typography>
                <ul style={{ paddingLeft: 20 }}>
                  {surgeryChecklist.error ? (
                    <Typography color="error">{t('operation.error_generating_checklist')}</Typography>
                  ) : (
                    surgeryChecklist.map((item, index) => (
                      <li key={index}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1976d2', marginRight: 8 }} />
                          {item}
                        </Typography>
                      </li>
                    ))
                  )}
                </ul>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSurgeryOpen(false)} color="secondary">{t('operation.close')}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Operations;

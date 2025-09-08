import PropTypes from 'prop-types';
import './Prescription.css';
import { useEffect, useRef, useState } from 'react';
import AddPrescription from '../AddPrescription/AddPrescription';
import ViewPrescription from './../ViewPrescription/ViewPrescription';
import AddMedicamentItem from '../AddMedicamentItem/AddMedicamentItem';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import CurrentUser from '../../main/config/user';
import { Button, LinearProgress, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Drawer, Chip, Tooltip, Box, Stack, Divider, TextField, Skeleton, Badge } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MedicationIcon from '@mui/icons-material/Medication';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

const statusColors = {
  Active: 'success',
  Expired: 'error',
  Completed: 'info',
  Pending: 'warning',
};

const Prescription = () => {
  const { t } = useTranslation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Modal/dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addMedicamentDialogOpen, setAddMedicamentDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Prescription Assistant AI states
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResult, setAssistantResult] = useState(null);
  const [assistantMedication, setAssistantMedication] = useState('');
  const [assistantPatientData, setAssistantPatientData] = useState({ age: '', weight: '' });
  // Prescription Error Detection AI states
  const [errorDetectOpen, setErrorDetectOpen] = useState(false);
  const [errorDetectLoading, setErrorDetectLoading] = useState(false);
  const [errorDetectResult, setErrorDetectResult] = useState(null);
  const [errorDetectPrescription, setErrorDetectPrescription] = useState({ medication: '', dosage: '', duration: '' });
  // Prescription Explanation AI states
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);
  const [explanationPrescription, setExplanationPrescription] = useState({ medication: '', dosage: '', duration: '' });

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    getAllPrescriptions();
    axios.get(BASE_URL+'/patients').then(res => setPatients(res.data)).catch(() => setPatients([]));
    axios.get(BASE_URL+'/doctors').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    axios.get(BASE_URL+'/clinics').then(res => setClinics(res.data)).catch(() => setClinics([]));
  }, []);

  const getAllPrescriptions = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/prescriptions.json')
        .then(res => res.json())
        .then(data => {
          setPrescriptions(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    } else {
      fetch(BASE_URL + '/prescriptions')
        .then(res => res.json())
        .then(data => {
          setPrescriptions(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    }
  };

  // Helper functions to get names by ID
  const getPatientName = id => {
    const p = patients.find(x => x.id === id);
    return p ? (p.fullName || p.name || p.id) : id;
  };
  const getDoctorName = id => {
    const d = doctors.find(x => x.id === id);
    return d ? (d.fullName || d.name || d.id) : id;
  };
  const getClinicName = id => {
    const c = clinics.find(x => x.id === id);
    return c ? (c.name || c.clinicName || c.id) : id;
  };

  // Actions
  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleView = () => {
    setSelectedPrescription(actionRow);
    setViewDialogOpen(true);
    handleActionClose();
  };

  const handleAddMedicament = () => {
    setSelectedPrescription(actionRow);
    setAddMedicamentDialogOpen(true);
    handleActionClose();
  };

  const handleDelete = () => {
    if (window.confirm(t('common:confirm_delete'))) {
      prescriptionHTTPService.removePrescription([actionRow.id])
        .then(() => {
          setNotification({ open: true, message: t('prescription.deleted'), severity: 'success' });
          getAllPrescriptions();
        })
        .catch(() => setNotification({ open: true, message: t('prescription.delete_error'), severity: 'error' }));
    }
    handleActionClose();
  };

  const handleBulkDelete = () => {
    if (window.confirm(t('common:confirm_delete'))) {
      prescriptionHTTPService.removePrescription(selectedIds)
        .then(() => {
          setNotification({ open: true, message: t('prescription.bulk_deleted'), severity: 'success' });
          getAllPrescriptions();
        })
        .catch(() => setNotification({ open: true, message: t('prescription.delete_error'), severity: 'error' }));
    }
  };

  // For medication warnings (mock logic)
  const getMedicationWarnings = (prescription) => {
    // Example: if patient has allergy to "Penicillin"
    if (prescription && prescription.medications?.some(m => m.medicationName === 'Penicillin')) {
      return "Warning: Patient is allergic to Penicillin!";
    }
    // Add more logic for drug interactions
    return null;
  };

  // Bulk status update
  const handleBulkStatusUpdate = (status) => {
    // Call your backend here
    setNotification({ open: true, message: `Marked as ${status}`, severity: 'success' });
    // Optionally refresh data
  };

  // Print/download PDF (mock)
  const handlePrint = () => window.print();
  const handleDownloadPDF = () => setNotification({ open: true, message: 'PDF downloaded (mock)', severity: 'info' });

  // PDF generation
  const generatePrescriptionPDF = (prescription) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'A4'
    });

    // Header
    doc.setFillColor('#1976d2');
    doc.rect(0, 0, 595, 70, 'F');
    doc.setFontSize(24);
    doc.setTextColor('#fff');
    doc.setFont('times', 'bold');
    doc.text('Dentic Clinic Prescription', 45, 45);

    // Title
    doc.setFontSize(18);
    doc.setTextColor('#1976d2');
    doc.setFont('times', 'bold');
    doc.text('Medical Prescription', 200, 100);

    // Patient/Doctor/Clinic Info
    doc.setFontSize(12);
    doc.setTextColor('#222');
    doc.setFont('times', 'normal');
    let y = 130;
    const left = 45;
    doc.text(`Patient: `, left, y);
    doc.setFont('times', 'bold');
    doc.text(getPatientName(prescription.patientId), left + 60, y);
    doc.setFont('times', 'normal');
    y += 20;
    doc.text(`Doctor: `, left, y);
    doc.setFont('times', 'bold');
    doc.text(getDoctorName(prescription.doctorId), left + 60, y);
    doc.setFont('times', 'normal');
    y += 20;
    doc.text(`Clinic: `, left, y);
    doc.setFont('times', 'bold');
    doc.text(getClinicName(prescription.clinicId), left + 60, y);
    doc.setFont('times', 'normal');
    y += 20;
    doc.text(`Prescribed On: `, left, y);
    doc.setFont('times', 'bold');
    doc.text(prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString() : '-', left + 90, y);
    doc.setFont('times', 'normal');
    y += 20;
    doc.text(`Valid Until: `, left, y);
    doc.setFont('times', 'bold');
    doc.text(prescription.validUntil ? new Date(prescription.validUntil).toLocaleDateString() : '-', left + 80, y);

    // Medications
    y += 35;
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('Medications:', left, y);
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    y += 18;
    if (prescription.medications && prescription.medications.length > 0) {
      prescription.medications.forEach((m, idx) => {
        let medText = `${idx + 1}. ${m.medicationName}`;
        medText += m.dosage ? ` | Dosage: ${m.dosage}` : '';
        medText += m.frequency ? ` | Frequency: ${m.frequency}` : '';
        medText += m.route ? ` | Route: ${m.route}` : '';
        medText += m.duration ? ` | Duration: ${m.duration}` : '';
        medText += m.instructions ? ` | Instructions: ${m.instructions}` : '';
        medText += m.notes ? ` | Notes: ${m.notes}` : '';
        doc.text(medText, left + 10, y);
        y += 18;
      });
    } else {
      doc.text('No medications listed.', left + 10, y);
      y += 16;
    }

    // Notes
    if (prescription.notes) {
      y += 18;
      doc.setFont('times', 'bold');
      doc.text('Notes:', left, y);
      doc.setFont('times', 'normal');
      const notesLines = doc.splitTextToSize(prescription.notes, 480);
      doc.text(notesLines, left + 50, y);
      y += notesLines.length * 14;
    }

    // Status
    y += 18;
    doc.setFont('times', 'bold');
    doc.text('Status:', left, y);
    doc.setFont('times', 'normal');
    doc.text(prescription.status, left + 50, y);

    // Signature area
    y += 60;
    doc.setDrawColor('#1976d2');
    doc.line(400, y, 555, y);
    doc.setFontSize(14);
    doc.setTextColor('#1976d2');
    doc.setFont('times', 'italic');
    doc.text(getDoctorName(prescription.doctorId), 420, y + 18);
    // Show signature image if available
    if (prescription.digitalSignature) {
      doc.text('Signature:', 420, y + 35);
      doc.addImage(prescription.digitalSignature, 'PNG', 420, y + 40, 120, 40);
    }
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#222');
    //doc.text('Doctor Signature', 420, y + 90);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text('This prescription was generated electronically by Dentic Clinic.', left, 800);

    doc.save(`prescription_${prescription.id || ''}.pdf`);
  };

  // Actions menu for each row
  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => { setActionAnchorEl(event.currentTarget); setActionRow(params.row); }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={actionAnchorEl} open={Boolean(actionAnchorEl)} onClose={() => setActionAnchorEl(null)}>
        <MenuItem onClick={() => { setSelectedPrescription(params.row); setViewDialogOpen(true); setActionAnchorEl(null); }}>
          {t('common:view')}
        </MenuItem>
        <MenuItem onClick={async () => { 
          if (window.confirm(t('common:confirm_delete'))) {
            await prescriptionHTTPService.removePrescription([params.row.id]); 
            setNotification({ open: true, message: t('prescription.deleted'), severity: 'success' }); 
            getAllPrescriptions(); 
          }
          setActionAnchorEl(null); 
        }}>
          {t('common:delete')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            generatePrescriptionPDF(params.row);
            setActionAnchorEl(null);
          }}
        >
          {t('common:generate_pdf')}
        </MenuItem>
      </Menu>
    </div>
  );

  // Update columns for status chip and view action
  const columns = [
    {
      field: 'patientId',
      headerName: t('prescription.patient'),
      width: 200,
      valueGetter: params => getPatientName(params.row.patientId),
    },
    {
      field: 'doctorId',
      headerName: t('prescription.doctor'),
      width: 200,
      valueGetter: params => getDoctorName(params.row.doctorId),
    },
    {
      field: 'clinicId',
      headerName: t('prescription.clinic'),
      width: 200,
      valueGetter: params => getClinicName(params.row.clinicId),
    },
    {
      field: 'prescriptionDate',
      headerName: t('prescription.prescribed_on'),
      width: 170,
      renderCell: (params) => (
        <Badge
          color="success"
          variant="standard"
          sx={{ mr: 1, p: 1, fontWeight: 'bold', fontSize: 14 }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <span role="img" aria-label="prescribed" style={{ marginRight: 6 }}>🟢</span>
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Badge>
      )
    },
    {
      field: 'validUntil',
      headerName: t('prescription.valid_until'),
      width: 170,
      renderCell: (params) => (
        <Badge
          color="error"
          variant="standard"
          sx={{ mr: 1, p: 1, fontWeight: 'bold', fontSize: 14 }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <span role="img" aria-label="valid-until" style={{ marginRight: 6 }}>🔴</span>
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Badge>
      )
    },
    { field: 'refillAllowed', headerName: t('prescription.refill_allowed'), width: 120 },
    { field: 'refillCount', headerName: t('prescription.refill_count'), width: 110 },
    {
      field: 'status',
      headerName: t('prescription.status'),
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('prescription.actions'),
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: renderActionsMenu
    }
  ];

  // Prescription Assistant AI function
  const handlePrescriptionAssistant = async () => {
    setAssistantLoading(true);
    setAssistantResult(null);
    try {
      const payload = {
        medication: assistantMedication,
        patientData: {
          age: Number(assistantPatientData.age),
          weight: Number(assistantPatientData.weight)
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/prescription-assistant`, payload);
      setAssistantResult({
        dosage: res.data.dosage || '',
        duration: res.data.duration || ''
      });
    } catch {
      setAssistantResult({ error: 'Error getting dosage/duration.' });
    }
    setAssistantLoading(false);
  };

  // Prescription Error Detection AI function
  const handlePrescriptionErrorDetection = async () => {
    setErrorDetectLoading(true);
    setErrorDetectResult(null);
    try {
      const payload = {
        prescription: {
          medication: errorDetectPrescription.medication,
          dosage: errorDetectPrescription.dosage,
          duration: errorDetectPrescription.duration
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/prescription-error-detection`, payload);
      setErrorDetectResult({
        errors: res.data.errors || []
      });
    } catch {
      setErrorDetectResult({ error: 'Error detecting prescription issues.' });
    }
    setErrorDetectLoading(false);
  };

  // Prescription Explanation AI function
  const handlePrescriptionExplanation = async () => {
    setExplanationLoading(true);
    setExplanationResult(null);
    try {
      const payload = {
        prescription: {
          medication: explanationPrescription.medication,
          dosage: explanationPrescription.dosage,
          duration: explanationPrescription.duration
        }
      };
      const res = await axios.post(`${BASE_URL}/ai/prescription-explanation`, payload);
      setExplanationResult({
        explanation: res.data.explanation || ''
      });
    } catch {
      setExplanationResult({ error: 'Error getting explanation.' });
    }
    setExplanationLoading(false);
  };

  // Chart data
  const statusCounts = prescriptions.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#43a047', '#e53935', '#ffa000', '#1976d2'],
    }]
  };

  // Loading skeletons
  if (loading) {
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
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> {t('prescription.title')}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          <i className="fas fa-plus"></i> {t('prescription.create')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={getAllPrescriptions}
          sx={{ mb: 2, ml: 2 }}
        >
          <i className="fas fa-refresh"></i> {t('common:reload')}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<MedicationIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setAssistantOpen(true)}
        >
          {t('prescription.prescription_assistant_ai')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<ReportProblemIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setErrorDetectOpen(true)}
        >
          {t('prescription.prescription_error_detection_ai')}
        </Button>
        <Button
          variant="outlined"
          color="info"
          startIcon={<InfoOutlinedIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setExplanationOpen(true)}
        >
          {t('prescription.prescription_explanation_ai')}
        </Button>
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={prescriptions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
              onSelectionModelChange={ids => setSelectedIds(ids)}
              autoHeight
              aria-label={t('prescription.table_aria')}
              getRowHeight={() => 50}
            />
          </div>
        )}

        {/* Add Prescription Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('prescription.create')}</DialogTitle>
          <DialogContent>
            <AddPrescription closeModal={() => { setAddDialogOpen(false); getAllPrescriptions(); }} />
          </DialogContent>
        </Dialog>

        {/* View Prescription Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-prescription-bottle-alt" style={{ color: '#1976d2', fontSize: 22 }} />
              {t('prescription.details')}
            </span>
          </DialogTitle>
          <DialogContent>
            {selectedPrescription ? (
              <div>
                <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2, mb: 2 }}>
                  <Typography variant="body1"><strong>{t('prescription.patient')}:</strong> {getPatientName(selectedPrescription.patientId)}</Typography>
                  <Typography variant="body1"><strong>{t('prescription.doctor')}:</strong> {getDoctorName(selectedPrescription.doctorId)}</Typography>
                  <Typography variant="body1"><strong>{t('prescription.clinic')}:</strong> {getClinicName(selectedPrescription.clinicId)}</Typography>
                  <Typography variant="body1"><strong>{t('prescription.prescribed_on')}:</strong> {selectedPrescription.prescriptionDate ? new Date(selectedPrescription.prescriptionDate).toLocaleDateString() : '-'}</Typography>
                  <Typography variant="body1"><strong>{t('prescription.valid_until')}:</strong> {selectedPrescription.validUntil ? new Date(selectedPrescription.validUntil).toLocaleDateString() : '-'}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{t('prescription.medications')}:</Typography>
                  <Stack spacing={2}>
                    {selectedPrescription.medications?.length > 0 ? (
                      selectedPrescription.medications.map((m, idx) => (
                        <Box key={idx} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff' }}>
                          <Typography variant="subtitle2" fontWeight={600}>{idx + 1}. {m.medicationName}</Typography>
                          <Typography variant="body2"><strong>{t('prescription.dosage')}:</strong> {m.dosage || t('prescription.not_specified')}</Typography>
                          <Typography variant="body2"><strong>{t('prescription.frequency')}:</strong> {m.frequency || t('prescription.not_specified')}</Typography>
                          {m.duration && <Typography variant="body2"><strong>{t('prescription.duration_days')}:</strong> {m.duration}</Typography>}
                          {m.route && <Typography variant="body2"><strong>{t('prescription.route')}:</strong> {m.route}</Typography>}
                          {m.instructions && <Typography variant="body2"><strong>{t('prescription.instructions')}:</strong> {m.instructions}</Typography>}
                          {m.notes && <Typography variant="body2"><strong>{t('prescription.notes')}:</strong> {m.notes}</Typography>}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">{t('prescription.no_medications')}</Typography>
                    )}
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>{t('prescription.notes')}:</Typography>
                  <Typography variant="body2">{selectedPrescription.notes || '-'}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>{t('prescription.status')}: <Chip label={selectedPrescription.status} color={statusColors[selectedPrescription.status] || 'default'} size="small" /></Typography>
                  {getMedicationWarnings(selectedPrescription) && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {getMedicationWarnings(selectedPrescription)}
                    </Alert>
                  )}
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>{t('common:print')}</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => generatePrescriptionPDF(selectedPrescription)}>{t('common:download_pdf')}</Button>
                </Stack>
              </div>
            ) : (
              <Typography>{t('prescription.no_prescription_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)} color="secondary" variant="outlined">
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Medicament Item Dialog */}
        <Dialog open={addMedicamentDialogOpen} onClose={() => setAddMedicamentDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('medicament.add_item')}</DialogTitle>
          <DialogContent>
            <AddMedicamentItem updatedItem={selectedPrescription} />
          </DialogContent>
        </Dialog>

        {/* Prescription Assistant Dialog */}
        <Dialog open={assistantOpen} onClose={() => setAssistantOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('prescription.prescription_assistant_ai')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('prescription.enter_medication_and_patient_data')}
            </Typography>
            <TextField
              label={t('prescription.medication')}
              value={assistantMedication}
              onChange={e => setAssistantMedication(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.medication_placeholder')}
            />
            <TextField
              label={t('prescription.age')}
              type="number"
              value={assistantPatientData.age}
              onChange={e => setAssistantPatientData(d => ({ ...d, age: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('prescription.weight_kg')}
              type="number"
              value={assistantPatientData.weight}
              onChange={e => setAssistantPatientData(d => ({ ...d, weight: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            {assistantLoading && <LinearProgress sx={{ mb: 2 }} />}
            {assistantResult && (
              <Box sx={{ mt: 2 }}>
                {assistantResult.error ? (
                  <Alert severity="error">{assistantResult.error}</Alert>
                ) : (
                  <>
                    {/* Improved display for code block response */}
                    {typeof assistantResult.dosage === 'string' && assistantResult.dosage.startsWith('```json') ? (() => {
                      try {
                        const parsed = JSON.parse(assistantResult.dosage.replace(/```json|```/g, ''));
                        return (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">{t('prescription.dosage')}:</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>{parsed.dosage}</Typography>
                            <Typography variant="subtitle2">{t('prescription.duration')}:</Typography>
                            <Typography variant="body2">{parsed.duration}</Typography>
                          </Box>
                        );
                      } catch {
                        return (
                          <>
                            <Typography variant="subtitle2">{t('prescription.dosage')}:</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>{assistantResult.dosage}</Typography>
                            <Typography variant="subtitle2">{t('prescription.duration')}:</Typography>
                            <Typography variant="body2">{assistantResult.duration}</Typography>
                          </>
                        );
                      }
                    })() : (
                      <>
                        <Typography variant="subtitle2">{t('prescription.dosage')}:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{assistantResult.dosage}</Typography>
                        <Typography variant="subtitle2">{t('prescription.duration')}:</Typography>
                        <Typography variant="body2">{assistantResult.duration}</Typography>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssistantOpen(false)}>{t('common:close')}</Button>
            <Button
              variant="contained"
              onClick={handlePrescriptionAssistant}
              disabled={
                !assistantMedication ||
                !assistantPatientData.age ||
                !assistantPatientData.weight ||
                assistantLoading
              }
            >
              {t('common:suggest')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prescription Error Detection Dialog */}
        <Dialog open={errorDetectOpen} onClose={() => setErrorDetectOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('prescription.prescription_error_detection_ai')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('prescription.enter_prescription_details')}
            </Typography>
            <TextField
              label={t('prescription.medication')}
              value={errorDetectPrescription.medication}
              onChange={e => setErrorDetectPrescription(p => ({ ...p, medication: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.medication_placeholder')}
            />
            <TextField
              label={t('prescription.dosage')}
              value={errorDetectPrescription.dosage}
              onChange={e => setErrorDetectPrescription(p => ({ ...p, dosage: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.dosage_placeholder')}
            />
            <TextField
              label={t('prescription.duration')}
              value={errorDetectPrescription.duration}
              onChange={e => setErrorDetectPrescription(p => ({ ...p, duration: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.duration_placeholder')}
            />
            {errorDetectLoading && <LinearProgress sx={{ mb: 2 }} />}
            {errorDetectResult && (
              <Box sx={{ mt: 2 }}>
                {errorDetectResult.error ? (
                  <Alert severity="error">{errorDetectResult.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('prescription.detected_issues')}:</Typography>
                    {errorDetectResult.errors.length > 0 ? (
                      <ul>
                        {errorDetectResult.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="success.main">{t('prescription.no_errors_detected')}</Typography>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setErrorDetectOpen(false)}>{t('common:close')}</Button>
            <Button
              variant="contained"
              onClick={handlePrescriptionErrorDetection}
              disabled={
                !errorDetectPrescription.medication ||
                !errorDetectPrescription.dosage ||
                !errorDetectPrescription.duration ||
                errorDetectLoading
              }
            >
              {t('common:check')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prescription Explanation Dialog */}
        <Dialog open={explanationOpen} onClose={() => setExplanationOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('prescription.prescription_explanation_ai')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('prescription.enter_prescription_details_for_explanation')}
            </Typography>
            <TextField
              label={t('prescription.medication')}
              value={explanationPrescription.medication}
              onChange={e => setExplanationPrescription(p => ({ ...p, medication: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.medication_placeholder')}
            />
            <TextField
              label={t('prescription.dosage')}
              value={explanationPrescription.dosage}
              onChange={e => setExplanationPrescription(p => ({ ...p, dosage: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.dosage_placeholder')}
            />
            <TextField
              label={t('prescription.duration')}
              value={explanationPrescription.duration}
              onChange={e => setExplanationPrescription(p => ({ ...p, duration: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={t('prescription.duration_placeholder')}
            />
            {explanationLoading && <LinearProgress sx={{ mb: 2 }} />}
            {explanationResult && (
              <Box sx={{ mt: 2 }}>
                {explanationResult.error ? (
                  <Alert severity="error">{explanationResult.error}</Alert>
                ) : (
                  <>
                    <Typography variant="subtitle2">{t('prescription.explanation')}:</Typography>
                    <Typography variant="body2">{explanationResult.explanation}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExplanationOpen(false)}>{t('common:close')}</Button>
            <Button
              variant="contained"
              onClick={handlePrescriptionExplanation}
              disabled={
                !explanationPrescription.medication ||
                !explanationPrescription.dosage ||
                !explanationPrescription.duration ||
                explanationLoading
              }
            >
              {t('common:explain')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detailed View Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: { xs: 320, sm: 480 } } }}
        >
          <div style={{ padding: 24, maxWidth: 480 }}>
            <Typography variant="h6" gutterBottom>
              {t('prescription.details')}
            </Typography>
            {selectedPrescription && (
              <>
                <Typography variant="subtitle2">{t('prescription.patient')}: {getPatientName(selectedPrescription.patientId)}</Typography>
                <Typography variant="subtitle2">{t('prescription.doctor')}: {getDoctorName(selectedPrescription.doctorId)}</Typography>
                <Typography variant="subtitle2">{t('prescription.clinic')}: {getClinicName(selectedPrescription.clinicId)}</Typography>
                <Typography variant="subtitle2">{t('prescription.prescribed_on')}: {selectedPrescription.prescriptionDate ? new Date(selectedPrescription.prescriptionDate).toLocaleDateString() : '-'}</Typography>
                <Typography variant="subtitle2">{t('prescription.valid_until')}: {selectedPrescription.validUntil ? new Date(selectedPrescription.validUntil).toLocaleDateString() : '-'}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('prescription.medications')}:</Typography>
                <ul>
                  {selectedPrescription.medications?.map((m, idx) => (
                    <li key={idx}>
                      <strong>{m.medicationName}</strong> ({m.dosage}, {m.frequency})
                    </li>
                  ))}
                </ul>
                <Typography variant="subtitle2">{t('prescription.notes')}:</Typography>
                <Typography variant="body2">{selectedPrescription.notes || '-'}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('prescription.status')}: <Chip label={selectedPrescription.status} color={statusColors[selectedPrescription.status] || 'default'} size="small" /></Typography>
                {/* Medication Warnings */}
                {getMedicationWarnings(selectedPrescription) && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {getMedicationWarnings(selectedPrescription)}
                  </Alert>
                )}
                {/* Print/Download PDF */}
                <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>{t('common:print')}</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => generatePrescriptionPDF(selectedPrescription)}>{t('common:download_pdf')}</Button>
                </div>
              </>
            )}
          </div>
        </Drawer>

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
      </div>
    </div>
  );
};

Prescription.propTypes = {};
Prescription.defaultProps = {};
export default Prescription;

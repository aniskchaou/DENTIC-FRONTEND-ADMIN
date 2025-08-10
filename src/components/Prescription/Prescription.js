import PropTypes from 'prop-types';
import './Prescription.css';
import { useEffect, useRef, useState } from 'react';
import AddPrescription from '../AddPrescription/AddPrescription';
import ViewPrescription from './../ViewPrescription/ViewPrescription';
import EditPrescription from './../EditPrescription/EditPrescription';
import AddMedicamentItem from '../AddMedicamentItem/AddMedicamentItem';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import CurrentUser from '../../main/config/user';
import { Button, LinearProgress, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Drawer, Chip, Tooltip, Box, Stack, Divider } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import jsPDF from 'jspdf';

const statusColors = {
  Active: 'success',
  Expired: 'error',
  Completed: 'info',
  Pending: 'warning',
};

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Modal/dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addMedicamentDialogOpen, setAddMedicamentDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    prescriptionHTTPService.getAllPrescription()
      .then(response => {
        setPrescriptions(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        setLoading(false);
      });
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

  const handleEdit = () => {
    setSelectedPrescription(actionRow);
    setEditDialogOpen(true);
    handleActionClose();
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
    if (window.confirm("Etes-vous sûr que vous voulez supprimer ?")) {
      prescriptionHTTPService.removePrescription([actionRow.id])
        .then(() => {
          setNotification({ open: true, message: 'Prescription deleted', severity: 'success' });
          getAllPrescriptions();
        })
        .catch(() => setNotification({ open: true, message: 'Error deleting', severity: 'error' }));
    }
    handleActionClose();
  };

  const handleBulkDelete = () => {
    if (window.confirm("Etes-vous sûr que vous voulez supprimer ?")) {
      prescriptionHTTPService.removePrescription(selectedIds)
        .then(() => {
          setNotification({ open: true, message: 'Prescriptions deleted', severity: 'success' });
          getAllPrescriptions();
        })
        .catch(() => setNotification({ open: true, message: 'Error deleting', severity: 'error' }));
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
        doc.text(
          `${idx + 1}. ${m.medicationName} (${m.dosage}, ${m.frequency})`,
          left + 10,
          y
        );
        y += 16;
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
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#222');
    doc.text('Doctor Signature', 420, y + 34);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text('This prescription was generated electronically by Dentic Clinic.', left, 800);

    doc.save(`prescription_${prescription.id || ''}.pdf`);
  };

  // Update columns for status chip and view action
  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient',
      width: 200,
      valueGetter: params => getPatientName(params.row.patientId), // Shows patient name
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      width: 200,
      valueGetter: params => getDoctorName(params.row.doctorId), // Shows doctor name
    },
    {
      field: 'clinicId',
      headerName: 'Clinic',
      width: 200,
      valueGetter: params => getClinicName(params.row.clinicId), // Shows clinic name
    },
    {
      field: 'medications',
      headerName: 'Medications',
      width: 220,
      renderCell: (params) =>
        params.value && params.value.length > 0
          ? params.value.map(m => `${m.medicationName} (${m.dosage}, ${m.frequency})`).join(', ')
          : '-'
    },
    {
      field: 'prescriptionDate',
      headerName: 'Prescribed On',
      width: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'validUntil',
      headerName: 'Valid Until',
      width: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    { field: 'refillAllowed', headerName: 'Refill Allowed', width: 120 },
    { field: 'refillCount', headerName: 'Refill Count', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
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
      headerName: 'Actions',
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
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => { setSelectedPrescription(params.row); setDrawerOpen(true); }}>
              <i className="fas fa-eye"></i>
            </IconButton>
          </Tooltip>
        </>
      ),
    }
  ];


  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> Prescriptions
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          <i className="fas fa-plus"></i> Create
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={getAllPrescriptions}
          sx={{ mb: 2, ml: 2 }}
        >
          <i className="fas fa-refresh"></i> Reload
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
            />
            <Menu
              id="action-menu"
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleView}>View</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
              <MenuItem
                onClick={() => {
                  generatePrescriptionPDF(actionRow);
                  handleActionClose();
                }}
              >
                Generate PDF
              </MenuItem>
            </Menu>
          </div>
        )}

        {/* Add Prescription Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Prescription</DialogTitle>
          <DialogContent>
            <AddPrescription closeModal={() => { setAddDialogOpen(false); getAllPrescriptions(); }} />
          </DialogContent>
        </Dialog>

        {/* Edit Prescription Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Prescription</DialogTitle>
          <DialogContent>
            <EditPrescription updatedItem={selectedPrescription} closeModal={() => { setEditDialogOpen(false); getAllPrescriptions(); }} />
          </DialogContent>
        </Dialog>

        {/* View Prescription Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-prescription-bottle-alt" style={{ color: '#1976d2', fontSize: 22 }} />
              Prescription Details
            </span>
          </DialogTitle>
          <DialogContent>
            {selectedPrescription ? (
              <div>
                <Box
                  sx={{
                    bgcolor: '#fafdff',
                    borderRadius: 2,
                    boxShadow: 1,
                    p: { xs: 2, sm: 3 },
                    minWidth: 320,
                    minHeight: 200,
                    mb: 2
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Patient: ${getPatientName(selectedPrescription.patientId)}`}
                      color="primary"
                      icon={<i className="fas fa-user"></i>}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Doctor: ${getDoctorName(selectedPrescription.doctorId)}`}
                      color="info"
                      icon={<i className="fas fa-user-md"></i>}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Clinic: ${getClinicName(selectedPrescription.clinicId)}`}
                      color="success"
                      icon={<i className="fas fa-hospital"></i>}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Status: ${selectedPrescription.status}`}
                      color={statusColors[selectedPrescription.status] || 'default'}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Prescribed On: ${selectedPrescription.prescriptionDate ? new Date(selectedPrescription.prescriptionDate).toLocaleDateString() : '-'}`}
                      color="default"
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Valid Until: ${selectedPrescription.validUntil ? new Date(selectedPrescription.validUntil).toLocaleDateString() : '-'}`}
                      color="warning"
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Refill Allowed: ${selectedPrescription.refillAllowed ? 'Yes' : 'No'}`}
                      color={selectedPrescription.refillAllowed ? 'success' : 'default'}
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                    <Chip
                      label={`Refill Count: ${selectedPrescription.refillCount ?? '-'}`}
                      color="info"
                      sx={{ fontWeight: 600, fontSize: 15 }}
                    />
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Medications:
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {selectedPrescription.medications?.length > 0 ? (
                      selectedPrescription.medications.map((m, idx) => (
                        <Chip
                          key={idx}
                          label={`${m.medicationName} (${m.dosage}, ${m.frequency})`}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No medications listed.</Typography>
                    )}
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600}>Notes:</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{selectedPrescription.notes || '-'}</Typography>
                  {/* Medication Warnings */}
                  {getMedicationWarnings(selectedPrescription) && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {getMedicationWarnings(selectedPrescription)}
                    </Alert>
                  )}
                </Box>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => generatePrescriptionPDF(selectedPrescription)}>Download PDF</Button>
                </Stack>
              </div>
            ) : (
              <Typography>No prescription selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)} color="secondary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Medicament Item Dialog */}
        <Dialog open={addMedicamentDialogOpen} onClose={() => setAddMedicamentDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Medicament Item</DialogTitle>
          <DialogContent>
            <AddMedicamentItem updatedItem={selectedPrescription} />
          </DialogContent>
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
              Prescription Details
            </Typography>
            {selectedPrescription && (
              <>
                <Typography variant="subtitle2">Patient: {getPatientName(selectedPrescription.patientId)}</Typography>
                <Typography variant="subtitle2">Doctor: {getDoctorName(selectedPrescription.doctorId)}</Typography>
                <Typography variant="subtitle2">Clinic: {getClinicName(selectedPrescription.clinicId)}</Typography>
                <Typography variant="subtitle2">Prescribed On: {selectedPrescription.prescriptionDate ? new Date(selectedPrescription.prescriptionDate).toLocaleDateString() : '-'}</Typography>
                <Typography variant="subtitle2">Valid Until: {selectedPrescription.validUntil ? new Date(selectedPrescription.validUntil).toLocaleDateString() : '-'}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Medications:</Typography>
                <ul>
                  {selectedPrescription.medications?.map((m, idx) => (
                    <li key={idx}>
                      <strong>{m.medicationName}</strong> ({m.dosage}, {m.frequency})
                    </li>
                  ))}
                </ul>
                <Typography variant="subtitle2">Notes:</Typography>
                <Typography variant="body2">{selectedPrescription.notes || '-'}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Status: <Chip label={selectedPrescription.status} color={statusColors[selectedPrescription.status] || 'default'} size="small" /></Typography>
                {/* Medication Warnings */}
                {getMedicationWarnings(selectedPrescription) && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {getMedicationWarnings(selectedPrescription)}
                  </Alert>
                )}
                {/* Print/Download PDF */}
                <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                  <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => generatePrescriptionPDF(selectedPrescription)}>Download PDF</Button>
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

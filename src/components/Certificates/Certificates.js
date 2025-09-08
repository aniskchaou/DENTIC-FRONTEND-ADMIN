import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Certificates.css';
import AddCertificate from './AddCertificate';
import EditCertificate from '../EditCertificate/EditCertificate';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import showMessage from '../../libraries/messages/messages';
import { LoadJSFiles } from './../init';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button, CircularProgress, LinearProgress, Typography, Chip, Menu, MenuItem, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Drawer, Snackbar, Alert, Skeleton, Tooltip as MuiTooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TemplateIcon from '@mui/icons-material/Description';
import SignatureIcon from '@mui/icons-material/BorderColor';
import jsPDF from 'jspdf';
import BASE_URL from '../../main/urls/urls';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';


Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Certificates = () => {
  const { t } = useTranslation();
  // State
  const [loading, setLoading] = useState(true);
  const [skeleton, setSkeleton] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCertificate, setDrawerCertificate] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [editRowsModel, setEditRowsModel] = useState({});
  const [filter, setFilter] = useState({
    type: '', status: '', patient: '', doctor: '', clinic: '', from: '', to: ''
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const userRole = 'admin'; // Simulate role

  // Fetch data
  useEffect(() => {
    LoadJSFiles();
    getAllCertificates();
    fetch(`${BASE_URL}/patients`).then(res => res.json()).then(setPatients);
    fetch(`${BASE_URL}/doctors`).then(res => res.json()).then(setDoctors);
    fetch(`${BASE_URL}/clinics`).then(res => res.json()).then(setClinics);
  }, []);

  const getAllCertificates = () => {
    setLoading(true);
    setSkeleton(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/certificates.json')
        .then(res => res.json())
        .then(data => {
          setCertificates(data);
          setTimeout(() => setSkeleton(false), 800);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', 'Failed to load certificates', 'warning');
          setLoading(false);
        });
    } else {
      certificateHTTPService.getAllCertificate()
        .then(response => {
          setCertificates(response.data);
          setTimeout(() => setSkeleton(false), 800);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', 'Failed to load certificates', 'warning');
          setLoading(false);
        });
    }
  };

  // Filtering
  const filteredCertificates = certificates.filter(c => {
    const matchesType = filter.type ? c.certificateType === filter.type : true;
    const matchesStatus = filter.status ? c.status === filter.status : true;
    const matchesPatient = filter.patient ? c.patientId === filter.patient : true;
    const matchesDoctor = filter.doctor ? c.doctorId === filter.doctor : true;
    const matchesClinic = filter.clinic ? c.clinicId === filter.clinic : true;
    const matchesFrom = filter.from ? new Date(c.issueDate) >= new Date(filter.from) : true;
    const matchesTo = filter.to ? new Date(c.issueDate) <= new Date(filter.to) : true;
    return matchesType && matchesStatus && matchesPatient && matchesDoctor && matchesClinic && matchesFrom && matchesTo;
  });

  // Helper functions
  const getPatientName = id => patients.find(p => p.id === id)?.fullName || t('certificates.patient_not_found');
  const getDoctorName = id => doctors.find(d => d.id === id)?.fullName || t('certificates.doctor_not_found');
  const getClinicName = id => clinics.find(c => c.id === id)?.name || t('certificates.clinic_not_found');

  // Inline editing
  const handleEditRowsModelChange = (model) => setEditRowsModel(model);
  const handleRowEditCommit = async (id) => {
    const changes = editRowsModel[id];
    if (changes) {
      const updated = { ...certificates.find(c => c.id === id), ...Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.value])) };
      await certificateHTTPService.updateCertificate(id, updated);
      setSnackbar({ open: true, message: 'Certificate updated', severity: 'success' });
      getAllCertificates();
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    await Promise.all(bulkSelection.map(id => certificateHTTPService.removeCertificate(id)));
    setSnackbar({ open: true, message: 'Certificates deleted', severity: 'success' });
    getAllCertificates();
  };
  const handleBulkStatus = async (status) => {
    await Promise.all(bulkSelection.map(id => certificateHTTPService.updateCertificate(id, { status })));
    setSnackbar({ open: true, message: `Marked selected as ${status}`, severity: 'success' });
    getAllCertificates();
  };

  // Export
  const exportToExcel = () => {
    const csvContent = [
      Object.keys(certificates[0] || {}).join(','),
      ...certificates.map(c => Object.values(c).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificates.xlsx';
    a.click();
    setSnackbar({ open: true, message: 'Exported to Excel', severity: 'success' });
  };
  const exportToPDF = () => {
    window.print();
    setSnackbar({ open: true, message: 'Print dialog opened for PDF export', severity: 'info' });
  };

  // Actions menu for each row
  const renderActionsMenu = (params) => (
    <div>
      <IconButton onClick={(event) => { setAnchorEl(event.currentTarget); setSelectedRow(params.row); }}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => { setDrawerCertificate(selectedRow); setDrawerOpen(true); setAnchorEl(null); }}>
          {t('certificates.view')}
        </MenuItem>
        {userRole === 'admin' && (
          <MenuItem onClick={async () => { await certificateHTTPService.removeCertificate(selectedRow.id); setSnackbar({ open: true, message: t('certificates.deleted'), severity: 'success' }); getAllCertificates(); setAnchorEl(null); }}>
            {t('certificates.delete')}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            exportCertificateToPDF(selectedRow);
            setAnchorEl(null);
          }}
        >
          {t('certificates.download')}
        </MenuItem>
      </Menu>
    </div>
  );

  // Columns for Certificates table
  const columns = [
    { field: 'certificateNumber', headerName: t('certificates.certificate_number'), width: 150, editable: false },
    {
      field: 'certificateType',
      headerName: t('certificates.type'),
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'patientId',
      headerName: t('certificates.patient'),
      width: 220,
      renderCell: (params) => (<span>{getPatientName(params.value)}</span>)
    },
    {
      field: 'doctorId',
      headerName: t('certificates.doctor'),
      width: 220,
      renderCell: (params) => (<span>{getDoctorName(params.value)}</span>)
    },
    {
      field: 'clinicId',
      headerName: t('certificates.clinic'),
      width: 220,
      renderCell: (params) => (<span>{getClinicName(params.value)}</span>)
    },
    {
      field: 'status',
      headerName: t('certificates.status'),
      width: 120,
      editable: userRole === 'admin',
      renderCell: (params) => (
        <Chip
          label={t(`certificates.status_${params.value.toLowerCase()}`)}
          color={
            params.value === 'Active'
              ? 'success'
              : params.value === 'Expired'
                ? 'error'
                : 'default'
          }
          size="small"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'issueDate',
      headerName: t('certificates.issued_on'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={new Date(params.value).toLocaleDateString()}
          color="primary"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'validUntil',
      headerName: t('certificates.valid_until'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={new Date(params.value).toLocaleDateString()}
          color="info"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      field: 'recommendations',
      headerName: t('certificates.recommendations'),
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={params.value}
            color="warning"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'actions',
      headerName: t('certificates.actions'),
      width: 120,
      renderCell: renderActionsMenu
    }
  ];

  // Chart data
  const types = certificates.reduce((acc, c) => {
    acc[c.certificateType] = (acc[c.certificateType] || 0) + 1;
    return acc;
  }, {});
  const doughnutData = {
    labels: Object.keys(types),
    datasets: [{
      data: Object.values(types),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };
  const barData = {
    labels: Object.keys(types),
    datasets: [{
      label: t('certificates.per_type'),
      data: Object.values(types),
      backgroundColor: '#1976d2'
    }]
  };
  const lineData = {
    labels: Object.keys(types),
    datasets: [
      {
        label: t('certificates.active'),
        data: Object.keys(types).map(type => certificates.filter(c => c.certificateType === type && c.status === 'Active').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: t('certificates.expired'),
        data: Object.keys(types).map(type => certificates.filter(c => c.certificateType === type && c.status === 'Expired').length),
        borderColor: '#e53935',
        fill: false,
      }
    ]
  };

  // Loading skeletons
  if (skeleton) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={500} />
      </Box>
    );
  }

  // Add this function inside the Certificates component, before the return statement:
  const handleCreateCertificate = async (certificateData) => {
    try {
      await certificateHTTPService.createCertificate(certificateData);
      setSnackbar({ open: true, message: 'Certificate created successfully', severity: 'success' });
      getAllCertificates();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create certificate', severity: 'error' });
    }
  };

  // Add this function inside the Certificates component, before the return statement:
  const exportCertificateToPDF = (certificate) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'A4'
    });

    // Header
    doc.setFillColor('#1976d2');
    doc.rect(0, 0, 595, 80, 'F');
    doc.setFontSize(28);
    doc.setTextColor('#fff');
    doc.setFont('times', 'bold');
    doc.text('Dentic Clinic', 40, 50);

    // Certificate Title
    doc.setFontSize(22);
    doc.setTextColor('#1976d2');
    doc.setFont('times', 'bold');
    doc.text('Medical Certificate', 200, 120);

    // Decorative line
    doc.setDrawColor('#1976d2');
    doc.setLineWidth(2);
    doc.line(40, 130, 555, 130);

    // Paragraph content
    doc.setFontSize(13);
    doc.setTextColor('#222');
    let y = 170;
    const leftMargin = 40;
    const maxWidth = 515;

    const patientName = getPatientName(certificate.patientId);
    const doctorName = getDoctorName(certificate.doctorId);
    const clinicName = getClinicName(certificate.clinicId);
    const issueDate = new Date(certificate.issueDate).toLocaleDateString();
    const validUntil = new Date(certificate.validUntil).toLocaleDateString();

    // Compose the certificate paragraph with bold for important info
    const paragraph =
      `This is to certify that ${patientName} has been examined and treated at ${clinicName} by Dr. ${doctorName} on ${issueDate}. Diagnosis: ${certificate.diagnosis}. Treatment provided: ${certificate.treatmentDetails}.` +
      (certificate.recommendations ? ` Recommendations: ${certificate.recommendations}.` : '') +
      ` This certificate is valid until ${validUntil}.`;

    // Split the paragraph into lines that fit the page width
    const lines = doc.splitTextToSize(paragraph, maxWidth);

    // Print the paragraph (all normal font)
    doc.setFont('times', 'normal');
    doc.text(lines, leftMargin, y, { maxWidth });

    // Notes
    if (certificate.notes) {
      y += lines.length * 18 + 15;
      doc.setFont('times', 'bold');
      doc.text('Notes:', leftMargin, y);
      doc.setFont('times', 'normal');
      const notesLines = doc.splitTextToSize(certificate.notes, maxWidth - 60);
      doc.text(notesLines, leftMargin + 60, y);
    }

    // Signature area
    y = 600; // Move signature area further down
    doc.setDrawColor('#1976d2');
    doc.line(400, y, 555, y);
    doc.setFontSize(16);
    doc.setTextColor('#1976d2');
    doc.setFont('times', 'italic');
    doc.text(doctorName, 420, y + 18);

    // Show signature image if available
    if (certificate.signature) {
      doc.text('Signature:', 420, y + 35);
      doc.addImage(certificate.signature, 'PNG', 420, y + 40, 120, 40);
    }

    // Label under signature
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#222');
    //doc.text('Doctor Signature', 420, y + 90);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.setFont('times', 'normal');
    doc.text('This certificate was generated electronically by Dentic Clinic.', 40, 800);

    doc.save(`certificate_${certificate.certificateNumber}.pdf`);
    setSnackbar({ open: true, message: 'Certificate exported as PDF', severity: 'success' });
  };

  return (
    <div className="Certificates">
      <div className="card">
        <div className="card-body">
          {/* Page Title */}
          <Typography variant="h4" gutterBottom sx={{ mb: 3, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ mr: 1 }} /> {t('certificates.title')}
          </Typography>

          {/* Widgets row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="primary">{t('certificates.total')}</Typography>
              <Typography variant="h6">{certificates.length}</Typography>
            </Box>
            <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="success.main">{t('certificates.active')}</Typography>
              <Typography variant="h6">{certificates.filter(c => c.status === 'Active').length}</Typography>
            </Box>
            <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="error.main">{t('certificates.expired')}</Typography>
              <Typography variant="h6">{certificates.filter(c => c.status === 'Expired').length}</Typography>
            </Box>
          </Box>

          {/* Charts row */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" align="center">{t('certificates.by_type')}</Typography>
              <Doughnut data={doughnutData} />
            </Box>
            <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" align="center">{t('certificates.per_type')}</Typography>
              <Bar data={barData} />
            </Box>
            <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" align="center">{t('certificates.status_trends')}</Typography>
              <Line data={lineData} />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<TemplateIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              {t('certificates.create')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
            >
              {t('certificates.export_excel')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={exportToPDF}
            >
              {t('certificates.export_pdf')}
            </Button>
          </Stack>

          {/* Advanced Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              label={t('certificates.type')}
              select
              value={filter.type}
              onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
              size="small"
              fullWidth
            >
              <MenuItem value="">{t('certificates.all_types')}</MenuItem>
              {Object.keys(types).map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('certificates.status')}
              select
              value={filter.status}
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              size="small"
              fullWidth
            >
              <MenuItem value="">{t('certificates.all_statuses')}</MenuItem>
              <MenuItem value="Active">{t('certificates.status_active')}</MenuItem>
              <MenuItem value="Expired">{t('certificates.status_expired')}</MenuItem>
            </TextField>
            <TextField
              label={t('certificates.patient')}
              select
              value={filter.patient}
              onChange={e => setFilter(f => ({ ...f, patient: e.target.value }))}
              size="small"
              fullWidth
            >
              <MenuItem value="">{t('certificates.all_patients')}</MenuItem>
              {patients.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.fullName}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('certificates.doctor')}
              select
              value={filter.doctor}
              onChange={e => setFilter(f => ({ ...f, doctor: e.target.value }))}
              size="small"
              fullWidth
            >
              <MenuItem value="">{t('certificates.all_doctors')}</MenuItem>
              {doctors.map(d => (
                <MenuItem key={d.id} value={d.id}>{d.fullName}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('certificates.clinic')}
              select
              value={filter.clinic}
              onChange={e => setFilter(f => ({ ...f, clinic: e.target.value }))}
              size="small"
              fullWidth
            >
              <MenuItem value="">{t('certificates.all_clinics')}</MenuItem>
              {clinics.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('certificates.from')}
              type="date"
              value={filter.from}
              onChange={e => setFilter(f => ({ ...f, from: e.target.value }))}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label={t('certificates.to')}
              type="date"
              value={filter.to}
              onChange={e => setFilter(f => ({ ...f, to: e.target.value }))}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          {/* DataGrid */}
          {loading ? <LinearProgress /> : (
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={filteredCertificates}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 15, 20]}
                checkboxSelection
                onRowSelectionModelChange={setBulkSelection}
                components={{ Toolbar: GridToolbar }}
                autoHeight
                editMode="row"
                onRowEditCommit={handleRowEditCommit}
                onEditRowsModelChange={handleEditRowsModelChange}
                aria-label={t('certificates.table_aria')}
              />
            </div>
          )}

          {/* Add Certificate Dialog */}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              <TemplateIcon sx={{ mr: 1 }} /> {t('certificates.create')}
            </DialogTitle>
            <DialogContent>
              <AddCertificate
                closeModal={() => setAddDialogOpen(false)}
                onCreate={handleCreateCertificate}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialogOpen(false)} color="secondary">{t('certificates.close')}</Button>
            </DialogActions>
          </Dialog>

          {/* Edit Certificate Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              <TemplateIcon sx={{ mr: 1 }} /> {t('certificates.edit')}
            </DialogTitle>
            <DialogContent>
              <EditCertificate closeModal={() => { setEditDialogOpen(false); getAllCertificates(); }} certificate={selectedRow} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="secondary">{t('certificates.close')}</Button>
            </DialogActions>
          </Dialog>

          {/* Certificate Preview Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: { xs: 320, sm: 480 } } }}
          >
            <Box sx={{ p: 3, maxWidth: 480 }}>
              {drawerCertificate && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {t('certificates.preview')}
                  </Typography>
                  <Typography variant="subtitle2">{t('certificates.type')}: {drawerCertificate.certificateType}</Typography>
                  <Typography variant="subtitle2">{t('certificates.patient')}: {getPatientName(drawerCertificate.patientId)}</Typography>
                  <Typography variant="subtitle2">{t('certificates.doctor')}: {getDoctorName(drawerCertificate.doctorId)}</Typography>
                  <Typography variant="subtitle2">{t('certificates.clinic')}: {getClinicName(drawerCertificate.clinicId)}</Typography>
                  <Typography variant="subtitle2">{t('certificates.diagnosis')}: {drawerCertificate.diagnosis}</Typography>
                  <Typography variant="subtitle2">{t('certificates.treatment')}: {drawerCertificate.treatmentDetails}</Typography>
                  <Typography variant="subtitle2">{t('certificates.recommendations')}: {drawerCertificate.recommendations}</Typography>
                  <Typography variant="subtitle2">{t('certificates.status')}: {drawerCertificate.status}</Typography>
                  <Typography variant="subtitle2">{t('certificates.issued_on')}: {new Date(drawerCertificate.issueDate).toLocaleDateString()}</Typography>
                  <Typography variant="subtitle2">{t('certificates.valid_until')}: {new Date(drawerCertificate.validUntil).toLocaleDateString()}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('certificates.notes')}:</Typography>
                  <Typography variant="body2">{drawerCertificate.notes}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => exportCertificateToPDF(drawerCertificate)}>{t('certificates.export_pdf')}</Button>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportToExcel}>{t('certificates.export_excel')}</Button>
                    <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => setSnackbar({ open: true, message: t('certificates.share_not_implemented'), severity: 'info' })}>{t('certificates.share')}</Button>
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
        </div>
      </div>
    </div>
  );
};

Certificates.propTypes = {};
Certificates.defaultProps = {};
export default Certificates;

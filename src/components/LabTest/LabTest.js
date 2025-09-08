import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './LabTest.css';
import useForceUpdate from 'use-force-update';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import labTestHTTPService from '../../main/services/labTestHTTPService';
import testlabHTTPService from '../../main/services/testlabHTTPService';
import { Button, Chip, LinearProgress, Link, Typography, Menu, MenuItem, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import CurrentUser from '../../main/config/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddLabTest from './AddLabTest';
import EditLabTest from './EditLabTest';
import ViewLabTest from './ViewLabTest';
import jsPDF from 'jspdf';
import BASE_URL from '../../main/urls/urls';
import ScienceIcon from '@mui/icons-material/Science';
import axios from '../../libraries/axios/axios';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const LabTest = () => {
  const { t } = useTranslation();

  const [labTests, setLabTests] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedItem, setViewedItem] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // AI Lab Report Analysis states
  const [aiLabOpen, setAiLabOpen] = useState(false);
  const [aiLabLoading, setAiLabLoading] = useState(false);
  const [aiLabResults, setAiLabResults] = useState('');
  const [aiLabIssues, setAiLabIssues] = useState(null);

  // Cross-Diagnosis Support AI states
  const [crossDiagOpen, setCrossDiagOpen] = useState(false);
  const [crossDiagLoading, setCrossDiagLoading] = useState(false);
  const [crossLabResults, setCrossLabResults] = useState('');
  const [crossGumHealth, setCrossGumHealth] = useState('');
  const [crossRecentTreatments, setCrossRecentTreatments] = useState('');
  const [crossDiagResult, setCrossDiagResult] = useState(null);

  // Turnaround Time Prediction AI states
  const [turnaroundOpen, setTurnaroundOpen] = useState(false);
  const [turnaroundLoading, setTurnaroundLoading] = useState(false);
  const [turnaroundTestType, setTurnaroundTestType] = useState('');
  const [turnaroundQueue, setTurnaroundQueue] = useState('');
  const [turnaroundResult, setTurnaroundResult] = useState(null);

  // Lab Report Image Analysis states
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState('');
  const [analyzeError, setAnalyzeError] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    LoadJSFiles();
    fetchAllLabTests();
    // Fetch patients and doctors using demo mode if enabled
    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/patients.json')
        .then(res => res.json())
        .then(data => setPatients(data));
      fetch('/demo/doctors.json')
        .then(res => res.json())
        .then(data => setDoctors(data));
      fetch('/demo/clinics.json')
        .then(res => res.json())
        .then(data => setClinics(data));
    } else {
      fetch(`${BASE_URL}/patients`)
        .then(res => res.json())
        .then(data => setPatients(data));
      fetch(`${BASE_URL}/doctors`)
        .then(res => res.json())
        .then(data => setDoctors(data));
      fetch(`${BASE_URL}/clinics`)
        .then(res => res.json())
        .then(data => setClinics(data));
    }

    fetch(`${BASE_URL}/staff`)
      .then(res => res.json())
      .then(data => setStaffs(data))
      .catch(() => setStaffs([]));
  }, []);


  const fetchAllLabTests = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/labtests.json')
        .then(res => res.json())
        .then(data => {
          setLabTests(data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
          setLoading(false);
        });
    } else {
      testlabHTTPService.getAllTestLab()
        .then(response => {
          setLabTests(response.data);
          setLoading(false);
        })
        .catch(e => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning')
        });
    }
  };


  const resfreshComponent = () => {
    fetchAllLabTests()
    //forceUpdate()
  }

  const removeLabTestAction = (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(t('labtest.confirm_delete') || "Are you sure you want to delete?");
    if (confirmDelete) {
      setLoading(true);
      testlabHTTPService.removeTestLab(id)
        .then(() => {
          fetchAllLabTests();
        })
        .catch(() => {
          showMessage('Error', t('labtest.delete_failed') || 'Failed to delete lab test.', 'error');
        })
        .finally(() => setLoading(false));
    }
  }

  const updateLabTestAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //  resfreshComponent()
  }

  const closeModalEdit = (data) => {
    //resfreshComponent()
    closeButtonEdit.current.click()
    fetchAllLabTests()
  }

  const closeModalAdd = (data) => {
    //resfreshComponent()
    closeButtonAdd.current.click()
    fetchAllLabTests()
  }

  // Helper functions to get full names
  const getPatientName = (id) => {
    const pat = patients.find(p => p.id === id);
    return pat ? pat.fullName : `${t('labtest.id')}: ${id}`;
  };
  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === id);
    return doc ? doc.fullName : `${t('labtest.id')}: ${id}`;
  };

  const renderActionsMenu = (params) => (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => handleMenuOpen(event, params.row)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>{t('labtest.view')}</MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>{t('labtest.edit')}</MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>{t('labtest.delete')}</MenuItem>
        <MenuItem onClick={() => handleMenuAction('download-pdf')}>{t('labtest.download_pdf')}</MenuItem>
        <MenuItem>
          <label style={{ cursor: 'pointer', margin: 0 }}>
            {t('labtest.upload_report')}
            <input
              type="file"
              hidden
              onChange={handleUploadReport}
            />
          </label>
        </MenuItem>
      </Menu>
    </div>
  );

  const columns = [
    {
      field: 'patientId',
      headerName: t('labtest.patient'),
      width: 250,
      renderCell: (params) => (
        <span>{getPatientName(params.value)}</span>
      )
    },
    {
      field: 'doctorId',
      headerName: t('labtest.doctor'),
      width: 250,
      renderCell: (params) => (
        <span>{getDoctorName(params.value)}</span>
      )
    },
    { field: 'testName', headerName: t('labtest.test_name'), width: 180 },
    {
      field: 'testCategory',
      headerName: t('labtest.category'),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={t(`labtest.category_${value.toLowerCase()}`)}
          color={
            value === 'Blood'
              ? 'primary'
              : value === 'Urine'
              ? 'success'
              : value === 'Radiology'
              ? 'info'
              : value === 'Biopsy'
              ? 'secondary'
              : 'default'
          }
          variant="outlined"
          size="small"
        />
      )
    },
    {
      field: 'sampleCollectionDate',
      headerName: t('labtest.sample_date'),
      width: 140,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'testStatus',
      headerName: t('labtest.status'),
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={t(`labtest.status_${(value || 'unknown').toLowerCase()}`)}
          color={
            value === 'Completed'
              ? 'success'
              : value === 'Pending'
              ? 'warning'
              : value === 'In Progress'
              ? 'info'
              : value === 'Cancelled'
              ? 'error'
              : 'default'
          }
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: t('labtest.actions'),
      width: 300,
      renderCell: renderActionsMenu
    }
  ];

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuAction = (action) => {
    if (action === 'view') {
      setViewedItem(selectedRow);
      handleMenuClose();
      setViewModalOpen(true);
    }
    if (action === 'edit') {
      setUpdatedItem(selectedRow);
      handleMenuClose();
      setEditModalOpen(true);
    }
    if (action === 'delete') {
      removeLabTestAction({ preventDefault: () => {} }, selectedRow.id);
      handleMenuClose();
    }
    if (action === 'download') {
      // Download lab test as JSON file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedRow, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `labtest_${selectedRow.id || 'data'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      handleMenuClose();
    }
    if (action === 'download-pdf') {
      // Download lab test as a nicely formatted PDF
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor('#1976d2');
      doc.text('Lab Test Report', 105, 18, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor('#333');
      let y = 32;

      // Add patient and doctor info at the top
      doc.setFont(undefined, 'bold');
      doc.text('Patient:', 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(getPatientName(selectedRow.patientId), 40, y);
      y += 8;
      doc.setFont(undefined, 'bold');
      doc.text('Doctor:', 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(getDoctorName(selectedRow.doctorId), 40, y);
      y += 10;

      // Draw a line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;

      // Add main test info as key-value pairs
      const fields = [
        { label: 'Test Name', value: selectedRow.testName },
        { label: 'Category', value: selectedRow.testCategory },
        { label: 'Sample Date', value: selectedRow.sampleCollectionDate ? new Date(selectedRow.sampleCollectionDate).toLocaleDateString() : '' },
        { label: 'Status', value: selectedRow.testStatus },
        { label: 'Result', value: selectedRow.result ? (typeof selectedRow.result === 'object' ? JSON.stringify(selectedRow.result, null, 2) : selectedRow.result) : '' },
        { label: 'Notes', value: selectedRow.notes || '' }
      ];

      fields.forEach(f => {
        if (f.value) {
          doc.setFont(undefined, 'bold');
          doc.text(`${f.label}:`, 14, y);
          doc.setFont(undefined, 'normal');
          // Handle long text wrapping
          const splitText = doc.splitTextToSize(String(f.value), 160);
          doc.text(splitText, 40, y);
          y += 8 + (splitText.length - 1) * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor('#888');
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 290);

      doc.save(`labtest_${selectedRow.id || 'data'}.pdf`);
      handleMenuClose();
    }
    handleMenuClose();
  };

  const handleRowSelection = (e) => {
    if (e.length === 1) {
      setUpdatedItemId(e[0]);
      const selectedItem = labTests.find(item => item.id === e[0]);
      setUpdatedItem(selectedItem);
      console.log(updatedItem);
    }
    setUpdatedItemIds(e);
  }
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const bulkDelete = () => {
    const confirmDelete = window.confirm(t('labtest.confirm_delete_selected') || "Are you sure you want to delete the selected items?");
    if (confirmDelete) {
      setLoading(true);
      Promise.all(updatedItemIds.map(id => testlabHTTPService.removeTestLab(id)))
        .then(() => {
          showMessage('Success', t('labtest.deleted_successfully') || 'Lab tests deleted.', 'success');
          fetchAllLabTests();
        })
        .catch(() => {
          showMessage('Error', t('labtest.delete_failed') || 'Failed to delete lab tests.', 'error');
        })
        .finally(() => setLoading(false));
    }
  };

  const exportSelected = () => {
    console.log('Exporting selected items:', updatedItemIds);
    // Add logic to export selected items to CSV or Excel
  };

  const handleUploadReport = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      // Add logic to upload and analyze the report
    }
  };

  const analyzeRadiograph = (image) => {
    console.log('Analyzing radiograph:', image);
    // Placeholder for AI analysis logic
    // Call AI API or model to analyze the image
  };

  const matchDiagnosisCode = (description) => {
    console.log('Matching diagnosis code for:', description);
    // Placeholder for ICD10 integration logic
    // Call API or use dataset to find matching codes
  };

  // AI Lab Report Analysis function
  const handleAiLabAnalysis = async () => {
    setAiLabLoading(true);
    setAiLabIssues(null);
    let labResults = {};
    try {
      labResults = JSON.parse(aiLabResults);
    } catch {
      labResults = {};
    }
    try {
      const payload = { labResults };
      const res = await axios.post(`${BASE_URL}/ai/lab-report-analysis`, payload);
      setAiLabIssues(res.data.flaggedIssues || []);
    } catch {
      setAiLabIssues({ error: 'Error analyzing lab report.' });
    }
    setAiLabLoading(false);
  };

  // Cross-Diagnosis Support AI function
  const handleCrossDiagnosisSupport = async () => {
    setCrossDiagLoading(true);
    setCrossDiagResult(null);
    let labResults = {};
    try {
      labResults = JSON.parse(crossLabResults);
    } catch {
      labResults = {};
    }
    const dentalHistory = {
      gumHealth: crossGumHealth,
      recentTreatments: crossRecentTreatments
        ? crossRecentTreatments.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };
    try {
      const payload = { labResults, dentalHistory };
      const res = await axios.post(`${BASE_URL}/ai/cross-diagnosis-support`, payload);
      setCrossDiagResult(res.data.linkedFindings || []);
    } catch {
      setCrossDiagResult({ error: 'Error analyzing cross-diagnosis.' });
    }
    setCrossDiagLoading(false);
  };

  // Turnaround Time Prediction AI function
  const handleTurnaroundPrediction = async () => {
    setTurnaroundLoading(true);
    setTurnaroundResult(null);
    try {
      const payload = {
        testType: turnaroundTestType,
        currentQueue: Number(turnaroundQueue)
      };
      const res = await axios.post(`${BASE_URL}/ai/lab-turnaround-prediction`, payload);
      setTurnaroundResult(res.data.predictedTime || '');
    } catch {
      setTurnaroundResult({ error: 'Error predicting turnaround time.' });
    }
    setTurnaroundLoading(false);
  };

  // Lab Report Image Analysis function
  const handleAnalyzeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAnalyzeLoading(true);
    setAnalyzeError('');
    setAnalyzeResult('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${BASE_URL}/ai/lab-test-report-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalyzeResult(res.data.raw || 'No summary available');
    } catch (err) {
      setAnalyzeError(t('labtest.analysis_failed') || 'Analysis failed');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  // Example widget summary data
  const totalLabTests = labTests.length;
  const completedTests = labTests.filter(t => t.testStatus === 'Completed').length;
  const pendingTests = labTests.filter(t => t.testStatus === 'Pending').length;
  const categories = {};
  labTests.forEach(t => {
    categories[t.testCategory] = (categories[t.testCategory] || 0) + 1;
  });

  // Example chart data
  const doughnutData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Tests per Category',
      data: Object.values(categories),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(categories).map(cat => labTests.filter(t => t.testCategory === cat && t.testStatus === 'Completed').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'Pending',
        data: Object.keys(categories).map(cat => labTests.filter(t => t.testCategory === cat && t.testStatus === 'Pending').length),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  return (
    <div className="card">
      {/* Page Title */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className="fas fa-vials" style={{ marginRight: 10 }} />
          {t('labtest.title')}
        </Typography>
      </Box>
      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('labtest.total')}</Typography>
          <Typography variant="h6">{totalLabTests}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">{t('labtest.completed')}</Typography>
          <Typography variant="h6">{completedTests}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">{t('labtest.pending')}</Typography>
          <Typography variant="h6">{pendingTests}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('labtest.by_category')}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('labtest.tests_per_category')}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('labtest.status_trends')}</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'flex-start' }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{ minWidth: 150 }}
            startIcon={<i className="fas fa-plus"></i>}
            onClick={() => setAddModalOpen(true)}
          >
            {t('labtest.create')}
          </Button>
          <Button
            onClick={e => updateLabTestAction(e, updatedItem)}
            type="button"
            data-toggle="modal"
            data-target="#edit"
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-edit"></i>}
          >
            {t('labtest.edit')}
          </Button>
          <Button
            onClick={e => removeLabTestAction(e, updatedItemId)}
            type="button"
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-trash-alt"></i>}
          >
            {t('labtest.remove')}
          </Button>
          <Button
            type="button"
            onClick={() => fetchAllLabTests()}
            color="primary"
            variant="outlined"
            sx={{ minWidth: 120 }}
            startIcon={<i className="fas fa-refresh"></i>}
          >
            {t('labtest.reload')}
          </Button>
          <Button
            onClick={bulkDelete}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 150 }}
          >
            {t('labtest.delete_selected')}
          </Button>
          <Button
            onClick={exportSelected}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 150 }}
          >
            {t('labtest.export_selected')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<ScienceIcon />}
            sx={{ minWidth: 180 }}
            onClick={() => setAiLabOpen(true)}
          >
            {t('labtest.ai_lab_report')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LinkIcon />}
            sx={{ minWidth: 220 }}
            onClick={() => setCrossDiagOpen(true)}
          >
            {t('labtest.cross_diagnosis')}
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<AccessTimeIcon />}
            sx={{ minWidth: 220 }}
            onClick={() => setTurnaroundOpen(true)}
          >
            {t('labtest.turnaround_prediction')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<ScienceIcon />}
            sx={{ minWidth: 220 }}
            onClick={() => setAnalyzeModalOpen(true)}
          >
            {t('labtest.analyze_lab_report')}
          </Button>
        </Box>
        <br /><br />
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ width: '100%' }}>
            <DataGrid
              rows={labTests}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 15, 20]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </div>
        )}

        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{t('labtest.edit')}</DialogTitle>
          <DialogContent>
            <EditLabTest
              closeModal={() => setEditModalOpen(false)}
              testLab={updatedItem}
              patients={patients}
              doctors={doctors}
              clinics={clinics}
              staffs={staffs} // <-- Make sure this is included!
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">{t('labtest.close')}</Button>
          </DialogActions>
        </Dialog>

        <ViewLabTest
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          testLab={viewedItem}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
        />

        <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{t('labtest.create')}</DialogTitle>
          <DialogContent>
            <AddLabTest closeModal={() => setAddModalOpen(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddModalOpen(false)} color="secondary">
              {t('labtest.close')}
            </Button>
          </DialogActions>
        </Dialog>

        <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditLabTest closeModal={closeButtonEdit} testLab={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonEdit} onClick={closeModalEdit} class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        {/* AI Lab Report Analysis Dialog */}
        <Dialog open={aiLabOpen} onClose={() => setAiLabOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('labtest.ai_lab_report')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('labtest.ai_lab_report_description')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAiLabAnalysis();
              }}
              style={{ marginBottom: 16 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.glucose')}</Typography>
                  <input
                    type="number"
                    value={(() => {
                      try {
                        return JSON.parse(aiLabResults).glucose || '';
                      } catch {
                        return '';
                      }
                    })()}
                    onChange={e => {
                      let obj = {};
                      try { obj = JSON.parse(aiLabResults); } catch { obj = {}; }
                      obj.glucose = e.target.value;
                      setAiLabResults(JSON.stringify(obj));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. 180"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.hemoglobin')}</Typography>
                  <input
                    type="number"
                    value={(() => {
                      try {
                        return JSON.parse(aiLabResults).hemoglobin || '';
                      } catch {
                        return '';
                      }
                    })()}
                    onChange={e => {
                      let obj = {};
                      try { obj = JSON.parse(aiLabResults); } catch { obj = {}; }
                      obj.hemoglobin = e.target.value;
                      setAiLabResults(JSON.stringify(obj));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. 12.5"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.biopsy')}</Typography>
                  <input
                    type="text"
                    value={(() => {
                      try {
                        return JSON.parse(aiLabResults).biopsy || '';
                      } catch {
                        return '';
                      }
                    })()}
                    onChange={e => {
                      let obj = {};
                      try { obj = JSON.parse(aiLabResults); } catch { obj = {}; }
                      obj.biopsy = e.target.value;
                      setAiLabResults(JSON.stringify(obj));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. mild inflammation"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="info"
                  type="submit"
                  disabled={aiLabLoading || !aiLabResults}
                >
                  {t('labtest.analyze')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAiLabOpen(false)}
                >
                  {t('labtest.close')}
                </Button>
              </Box>
            </form>
            {aiLabLoading && <LinearProgress sx={{ mt: 2 }} />}
            {aiLabIssues && (
              <Box sx={{ mt: 3 }}>
                {aiLabIssues.error ? (
                  <Typography color="error">{aiLabIssues.error}</Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('labtest.flagged_issues')}:</Typography>
                    {aiLabIssues.length === 0 ? (
                      <Typography color="success.main">{t('labtest.no_abnormalities')}</Typography>
                    ) : (
                      <ul>
                        {aiLabIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Cross-Diagnosis Support Dialog */}
        <Dialog open={crossDiagOpen} onClose={() => setCrossDiagOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('labtest.cross_diagnosis')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('labtest.cross_diagnosis_description')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleCrossDiagnosisSupport();
              }}
              style={{ marginBottom: 16 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.lab_results')} (JSON)</Typography>
                  <input
                    type="text"
                    value={crossLabResults}
                    onChange={e => setCrossLabResults(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder='{"glucose": 180, "hemoglobin": 12.5}'
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.gum_health')}</Typography>
                  <input
                    type="text"
                    value={crossGumHealth}
                    onChange={e => setCrossGumHealth(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. bleeding"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.recent_treatments')} (comma separated)</Typography>
                  <input
                    type="text"
                    value={crossRecentTreatments}
                    onChange={e => setCrossRecentTreatments(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. scaling"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={crossDiagLoading || !crossLabResults}
                >
                  {t('labtest.analyze')}
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setCrossDiagOpen(false)}
                >
                  {t('labtest.close')}
                </Button>
              </Box>
            </form>
            {crossDiagLoading && <LinearProgress sx={{ mt: 2 }} />}
            {crossDiagResult && (
              <Box sx={{ mt: 3 }}>
                {crossDiagResult.error ? (
                  <Typography color="error">{crossDiagResult.error}</Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('labtest.linked_findings')}:</Typography>
                    {crossDiagResult.length === 0 ? (
                      <Typography color="success.main">{t('labtest.no_connections')}</Typography>
                    ) : (
                      <ul>
                        {crossDiagResult.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Turnaround Time Prediction Dialog */}
        <Dialog open={turnaroundOpen} onClose={() => setTurnaroundOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('labtest.turnaround_prediction')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('labtest.turnaround_prediction_description')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleTurnaroundPrediction();
              }}
              style={{ marginBottom: 16 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.test_type')}</Typography>
                  <input
                    type="text"
                    value={turnaroundTestType}
                    onChange={e => setTurnaroundTestType(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. CBC"
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('labtest.current_queue')}</Typography>
                  <input
                    type="number"
                    value={turnaroundQueue}
                    onChange={e => setTurnaroundQueue(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder="e.g. 12"
                    required
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  disabled={turnaroundLoading || !turnaroundTestType || !turnaroundQueue}
                >
                  {t('labtest.predict')}
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setTurnaroundOpen(false)}
                >
                  {t('labtest.close')}
                </Button>
              </Box>
            </form>
            {turnaroundLoading && <LinearProgress sx={{ mt: 2 }} />}
            {turnaroundResult && (
              <Box sx={{ mt: 3 }}>
                {turnaroundResult.error ? (
                  <Typography color="error">{turnaroundResult.error}</Typography>
                ) : (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('labtest.predicted_turnaround_time')}:</Typography>
                    <Typography variant="body1" color="warning.main">{turnaroundResult}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Lab Report Image Analysis Dialog */}
        <Dialog open={analyzeModalOpen} onClose={() => setAnalyzeModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('labtest.analyze_lab_report')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('labtest.analyze_lab_report_description') || 'Upload a lab test report image to get an AI-powered summary.'}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              disabled={analyzeLoading}
              sx={{ mb: 2 }}
            >
              {t('labtest.upload_image') || 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleAnalyzeImage}
              />
            </Button>
            {analyzeLoading && <LinearProgress sx={{ mt: 2 }} />}
            {analyzeError && <Typography color="error" sx={{ mt: 2 }}>{analyzeError}</Typography>}
            {analyzeResult && (
              <Box sx={{ mt: 2, bgcolor: '#f1f8e9', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2">{t('labtest.result_summary') || 'Result Summary'}</Typography>
                <Box
                  sx={{ fontFamily: 'monospace', fontSize: 14, color: '#388e3c', mt: 1 }}
                  dangerouslySetInnerHTML={{ __html: marked(analyzeResult) }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyzeModalOpen(false)} color="secondary">
              {t('labtest.close')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
};

LabTest.propTypes = {};

LabTest.defaultProps = {};

export default LabTest;

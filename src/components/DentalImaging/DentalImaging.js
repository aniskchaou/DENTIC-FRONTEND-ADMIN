import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Avatar, IconButton, Tooltip
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScienceIcon from '@mui/icons-material/Science';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import DentalPapayaViewer from './DentalPapayaViewer';
import DicomViewer from './DicomViewer';
// To use Papaya.js, add the following to your public/index.html:
// <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/papaya-viewer@1.0.47/build/papaya.js"></script>
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/papaya-viewer@1.0.47/build/papaya.css" />


const DentalImaging = () => {
  const { t } = useTranslation();

  const imagingTypes = [
    { value: 'xray', label: t('dental_imaging.xray') },
    { value: 'panoramic', label: t('dental_imaging.panoramic') },
    { value: 'intraoral', label: t('dental_imaging.intraoral_camera') },
    { value: 'cbct', label: t('dental_imaging.cbct') }
  ];
  const statusOptions = [
    t('dental_imaging.status_pending'),
    t('dental_imaging.status_reviewed'),
    t('dental_imaging.status_flagged')
  ];

  const [images, setImages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    type: '',
    imageType: '',
    date: '',
    uploadDate: '',
    notes: '',
    diagnosisNotes: '',
    imageUrl: '',
    status: 'Pending'
  });
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiFindings, setAiFindings] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  // Treatment Progress Tracking AI
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressImage1, setProgressImage1] = useState(null);
  const [progressImage2, setProgressImage2] = useState(null);
  const [progressResult, setProgressResult] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [aiUploadFile, setAiUploadFile] = useState(null);
  // OHIF Viewer
  const [ohifModalOpen, setOhifModalOpen] = useState(false);
  const [ohifImageUrl, setOhifImageUrl] = useState('');
  // Cornerstone.js Viewer
  const [cornerstoneModalOpen, setCornerstoneModalOpen] = useState(false);
  const [cornerstoneImageUrl, setCornerstoneImageUrl] = useState('');
  const cornerstoneElementRef = useRef(null);
  // DICOM Web Viewer
  const [dicomModalOpen, setDicomModalOpen] = useState(false);
  const [dicomImageUrl, setDicomImageUrl] = useState('');
  // Papaya.js Viewer
  const [papayaModalOpen, setPapayaModalOpen] = useState(false);
  const [papayaImageUrl, setPapayaImageUrl] = useState('');
  const [papayaMenuOpen, setPapayaMenuOpen] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/dental-imaging`);
      setImages(res.data);
    } catch {
      setImages([]);
    }
    setLoading(false);
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/patients`);
      setPatients(res.data);
    } catch {
      setPatients([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors`);
      setDoctors(res.data);
    } catch {
      setDoctors([]);
    }
  };

  const handleOpenDialog = () => {
    setForm({
      patientId: '', doctorId: '', type: '', imageType: '', date: '', uploadDate: '', notes: '', diagnosisNotes: '', imageUrl: '', status: 'Pending'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddImage = async () => {
    if (!form.patientId || !form.type || !selectedFile) return;
    const payload = {
      patientId: form.patientId,
      doctorId: form.doctorId,
      imageType: imagingTypes.find(t => t.value === form.type)?.label || form.type,
      type: form.type,
      uploadDate: form.uploadDate || new Date().toISOString(),
      notes: form.notes,
      diagnosisNotes: form.diagnosisNotes,
      status: form.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    formData.append('image', selectedFile); // <-- field name changed to 'image'

    // Show cURL for debugging
    const curlParts = [
      `curl -X POST "${BASE_URL}/dental-imaging"`,
      `-H "Content-Type: multipart/form-data"`,
      ...Object.entries(payload).map(([key, value]) => `-F "${key}=${value}"`),
      selectedFile ? `-F "image=@${selectedFile.name}"` : ''
    ];
    console.log('cURL:\n' + curlParts.filter(Boolean).join(' \\\n'));

    await axios.post(`${BASE_URL}/dental-imaging`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setOpenDialog(false);
    setSelectedFile(null);
    fetchImages();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/dental-imaging/${id}`);
    fetchImages();
  };

  const handleView = (img) => {
    setSelectedImage(img);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  // Drag and drop logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, imageUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, imageUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
    setDragActive(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Helper functions for names
  const getPatientName = (id) => {
    const p = patients.find(p => String(p.id) === String(id));
    return p ? (p.fullName || p.name) : id;
  };
  const getDoctorName = (id) => {
    const d = doctors.find(d => String(d.id) === String(id));
    return d ? (d.fullName || d.name) : id;
  };

  // AI X-ray Analysis function
  const handleXrayAnalysis = async (img) => {
    setAiLoading(true);
    setAiFindings([]);
    try {
      let fileToSend = null;

      // If you have the original file, use it
      if (img.file) {
        fileToSend = img.file;
      } else if (img.imageUrl && img.imageUrl.startsWith('data:')) {
        // Convert dataURL to Blob
        const arr = img.imageUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        fileToSend = new Blob([u8arr], { type: mime });
      } else if (img.imageUrl) {
        // Fetch from server using direct image URL
        const imageResponse = await fetch(img.imageUrl);
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const imageBlob = await imageResponse.blob();
        fileToSend = new File([imageBlob], 'xray.jpg', { type: contentType });
      } else {
        setAiFindings(['No image available']);
        setAiLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', fileToSend, 'xray.jpg');

      const res = await axios.post(`${BASE_URL}/ai/xray-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let findings = [];
      if (res.data && Array.isArray(res.data.findings)) {
        findings = res.data.findings.map(f => {
          try {
            if (f.startsWith('```json')) {
              return JSON.parse(f.replace(/```json|```/g, ''))[0];
            }
            return f;
          } catch {
            return f;
          }
        });
      }
      setAiFindings(findings);
    } catch {
      setAiFindings(['Error analyzing image']);
    }
    setAiLoading(false);
  };

  // Handle file selection for AI modal
  const handleAiFileChange = (e) => {
    const file = e.target.files[0];
    setAiUploadFile(file || null);
  };

  // Handle AI X-ray Analysis from modal
  const handleAiModalAnalyze = async () => {
    if (!aiUploadFile) return;
    setAiLoading(true);
    setAiFindings([]);
    setAiModalOpen(false);

    try {
      const formData = new FormData();
      formData.append('image', aiUploadFile, aiUploadFile.name);

      const res = await axios.post(`${BASE_URL}/ai/xray-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let findings = [];
      if (res.data && Array.isArray(res.data.findings)) {
        findings = res.data.findings.map(f => {
          try {
            if (f.startsWith('```json')) {
              return JSON.parse(f.replace(/```json|```/g, ''))[0];
            }
            return f;
          } catch {
            return f;
          }
        });
      }
      setAiFindings(findings);
    } catch {
      setAiFindings(['Error analyzing image']);
    }
    setAiLoading(false);
    setAiUploadFile(null);
  };

  const handleOpenOhif = (img) => {
    let url = img.imageUrl;
    if (url && url.startsWith('uploads\\')) {
      const filename = url.replace('uploads\\', '').replace('uploads/', '');
      url = `${BASE_URL}/dental-imaging/image/${filename}`;
    }
    // Open OHIF Viewer in a new tab
    window.open(`https://viewer.ohif.org/?image=${encodeURIComponent(url)}`, '_blank');
  };

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
  });

  // When opening the modal, use a DICOM image URL with the 'wadouri:' prefix
  const handleOpenCornerstone = () => {
    setCornerstoneImageUrl('wadouri:https://raw.githubusercontent.com/cornerstonejs/cornerstone-wado-image-loader/master/testImages/CT000010.dcm');
    setCornerstoneModalOpen(true);
  };

  // In useEffect:
  useEffect(() => {
    if (cornerstoneModalOpen && cornerstoneImageUrl && cornerstoneElementRef.current) {
      cornerstone.enable(cornerstoneElementRef.current);
      cornerstone.loadImage(cornerstoneImageUrl).then(image => {
        cornerstone.displayImage(cornerstoneElementRef.current, image);
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
      }).catch(err => {
        cornerstoneElementRef.current.innerHTML = `<div style="color:white;padding:20px;">Failed to load DICOM image.<br/>${err.message}</div>`;
      });
    }
    return () => {
      if (cornerstoneElementRef.current) {
        cornerstone.disable(cornerstoneElementRef.current);
      }
    };
  }, [cornerstoneModalOpen, cornerstoneImageUrl]);

  // Define handleOpenDicomViewer function
  const handleOpenDicomViewer = (img) => {
    // Load DICOM file from your local assets folder
    setDicomImageUrl('assets/img/example.dcm');
    setDicomModalOpen(true);
  };

  // Handler to open Papaya.js modal (like other viewers)
  const handleOpenPapaya = (img) => {
    let url = img.imageUrl;
    if (url && url.startsWith('uploads\\')) {
      const filename = url.replace('uploads\\', '').replace('uploads/', '');
      url = `${BASE_URL}/dental-imaging/image/${filename}`;
    }
    setPapayaImageUrl(url || 'http://localhost:5000/dental-imaging/image/example.dcm');
    setPapayaModalOpen(true);
  };

  // DataGrid columns
  const columns = [
    {
      field: 'imageUrl',
      headerName: t('dental_imaging.preview'),
      width: 90,
      renderCell: (params) => {
        let url = params.value;
        // If the imageUrl contains 'uploads\', extract the filename and build the full URL
        if (url && url.startsWith('uploads\\')) {
          const filename = url.replace('uploads\\', '').replace('uploads/', '');
          url = `${BASE_URL}/dental-imaging/image/${filename}`;
        }
        return (
          <Avatar
            src={url}
            variant="rounded"
            sx={{ width: 56, height: 40, bgcolor: '#e3f2fd' }}
          />
        );
      }
    },
    {
      field: 'patientId',
      headerName: t('dental_imaging.patient'),
      width: 150,
      valueGetter: (params) => getPatientName(params.row.patientId)
    },
    {
      field: 'doctorId',
      headerName: t('dental_imaging.doctor'),
      width: 150,
      valueGetter: (params) => getDoctorName(params.row.doctorId)
    },
    {
      field: 'imageType',
      headerName: t('dental_imaging.type'),
      width: 120
    },
    {
      field: 'status',
      headerName: t('dental_imaging.status'),
      width: 110,
      renderCell: (params) => (
        <span style={{
          color: params.value === t('dental_imaging.status_reviewed') ? '#388e3c' : params.value === t('dental_imaging.status_flagged') ? '#d32f2f' : '#1976d2',
          fontWeight: 'bold'
        }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'uploadDate',
      headerName: t('dental_imaging.upload_date'),
      width: 130,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '-'
    },
    {
      field: 'diagnosisNotes',
      headerName: t('dental_imaging.diagnosis_notes'),
      width: 220
    },
    {
      field: 'actions',
      headerName: t('dental_imaging.actions'),
      width: 520,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <> 
          <Tooltip title={t('dental_imaging.view')}>
            <IconButton color="primary" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('dental_imaging.delete')}>
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('dental_imaging.ai_xray_analysis')}>
            <IconButton color="secondary" onClick={() => handleXrayAnalysis(params.row)}>
              <ScienceIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Papaya.js Advanced Viewer">
            <IconButton color="info" onClick={() => setPapayaMenuOpen(true)}>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  const handleProgressAnalyze = async () => {
    if (!progressImage1 || !progressImage2) return;
    setProgressLoading(true);
    setProgressResult(null);
    try {
      const formData = new FormData();
      formData.append('previousXray', progressImage1);
      formData.append('currentXray', progressImage2);
      await axios.post(`${BASE_URL}/ai/treatment-progress`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        setProgressResult(res.data);
      });
    } catch (err) {
      setProgressResult({ error: 'Error analyzing treatment progress.' });
    }
    setProgressLoading(false);
  };

  useEffect(() => {
    if (cornerstoneModalOpen && cornerstoneImageUrl && cornerstoneElementRef.current) {
      cornerstone.enable(cornerstoneElementRef.current);
      cornerstone.loadImage(cornerstoneImageUrl).then(image => {
        cornerstone.displayImage(cornerstoneElementRef.current, image);
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
      }).catch(err => {
        cornerstoneElementRef.current.innerHTML = `<div style="color:white;padding:20px;">Failed to load DICOM image.<br/>${err.message}</div>`;
      });
    }
    return () => {
      if (cornerstoneElementRef.current) {
        cornerstone.disable(cornerstoneElementRef.current);
      }
    };
  }, [cornerstoneModalOpen, cornerstoneImageUrl]);

  // Load Papaya.js viewer when modal opens
  useEffect(() => {
    if (papayaModalOpen && papayaImageUrl) {
      // Wait for Papaya to be loaded
      if (window.papaya) {
        // Remove previous viewer if exists
        if (document.getElementById('papaya-viewer')) {
          document.getElementById('papaya-container').innerHTML = '';
        }
        window.papaya.Container.resetViewer(0, [papayaImageUrl]);
        window.papaya.Container.addViewer('papaya-container', [papayaImageUrl]);
      }
    }
    // Cleanup on modal close
    return () => {
      if (document.getElementById('papaya-viewer')) {
        document.getElementById('papaya-container').innerHTML = '';
      }
    };
  }, [papayaModalOpen, papayaImageUrl]);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AddPhotoAlternateIcon sx={{ color: '#1976d2', fontSize: 38, mr: 1 }} />
          <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
            {t('dental_imaging.title')}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          {t('dental_imaging.add_new_image')}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<UploadFileIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setAiModalOpen(true)}
        >
          {t('dental_imaging.ai_xray_analysis_upload')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CompareArrowsIcon />}
          sx={{ mb: 2, ml: 2 }}
          onClick={() => setProgressModalOpen(true)}
        >
          AI Treatment Progress Tracking
        </Button>
  
  
      {/* AI Treatment Progress Tracking Modal */}
      <Dialog open={progressModalOpen} onClose={() => { setProgressModalOpen(false); setProgressResult(null); setProgressImage1(null); setProgressImage2(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>AI Treatment Progress Tracking</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Upload two X-ray images (before and after treatment) to analyze progress.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Image 1 (Before)</Typography>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="progress-image-1"
                onChange={e => setProgressImage1(e.target.files[0] || null)}
              />
              <label htmlFor="progress-image-1">
                <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
                  Choose Image
                </Button>
              </label>
              {progressImage1 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Selected: {progressImage1.name}</Typography>
                  <img src={URL.createObjectURL(progressImage1)} alt="Preview 1" style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }} />
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Image 2 (After)</Typography>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="progress-image-2"
                onChange={e => setProgressImage2(e.target.files[0] || null)}
              />
              <label htmlFor="progress-image-2">
                <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
                  Choose Image
                </Button>
              </label>
              {progressImage2 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Selected: {progressImage2.name}</Typography>
                  <img src={URL.createObjectURL(progressImage2)} alt="Preview 2" style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }} />
                </Box>
              )}
            </Box>
          </Box>
          {progressLoading && <Typography>Analyzing progress...</Typography>}
          {progressResult && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fafafa' }}>
              {progressResult.error ? (
                <Typography color="error">{progressResult.error}</Typography>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>Progress Summary</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {progressResult.status}</Typography>
                  <Typography variant="body2"><strong>Details:</strong> {progressResult.details}</Typography>
                  <Typography variant="body2"><strong>Recommendations:</strong> {progressResult.recommendations}</Typography>
                  <Typography variant="body2"><strong>Notes:</strong> {progressResult.notes}</Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setProgressModalOpen(false); setProgressResult(null); setProgressImage1(null); setProgressImage2(null); }}>Close</Button>
          <Button
            variant="contained"
            onClick={handleProgressAnalyze}
            disabled={!progressImage1 || !progressImage2 || progressLoading}
          >
            Analyze Progress
          </Button>
        </DialogActions>
      </Dialog>
        <div style={{ height: 480, width: '100%', background: '#fff', borderRadius: 8 }}>
          <DataGrid
            rows={images}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8, 16, 32]}
            loading={loading}
            getRowId={row => row.id}
            disableSelectionOnClick
            autoHeight={false}
            sx={{
              fontSize: 15,
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#e3f2fd', fontWeight: 700 },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f0f6ff' }
            }}
          />
        </div>
      </Paper>

      {/* Add Image Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dental_imaging.add_dental_image')}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label={t('dental_imaging.patient')}
            name="patientId"
            value={form.patientId}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.fullName || p.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('dental_imaging.doctor')}
            name="doctorId"
            value={form.doctorId}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {doctors.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.fullName || d.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('dental_imaging.imaging_type')}
            name="type"
            value={form.type}
            onChange={e => {
              handleFormChange(e);
              setForm(f => ({ ...f, imageType: imagingTypes.find(t => t.value === e.target.value)?.label || '' }));
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {imagingTypes.map(t => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('dental_imaging.status')}
            name="status"
            select
            value={form.status}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('dental_imaging.upload_date')}
            name="uploadDate"
            type="datetime-local"
            value={form.uploadDate}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('dental_imaging.notes')}
            name="notes"
            value={form.notes}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <TextField
            label={t('dental_imaging.diagnosis_notes')}
            name="diagnosisNotes"
            value={form.diagnosisNotes}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            sx={{
              mb: 2,
              p: 2,
              border: '2px dashed #1976d2',
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: dragActive ? '#e3f2fd' : '#fafafa',
              color: '#1976d2',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('dental_imaging.drag_drop')}
            </Typography>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="dental-image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="dental-image-upload">
              <Button variant="outlined" component="span" startIcon={<AddPhotoAlternateIcon />}>
                {t('dental_imaging.browse')}
              </Button>
            </label>
          </Box>
          {form.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <img src={form.imageUrl} alt={t('dental_imaging.preview')} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('dental_imaging.cancel')}</Button>
          <Button variant="contained" onClick={handleAddImage} disabled={!form.patientId || !form.type || !selectedFile}>
            {t('dental_imaging.add_image')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Image Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle>{t('dental_imaging.image_preview')}</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {getPatientName(selectedImage.patientId)} - {selectedImage.imageType}
              </Typography>
              <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                <img
                  src={
                    selectedImage.imageUrl && selectedImage.imageUrl.startsWith('uploads\\')
                      ? `${BASE_URL}/dental-imaging/image/${selectedImage.imageUrl.replace('uploads\\', '').replace('uploads/', '')}`
                      : selectedImage.imageUrl
                  }
                  alt={t('dental_imaging.preview')}
                  style={{ maxWidth: 500, maxHeight: 350, width: '100%', borderRadius: 8, objectFit: 'contain', background: '#fafafa' }}
                />
              </Box>
              <Typography variant="body2"><strong>{t('dental_imaging.doctor')}:</strong> {getDoctorName(selectedImage.doctorId)}</Typography>
              <Typography variant="body2"><strong>{t('dental_imaging.upload_date')}:</strong> {selectedImage.uploadDate ? new Date(selectedImage.uploadDate).toLocaleString() : '-'}</Typography>
              <Typography variant="body2"><strong>{t('dental_imaging.status')}:</strong> {selectedImage.status || t('dental_imaging.status_pending')}</Typography>
              <Typography variant="body2"><strong>{t('dental_imaging.notes')}:</strong> {selectedImage.notes}</Typography>
              <Typography variant="body2"><strong>{t('dental_imaging.diagnosis_notes')}:</strong> {selectedImage.diagnosisNotes}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>{t('dental_imaging.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* AI X-ray Analysis Findings Dialog */}
      <Dialog open={aiFindings.length > 0 || aiLoading} onClose={() => setAiFindings([])}>
        <DialogTitle>{t('dental_imaging.ai_xray_analysis')}</DialogTitle>
        <DialogContent>
          {aiLoading ? (
            <Typography>{t('dental_imaging.analyzing_image')}</Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {t('dental_imaging.findings')}
              </Typography>
              {aiFindings.length > 0 ? (
                <ul>
                  {aiFindings.map((finding, idx) => (
                    <div key={idx} style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
                      <div><strong>Issue:</strong> {finding.issue}</div>
                      <div><strong>Severity:</strong> {finding.severity}</div>
                      <div><strong>Location:</strong> {finding.location}</div>
                      <div><strong>Recommendation:</strong> {finding.recommendation}</div>
                      <div><strong>Tooth Surface:</strong> {finding.tooth_surface}</div>
                      <div><strong>Stage:</strong> {finding.stage}</div>
                      <div><strong>Confidence:</strong> {finding.confidence}</div>
                      <div><strong>Notes:</strong> {finding.notes}</div>
                      <div><strong>Urgency:</strong> {finding.urgency}</div>
                      <div><strong>Follow Up:</strong> {finding.follow_up}</div>
                      <div><strong>Patient Risk Factors:</strong> {finding.patient_risk_factors}</div>
                      <div><strong>Imaging Quality:</strong> {finding.imaging_quality}</div>
                      <div><strong>Image Artifacts:</strong> {finding.image_artifacts}</div>
                    </div>
                  ))}
                </ul>
              ) : (
                <Typography>{t('dental_imaging.no_findings')}</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiFindings([])}>{t('dental_imaging.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* AI X-ray Analysis Upload Modal */}
      <Dialog open={aiModalOpen} onClose={() => setAiModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('dental_imaging.ai_xray_analysis')}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {t('dental_imaging.ai_xray_analysis_instruction')}
          </Typography>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="ai-xray-upload"
            onChange={handleAiFileChange}
          />
          <label htmlFor="ai-xray-upload">
            <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
              {t('dental_imaging.choose_image')}
            </Button>
          </label>
          {aiUploadFile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">{t('dental_imaging.selected_file')}: {aiUploadFile.name}</Typography>
              <img
                src={URL.createObjectURL(aiUploadFile)}
                alt={t('dental_imaging.preview')}
                style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiModalOpen(false)}>{t('dental_imaging.cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleAiModalAnalyze}
            disabled={!aiUploadFile}
          >
            {t('dental_imaging.analyze')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cornerstone.js Viewer Modal */}
      <Dialog open={cornerstoneModalOpen} onClose={() => setCornerstoneModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cornerstone.js Viewer</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', height: 500, bgcolor: '#222', borderRadius: 2 }}>
            <div
              ref={cornerstoneElementRef}
              style={{
                width: '100%',
                height: '500px',
                background: '#222',
                borderRadius: '8px'
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Use mouse to adjust window/level (brightness/contrast).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCornerstoneModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DICOM Web Viewer Modal */}
      <Dialog open={dicomModalOpen} onClose={() => setDicomModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>DICOM Web Viewer</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', height: 500, bgcolor: '#222', borderRadius: 2 }}>
            {dicomImageUrl ? (
              <Typography color="info" sx={{ p: 2 }}>
                DICOM Web Viewer is not available. Please use the Cornerstone.js Viewer for DICOM images.
              </Typography>
            ) : (
              <Typography>No DICOM image available.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDicomModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Papaya.js Viewer Modal */}
      <Dialog open={papayaModalOpen} onClose={() => setPapayaModalOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontSize: 24, fontWeight: 700 }}>
          Papaya.js Viewer
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <DentalPapayaViewer />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setPapayaModalOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Big Modal for DentalPapayaViewer */}
      <Dialog
        open={papayaMenuOpen}
        onClose={() => setPapayaMenuOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fafafa'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: 28, fontWeight: 700 }}>
          Advanced Papaya.js Viewer
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <DentalPapayaViewer />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setPapayaMenuOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DentalImaging;
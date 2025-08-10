import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Avatar, IconButton, Tooltip
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const imagingTypes = [
  { value: 'xray', label: 'X-Ray' },
  { value: 'panoramic', label: 'Panoramic' },
  { value: 'intraoral', label: 'Intraoral Camera' },
  { value: 'cbct', label: 'CBCT' }
];
const statusOptions = ['Pending', 'Reviewed', 'Flagged'];

const DentalImaging = () => {
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

  // DataGrid columns
  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Preview',
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
      headerName: 'Patient',
      width: 150,
      valueGetter: (params) => getPatientName(params.row.patientId)
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      width: 150,
      valueGetter: (params) => getDoctorName(params.row.doctorId)
    },
    {
      field: 'imageType',
      headerName: 'Type',
      width: 120
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <span style={{
          color: params.value === 'Reviewed' ? '#388e3c' : params.value === 'Flagged' ? '#d32f2f' : '#1976d2',
          fontWeight: 'bold'
        }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'uploadDate',
      headerName: 'Upload Date',
      width: 130,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '-'
    },
    {
      field: 'diagnosisNotes',
      headerName: 'Diagnosis Notes',
      width: 220
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="View">
            <IconButton color="primary" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 3 }}>
      
      <Paper sx={{ p: 3, mb: 3, boxShadow: '0 4px 24px rgba(25,118,210,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AddPhotoAlternateIcon sx={{ color: '#1976d2', fontSize: 38, mr: 1 }} />
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
          Dental Imaging
        </Typography>
      </Box>
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }} // Add margin bottom to the button
        >
          Add New Image
        </Button>
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
        <DialogTitle>Add Dental Image</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Patient"
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
            label="Doctor"
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
            label="Imaging Type"
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
            label="Status"
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
            label="Upload Date"
            name="uploadDate"
            type="datetime-local"
            value={form.uploadDate}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <TextField
            label="Diagnosis Notes"
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
              Drag &amp; drop image here, or click to select
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
                Browse
              </Button>
            </label>
          </Box>
          {form.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <img src={form.imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddImage} disabled={!form.patientId || !form.type || !selectedFile}>
            Add Image
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Image Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle>Image Preview</DialogTitle>
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
                  alt="Dental"
                  style={{ maxWidth: 500, maxHeight: 350, width: '100%', borderRadius: 8, objectFit: 'contain', background: '#fafafa' }}
                />
              </Box>
              <Typography variant="body2"><strong>Doctor:</strong> {getDoctorName(selectedImage.doctorId)}</Typography>
              <Typography variant="body2"><strong>Upload Date:</strong> {selectedImage.uploadDate ? new Date(selectedImage.uploadDate).toLocaleString() : '-'}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {selectedImage.status || 'Pending'}</Typography>
              <Typography variant="body2"><strong>Notes:</strong> {selectedImage.notes}</Typography>
              <Typography variant="body2"><strong>Diagnosis Notes:</strong> {selectedImage.diagnosisNotes}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DentalImaging;
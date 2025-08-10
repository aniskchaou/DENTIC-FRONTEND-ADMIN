import React, { useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, Typography, Chip, Divider, Box, Paper, Stack, Tooltip
} from '@mui/material';

const ViewLabTest = ({
  open,
  onClose,
  testLab,
  getPatientName,
  getDoctorName
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(testLab?.document || null);
  const fileInputRef = useRef();

  if (!testLab) return null;

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`/api/labtests/${testLab.id}/upload`, {
        method: 'POST',
        body: formData,
      });
      // Optionally update UI or fetch new document info here
      setUploadedFile({ name: file.name, url: `/labtest/${file.name}` });
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  // Handle download
  const handleDownload = () => {
    if (uploadedFile && uploadedFile.url) {
      const link = document.createElement('a');
      link.href = uploadedFile.url;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ background: '#e3f2fd', fontWeight: 700, fontSize: 22 }}>
        <i className="fas fa-vials" style={{ color: '#1976d2', marginRight: 10 }} />
        Lab Test Details
      </DialogTitle>
      <DialogContent dividers sx={{ background: '#f8fafc' }}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#fff', borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Tooltip title="Patient">
              <i className="fas fa-user" style={{ color: '#1976d2', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle1" fontWeight={600}>
              {getPatientName ? getPatientName(testLab.patientId) : testLab.patientId}
            </Typography>
            <Chip
              label={testLab.testStatus}
              color={
                testLab.testStatus === 'Completed'
                  ? 'success'
                  : testLab.testStatus === 'Pending'
                  ? 'warning'
                  : 'default'
              }
              size="small"
              sx={{ ml: 2 }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Tooltip title="Doctor">
              <i className="fas fa-user-md" style={{ color: '#388e3c', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle2">{getDoctorName ? getDoctorName(testLab.doctorId) : testLab.doctorId}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Test Name">
              <i className="fas fa-flask" style={{ color: '#d32f2f', fontSize: 18 }} />
            </Tooltip>
            <Typography variant="subtitle2">{testLab.testName}</Typography>
          </Stack>
        </Paper>
        <Divider sx={{ mb: 2 }} />

        {/* Upload/Download Document Section */}
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            <i className="fas fa-file-upload" style={{ marginRight: 8, color: '#1976d2' }} />
            Lab Test Document
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                startIcon={<i className="fas fa-upload"></i>}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
              {uploadedFile && (
                <>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {uploadedFile.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDownload}
                    startIcon={<i className="fas fa-download"></i>}
                  >
                    Download
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Category:</strong> {testLab.testCategory}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Status:</strong>{' '}
              <Chip
                label={testLab.testStatus}
                color={
                  testLab.testStatus === 'Completed'
                    ? 'success'
                    : testLab.testStatus === 'Pending'
                    ? 'warning'
                    : 'default'
                }
                size="small"
              />
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Sample Type:</strong> {testLab.sampleType}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Sample Date:</strong> {testLab.sampleCollectionDate ? new Date(testLab.sampleCollectionDate).toLocaleString() : '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Collected By:</strong> {testLab.sampleCollectedBy}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Laboratory:</strong> {testLab.laboratoryId}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Test Cost:</strong> {testLab.testCost}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Insurance Covered:</strong> {testLab.insuranceCovered}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Payment Status:</strong> {testLab.paymentStatus}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Description:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#1976d2' }}>
              {testLab.testDescription || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Result:</strong>
            </Typography>
            <Box sx={{
              background: '#f1f8e9',
              borderRadius: 1,
              p: 1,
              fontFamily: 'monospace',
              fontSize: 14,
              color: '#388e3c',
              mb: 2,
              minHeight: 32
            }}>
              {testLab.result && Object.keys(testLab.result).length > 0
                ? <pre style={{ margin: 0, background: 'none', fontFamily: 'inherit' }}>{JSON.stringify(testLab.result, null, 2)}</pre>
                : 'No result yet'}
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            <i className="fas fa-clock" style={{ marginRight: 4 }} />
            Created: {testLab.createdAt ? new Date(testLab.createdAt).toLocaleString() : '-'}
            <br />
            <i className="fas fa-sync-alt" style={{ marginRight: 4 }} />
            Updated: {testLab.updatedAt ? new Date(testLab.updatedAt).toLocaleString() : '-'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: '#f8fafc' }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ minWidth: 100 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewLabTest;
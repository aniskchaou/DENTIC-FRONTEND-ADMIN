import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, TextField, MenuItem, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  IconButton, Tooltip, Alert, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Avatar,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderIcon from '@mui/icons-material/Folder';
import {
  getAdminDocuments, uploadAdminDocument, verifyAdminDocument, deleteAdminDocument
} from '../../main/services/receptionistHTTPService';

const DOC_TYPES = ['consent', 'insurance_card', 'government_id', 'referral_letter', 'medical_record', 'hipaa', 'payment_agreement', 'other'];

const DOC_COLORS = {
  consent: { color: '#1976d2', bg: '#e3f2fd' },
  insurance_card: { color: '#7b1fa2', bg: '#f3e5f5' },
  government_id: { color: '#388e3c', bg: '#e8f5e9' },
  referral_letter: { color: '#f57c00', bg: '#fff3e0' },
  medical_record: { color: '#0288d1', bg: '#e1f5fe' },
  hipaa: { color: '#c62828', bg: '#ffebee' },
  payment_agreement: { color: '#558b2f', bg: '#f1f8e9' },
  other: { color: '#546e7a', bg: '#eceff1' },
};

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patientId, setPatientId] = useState('');
  const [uploadDialog, setUploadDialog] = useState(false);
  const [verifyDialog, setVerifyDialog] = useState(null);
  const [verifyNote, setVerifyNote] = useState('');
  const [uploadForm, setUploadForm] = useState({ patientId: '', docType: 'other', description: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = patientId ? { patientId } : {};
      const r = await getAdminDocuments(params);
      setDocs(Array.isArray(r.data) ? r.data : (r.data?.value || []));
    } catch { setError('Failed to load documents'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const handleUpload = async () => {
    if (!uploadFile) return setError('Please select a file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      Object.entries(uploadForm).forEach(([k, v]) => fd.append(k, v));
      await uploadAdminDocument(fd);
      setSuccess('Document uploaded');
      setUploadDialog(false); setUploadFile(null);
      setUploadForm({ patientId: '', docType: 'other', description: '' });
      load();
    } catch { setError('Upload failed'); }
    setUploading(false);
  };

  const handleVerify = async () => {
    try {
      await verifyAdminDocument(verifyDialog, { note: verifyNote });
      setSuccess('Document verified'); setVerifyDialog(null); setVerifyNote(''); load();
    } catch { setError('Verification failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try { await deleteAdminDocument(id); setSuccess('Deleted'); load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100%', p: { xs: 2, md: 3 } }}>

      {/* Page header */}
      <Box sx={{
        background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 55%, #42a5f5 100%)',
        borderRadius: 3, p: 3, mb: 3,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>
            <FolderIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Administrative Documents
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
            {docs.length} document{docs.length !== 1 ? 's' : ''} on file
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setUploadDialog(true)}
          sx={{ bgcolor: '#fff', color: '#1565c0', fontWeight: 700, borderRadius: 2.5, '&:hover': { bgcolor: '#e3f2fd' } }}>
          Upload Document
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small" label="Filter by Patient ID" value={patientId}
          onChange={e => setPatientId(e.target.value)}
          sx={{ width: 220, bgcolor: '#fff', borderRadius: 2 }}
        />
        {patientId && <Button size="small" onClick={() => setPatientId('')} sx={{ color: '#64748b' }}>Clear</Button>}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #e8edf2', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  {['Patient','Type','File','Description','Verified','Uploaded','Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5, borderBottom: '2px solid #e8edf2' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {docs.map(d => {
                  const dc = DOC_COLORS[d.docType] || DOC_COLORS.other;
                  return (
                    <TableRow key={d.id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' }, borderBottom: '1px solid #f1f5f9' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                            {String(d.patientId || '?')[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{d.patientId}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: dc.bg, border: `1px solid ${dc.color}30`, borderRadius: 2, px: 1.2, py: 0.4 }}>
                          <Typography variant="caption" sx={{ color: dc.color, fontWeight: 700, textTransform: 'capitalize' }}>
                            {(d.docType || 'other').replace(/_/g, ' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 12 }}>
                          {d.fileName || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>
                        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                          {d.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {d.isVerified
                          ? <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#e8f5e9', border: '1px solid #a5d6a720', borderRadius: 2, px: 1.2, py: 0.4 }}>
                              <VerifiedIcon sx={{ fontSize: 14, color: '#388e3c' }} />
                              <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 700 }}>Verified</Typography>
                            </Box>
                          : <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#fff3e0', border: '1px solid #ffe08220', borderRadius: 2, px: 1.2, py: 0.4 }}>
                              <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 700 }}>Unverified</Typography>
                            </Box>}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Open file">
                            <IconButton size="small" component="a" href={d.fileUrl} target="_blank" rel="noopener noreferrer"
                              sx={{ color: '#1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' }, borderRadius: 1.5, p: 0.6 }}>
                              <OpenInNewIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={d.isVerified ? 'Already verified' : 'Verify document'}>
                            <span>
                              <IconButton size="small" disabled={d.isVerified}
                                onClick={() => { setVerifyDialog(d.id); setVerifyNote(''); }}
                                sx={{ color: '#388e3c', bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#c8e6c9' }, borderRadius: 1.5, p: 0.6, '&.Mui-disabled': { opacity: 0.35 } }}>
                                <VerifiedIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(d.id)}
                              sx={{ color: '#d32f2f', bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' }, borderRadius: 1.5, p: 0.6 }}>
                              <DeleteIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!docs.length && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                      <FolderIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3, display: 'block', mx: 'auto' }} />
                      No documents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Upload Administrative Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={6}><TextField fullWidth size="small" label="Patient ID *" value={uploadForm.patientId} onChange={e => setUploadForm({ ...uploadForm, patientId: e.target.value })} required /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" select label="Document Type" value={uploadForm.docType} onChange={e => setUploadForm({ ...uploadForm, docType: e.target.value })}>
                {DOC_TYPES.map(t => <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Description (optional)" value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} /></Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadIcon />} sx={{ borderRadius: 2, borderStyle: 'dashed', py: 1.5 }}>
                {uploadFile ? uploadFile.name : 'Click to select file'}
                <input type="file" hidden onChange={e => setUploadFile(e.target.files[0])} />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUploadDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={uploading || !uploadFile || !uploadForm.patientId} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>
            {uploading ? <CircularProgress size={18} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verify dialog */}
      <Dialog open={!!verifyDialog} onClose={() => setVerifyDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Verify Document</DialogTitle>
        <DialogContent>
          <TextField fullWidth size="small" label="Verification note (optional)" value={verifyNote} onChange={e => setVerifyNote(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setVerifyDialog(null)} color="inherit">Cancel</Button>
          <Button variant="contained" color="success" onClick={handleVerify} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>Mark Verified</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



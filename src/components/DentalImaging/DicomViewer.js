import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import DentalPapayaViewer from "./DentalPapayaViewer";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import BASE_URL from "../../main/urls/urls";
import { useTranslation } from "react-i18next";

export default function DicomViewer() {
  const { t } = useTranslation();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [dcmFiles, setDcmFiles] = useState([]);
  const [selectedDcmFiles, setSelectedDcmFiles] = useState([]);
  const [viewerUrls, setViewerUrls] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPatient, setModalPatient] = useState("");
  const [modalFiles, setModalFiles] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const fileInputRef = useRef();

  // Fetch patients from backend
  useEffect(() => {
    axios.get(BASE_URL + "/patients").then(res => {
      setPatients(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  // Fetch DICOM files when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setFetchError("");
      axios.get(`http://localhost:5000/dental-imaging/dicom-files/${selectedPatient}`)
        .then(res => {
          const files = Array.isArray(res.data.files) ? res.data.files : [];
          setDcmFiles(files.map(url => ({
            url,
            name: url.split("/").pop()
          })));
          if (files.length === 0) setFetchError(t("dicom.no_files"));
        })
        .catch(() => {
          setDcmFiles([]);
          setFetchError(t("dicom.no_files"));
        });
      setSelectedDcmFiles([]);
    } else {
      setDcmFiles([]);
      setSelectedDcmFiles([]);
      setFetchError("");
    }
  }, [selectedPatient, t]);

  const handleSendToViewer = () => {
    if (selectedDcmFiles.length) {
      setViewerUrls(selectedDcmFiles);
    }
  };

  // Modal: Add DICOM files
  const handleModalOpen = () => {
    setModalOpen(true);
    setModalPatient("");
    setModalFiles([]);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPatient("");
    setModalFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleModalSubmit = async () => {
    if (modalFiles.length && modalPatient) {
      for (let file of modalFiles) {
        const formData = new FormData();
        formData.append("MRN", modalPatient); // Use MRN as patient identifier
        formData.append("file", file);
        await axios.post(
          "http://localhost:5000/dental-imaging/upload-dicom",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      // Optionally refresh dcmFiles list from backend
      if (selectedPatient === modalPatient) {
        // Refresh files for current patient
        axios.get(`http://localhost:5000/dental-imaging/dicom-files/${selectedPatient}`)
          .then(res => {
            const files = Array.isArray(res.data.files) ? res.data.files : [];
            setDcmFiles(files.map(url => ({
              url,
              name: url.split("/").pop()
            })));
          });
      }
    }
    handleModalClose();
  };

  const handleDcmCheckboxChange = (url) => {
    setSelectedDcmFiles(prev =>
      prev.includes(url)
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 1000, mx: "auto" }}>
      {/* Top: Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
            {t("dicom.title")}
          </Typography>
          <IconButton color="primary" onClick={handleModalOpen}>
            <AddIcon />
          </IconButton>
        </Stack>
        <TextField
          select
          label={t("dicom.patient")}
          value={selectedPatient}
          onChange={e => setSelectedPatient(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {patients.map(p => (
            <MenuItem key={p.id} value={p.medicalRecordNumber}>
              {p.name || p.fullName} {p.medicalRecordNumber ? `(${p.medicalRecordNumber})` : ""}
            </MenuItem>
          ))}
        </TextField>
        {fetchError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {fetchError}
          </Typography>
        )}
        {dcmFiles.length > 0 && (
          <FormGroup sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("dicom.select_files")}</Typography>
            {dcmFiles.map(f => (
              <FormControlLabel
                key={f.url}
                control={
                  <Checkbox
                    checked={selectedDcmFiles.includes(f.url)}
                    onChange={() => handleDcmCheckboxChange(f.url)}
                  />
                }
                label={f.name}
              />
            ))}
          </FormGroup>
        )}
        <Button
          variant="outlined"
          color="primary"
          disabled={!selectedPatient || !selectedDcmFiles.length}
          sx={{ mt: 2 }}
          onClick={handleSendToViewer}
        >
          {t("dicom.send_to_viewer")}
        </Button>
      </Paper>
      {/* Bottom: DentalPapayaViewer */}
      <DentalPapayaViewer dcmUrl={viewerUrls} />

      {/* Modal: Add DICOM files */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t("dicom.add_files")}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label={t("dicom.select_patient")}
            value={modalPatient}
            onChange={e => setModalPatient(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.medicalRecordNumber}>
                {p.name || p.fullName} {p.medicalRecordNumber ? `(${p.medicalRecordNumber})` : ""}
              </MenuItem>
            ))}
          </TextField>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".dcm"
            style={{ marginBottom: 16, marginTop: 8, width: "100%" }}
            onChange={e => setModalFiles(Array.from(e.target.files))}
          />
          {modalFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">{t("dicom.selected_files")}</Typography>
              <ul>
                {modalFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">{t("dicom.cancel")}</Button>
          <Button
            onClick={handleModalSubmit}
            color="primary"
            variant="contained"
            disabled={!modalPatient || !modalFiles.length}
          >
            {t("dicom.upload")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

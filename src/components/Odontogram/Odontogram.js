import React, { useState, useEffect } from 'react';
import './Odontogram.css';
import axios from 'axios';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, MenuItem, Stack } from '@mui/material';

const TOOTH_STATUSES = ['healthy', 'decayed', 'missing', 'treated'];
const TOOTH_SURFACES = ['mesial', 'distal', 'occlusal', 'buccal', 'lingual'];

const getInitialTeeth = () =>
  Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    status: 'healthy',
    surfaces: {},
    notes: '',
    images: [],
    history: [],
    procedure: '',
    operation: '',
    diagnosis: ''
  }));

const Odontogram = ({ patientId }) => {
  const [teeth, setTeeth] = useState(getInitialTeeth());
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Data for selects
  const [procedures, setProcedures] = useState([]);
  const [operations, setOperations] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);

  // Fetch select options
  useEffect(() => {
    axios.get('/procedures').then(res => setProcedures(res.data));
    axios.get('/operations').then(res => setOperations(res.data));
    axios.get('/diagnosis').then(res => setDiagnosis(res.data));
  }, []);

  // Load from localStorage for patient-specific odontogram
  useEffect(() => {
    if (patientId) {
      const saved = localStorage.getItem(`odontogram_${patientId}`);
      if (saved) setTeeth(JSON.parse(saved));
    }
  }, [patientId]);

  // Save to localStorage on change
  useEffect(() => {
    if (patientId) {
      localStorage.setItem(`odontogram_${patientId}`, JSON.stringify(teeth));
    }
  }, [teeth, patientId]);

  // Cycle tooth status on click
  const handleToothClick = (id) => {
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === id
          ? {
              ...tooth,
              status:
                TOOTH_STATUSES[
                  (TOOTH_STATUSES.indexOf(tooth.status) + 1) %
                    TOOTH_STATUSES.length
                ],
              history: [
                ...tooth.history,
                {
                  date: new Date().toISOString(),
                  status: tooth.status,
                },
              ],
            }
          : tooth
      )
    );
  };

  // Open modal for tooth details
  const handleToothDetails = (tooth) => {
    setSelectedTooth(tooth);
    setShowModal(true);
  };

  // Update notes, surfaces, images, selects
  const handleModalChange = (field, value) => {
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === selectedTooth.id
          ? { ...tooth, [field]: value }
          : tooth
      )
    );
    setSelectedTooth({ ...selectedTooth, [field]: value });

    // Remove "Selected:" from value if present (for select boxes)
    if (typeof value === 'string' && value.startsWith('Selected:')) {
      const cleanValue = value.replace(/^Selected:\s*/, '');
      setTeeth((prev) =>
        prev.map((tooth) =>
          tooth.id === selectedTooth.id
            ? { ...tooth, [field]: cleanValue }
            : tooth
        )
      );
      setSelectedTooth({ ...selectedTooth, [field]: cleanValue });
    }
  };

  // Surface selection
  const handleSurfaceToggle = (surface) => {
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === selectedTooth.id
          ? {
              ...tooth,
              surfaces: {
                ...tooth.surfaces,
                [surface]: !tooth.surfaces[surface],
              },
            }
          : tooth
      )
    );
    setSelectedTooth({
      ...selectedTooth,
      surfaces: {
        ...selectedTooth.surfaces,
        [surface]: !selectedTooth.surfaces[surface],
      },
    });
  };

  // Image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === selectedTooth.id
          ? {
              ...tooth,
              images: [
                ...tooth.images,
                ...files.map((file) => URL.createObjectURL(file)),
              ],
            }
          : tooth
      )
    );
    setSelectedTooth({
      ...selectedTooth,
      images: [
        ...selectedTooth.images,
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    });
  };

  // Export odontogram as image
  const handleExport = () => {
    const odontogramEl = document.querySelector('.odontogram');
    if (!odontogramEl) return;
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(odontogramEl).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'odontogram.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  return (
    <Box>
      <Box className="odontogram">
        {teeth.map((tooth) => (
          <div
            key={tooth.id}
            className={`tooth ${tooth.status}`}
            title={`Tooth ${tooth.id}: ${tooth.status}`}
            onClick={() => handleToothClick(tooth.id)}
            onDoubleClick={() => handleToothDetails(tooth)}
          >
            {tooth.id}
            <span className="surfaces">
              {TOOTH_SURFACES.map(
                (surface) =>
                  tooth.surfaces[surface] && (
                    <span key={surface} className={`surface ${surface}`}>
                      {surface[0].toUpperCase()}
                    </span>
                  )
              )}
            </span>
          </div>
        ))}
      </Box>
      <Button variant="contained" onClick={handleExport} sx={{ mt: 2 }}>
        Export Odontogram
      </Button>
      <Dialog open={showModal && !!selectedTooth} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tooth {selectedTooth?.id} Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography><strong>Status:</strong> {selectedTooth?.status}</Typography>
            <Box>
              <strong>Surfaces:</strong>
              <Stack direction="row" spacing={1}>
                {TOOTH_SURFACES.map((surface) => (
                  <label key={surface}>
                    <input
                      type="checkbox"
                      checked={!!selectedTooth?.surfaces[surface]}
                      onChange={() => handleSurfaceToggle(surface)}
                    />
                    {surface}
                  </label>
                ))}
              </Stack>
            </Box>
            <TextField
              label="Notes"
              value={selectedTooth?.notes || ''}
              onChange={(e) => handleModalChange('notes', e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box>
              <strong>Images:</strong>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Box className="images" sx={{ mt: 1 }}>
                {selectedTooth?.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Tooth ${selectedTooth?.id}`} width={50} />
                ))}
              </Box>
            </Box>
            {/* Select Procedure, Operation, Diagnosis */}
            <TextField
              select
              label="Procedure"
              value={selectedTooth?.procedure || ''}
              onChange={e => handleModalChange('procedure', e.target.value)}
              fullWidth
            >
              {procedures.map((proc) => (
                <MenuItem key={proc.id || proc.name} value={proc.id || proc.name}>
                  {proc.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Operation"
              value={selectedTooth?.operation || ''}
              onChange={e => handleModalChange('operation', e.target.value)}
              fullWidth
            >
              {operations.map((op) => (
                <MenuItem key={op.id || op.name} value={op.id || op.name}>
                  {op.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Diagnosis"
              value={selectedTooth?.diagnosis || ''}
              onChange={e => handleModalChange('diagnosis', e.target.value)}
              fullWidth
            >
              {diagnosis.map((diag) => (
                <MenuItem key={diag.id || diag.name} value={diag.id || diag.name}>
                  {diag.name}
                </MenuItem>
              ))}
            </TextField>
            {/* Save button below select boxes */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, minWidth: 120 }}
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Save
            </Button>
            <Box>
              <strong>History:</strong>
              <ul>
                {selectedTooth?.history.map((h, idx) => (
                  <li key={idx}>
                    {h.date}: {h.status}
                  </li>
                ))}
              </ul>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Odontogram;

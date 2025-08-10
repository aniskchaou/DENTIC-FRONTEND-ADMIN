import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

// Simple SVG-based odontogram for a patient
const TEETH = [
  // Upper jaw (right to left)
  { num: 18 }, { num: 17 }, { num: 16 }, { num: 15 }, { num: 14 }, { num: 13 }, { num: 12 }, { num: 11 },
  { num: 21 }, { num: 22 }, { num: 23 }, { num: 24 }, { num: 25 }, { num: 26 }, { num: 27 }, { num: 28 },
  // Lower jaw (left to right)
  { num: 48 }, { num: 47 }, { num: 46 }, { num: 45 }, { num: 44 }, { num: 43 }, { num: 42 }, { num: 41 },
  { num: 31 }, { num: 32 }, { num: 33 }, { num: 34 }, { num: 35 }, { num: 36 }, { num: 37 }, { num: 38 }
];

const toothColor = "#fff";
const toothStroke = "#1976d2";

const OdontogramSVG = React.forwardRef(({ patient }, ref) => (
  <svg
    ref={ref}
    width={700}
    height={260}
    viewBox="0 0 700 260"
    style={{ background: "#f5f5f5", borderRadius: 12, margin: "auto", display: "block" }}
    className="odontogram"
  >
    {/* Upper jaw */}
    {TEETH.slice(0, 16).map((tooth, idx) => (
      <g key={tooth.num}>
        <rect
          x={30 + idx * 40}
          y={40}
          width={36}
          height={60}
          rx={12}
          fill={toothColor}
          stroke={toothStroke}
          strokeWidth={2}
        />
        <text
          x={48 + idx * 40}
          y={110}
          fontSize={14}
          textAnchor="middle"
          fill="#333"
        >
          {tooth.num}
        </text>
      </g>
    ))}
    {/* Lower jaw */}
    {TEETH.slice(16).map((tooth, idx) => (
      <g key={tooth.num}>
        <rect
          x={30 + idx * 40}
          y={140}
          width={36}
          height={60}
          rx={12}
          fill={toothColor}
          stroke={toothStroke}
          strokeWidth={2}
        />
        <text
          x={48 + idx * 40}
          y={215}
          fontSize={14}
          textAnchor="middle"
          fill="#333"
        >
          {tooth.num}
        </text>
      </g>
    ))}
    {/* Jaw labels */}
    <text x={350} y={30} fontSize={18} textAnchor="middle" fill="#1976d2" fontWeight="bold">Upper Jaw</text>
    <text x={350} y={235} fontSize={18} textAnchor="middle" fill="#1976d2" fontWeight="bold">Lower Jaw</text>
  </svg>
));

const OndotogramPatient = ({ open, onClose, patient }) => {
  const svgRef = useRef();

  const handleDownload = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    // Use html2canvas for SVG to PNG export
    const html2canvas = (await import('html2canvas')).default;
    html2canvas(svg.parentNode).then((canvas) => {
      const link = document.createElement('a');
      link.download = `odontogram_${patient?.fullName || 'patient'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Odontogram for {patient?.fullName || ''}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Patient: <b>{patient?.fullName || ''}</b>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <OdontogramSVG ref={svgRef} patient={patient} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
        >
          Download Odontogram
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OndotogramPatient;
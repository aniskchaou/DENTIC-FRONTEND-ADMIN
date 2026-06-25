import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ProfessionalOdontogram.css';
import axios from 'axios';
import { FaUserMd, FaUser, FaClinicMedical, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import BASE_URL from '../../main/urls/urls';
import InsightsIcon from '@mui/icons-material/Insights';
import ScienceIcon from '@mui/icons-material/Science';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Plot from 'react-plotly.js';
import Jaw3DPlot from './Jaw3DPlot';

const TOOTH_STATUSES = ['healthy', 'decayed', 'missing', 'filled'];
const TOOTH_SURFACES = ['mesial', 'distal', 'occlusal', 'buccal', 'lingual'];

const TOOTH_TYPES = [
  'Molar', 'Molar', 'Premolar', 'Premolar', 'Canine', 'Incisor', 'Incisor', 'Incisor',
  'Incisor', 'Incisor', 'Canine', 'Premolar', 'Premolar', 'Molar', 'Molar', 'Molar',
  'Molar', 'Molar', 'Premolar', 'Premolar', 'Canine', 'Incisor', 'Incisor', 'Incisor',
  'Incisor', 'Incisor', 'Canine', 'Premolar', 'Premolar', 'Molar', 'Molar', 'Molar'
];

const getInitialTeeth = () =>
  Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    status: 'healthy',
    surfaces: {},
    notes: '',
    images: [],
    history: [],
    type: TOOTH_TYPES[i],
    procedure: '',
    operation: '',
    diagnosis: '',
    treatmentSummary: '',
  }));

const statusColors = {
  healthy: '#4caf50',
  decayed: '#f44336',
  filled: '#ffeb3b',
  missing: '#e0e0e0'
};

const teethData = [
  { id: 1, x: 0, y: 0, z: 0, status: 'healthy' },
  { id: 2, x: 1, y: 0.2, z: 0, status: 'decayed' },
  { id: 3, x: 2, y: 0.4, z: 0, status: 'filled' },
  // ...add all teeth with their positions and status
];


const statusColor = {
  healthy: 'green',
  decayed: 'red',
  filled: 'yellow',
  missing: 'gray'
};

// ── Clinical odontogram constants ──────────────────────────────────────────
// FDI numbers indexed by tooth array position (0-31)
const FDI_NUMBERS = [
  18, 17, 16, 15, 14, 13, 12, 11,  // upper right (Q1) – displayed left
  21, 22, 23, 24, 25, 26, 27, 28,  // upper left  (Q2) – displayed right
  48, 47, 46, 45, 44, 43, 42, 41,  // lower right (Q4) – displayed left
  31, 32, 33, 34, 35, 36, 37, 38,  // lower left  (Q3) – displayed right
];

const TOOTH_WIDTHS  = { Molar: 52, Premolar: 38, Canine: 30, Incisor: 28 };
const TOOTH_HEIGHTS = { Molar: 42, Premolar: 42, Canine: 46, Incisor: 42 };
const TOOTH_GAP     = 2;

// Enamel-realistic base colors per status
const SURFACE_BASE = {
  healthy: '#f0ece0',   // warm ivory enamel
  decayed: '#b8814a',   // caries brown
  filled:  '#c8d4e0',   // amalgam silver-blue
  missing: '#d8d0c8',
};
const SURFACE_MARKED  = '#1a5fa8';
const ENAMEL_STROKE   = '#8a9ba8';
const FISSURE_COLOR   = '#a09080';

// ── Anatomically realistic tooth crown outlines (occlusal view) ───────────
const getToothOutlinePath = (type, W, H) => {
  switch (type) {

    case 'Molar': {
      // Wide rounded-rectangle with subtle cusp bumps at all 4 corners
      const r = 9;
      return [
        `M ${r},1`,
        `L ${W-r},1 Q ${W-1},1 ${W-1},${r+1}`,
        `L ${W-1},${H/2-5} Q ${W+3},${H/2} ${W-1},${H/2+5}`,  // right cusp bump
        `L ${W-1},${H-r-1} Q ${W-1},${H-1} ${W-r},${H-1}`,
        `L ${r},${H-1} Q 1,${H-1} 1,${H-r-1}`,
        `L 1,${H/2+5} Q ${-3},${H/2} 1,${H/2-5}`,             // left cusp bump
        `L 1,${r+1} Q 1,1 ${r},1 Z`
      ].join(' ');
    }

    case 'Premolar': {
      // Figure-of-8 oval – two distinct cusp lobes (buccal + lingual)
      const cx = W/2, cy = H/2;
      const rx = W*0.42, ry = H*0.46, k = 0.5523;
      return [
        `M ${cx},${cy-ry}`,
        `C ${cx+rx*k},${cy-ry} ${cx+rx},${cy-ry*k} ${cx+rx},${cy}`,
        `C ${cx+rx},${cy+ry*k} ${cx+rx*k},${cy+ry} ${cx},${cy+ry}`,
        `C ${cx-rx*k},${cy+ry} ${cx-rx},${cy+ry*k} ${cx-rx},${cy}`,
        `C ${cx-rx},${cy-ry*k} ${cx-rx*k},${cy-ry} ${cx},${cy-ry} Z`
      ].join(' ');
    }

    case 'Canine': {
      // Diamond: pointed lingual tip (top), wide rounded buccal base (bottom)
      const cx = W/2;
      return [
        `M ${cx},2`,
        `Q ${W*0.82},${H*0.18} ${W-2},${H*0.46}`,
        `Q ${W-2},${H-5} ${W-4},${H-2}`,
        `Q ${cx},${H+2} 4,${H-2}`,
        `Q 2,${H-5} 2,${H*0.46}`,
        `Q ${W*0.18},${H*0.18} ${cx},2 Z`
      ].join(' ');
    }

    case 'Incisor':
    default: {
      // Trapezoid: wide buccal base (bottom), narrower lingual top – shovel-shaped
      const lo = W * 0.20;                  // lingual offset (each side)
      return [
        `M ${lo+3},3`,
        `Q ${W/2},1 ${W-lo-3},3`,           // lingual edge (gently curved inward)
        `Q ${W-2},6 ${W-2},${H*0.30}`,      // upper-right corner
        `L ${W-2},${H-5}`,
        `Q ${W-2},${H-1} ${W-5},${H-1}`,    // buccal right corner
        `L 5,${H-1}`,
        `Q 2,${H-1} 2,${H-5}`,              // buccal left corner
        `L 2,${H*0.30}`,
        `Q 2,6 ${lo+3},3 Z`                 // upper-left corner
      ].join(' ');
    }
  }
};

const getJawTeeth = (teeth, start, end, yOffset) =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const t = teeth[start + i];
    return {
      id: t.id,
      x: Math.cos(Math.PI * (i / (end - start))) * 10,
      y: Math.sin(Math.PI * (i / (end - start))) * 3 + yOffset,
      z: 0,
      status: t.status
    };
  });

// Realistic arch logic for 3D chart
const getArchTeeth3D = (teethSlice, arch) =>
  teethSlice.map((tooth, idx) => {
    const archRadius = 10; // scale for Plotly
    const archCenterY = arch === 'upper' ? 6 : -6;
    const angle = arch === 'upper'
      ? Math.PI * (1 - idx / (teethSlice.length - 1))
      : -Math.PI * (idx / (teethSlice.length - 1));
    return {
      id: tooth.id,
      x: archRadius * Math.cos(angle),
      y: archRadius * Math.sin(angle) + archCenterY,
      z: 0,
      status: tooth.status
    };
  });

const ProfessionalOdontogram = () => {
  const [teeth, setTeeth] = useState(getInitialTeeth());
  // Use fixed arch radius for 3D chart
  const archRadius = 20;
  // Helper for 3D jaw layout
  const getSemiCircleTeeth3D = (teethSlice, arch) => {
    const verticalOffset = 2.5 * archRadius;
    const archCenterY = arch === 'upper' ? verticalOffset : -verticalOffset;
    return teethSlice.map((tooth, idx) => {
      const angle = arch === 'upper'
        ? Math.PI * (1 - idx / (teethSlice.length - 1))
        : -Math.PI * (idx / (teethSlice.length - 1));
      return {
        id: tooth.id,
        x: archRadius * Math.cos(angle),
        y: archRadius * Math.sin(angle) + archCenterY,
        z: 0,
        status: tooth.status
      };
    });
  };
  const upperJawTeeth3D = getSemiCircleTeeth3D(teeth.slice(0, 16), 'upper');
  const lowerJawTeeth3D = getSemiCircleTeeth3D(teeth.slice(16), 'lower');
  const allTeeth3D = [...upperJawTeeth3D, ...lowerJawTeeth3D].filter(t => t.status !== 'missing');
  const { t } = useTranslation();

  
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [operations, setOperations] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  // NEW: State for select box data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [selectedMembership, setSelectedMembership] = useState('');
  const [sentFormData, setSentFormData] = useState(null);
  const [backendTeethHistory, setBackendTeethHistory] = useState([]); // <-- New state for backend teeth history

  // Add state for Condition Prediction AI
  const [conditionPredictionOpen, setConditionPredictionOpen] = useState(false);
  const [conditionPredictionLoading, setConditionPredictionLoading] = useState(false);
  const [conditionPredictionResult, setConditionPredictionResult] = useState(null);

  // Treatment Simulation AI states
  const [treatmentSimOpen, setTreatmentSimOpen] = useState(false);
  const [treatmentSimLoading, setTreatmentSimLoading] = useState(false);
  const [treatmentSimOdontogram, setTreatmentSimOdontogram] = useState('');
  const [treatmentSimPlan, setTreatmentSimPlan] = useState('');
  const [treatmentSimResult, setTreatmentSimResult] = useState(null);

  // Fetch select box data and lists
  useEffect(() => {
    fetch(`${BASE_URL}/procedures`)
      .then(res => res.json())
      .then(data => setProcedures(data))
      .catch(() => setProcedures([]));
    fetch(`${BASE_URL}/operations`)
      .then(res => res.json())
      .then(data => setOperations(data))
      .catch(() => setOperations([]));
    fetch(`${BASE_URL}/diagnoses`)
      .then(res => res.json())
      .then(data => setDiagnoses(data))
      .catch(() => setDiagnoses([]));
    fetch(`${BASE_URL}/patients`)
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(() => setPatients([]));
    fetch(`${BASE_URL}/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(() => setDoctors([]));
    fetch(`${BASE_URL}/clinics`)
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(() => setClinics([]));
    fetch(`${BASE_URL}/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointments([]));
  }, []);

  // Fetch teeth data from backend when all filters are selected
  useEffect(() => {
    if (
      selectedPatient &&
      selectedDoctor &&
      selectedClinic &&
      selectedAppointment &&
      selectedMembership
    ) {
      axios
        .post(`${BASE_URL}/ondotogram/teeth`, {
          patient: parseInt(selectedPatient, 10),
          doctor: parseInt(selectedDoctor, 10),
          clinic: parseInt(selectedClinic, 10),
          appointment: parseInt(selectedAppointment, 10),
          membership: isNaN(selectedMembership)
            ? selectedMembership
            : parseInt(selectedMembership, 10)
        })
        .then((res) => {
          const backendTeeth = res.data;
          setBackendTeethHistory(backendTeeth); // <-- Save for history display
          setTeeth((prevTeeth) =>
            prevTeeth.map((tooth) => {
              const found = backendTeeth.find(
                (t) => t.toothNumber === tooth.id
              );
              return found
                ? {
                    ...tooth,
                    status: found.status,
                    notes: found.notes,
                    procedure: found.procedure,
                    operation: found.operation,
                    diagnosis: found.diagnosis,
                    treatmentSummary: found.treatmentSummary
                  }
                : { ...tooth, status: 'healthy', notes: '', procedure: '', operation: '', diagnosis: '', treatmentSummary: '' };
            })
          );
        })
        .catch(() => {
          setTeeth(getInitialTeeth());
          setBackendTeethHistory([]);
        });
    }
  }, [selectedPatient, selectedDoctor, selectedClinic, selectedAppointment, selectedMembership]);

  // Tooltip content for a tooth
  const getToothTooltip = (tooth) => {
    return `
Tooth ${tooth.id}
Status: ${tooth.status}
Notes: ${tooth.notes || '-'}
Procedure: ${tooth.procedure || '-'}
Operation: ${tooth.operation || '-'}
Diagnosis: ${tooth.diagnosis || '-'}
Treatment: ${tooth.treatmentSummary || '-'}
    `.trim();
  };

  // ── 3D realistic 5-surface tooth ─────────────────────────────────────────
  const toothSVG = (tooth) => {
    const W  = TOOTH_WIDTHS[tooth.type]  || 28;
    const H  = TOOTH_HEIGHTS[tooth.type] || 36;
    const ix = Math.round(W * 0.27);
    const iy = Math.round(H * 0.27);
    const clipId   = `tc-${tooth.id}`;
    const grad3d   = `tg3-${tooth.id}`;
    const gradEdge = `tge-${tooth.id}`;

    const isSelected  = selectedTooth && selectedTooth.id === tooth.id;
    const strokeColor = isSelected ? '#e65100' : '#6a7d8a';
    const strokeW     = isSelected ? 3 : 1.2;
    const base = SURFACE_BASE[tooth.status] || '#f0ece0';
    const sf   = (s) => tooth.surfaces[s] ? SURFACE_MARKED : base;
    const path = getToothOutlinePath(tooth.type, W, H);

    if (tooth.status === 'missing') {
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
          <path d={path} fill="#ddd" stroke="#aaa" strokeWidth={1.5} />
          <line x1={4} y1={4} x2={W-4} y2={H-4} stroke="#cc4444" strokeWidth={2.5} />
          <line x1={W-4} y1={4} x2={4} y2={H-4} stroke="#cc4444" strokeWidth={2.5} />
        </svg>
      );
    }

    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        <defs>
          <clipPath id={clipId}><path d={path} /></clipPath>
          {/* Strong specular highlight – simulates porcelain/enamel gloss */}
          <radialGradient id={grad3d} cx="30%" cy="25%" r="58%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.00" />
            <stop offset="22%"  stopColor="#ffffff" stopOpacity="0.80" />
            <stop offset="55%"  stopColor="#f5efe0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c8b898" stopOpacity="0.05" />
          </radialGradient>
          {/* Peripheral shadow for depth */}
          <radialGradient id={gradEdge} cx="50%" cy="50%" r="50%">
            <stop offset="55%"  stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.30" />
          </radialGradient>
        </defs>

        <path d={path} fill={base} stroke="none" />

        <g clipPath={`url(#${clipId})`}>
          <polygon points={`0,0 0,${H} ${ix},${H-iy} ${ix},${iy}`}
            fill={sf('mesial')} stroke="none" style={{cursor:'pointer'}}
            onClick={(e)=>{e.stopPropagation();handleSurfaceClickFn(tooth,'mesial');}} />
          <polygon points={`${W},0 ${W},${H} ${W-ix},${H-iy} ${W-ix},${iy}`}
            fill={sf('distal')} stroke="none" style={{cursor:'pointer'}}
            onClick={(e)=>{e.stopPropagation();handleSurfaceClickFn(tooth,'distal');}} />
          <polygon points={`0,0 ${W},0 ${W-ix},${iy} ${ix},${iy}`}
            fill={sf('lingual')} stroke="none" style={{cursor:'pointer'}}
            onClick={(e)=>{e.stopPropagation();handleSurfaceClickFn(tooth,'lingual');}} />
          <polygon points={`0,${H} ${W},${H} ${W-ix},${H-iy} ${ix},${H-iy}`}
            fill={sf('buccal')} stroke="none" style={{cursor:'pointer'}}
            onClick={(e)=>{e.stopPropagation();handleSurfaceClickFn(tooth,'buccal');}} />
          <rect x={ix} y={iy} width={W-2*ix} height={H-2*iy}
            fill={sf('occlusal')} stroke="none" style={{cursor:'pointer'}}
            onClick={(e)=>{e.stopPropagation();handleSurfaceClickFn(tooth,'occlusal');}} />
        </g>

        <g clipPath={`url(#${clipId})`} style={{pointerEvents:'none'}}>
          {tooth.type === 'Molar' && (<>
            <path d={`M ${W*.30},${H*.27} Q ${W*.50},${H*.42} ${W*.70},${H*.27}`}
              fill="none" stroke={FISSURE_COLOR} strokeWidth={1.5} opacity={.65}/>
            <path d={`M ${W*.30},${H*.73} Q ${W*.50},${H*.58} ${W*.70},${H*.73}`}
              fill="none" stroke={FISSURE_COLOR} strokeWidth={1.5} opacity={.65}/>
            <line x1={W*.50} y1={H*.27} x2={W*.50} y2={H*.73}
              stroke={FISSURE_COLOR} strokeWidth={1.2} opacity={.60}/>
            <ellipse cx={W*.27} cy={H*.24} rx={W*.11} ry={H*.09} fill="#fff" opacity=".50"/>
            <ellipse cx={W*.73} cy={H*.24} rx={W*.11} ry={H*.09} fill="#fff" opacity=".50"/>
            <ellipse cx={W*.27} cy={H*.76} rx={W*.11} ry={H*.09} fill="#fff" opacity=".40"/>
            <ellipse cx={W*.73} cy={H*.76} rx={W*.11} ry={H*.09} fill="#fff" opacity=".40"/>
          </>)}
          {tooth.type === 'Premolar' && (<>
            <line x1={W*.50} y1={H*.20} x2={W*.50} y2={H*.80}
              stroke={FISSURE_COLOR} strokeWidth={1.2} opacity={.60}/>
            <ellipse cx={W*.50} cy={H*.26} rx={W*.14} ry={H*.10} fill="#fff" opacity=".52"/>
            <ellipse cx={W*.50} cy={H*.74} rx={W*.14} ry={H*.10} fill="#fff" opacity=".42"/>
          </>)}
          {tooth.type === 'Canine' && (
            <ellipse cx={W*.50} cy={H*.30} rx={W*.16} ry={H*.11} fill="#fff" opacity=".50"/>
          )}
          {tooth.type === 'Incisor' && (
            <ellipse cx={W*.50} cy={H*.32} rx={W*.28} ry={H*.10} fill="#fff" opacity=".52"/>
          )}
        </g>

        <path d={path} fill={`url(#${grad3d})`}   stroke="none" style={{pointerEvents:'none'}}/>
        <path d={path} fill={`url(#${gradEdge})`} stroke="none" style={{pointerEvents:'none'}}/>
        <path d={path} fill="none" stroke={strokeColor} strokeWidth={strokeW} style={{pointerEvents:'none'}}/>
      </svg>
    );
  };

  // ── Realistic U-arch jaw renderer ──────────────────────────────────────
  const renderArch = (teethSlice, arch) => {
    const cx  = 360;
    const rxA = 255;                               // arch half-width (≈ outer gum)
    const ryA = 290;                               // arch depth
    const cyA = arch === 'upper' ? 450 : 538;      // molar baseline y

    // Gum horseshoe: teeth sit right at the outer edge
    const rxO = 285,  ryO = 328;                   // outer gum
    const rxI = 218,  ryI = 248;                   // inner palate (close to teeth)

    const gumPath = arch === 'upper'
      ? `M ${cx-rxO},${cyA} A ${rxO},${ryO} 0 0,1 ${cx+rxO},${cyA} L ${cx+rxI},${cyA} A ${rxI},${ryI} 0 0,0 ${cx-rxI},${cyA} Z`
      : `M ${cx-rxO},${cyA} A ${rxO},${ryO} 0 0,0 ${cx+rxO},${cyA} L ${cx+rxI},${cyA} A ${rxI},${ryI} 0 0,1 ${cx-rxI},${cyA} Z`;

    const palatePath = arch === 'upper'
      ? `M ${cx-rxI},${cyA} A ${rxI},${ryI} 0 0,1 ${cx+rxI},${cyA} Z`
      : `M ${cx-rxI},${cyA} A ${rxI},${ryI} 0 0,0 ${cx+rxI},${cyA} Z`;

    const gGumId = `gg-${arch}`;

    // Single full fill – smooth radial gradient replaces 3 separate shapes
    const fullFill = arch === 'upper'
      ? `M ${cx-rxO},${cyA} A ${rxO},${ryO} 0 0,1 ${cx+rxO},${cyA} Z`
      : `M ${cx-rxO},${cyA} A ${rxO},${ryO} 0 0,0 ${cx+rxO},${cyA} Z`;
    const numTeeth  = teethSlice.length;

    return (
      <g>
        <defs>
          {/* Smooth single radial gradient: light centre → dark outer edge */}
          <radialGradient id={gGumId} gradientUnits="userSpaceOnUse"
            cx={cx} cy={cyA} r={rxO}>
            <stop offset="0%"   stopColor="#d0a0a8" />
            <stop offset="70%"  stopColor="#c09098" />
            <stop offset="83%"  stopColor="#8a3848" />
            <stop offset="92%"  stopColor="#6a2030" />
            <stop offset="100%" stopColor="#481018" />
          </radialGradient>
        </defs>

        {/* Single fill – no hard boundary between palate and gum */}
        <path d={fullFill} fill={`url(#${gGumId})`} />

        {teethSlice.map((tooth, idx) => {
          const globalIdx  = arch === 'upper' ? idx : 16 + idx;
          const fdiNum     = FDI_NUMBERS[globalIdx];
          const W          = TOOTH_WIDTHS[tooth.type]  || 28;
          const H          = TOOTH_HEIGHTS[tooth.type] || 36;
          const isSelected = selectedTooth && selectedTooth.id === tooth.id;

          // Angle from π (left molar) → 0 (right molar)
          const alpha = Math.PI * (1 - idx / (numTeeth - 1));

          const tx = cx + rxA * Math.cos(alpha);
          const ty = arch === 'upper'
            ? cyA - ryA * Math.sin(alpha)
            : cyA + ryA * Math.sin(alpha);

          const outRad = Math.atan2(ty - cyA, tx - cx);
          const rotDeg = outRad * 180 / Math.PI - 90;

          // FDI number – just outside the outer gum boundary
          const numOff = H / 2 + 32;
          const numX   = tx + numOff * Math.cos(outRad);
          const numY   = ty + numOff * Math.sin(outRad);

          const numColor = isSelected ? '#e65100'
            : (idx < 3 || idx > 12) ? '#1a3fa8'
            : (idx < 5 || idx > 10) ? '#7030a0'
            : (idx === 5 || idx === 10) ? '#c06000'
            : '#007030';

          return (
            <g key={tooth.id}>
              <text x={numX} y={numY}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fontWeight="bold" fontFamily="Arial, sans-serif"
                fill={numColor}
              >
                {fdiNum}
              </text>
              <g
                transform={`translate(${tx},${ty}) rotate(${rotDeg}) translate(${-W/2},${-H/2})`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleToothDetails(tooth)}
              >
                {toothSVG(tooth)}
              </g>
            </g>
          );
        })}
      </g>
    );
  };

  const handleToothClick = (id) => {
    console.log('Tooth clicked:', id);
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

  // Open modal for details
  const handleToothDetails = (tooth) => {
    setSelectedTooth(tooth);
  };

  // Update notes, surfaces, images
  const handleModalChange = (field, value) => {
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === selectedTooth.id
          ? { ...tooth, [field]: value }
          : tooth
      )
    );
    setSelectedTooth((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  // Surface selection (for modal checkboxes)
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
  };

  // Called from within the tooth SVG: select tooth + toggle that surface
  const handleSurfaceClickFn = (tooth, surface) => {
    setSelectedTooth(tooth);
    setTeeth((prev) =>
      prev.map((t) =>
        t.id === tooth.id
          ? { ...t, surfaces: { ...t.surfaces, [surface]: !t.surfaces[surface] } }
          : t
      )
    );
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

  // Update the save button handler to send data to backend
  const handleSaveToothDetails = async () => {
    if (!selectedTooth) return;
    const newHistoryItem = {
      date: new Date().toLocaleString(),
      status: selectedTooth.status,
      notes: selectedTooth.notes,
      procedure: selectedTooth.procedure,
      operation: selectedTooth.operation,
      diagnosis: selectedTooth.diagnosis,
      treatmentSummary: selectedTooth.treatmentSummary,
    };
    setTeeth(prev =>
      prev.map(tooth =>
        tooth.id === selectedTooth.id
          ? { ...tooth, history: [...tooth.history, newHistoryItem] }
          : tooth
      )
    );
    setSentFormData(newHistoryItem);

    // Ensure IDs are integers (or null if not selected)
    const payload = {
      patient: selectedPatient ? parseInt(selectedPatient, 10) : null,
      doctor: selectedDoctor ? parseInt(selectedDoctor, 10) : null,
      clinic: selectedClinic ? parseInt(selectedClinic, 10) : null,
      appointment: selectedAppointment ? parseInt(selectedAppointment, 10) : null,
      membership: selectedMembership && !isNaN(selectedMembership) ? parseInt(selectedMembership, 10) : selectedMembership,
      teeth: [
        {
          toothNumber: selectedTooth.id,
          status: selectedTooth.status,
          notes: selectedTooth.notes,
          procedure: selectedTooth.procedure,
          operation: selectedTooth.operation,
          diagnosis: selectedTooth.diagnosis,
          treatmentSummary: selectedTooth.treatmentSummary,
        }
      ]
    };
    console.log('Sending data:', payload);
    try {
      await axios.post(`${BASE_URL}/ondotogram`, payload);
      //alert('Data saved successfully!');
    } catch (error) {
      alert('Failed to save data.');
    }
  };

  // Add this helper at the top (or near your imports)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleString();
  };

  // Show all backend history for all teeth when a patient is selected
  const renderAllTeethHistoryTable = () => {
    if (!selectedPatient || backendTeethHistory.length === 0) return null;
    return (
      <div style={{
        width: '100%',
        margin: '32px 0 0 0',
        padding: '24px',
        background: '#fff',
        borderRadius: '16px',
        border: '1.5px solid #90caf9',
        textAlign: 'left',
        boxSizing: 'border-box',
        boxShadow: '0 4px 24px rgba(25, 118, 210, 0.07)'
      }}>
        <div style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 12, fontSize: 20 }}>
          {t('odontogram.all_teeth_treatment_history')}
        </div>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fafdff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <thead style={{ background: '#e3f2fd' }}>
            <tr>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.tooth_number')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.date')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.status')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.notes')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.procedure')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.operation')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.diagnosis')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.treatment_summary')}</th>
            </tr>
          </thead>
          <tbody>
            {backendTeethHistory.map((t, idx) => (
              <tr key={idx}>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.toothNumber}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>
                  {formatDate(t.date || t.createdAt)}
                </td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.status}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.notes}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.procedure}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.operation}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.diagnosis}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.treatmentSummary}</td>
              </tr>
            ))}
            {backendTeethHistory.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: '#888', textAlign: 'center', padding: 12 }}>
                  {t('odontogram.no_history_yet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Filter Section ---
  const renderFilterSection = () => (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #1976d2',
        boxShadow: '0 4px 24px rgba(25, 118, 210, 0.08)',
        padding: '32px 24px',
        margin: '0 auto 32px auto',
        width: '100%',
        maxWidth: 1200,
        display: 'flex',
        flexDirection: 'row',
        gap: '32px',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaUser style={{ color: '#1976d2' }} /> {t('odontogram.patient')}
        </label>
        <Autocomplete
          options={patients}
          getOptionLabel={(option) => option.fullName || option.name || ''}
          value={patients.find(p => p.id === selectedPatient) || null}
          onChange={(event, newValue) => setSelectedPatient(newValue ? newValue.id : '')}
          renderInput={(params) => (
            <TextField {...params} label={t('odontogram.select_patient')} variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaUserMd style={{ color: '#1976d2' }} /> {t('odontogram.doctor')}
        </label>
        <Autocomplete
          options={doctors}
          getOptionLabel={(option) => option.fullName || option.name || ''}
          value={doctors.find(d => d.id === selectedDoctor) || null}
          onChange={(event, newValue) => setSelectedDoctor(newValue ? newValue.id : '')}
          renderInput={(params) => (
            <TextField {...params} label={t('odontogram.select_doctor')} variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaClinicMedical style={{ color: '#1976d2' }} /> {t('odontogram.clinic')}
        </label>
        <Autocomplete
          options={clinics}
          getOptionLabel={(option) => option.name || ''}
          value={clinics.find(c => c.id === selectedClinic) || null}
          onChange={(event, newValue) => setSelectedClinic(newValue ? newValue.id : '')}
          renderInput={(params) => (
            <TextField {...params} label={t('odontogram.select_clinic')} variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaCalendarAlt style={{ color: '#1976d2' }} /> {t('odontogram.appointment')}
        </label>
        <Autocomplete
          options={appointments}
          getOptionLabel={(option) => option.appointmentDate ? `${option.appointmentDate} (${option.startTime} - ${option.endTime})` : option.name || ''}
          value={appointments.find(a => a.id === selectedAppointment) || null}
          onChange={(event, newValue) => setSelectedAppointment(newValue ? newValue.id : '')}
          renderInput={(params) => (
            <TextField {...params} label={t('odontogram.select_appointment')} variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaIdBadge style={{ color: '#1976d2' }} /> {t('odontogram.membership')}
        </label>
        <Autocomplete
          options={[{id: 'basic', name: t('odontogram.basic')}, {id: 'premium', name: t('odontogram.premium')}, {id: 'vip', name: t('odontogram.vip')} ]}
          getOptionLabel={(option) => option.name}
          value={['basic','premium','vip'].includes(selectedMembership) ? {id: selectedMembership, name: t(`odontogram.${selectedMembership}`)} : null}
          onChange={(event, newValue) => setSelectedMembership(newValue ? newValue.id : '')}
          renderInput={(params) => (
            <TextField {...params} label={t('odontogram.select_membership')} variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>
    </div>
  );

  // --- Tooth Details Section ---
  const renderToothDetailsSection = () => (
    <div style={{
      minWidth: 350,
      maxWidth: 420,
      padding: '28px 24px',
      border: 'none',
      borderRadius: '18px',
      background: '#fff',
      marginLeft: 16,
      boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      {selectedTooth ? (
        <>
          <h2 style={{ color: '#1976d2', marginBottom: 18, fontWeight: 700 }}>
            {t('odontogram.tooth_details', { id: selectedTooth.id })}
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.status')}</label>
            <select
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 16
              }}
              value={selectedTooth.status}
              onChange={e => handleModalChange('status', e.target.value)}
            >
              <option value="">{t('odontogram.select_status')}</option>
              {TOOTH_STATUSES.map(status => (
                <option key={status} value={status}>{t(`odontogram.statuses.${status}`)}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.notes')}</label>
            <textarea
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 15,
                minHeight: 40,
                marginTop: 4,
                marginBottom: 8,
                resize: 'vertical'
              }}
              value={selectedTooth.notes || ''}
              onChange={e => handleModalChange('notes', e.target.value)}
              placeholder={t('odontogram.enter_notes')}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.procedure')}</label>
            <select
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 16
              }}
              value={selectedTooth.procedure}
              onChange={e => handleModalChange('procedure', e.target.value)}
            >
              <option value="">{t('odontogram.select_procedure')}</option>
              {procedures.map(p => (
                <option key={p.id} value={p.procedureName}>{p.procedureName}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.operation')}</label>
            <select
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 16
              }}
              value={selectedTooth.operation}
              onChange={e => handleModalChange('operation', e.target.value)}
            >
              <option value="">{t('odontogram.select_operation')}</option>
              {operations.map(o => (
                <option key={o.id} value={o.procedureName}>{o.procedureName}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.diagnosis')}</label>
            <select
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 16
              }}
              value={selectedTooth.diagnosis}
              onChange={e => handleModalChange('diagnosis', e.target.value)}
            >
              <option value="">{t('odontogram.select_diagnosis')}</option>
              {diagnoses.map(d => (
                <option key={d.id} value={d.condition}>{d.condition}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>{t('odontogram.treatment_summary')}</label>
            <textarea
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1.5px solid #90caf9',
                background: '#f8fafd',
                fontSize: 15,
                minHeight: 40,
                marginTop: 4,
                marginBottom: 8,
                resize: 'vertical'
              }}
              value={selectedTooth.treatmentSummary || ''}
              onChange={e => handleModalChange('treatmentSummary', e.target.value)}
              placeholder={t('odontogram.add_treatment_summary')}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 32px',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
              }}
              onClick={handleSaveToothDetails}
            >
              {t('odontogram.save')}
            </button>
          </div>
        </>
      ) : (
        <div style={{ color: '#888', marginTop: 40, fontSize: 18, textAlign: 'center' }}>
          {t('odontogram.select_tooth_to_see_details')}
        </div>
      )}
    </div>
  );

  // --- Tooth Treatment History Section ---
  const renderToothTreatmentHistorySection = () => (
    <div style={{
      width: '100%',
      margin: '32px 0 0 0',
      padding: '24px',
      background: '#fff',
      borderRadius: '16px',
      border: '1.5px solid #90caf9',
      textAlign: 'left',
      boxSizing: 'border-box',
      boxShadow: '0 4px 24px rgba(25, 118, 210, 0.07)'
    }}>
      <div style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 12, fontSize: 20 }}>
        {t('odontogram.tooth_treatment_history')}
      </div>
      {selectedTooth ? (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fafdff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <thead style={{ background: '#e3f2fd' }}>
            <tr>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.date')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.status')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.notes')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.procedure')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.operation')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.diagnosis')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.treatment_summary')}</th>
            </tr>
          </thead>
          <tbody>
            {backendTeethHistory
              .filter((t) => t.toothNumber === selectedTooth.id)
              .map((t, idx) => (
                <tr key={'backend-' + idx}>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{formatDate(t.createdAt)}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.status}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.notes}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.procedure}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.operation}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.diagnosis}</td>
                  <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.treatmentSummary}</td>
                </tr>
              ))}
            {selectedTooth.history.map((h, idx) => (
              <tr key={'local-' + idx}>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>-</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.status}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.notes}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.procedure}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.operation}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.diagnosis}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{h.treatmentSummary}</td>
              </tr>
            ))}
            {backendTeethHistory.filter((t) => t.toothNumber === selectedTooth.id).length === 0 &&
              selectedTooth.history.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: '#888', textAlign: 'center', padding: 12 }}>
                    {t('odontogram.no_history_yet')}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      ) : (
        <div style={{ color: '#888', marginTop: 24, fontSize: 16 }}>
          {t('odontogram.select_tooth_to_see_history')}
        </div>
      )}
    </div>
  );

  // --- All Teeth Treatment History for Patient Section ---
  const renderAllTeethHistoryTableStyled = () => {
    if (!selectedPatient || backendTeethHistory.length === 0) return null;
    return (
      <div style={{
        width: '100%',
        margin: '32px 0 0 0',
        padding: '24px',
        background: '#fff',
        borderRadius: '16px',
        border: '1.5px solid #90caf9',
        textAlign: 'left',
        boxSizing: 'border-box',
        boxShadow: '0 4px 24px rgba(25, 118, 210, 0.07)'
      }}>
        <div style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 12, fontSize: 20 }}>
          All Teeth Treatment History for Patient
        </div>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fafdff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <thead style={{ background: '#e3f2fd' }}>
            <tr>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.tooth_number')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.date')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.status')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.notes')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.procedure')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.operation')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.diagnosis')}</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>{t('odontogram.treatment_summary')}</th>
            </tr>
          </thead>
          <tbody>
            {backendTeethHistory.map((t, idx) => (
              <tr key={idx}>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.toothNumber}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{formatDate(t.date || t.createdAt)}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.status}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.notes}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.procedure}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.operation}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.diagnosis}</td>
                <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{t.treatmentSummary}</td>
              </tr>
            ))}
            {backendTeethHistory.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: '#888', textAlign: 'center', padding: 12 }}>
                  {t('odontogram.no_history_yet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Condition Prediction AI function
  const handleConditionPrediction = async () => {
    setConditionPredictionLoading(true);
    setConditionPredictionResult(null);
    try {
      // Build odontogram object from current teeth state
      const odontogram = {};
      teeth.forEach(tooth => {
        odontogram[tooth.id] = tooth.diagnosis
          ? `${tooth.diagnosis}${tooth.status !== 'healthy' ? ', ' + tooth.status : ''}`
          : (tooth.status.charAt(0).toUpperCase() + tooth.status.slice(1));
      });

      const payload = { odontogram };
      const res = await axios.post(`${BASE_URL}/ai/condition-prediction`, payload);

      // Handle code block response
      let predictions = {};
      
        predictions = res.data.predictions;

      setConditionPredictionResult(predictions);
    } catch {
      setConditionPredictionResult({ error: 'Error predicting conditions.' });
    }
    setConditionPredictionLoading(false);
  };

  // Treatment Simulation AI function
  const handleTreatmentSimulation = async () => {
    setTreatmentSimLoading(true);
    setTreatmentSimResult(null);
    try {
      // Parse odontogram and treatmentPlan from textarea inputs
      let odontogram = {};
      let treatmentPlan = {};
      try {
        odontogram = JSON.parse(treatmentSimOdontogram);
      } catch {
        odontogram = {};
      }
      try {
        treatmentPlan = JSON.parse(treatmentSimPlan);
      } catch {
        treatmentPlan = {};
      }
      const payload = {
        odontogram,
        treatmentPlan
      };
      const res = await axios.post(`${BASE_URL}/ai/treatment-simulation`, payload);
      setTreatmentSimResult(res.data.simulatedOdontogram || {});
    } catch {
      setTreatmentSimResult({ error: 'Error simulating treatment.' });
    }
    setTreatmentSimLoading(false);
  };

  const [show3DModal, setShow3DModal] = useState(false);

  return (
    <div>
      {renderFilterSection()}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 32
      }}>
        {/* Odontogram Block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <svg
              width="720"
              height="1100"
              viewBox="0 0 720 1100"
              className="odontogram-svg odontogram"
              style={{ display: 'block', background: '#f5f8fc', borderRadius: 14, border: '1px solid #d0d8e0' }}
            >
              {/* ── Jaw labels ── */}
              <text x="360" y="22" textAnchor="middle" fontSize="14" fill="#1565c0" fontWeight="bold" fontFamily="Arial, sans-serif">Upper Jaw</text>
              <text x="360" y="1075" textAnchor="middle" fontSize="14" fill="#1565c0" fontWeight="bold" fontFamily="Arial, sans-serif">Lower Jaw</text>

              {/* ── Side labels ── */}
              <text x="18"  y="494" textAnchor="middle" fontSize="12" fill="#1565c0" fontWeight="bold" fontFamily="Arial, sans-serif">Right</text>
              <text x="702" y="494" textAnchor="middle" fontSize="12" fill="#1565c0" fontWeight="bold" fontFamily="Arial, sans-serif">Left</text>

              {/* ── Midline ── */}
              <line x1="360" y1="443" x2="360" y2="545" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="4,3" />

              {/* ── Arches ── */}
              {renderArch(teeth.slice(0, 16), 'upper')}
              {renderArch(teeth.slice(16), 'lower')}

              {/* ── Legend ── */}
              {[
                { color: '#f7f2e8', label: 'Healthy' },
                { color: '#c8915a', label: 'Decayed' },
                { color: '#ccd9e8', label: 'Filled' },
                { color: '#ddd',    label: 'Missing', cross: true },
                { color: SURFACE_MARKED, label: 'Surface marked' },
              ].map((item, idx) => (
                <g key={idx} transform={`translate(${10 + idx * 138}, 1085)`}>
                  <rect x={0} y={0} width={13} height={13} fill={item.color} stroke="#455a64" strokeWidth={1} />
                  {item.cross && (<>
                    <line x1={2} y1={2} x2={11} y2={11} stroke="#e53935" strokeWidth={1.5} />
                    <line x1={11} y1={2} x2={2} y2={11} stroke="#e53935" strokeWidth={1.5} />
                  </>)}
                  <text x={17} y={11} fontSize={10} fill="#333" fontFamily="Arial, sans-serif">{item.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              <button
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                }}
                onClick={() => setShow3DModal(true)}
              >
                Show 3D Jaw Chart
              </button>
              <button
                style={{
                  background: '#388e3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(56, 142, 60, 0.08)'
                }}
                onClick={() => {
                  const odontogramEl = document.querySelector('.odontogram');
                  if (!odontogramEl) return;
                  import('html2canvas').then((html2canvas) => {
                    html2canvas.default(odontogramEl.parentNode).then((canvas) => {
                      const link = document.createElement('a');
                      link.download = 'odontogram.png';
                      link.href = canvas.toDataURL();
                      link.click();
                    });
                  });
                }}
              >
                Download Odontogram Image
              </button>
            </div>
          </div>
        </div>
        {renderToothDetailsSection()}
      </div>
      {renderToothTreatmentHistorySection()}
      {renderAllTeethHistoryTableStyled()}

      {/* Condition Prediction AI & Treatment Simulation AI Buttons in same line */}
      <div style={{ width: '100%', textAlign: 'center', margin: '24px 0', display: 'flex', justifyContent: 'center', gap: 16 }}>
        <button
          style={{
            background: '#fff',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '6px',
            padding: '10px 32px',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={() => setConditionPredictionOpen(true)}
        >
          <InsightsIcon style={{ color: '#1976d2' }} />
          {t('odontogram.condition_prediction_ai')}
        </button>
        <button
          style={{
            background: '#fff',
            color: '#388e3c',
            border: '2px solid #388e3c',
            borderRadius: '6px',
            padding: '10px 32px',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(56, 142, 60, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={() => setTreatmentSimOpen(true)}
        >
          <ScienceIcon style={{ color: '#388e3c' }} />
          {t('odontogram.treatment_simulation_ai')}
        </button>
      </div>

      {/* Condition Prediction Dialog */}
      {conditionPredictionOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              minWidth: 400,
              maxWidth: 540,
              boxShadow: '0 4px 24px rgba(25, 118, 210, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 22, color: '#1976d2', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <InsightsIcon />
              {t('odontogram.condition_prediction_ai')}
            </div>
            <div style={{ marginBottom: 16 }}>
              <p>
                {t('odontogram.predict_future_dental_issues')}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                }}
                onClick={handleConditionPrediction}
                disabled={conditionPredictionLoading}
              >
                {t('odontogram.predict_conditions')}
              </button>
              <button
                style={{
                  background: '#fff',
                  color: '#1976d2',
                  border: '1.5px solid #1976d2',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
                onClick={() => setConditionPredictionOpen(false)}
              >
                {t('odontogram.close')}
              </button>
            </div>
            {conditionPredictionLoading && (
              <div style={{ marginTop: 18 }}>
                <span style={{ color: '#1976d2', fontWeight: 500 }}>{t('odontogram.predicting')}...</span>
              </div>
            )}
            {conditionPredictionResult && (
              <div style={{ marginTop: 18 }}>
                {conditionPredictionResult.error ? (
                  <span style={{ color: '#f44336', fontWeight: 500 }}>{conditionPredictionResult.error}</span>
                ) : (
                  <>
                    <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>{t('odontogram.predicted_conditions')}:</div>
                    <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, color: '#333', fontSize: 15 }}>
                      {typeof conditionPredictionResult === 'object'
                        ? JSON.stringify(conditionPredictionResult).replace(/```json|```/g, '')
                        : String(conditionPredictionResult).replace(/```json|```/g, '')}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Treatment Simulation Dialog */}
      {treatmentSimOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              minWidth: 400,
              maxWidth: 540,
              boxShadow: '0 4px 24px rgba(56, 142, 60, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 22, color: '#388e3c', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScienceIcon />
              {t('odontogram.treatment_simulation_ai')}
            </div>
            <div style={{ marginBottom: 16 }}>
              <p>
                {t('odontogram.simulate_dental_chart_evolution')}
              </p>
              <label style={{ fontWeight: 600, color: '#388e3c' }}>{t('odontogram.odontogram_json')}</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1.5px solid #a5d6a7',
                  background: '#f8fafd',
                  fontSize: 15,
                  minHeight: 60,
                  marginTop: 4,
                  marginBottom: 8,
                  resize: 'vertical'
                }}
                value={treatmentSimOdontogram}
                onChange={e => setTreatmentSimOdontogram(e.target.value)}
                placeholder={`{\n  "14": "Caries present",\n  "15": "Healthy",\n  "16": "Recurrent decay, old filling"\n}`}
              />
              <label style={{ fontWeight: 600, color: '#388e3c' }}>{t('odontogram.treatment_plan_json')}</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1.5px solid #a5d6a7',
                  background: '#f8fafd',
                  fontSize: 15,
                  minHeight: 60,
                  marginTop: 4,
                  marginBottom: 8,
                  resize: 'vertical'
                }}
                value={treatmentSimPlan}
                onChange={e => setTreatmentSimPlan(e.target.value)}
                placeholder={`{\n  "14": "Filling",\n  "16": "Replace filling"\n}`}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                style={{
                  background: '#388e3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(56, 142, 60, 0.08)'
                }}
                onClick={handleTreatmentSimulation}
                disabled={treatmentSimLoading}
              >
                {t('odontogram.simulate_treatment')}
              </button>
              <button
                style={{
                  background: '#fff',
                  color: '#388e3c',
                  border: '1.5px solid #388e3c',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
                onClick={() => setTreatmentSimOpen(false)}
              >
                {t('odontogram.close')}
              </button>
            </div>
            {treatmentSimLoading && (
              <div style={{ marginTop: 18 }}>
                <span style={{ color: '#388e3c', fontWeight: 500 }}>{t('odontogram.simulating')}...</span>
              </div>
            )}
            {treatmentSimResult && (
              <div style={{ marginTop: 18 }}>
                {treatmentSimResult.error ? (
                  <span style={{ color: '#f44336', fontWeight: 500 }}>{treatmentSimResult.error}</span>
                ) : (
                  <>
                    <div style={{ fontWeight: 600, color: '#388e3c', marginBottom: 8 }}>{t('odontogram.simulated_odontogram')}:</div>
                    <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, color: '#333', fontSize: 15 }}>
                      {typeof treatmentSimResult === 'object' && treatmentSimResult.simulatedOdontogram
                        ? JSON.stringify(treatmentSimResult.simulatedOdontogram, null, 2).replace(/```json|```/g, '')
                        : String(treatmentSimResult).replace(/```json|```/g, '')}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ...existing dialogs... */}
      <div style={{ width: '100%', textAlign: 'center', margin: '32px 0', position: 'relative' }}>
       
        {show3DModal && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.18)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShow3DModal(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 32,
                minWidth: 400,
                maxWidth: 900,
                boxShadow: '0 4px 24px rgba(25, 118, 210, 0.15)',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontWeight: 700, fontSize: 22, color: '#1976d2', marginBottom: 18 }}>
                3D Jaw Chart
              </div>
              <Jaw3DPlot allTeeth3D={allTeeth3D} statusColor={statusColor} />
              <button
                style={{
                  marginTop: 24,
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                }}
                onClick={() => setShow3DModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalOdontogram;

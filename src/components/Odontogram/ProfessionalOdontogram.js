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

  // SVG for tooth with color and cross for missing
  const toothSVG = (type, status, id, isSelected) => {
    let fill =
      status === 'healthy'
        ? statusColors.healthy
        : status === 'decayed'
        ? statusColors.decayed
        : status === 'filled'
        ? statusColors.filled
        : status === 'missing'
        ? statusColors.missing
        : '#fff';

    let numberColor = '#ff3b3b';

    // Cross for missing
    const cross = (
      <>
        <line x1="8" y1="8" x2="32" y2="32" stroke="#f44336" strokeWidth="3" />
        <line x1="32" y1="8" x2="8" y2="32" stroke="#f44336" strokeWidth="3" />
      </>
    );

    if (type === 'Molar') {
      return (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <ellipse cx="20" cy="20" rx="15" ry="12" fill={fill} stroke="#000" strokeWidth="2"/>
          {status === 'missing' && cross}
          <title>{getToothTooltip({id, status, ...teeth[id-1]})}</title>
          <text x="20" y="36" textAnchor="middle" fontSize="10" fill={numberColor} fontWeight="bold">{id}</text>
        </svg>
      );
    }
    if (type === 'Premolar') {
      return (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <ellipse cx="20" cy="20" rx="10" ry="13" fill={fill} stroke="#000" strokeWidth="2"/>
          {status === 'missing' && cross}
          <title>{getToothTooltip({id, status, ...teeth[id-1]})}</title>
          <text x="20" y="36" textAnchor="middle" fontSize="10" fill={numberColor} fontWeight="bold">{id}</text>
        </svg>
      );
    }
    if (type === 'Canine') {
      return (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M20 8 Q25 20 20 32 Q15 20 20 8" fill={fill} stroke="#000" strokeWidth="2"/>
          {status === 'missing' && cross}
          <title>{getToothTooltip({id, status, ...teeth[id-1]})}</title>
          <text x="20" y="36" textAnchor="middle" fontSize="10" fill={numberColor} fontWeight="bold">{id}</text>
        </svg>
      );
    }
    // Incisor
    return (
      <svg width="40" height="40" viewBox="0 0 40 40">
        <rect x="13" y="10" width="14" height="20" rx="7" fill={fill} stroke="#000" strokeWidth="2"/>
        {status === 'missing' && cross}
        <title>{getToothTooltip({id, status, ...teeth[id-1]})}</title>
        <text x="20" y="36" textAnchor="middle" fontSize="10" fill={numberColor} fontWeight="bold">{id}</text>
      </svg>
    );
  };

  // Render arch with tooltip and color
  const renderArch = (teethSlice, arch) => {
    const archRadius = 200;
    const archCenterX = 300;
    const archCenterY = arch === 'upper' ? 320 : 260;
    return (
      <g>
        {teethSlice.map((tooth, idx) => {
          const angle =
            arch === 'upper'
              ? Math.PI * (1 - idx / 15)
              : -Math.PI * (idx / 15);
          const x = archCenterX + archRadius * Math.cos(angle);
          const y = archCenterY + archRadius * Math.sin(angle);

          const isSelected = selectedTooth && selectedTooth.id === tooth.id;

          return (
            <g
              key={tooth.id}
              transform={`translate(${x},${y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleToothDetails(tooth)}
              onMouseEnter={e => {
                // Optional: highlight on hover
                e.currentTarget.querySelector('ellipse,rect,path').setAttribute('stroke', '#1976d2');
                e.currentTarget.querySelector('ellipse,rect,path').setAttribute('stroke-width', '3');
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('ellipse,rect,path').setAttribute('stroke', '#000');
                e.currentTarget.querySelector('ellipse,rect,path').setAttribute('stroke-width', '2');
              }}
            >
              {toothSVG(tooth.type, tooth.status, tooth.id, isSelected)}
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
              width="800"
              height="700"
              viewBox="-70 0 800 700"
              className="odontogram-svg odontogram"
              style={{ display: 'block', background: '#fff' }}
            >
              {/* Jaw labels */}
              <text x="320" y="50" textAnchor="middle" fontSize="22" fill="#007bff" fontWeight="bold">Upper Jaw</text>
              <text x="320" y="610" textAnchor="middle" fontSize="22" fill="#007bff" fontWeight="bold">Lower Jaw</text>
              <text x="80" y="370" textAnchor="middle" fontSize="18" fill="#007bff" fontWeight="bold" transform="rotate(-90 80,370)">Left</text>
              <text x="720" y="520" textAnchor="middle" fontSize="18" fill="#007bff" fontWeight="bold" transform="rotate(90 720,370)">Right</text>
              {renderArch(teeth.slice(0, 16), 'upper')}
              {renderArch(teeth.slice(16), 'lower')}
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

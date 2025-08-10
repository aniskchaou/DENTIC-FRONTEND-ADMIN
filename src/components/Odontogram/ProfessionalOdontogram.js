import React, { useState, useEffect } from 'react';
import './ProfessionalOdontogram.css';
import axios from 'axios';
import { FaUserMd, FaUser, FaClinicMedical, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import BASE_URL from '../../main/urls/urls';

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

const ProfessionalOdontogram = () => {
  const [teeth, setTeeth] = useState(getInitialTeeth());
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
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Tooth Number</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Date</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Status</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Notes</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Procedure</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Operation</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Diagnosis</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Treatment Summary</th>
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
                  No history yet.
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
          <FaUser style={{ color: '#1976d2' }} /> Patient
        </label>
        <select
          value={selectedPatient}
          onChange={e => setSelectedPatient(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            background: '#f8fafd',
            fontSize: 16
          }}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.fullName || p.name}</option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaUserMd style={{ color: '#1976d2' }} /> Doctor
        </label>
        <select
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            background: '#f8fafd',
            fontSize: 16
          }}
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.fullName || d.name}</option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaClinicMedical style={{ color: '#1976d2' }} /> Clinic
        </label>
        <select
          value={selectedClinic}
          onChange={e => setSelectedClinic(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            background: '#f8fafd',
            fontSize: 16
          }}
        >
          <option value="">Select Clinic</option>
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaCalendarAlt style={{ color: '#1976d2' }} /> Appointment
        </label>
        <select
          value={selectedAppointment}
          onChange={e => setSelectedAppointment(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            background: '#f8fafd',
            fontSize: 16
          }}
        >
          <option value="">Select Appointment</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.appointmentDate
                ? `${a.appointmentDate} (${a.startTime} - ${a.endTime})`
                : a.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 200 }}>
        <label style={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaIdBadge style={{ color: '#1976d2' }} /> Membership
        </label>
        <select
          value={selectedMembership}
          onChange={e => setSelectedMembership(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            background: '#f8fafd',
            fontSize: 16
          }}
        >
          <option value="">Select Membership</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
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
            Tooth #{selectedTooth.id} Details
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Status</label>
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
              <option value="">Select Status</option>
              {TOOTH_STATUSES.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Notes</label>
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
              placeholder="Enter notes..."
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Procedure</label>
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
              <option value="">Select Procedure</option>
              {procedures.map(p => (
                <option key={p.id} value={p.procedureName}>{p.procedureName}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Operation</label>
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
              <option value="">Select Operation</option>
              {operations.map(o => (
                <option key={o.id} value={o.procedureName}>{o.procedureName}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Diagnosis</label>
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
              <option value="">Select Diagnosis</option>
              {diagnoses.map(d => (
                <option key={d.id} value={d.condition}>{d.condition}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#1976d2' }}>Treatment Summary</label>
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
              placeholder="Add treatment summary..."
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
              Save
            </button>
          </div>
        </>
      ) : (
        <div style={{ color: '#888', marginTop: 40, fontSize: 18, textAlign: 'center' }}>
          Select a tooth to see details
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
        Tooth Treatment History
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
              {/* <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Date</th> */}
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Created At</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Status</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Notes</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Procedure</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Operation</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Diagnosis</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Treatment Summary</th>
            </tr>
          </thead>
          <tbody>
            {backendTeethHistory
              .filter((t) => t.toothNumber === selectedTooth.id)
              .map((t, idx) => (
                <tr key={'backend-' + idx}>
                  {/* <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{formatDate(t.date)}</td> */}
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
                {/* <td style={{ padding: 10, border: '1px solid #cce3f6' }}>{formatDate(h.date)}</td> */}
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
                    No history yet.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      ) : (
        <div style={{ color: '#888', marginTop: 24, fontSize: 16 }}>Select a tooth to see history</div>
      )}
    </div>
  );

  // --- All Teeth Treatment History for Patient Section ---
  // (leave your renderAllTeethHistoryTable as is, but you can update the style for consistency)
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
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Tooth Number</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Date</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Status</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Notes</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Procedure</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Operation</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Diagnosis</th>
              <th style={{ padding: 10, border: '1px solid #cce3f6' }}>Treatment Summary</th>
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
                  No history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

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
        {renderToothDetailsSection()}
      </div>
      {renderToothTreatmentHistorySection()}
      {renderAllTeethHistoryTableStyled()}
    </div>
  );
};

export default ProfessionalOdontogram;

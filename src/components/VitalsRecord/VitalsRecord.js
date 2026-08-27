import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const VitalsRecord = () => {
  const [vitals, setVitals] = useState([]);
  const [form, setForm] = useState({ patientId: '', appointmentId: '', bloodPressureSys: '', bloodPressureDia: '', pulse: '', temperature: '', weight: '', height: '', oxygenSaturation: '', respiratoryRate: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [filterPatient, setFilterPatient] = useState('');

  const load = () => {
    const params = filterPatient ? { patientId: filterPatient } : {};
    axios.get(`${BASE_URL}/vitals`, { params }).then(r => setVitals(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [filterPatient]);

  const handleSave = () => {
    axios.post(`${BASE_URL}/vitals`, form)
      .then(() => { setShowForm(false); setForm({ patientId: '', appointmentId: '', bloodPressureSys: '', bloodPressureDia: '', pulse: '', temperature: '', weight: '', height: '', oxygenSaturation: '', respiratoryRate: '', notes: '' }); load(); })
      .catch(() => {});
  };

  const Field = ({ label, field, type = 'number', unit }) => (
    <div className="col-md-3 mb-2">
      <label style={{ fontSize: 12 }}>{label} {unit && <span className="text-muted">({unit})</span>}</label>
      <input type={type} className="form-control form-control-sm" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
    </div>
  );

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title"><i className="fa fa-heartbeat mr-2" />Vitals Recording</h4>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>+ Record Vitals</button>
        </div>
        <div className="card-body">
          <div className="mb-3 d-flex align-items-center">
            <input className="form-control form-control-sm" style={{ width: 180 }} placeholder="Filter by Patient ID" value={filterPatient} onChange={e => setFilterPatient(e.target.value)} />
            <button className="btn btn-sm btn-outline-secondary ml-2" onClick={load}>Refresh</button>
          </div>

          {showForm && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <h6>Record New Vitals</h6>
                <div className="row">
                  <Field label="Patient ID *" field="patientId" type="text" />
                  <Field label="Appointment ID" field="appointmentId" type="text" />
                  <Field label="Systolic BP" field="bloodPressureSys" unit="mmHg" />
                  <Field label="Diastolic BP" field="bloodPressureDia" unit="mmHg" />
                  <Field label="Pulse" field="pulse" unit="bpm" />
                  <Field label="Temperature" field="temperature" unit="°C" />
                  <Field label="Weight" field="weight" unit="kg" />
                  <Field label="Height" field="height" unit="cm" />
                  <Field label="O₂ Saturation" field="oxygenSaturation" unit="%" />
                  <Field label="Respiratory Rate" field="respiratoryRate" unit="br/min" />
                  <div className="col-md-6 mb-2">
                    <label style={{ fontSize: 12 }}>Notes</label>
                    <textarea className="form-control form-control-sm" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary btn-sm mr-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr><th>Date/Time</th><th>Patient</th><th>BP</th><th>Pulse</th><th>Temp</th><th>O₂%</th><th>Wt</th><th>Ht</th><th>RR</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {vitals.map(v => (
                  <tr key={v.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(v.recordedAt).toLocaleString()}</td>
                    <td>{v.patientId}</td>
                    <td>{v.bloodPressureSys && v.bloodPressureDia ? `${v.bloodPressureSys}/${v.bloodPressureDia}` : '-'}</td>
                    <td>{v.pulse || '-'}</td>
                    <td>{v.temperature ? `${v.temperature}°C` : '-'}</td>
                    <td>{v.oxygenSaturation ? `${v.oxygenSaturation}%` : '-'}</td>
                    <td>{v.weight ? `${v.weight}kg` : '-'}</td>
                    <td>{v.height ? `${v.height}cm` : '-'}</td>
                    <td>{v.respiratoryRate || '-'}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.notes || '-'}</td>
                  </tr>
                ))}
                {vitals.length === 0 && <tr><td colSpan={10} className="text-center text-muted">No vitals recorded yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsRecord;

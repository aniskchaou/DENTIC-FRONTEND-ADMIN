import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const patientId = userData.patientId || userData.id;

  useEffect(() => {
    if (!patientId) return;
    axios.get(`${BASE_URL}/patient-portal/prescriptions/${patientId}`)
      .then(r => setPrescriptions(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title"><i className="fa fa-medkit mr-2" />My Prescriptions</h4>
        </div>
        <div className="card-body">
          {loading ? <p>Loading…</p> : (
            prescriptions.length === 0
              ? <p className="text-muted text-center">No prescriptions on record.</p>
              : prescriptions.map(p => (
                <div key={p.id} className="card mb-3">
                  <div className="card-header d-flex justify-content-between">
                    <strong>{p.medications ? (Array.isArray(p.medications) ? p.medications.map(m => m.name || m).join(', ') : p.medications) : 'Prescription'}</strong>
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      {p.prescribedDate ? new Date(p.prescribedDate).toLocaleDateString() : p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="card-body p-3">
                    {p.instructions && <p className="mb-1"><strong>Instructions:</strong> {p.instructions}</p>}
                    {p.duration && <p className="mb-1"><strong>Duration:</strong> {p.duration}</p>}
                    {p.refills > 0 && <p className="mb-1"><strong>Refills remaining:</strong> {p.refills}</p>}
                    {p.status && (
                      <span className={`badge badge-${p.status === 'active' ? 'success' : 'secondary'}`}>{p.status}</span>
                    )}
                    {p.medications && Array.isArray(p.medications) && (
                      <table className="table table-sm mt-2">
                        <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th></tr></thead>
                        <tbody>
                          {p.medications.map((m, i) => (
                            <tr key={i}>
                              <td>{m.name || m}</td>
                              <td>{m.dosage || '-'}</td>
                              <td>{m.frequency || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;

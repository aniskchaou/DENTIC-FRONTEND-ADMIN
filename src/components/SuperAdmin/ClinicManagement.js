import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const badge = (status) => {
  const colors = { Active: '#388e3c', Suspended: '#d32f2f', trial: '#f57c00', active: '#388e3c', cancelled: '#888', expired: '#888' };
  return <span style={{ background: colors[status] || '#888', color: '#fff', borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>{status}</span>;
};

const ClinicManagement = () => {
  const [clinics, setClinics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sub, setSub] = useState(null);
  const [plans, setPlans] = useState([]);
  const [trialDays, setTrialDays] = useState('14');
  const [newPlanId, setNewPlanId] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([superAdminHTTPService.getClinics(), superAdminHTTPService.getPlans()])
      .then(([c, p]) => { setClinics(c.data); setPlans(p.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openSub = (clinic) => {
    setSelected(clinic);
    setSub(null);
    setMsg('');
    superAdminHTTPService.getClinicSubscription(clinic.id)
      .then(r => setSub(r.data))
      .catch(() => setSub(null));
  };

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const suspend = (id) => superAdminHTTPService.suspendClinic(id).then(() => { notify('Clinic suspended.'); load(); }).catch(e => notify(e.message));
  const unsuspend = (id) => superAdminHTTPService.unsuspendClinic(id).then(() => { notify('Clinic reactivated.'); load(); }).catch(e => notify(e.message));
  const extendTrial = () => superAdminHTTPService.manageTrial(selected.id, { trialDays: parseInt(trialDays) }).then(() => { notify('Trial extended.'); openSub(selected); });
  const upgradePlan = () => superAdminHTTPService.changePlan(selected.id, { planId: parseInt(newPlanId) }).then(() => { notify('Plan updated.'); openSub(selected); });
  const cancelSub = () => superAdminHTTPService.cancelSubscription(selected.id).then(() => { notify('Subscription cancelled.'); openSub(selected); });

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>Clinic Management</h2>
      {msg && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: '#2e7d32' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Clinic list */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead style={{ background: '#1a237e', color: '#fff' }}>
              <tr>{['Name', 'City', 'Email', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {clinics.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff', cursor: 'pointer' }}>
                  <td style={{ padding: '9px 14px' }}><button onClick={() => openSub(c)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 600, padding: 0 }}>{c.name}</button></td>
                  <td style={{ padding: '9px 14px' }}>{c.city}</td>
                  <td style={{ padding: '9px 14px' }}>{c.email}</td>
                  <td style={{ padding: '9px 14px' }}>{badge(c.status || 'Active')}</td>
                  <td style={{ padding: '9px 14px' }}>
                    {c.status === 'Suspended'
                      ? <button onClick={() => unsuspend(c.id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Reactivate</button>
                      : <button onClick={() => suspend(c.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Suspend</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subscription panel */}
        {selected && (
          <div style={{ flex: 1, minWidth: 280, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <h4 style={{ marginBottom: 12 }}>Subscription — {selected.name}</h4>
            {sub ? (
              <>
                <p><strong>Status:</strong> {badge(sub.status)}</p>
                <p><strong>Plan ID:</strong> {sub.planId}</p>
                {sub.trialEndsAt && <p><strong>Trial ends:</strong> {new Date(sub.trialEndsAt).toLocaleDateString()}</p>}
                {sub.currentPeriodEnd && <p><strong>Period end:</strong> {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>}

                <hr style={{ margin: '12px 0' }} />
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Upgrade / Downgrade Plan</label>
                  <select value={newPlanId} onChange={e => setNewPlanId(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 6 }}>
                    <option value="">Select plan…</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price}/{p.billingCycle}</option>)}
                  </select>
                  <button onClick={upgradePlan} disabled={!newPlanId} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', width: '100%' }}>Apply Plan</button>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Extend Trial (days)</label>
                  <input type="number" value={trialDays} onChange={e => setTrialDays(e.target.value)} style={{ width: '60%', padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc', marginRight: 6 }} />
                  <button onClick={extendTrial} style={{ background: '#f57c00', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Extend</button>
                </div>

                <button onClick={cancelSub} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', width: '100%' }}>Cancel Subscription</button>
              </>
            ) : (
              <div>
                <p style={{ color: '#aaa', marginBottom: 12 }}>No subscription found.</p>
                <select value={newPlanId} onChange={e => setNewPlanId(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 6 }}>
                  <option value="">Select plan…</option>
                  {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price}/{p.billingCycle}</option>)}
                </select>
                <button onClick={() => superAdminHTTPService.createClinicSubscription({ clinicId: selected.id, planId: parseInt(newPlanId), trialDays: parseInt(trialDays) }).then(() => { notify('Subscription created.'); openSub(selected); })}
                  disabled={!newPlanId} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', width: '100%' }}>
                  Create Subscription
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicManagement;

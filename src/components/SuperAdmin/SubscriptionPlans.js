import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const input = (props) => <input {...props} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 10, boxSizing: 'border-box', ...props.style }} />;

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', billingCycle: 'monthly', maxUsers: '', maxPatients: '', features: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => superAdminHTTPService.getPlans().then(r => setPlans(r.data));
  useEffect(() => { load(); }, []);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      maxUsers: form.maxUsers ? parseInt(form.maxUsers) : null,
      maxPatients: form.maxPatients ? parseInt(form.maxPatients) : null,
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
    };
    const call = editing
      ? superAdminHTTPService.updatePlan(editing, payload)
      : superAdminHTTPService.createPlan(payload);
    call.then(() => { notify(editing ? 'Plan updated.' : 'Plan created.'); setEditing(null); setForm({ name: '', price: '', billingCycle: 'monthly', maxUsers: '', maxPatients: '', features: '' }); load(); })
      .catch(e => notify('Error: ' + e.message));
  };

  const editPlan = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, price: p.price, billingCycle: p.billingCycle, maxUsers: p.maxUsers || '', maxPatients: p.maxPatients || '', features: (p.features || []).join(', ') });
  };

  const deactivate = (id) => superAdminHTTPService.deletePlan(id).then(() => { notify('Plan deactivated.'); load(); });

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>Subscription Plans</h2>
      {msg && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: '#2e7d32' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Plans list */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {plans.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 10, padding: 20, minWidth: 200, flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #1976d2' }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 22, color: '#1976d2', marginBottom: 6 }}>${p.price}<span style={{ fontSize: 13, color: '#888' }}>/{p.billingCycle}</span></div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>Max users: {p.maxUsers ?? '∞'}</div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 10 }}>Max patients: {p.maxPatients ?? '∞'}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{(p.features || []).join(', ')}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => editPlan(p)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => deactivate(p.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, minWidth: 260, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h4 style={{ marginBottom: 14 }}>{editing ? 'Edit Plan' : 'New Plan'}</h4>
          {input({ name: 'name', placeholder: 'Plan name (e.g. Starter)', value: form.name, onChange: handleChange })}
          {input({ name: 'price', type: 'number', placeholder: 'Price', value: form.price, onChange: handleChange })}
          <select name="billingCycle" value={form.billingCycle} onChange={handleChange} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 10 }}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {input({ name: 'maxUsers', type: 'number', placeholder: 'Max users (leave blank = unlimited)', value: form.maxUsers, onChange: handleChange })}
          {input({ name: 'maxPatients', type: 'number', placeholder: 'Max patients (leave blank = unlimited)', value: form.maxPatients, onChange: handleChange })}
          {input({ name: 'features', placeholder: 'Features (comma-separated)', value: form.features, onChange: handleChange })}
          <button onClick={save} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>
            {editing ? 'Save Changes' : 'Create Plan'}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: '', price: '', billingCycle: 'monthly', maxUsers: '', maxPatients: '', features: '' }); }} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%', marginTop: 6 }}>Cancel</button>}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

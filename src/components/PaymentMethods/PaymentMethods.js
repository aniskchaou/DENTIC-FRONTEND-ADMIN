import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'cash', provider: '', notes: '', isActive: true, clinicId: '' });
  const [editing, setEditing] = useState(null);

  const load = () => axios.get(`${BASE_URL}/clinic-payment-methods`).then(r => setMethods(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = () => {
    const req = editing
      ? axios.put(`${BASE_URL}/clinic-payment-methods/${editing}`, form)
      : axios.post(`${BASE_URL}/clinic-payment-methods`, form);
    req.then(() => { setShowForm(false); setEditing(null); setForm({ name: '', type: 'cash', provider: '', notes: '', isActive: true, clinicId: '' }); load(); }).catch(() => {});
  };

  const startEdit = (m) => { setForm({ name: m.name, type: m.type, provider: m.provider || '', notes: m.notes || '', isActive: m.isActive, clinicId: m.clinicId || '' }); setEditing(m.id); setShowForm(true); };

  const setDefault = (id) => axios.put(`${BASE_URL}/clinic-payment-methods/${id}/default`).then(load).catch(() => {});
  const remove = (id) => { if (window.confirm('Delete this payment method?')) axios.delete(`${BASE_URL}/clinic-payment-methods/${id}`).then(load).catch(() => {}); };
  const toggle = (m) => axios.put(`${BASE_URL}/clinic-payment-methods/${m.id}`, { ...m, isActive: !m.isActive }).then(load).catch(() => {});

  const TYPE_ICONS = { cash: 'fa-money', card: 'fa-credit-card', insurance: 'fa-shield', bank_transfer: 'fa-bank', online: 'fa-globe', other: 'fa-ellipsis-h' };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title"><i className="fa fa-credit-card mr-2" />Payment Methods</h4>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setForm({ name: '', type: 'cash', provider: '', notes: '', isActive: true, clinicId: '' }); setShowForm(!showForm); }}>+ Add Method</button>
        </div>
        <div className="card-body">
          {showForm && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <h6>{editing ? 'Edit' : 'Add'} Payment Method</h6>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label>Name *</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cash, VISA Terminal" />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label>Type</label>
                    <select className="form-control" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {['cash','card','insurance','bank_transfer','online','other'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label>Provider</label>
                    <input className="form-control" value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))} placeholder="e.g. Stripe, Square" />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label>Active</label>
                    <div className="mt-2">
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} /> Active
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Notes</label>
                    <input className="form-control" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary btn-sm mr-2" onClick={handleSave}>{editing ? 'Update' : 'Add'}</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="row">
            {methods.map(m => (
              <div className="col-md-4 mb-3" key={m.id}>
                <div className={`card ${m.isDefault ? 'border-success' : ''} ${!m.isActive ? 'bg-light' : ''}`}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className={`fa ${TYPE_ICONS[m.type] || 'fa-ellipsis-h'} mr-2 text-primary`} />
                        <strong>{m.name}</strong>
                        {m.isDefault && <span className="badge badge-success ml-2">Default</span>}
                        {!m.isActive && <span className="badge badge-secondary ml-2">Inactive</span>}
                      </div>
                    </div>
                    <div className="mt-1 text-muted" style={{ fontSize: 12 }}>Type: {m.type.replace('_',' ')} {m.provider && `• ${m.provider}`}</div>
                    {m.notes && <div className="mt-1" style={{ fontSize: 12 }}>{m.notes}</div>}
                    <div className="mt-2">
                      {!m.isDefault && <button className="btn btn-xs btn-outline-success mr-1" onClick={() => setDefault(m.id)}>Set Default</button>}
                      <button className="btn btn-xs btn-outline-secondary mr-1" onClick={() => toggle(m)}>{m.isActive ? 'Disable' : 'Enable'}</button>
                      <button className="btn btn-xs btn-outline-primary mr-1" onClick={() => startEdit(m)}>Edit</button>
                      <button className="btn btn-xs btn-outline-danger" onClick={() => remove(m.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {methods.length === 0 && <div className="col-12 text-center text-muted">No payment methods configured yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;

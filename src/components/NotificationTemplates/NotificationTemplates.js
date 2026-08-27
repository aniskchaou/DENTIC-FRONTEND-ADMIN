import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const EVENTS = ['appointment_reminder','appointment_confirmation','payment_due','recall','welcome','custom'];

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'email', event: 'appointment_reminder', subject: '', body: '', isActive: true, isGlobal: true });
  const [preview, setPreview] = useState(null);

  const load = () => axios.get(`${BASE_URL}/notification-templates`).then(r => setTemplates(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const startEdit = (t) => { setForm({ name: t.name, type: t.type, event: t.event, subject: t.subject || '', body: t.body, isActive: t.isActive, isGlobal: t.isGlobal }); setEditing(t.id); };
  const startNew = () => { setForm({ name: '', type: 'email', event: 'appointment_reminder', subject: '', body: '', isActive: true, isGlobal: true }); setEditing('new'); };

  const handleSave = () => {
    const req = editing === 'new'
      ? axios.post(`${BASE_URL}/notification-templates`, form)
      : axios.put(`${BASE_URL}/notification-templates/${editing}`, form);
    req.then(() => { setEditing(null); load(); }).catch(() => {});
  };

  const remove = (id) => { if (window.confirm('Delete this template?')) axios.delete(`${BASE_URL}/notification-templates/${id}`).then(load).catch(() => {}); };

  const generatePreview = (body) => {
    const sample = { patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2026-08-15', time: '10:00 AM', clinicName: 'DentCare Clinic', amount: '$150.00', portalUrl: 'https://portal.dentic.com' };
    return body.replace(/\{\{(\w+)\}\}/g, (_, k) => sample[k] || `{{${k}}}`);
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title"><i className="fa fa-bell mr-2" />Notification Templates</h4>
          <button className="btn btn-sm btn-primary" onClick={startNew}>+ New Template</button>
        </div>
        <div className="card-body">
          {editing && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <h6>{editing === 'new' ? 'New' : 'Edit'} Template</h6>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label>Name *</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label>Channel</label>
                    <select className="form-control" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {['email','sms','push'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label>Event</label>
                    <select className="form-control" value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))}>
                      {EVENTS.map(e => <option key={e} value={e}>{e.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3 mb-2 d-flex align-items-end">
                    <label className="mr-3"><input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} /> Active</label>
                    <label><input type="checkbox" checked={form.isGlobal} onChange={e => setForm(p => ({ ...p, isGlobal: e.target.checked }))} /> Global</label>
                  </div>
                  {form.type === 'email' && (
                    <div className="col-md-12 mb-2">
                      <label>Subject</label>
                      <input className="form-control" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Use {{variables}} like {{patientName}}" />
                    </div>
                  )}
                  <div className="col-md-12 mb-2">
                    <label>Body — available variables: <code>{'{{patientName}} {{doctorName}} {{date}} {{time}} {{clinicName}} {{amount}}'}</code></label>
                    <textarea className="form-control" rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-info btn-sm mr-2" onClick={() => setPreview(generatePreview(form.body))}>Preview</button>
                <button className="btn btn-primary btn-sm mr-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                {preview && (
                  <div className="alert alert-light mt-3">
                    <strong>Preview:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{preview}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          <table className="table table-sm table-hover">
            <thead><tr><th>Name</th><th>Channel</th><th>Event</th><th>Scope</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td><span className={`badge badge-${t.type === 'email' ? 'primary' : t.type === 'sms' ? 'success' : 'info'}`}>{t.type}</span></td>
                  <td>{t.event.replace(/_/g,' ')}</td>
                  <td>{t.isGlobal ? <span className="badge badge-dark">Global</span> : <span className="badge badge-secondary">Clinic</span>}</td>
                  <td>{t.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-secondary">Inactive</span>}</td>
                  <td>
                    <button className="btn btn-xs btn-outline-primary mr-1" onClick={() => startEdit(t)}>Edit</button>
                    <button className="btn btn-xs btn-outline-danger" onClick={() => remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No templates yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplates;

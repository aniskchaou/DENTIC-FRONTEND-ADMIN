import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const STATUS_BADGE = { open: 'warning', in_progress: 'info', resolved: 'success', closed: 'secondary' };
const PRIORITY_BADGE = { low: 'secondary', medium: 'info', high: 'warning', critical: 'danger' };

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', clinicId: '' });

  const load = () => axios.get(`${BASE_URL}/support-tickets`).then(r => setTickets(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    axios.post(`${BASE_URL}/support-tickets`, form)
      .then(() => { setShowForm(false); setForm({ subject: '', description: '', priority: 'medium', clinicId: '' }); load(); })
      .catch(() => {});
  };

  const handleStatus = (id, status) => {
    axios.put(`${BASE_URL}/support-tickets/${id}/status`, { status })
      .then(() => { load(); if (selected?.id === id) setSelected(t => ({ ...t, status })); })
      .catch(() => {});
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    axios.post(`${BASE_URL}/support-tickets/${selected.id}/reply`, { text: replyText, author: 'Support' })
      .then(r => { setSelected(r.data); setReplyText(''); load(); })
      .catch(() => {});
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Support Tickets</h4>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>+ New Ticket</button>
        </div>
        <div className="card-body">
          {showForm && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <h6>New Support Ticket</h6>
                <input className="form-control mb-2" placeholder="Subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                <textarea className="form-control mb-2" rows={3} placeholder="Describe the issue…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                <div className="row">
                  <div className="col-md-4">
                    <select className="form-control mb-2" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                      {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input className="form-control mb-2" placeholder="Clinic ID (optional)" value={form.clinicId} onChange={e => setForm(p => ({ ...p, clinicId: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary btn-sm mr-2" onClick={handleCreate}>Submit</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="row">
            {/* Ticket list */}
            <div className={selected ? 'col-md-5' : 'col-md-12'}>
              <table className="table table-sm table-hover">
                <thead><tr><th>#</th><th>Subject</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id} className={selected?.id === t.id ? 'table-active' : ''} style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
                      <td>{t.id}</td>
                      <td>{t.subject}</td>
                      <td><span className={`badge badge-${PRIORITY_BADGE[t.priority]}`}>{t.priority}</span></td>
                      <td><span className={`badge badge-${STATUS_BADGE[t.status]}`}>{t.status}</span></td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {tickets.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No tickets</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Ticket detail */}
            {selected && (
              <div className="col-md-7 border-left">
                <div className="d-flex justify-content-between mb-2">
                  <h6>#{selected.id} — {selected.subject}</h6>
                  <button className="btn btn-sm btn-light" onClick={() => setSelected(null)}>✕</button>
                </div>
                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{selected.description}</p>
                <div className="mb-2">
                  {['open','in_progress','resolved','closed'].map(s => (
                    <button key={s} className={`btn btn-sm mr-1 btn-${STATUS_BADGE[s]}`} onClick={() => handleStatus(selected.id, s)}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <hr />
                <h6>Replies ({(selected.replies || []).length})</h6>
                {(selected.replies || []).map((r, i) => (
                  <div key={i} className="alert alert-light p-2 mb-1">
                    <strong>{r.author}</strong> <small className="text-muted">{new Date(r.timestamp).toLocaleString()}</small>
                    <p className="mb-0">{r.text}</p>
                  </div>
                ))}
                <div className="input-group mt-2">
                  <input className="form-control" placeholder="Write a reply…" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} />
                  <div className="input-group-append">
                    <button className="btn btn-primary" onClick={handleReply}>Send</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;

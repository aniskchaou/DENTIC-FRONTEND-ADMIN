import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const STATUS_COLORS = { pending: '#f57c00', approved: '#1976d2', rejected: '#d32f2f', processed: '#388e3c' };

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [form, setForm] = useState({ saasInvoiceId: '', clinicId: '', amount: '', reason: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => superAdminHTTPService.getRefunds().then(r => setRefunds(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const create = () => {
    superAdminHTTPService.createRefund({ ...form, amount: parseFloat(form.amount), saasInvoiceId: parseInt(form.saasInvoiceId) })
      .then(() => { notify('Refund request created.'); setForm({ saasInvoiceId: '', clinicId: '', amount: '', reason: '' }); load(); })
      .catch(e => notify('Error: ' + e.message));
  };

  const updateStatus = (id, status) => superAdminHTTPService.updateRefundStatus(id, { status }).then(() => { notify(`Refund ${status}.`); load(); });

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>Refund Management</h2>
      {msg && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: '#2e7d32' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Table */}
        <div style={{ flex: 2, minWidth: 360 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead style={{ background: '#1a237e', color: '#fff' }}>
              <tr>{['Invoice', 'Clinic', 'Amount', 'Reason', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {refunds.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#aaa' }}>No refund requests.</td></tr>}
              {refunds.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '8px 12px' }}>#{r.saasInvoiceId}</td>
                  <td style={{ padding: '8px 12px', fontSize: 12, color: '#555' }}>{r.clinicId?.slice(0, 8)}…</td>
                  <td style={{ padding: '8px 12px' }}>${r.amount}</td>
                  <td style={{ padding: '8px 12px', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason || '—'}</td>
                  <td style={{ padding: '8px 12px' }}><span style={{ background: STATUS_COLORS[r.status], color: '#fff', borderRadius: 10, padding: '2px 9px', fontSize: 12 }}>{r.status}</span></td>
                  <td style={{ padding: '8px 12px' }}>
                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => updateStatus(r.id, 'approved')} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Approve</button>
                        <button onClick={() => updateStatus(r.id, 'rejected')} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                      </div>
                    )}
                    {r.status === 'approved' && (
                      <button onClick={() => updateStatus(r.id, 'processed')} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Mark Processed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create */}
        <div style={{ flex: 1, minWidth: 240, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h4 style={{ marginBottom: 12 }}>New Refund Request</h4>
          {[['saasInvoiceId', 'Invoice ID', 'number'], ['clinicId', 'Clinic ID (UUID)', 'text'], ['amount', 'Amount ($)', 'number']].map(([name, placeholder, type]) => (
            <input key={name} type={type} name={name} placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8, boxSizing: 'border-box' }} />
          ))}
          <textarea placeholder="Reason" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 10, height: 70, boxSizing: 'border-box' }} />
          <button onClick={create} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Submit Request</button>
        </div>
      </div>
    </div>
  );
};

export default RefundManagement;

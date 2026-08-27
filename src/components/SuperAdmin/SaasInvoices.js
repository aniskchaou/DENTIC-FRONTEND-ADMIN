import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const STATUS_COLORS = { draft: '#888', sent: '#1976d2', paid: '#388e3c', overdue: '#d32f2f', cancelled: '#aaa' };

const SaasInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ clinicId: '', subscriptionId: '', amount: '', couponCode: '', dueDate: '' });
  const [payRef, setPayRef] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => superAdminHTTPService.getSaasInvoices().then(r => setInvoices(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const create = () => {
    superAdminHTTPService.createSaasInvoice({ ...form, amount: parseFloat(form.amount), subscriptionId: parseInt(form.subscriptionId) })
      .then(() => { notify('Invoice created.'); setForm({ clinicId: '', subscriptionId: '', amount: '', couponCode: '', dueDate: '' }); load(); })
      .catch(e => notify('Error: ' + e.message));
  };

  const markPaid = (id) => {
    superAdminHTTPService.markInvoicePaid(id, { paymentReference: payRef })
      .then(() => { notify('Invoice marked as paid.'); setSelectedId(null); setPayRef(''); load(); })
      .catch(e => notify('Error: ' + e.message));
  };

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>SaaS Invoices</h2>
      {msg && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: '#2e7d32' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Table */}
        <div style={{ flex: 2, minWidth: 380 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead style={{ background: '#1a237e', color: '#fff' }}>
              <tr>{['#', 'Clinic', 'Amount', 'Discount', 'Final', 'Due', 'Status', ''].map(h => <th key={h} style={{ padding: '10px 10px', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {invoices.length === 0 && <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', color: '#aaa' }}>No invoices.</td></tr>}
              {invoices.map((inv, i) => (
                <tr key={inv.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '8px 10px', fontSize: 12 }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '8px 10px', fontSize: 12 }}>{inv.clinicId?.slice(0, 8)}…</td>
                  <td style={{ padding: '8px 10px' }}>${inv.amount}</td>
                  <td style={{ padding: '8px 10px', color: '#d32f2f' }}>{inv.discount > 0 ? `-$${inv.discount}` : '—'}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>${inv.finalAmount}</td>
                  <td style={{ padding: '8px 10px', fontSize: 12 }}>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '8px 10px' }}><span style={{ background: STATUS_COLORS[inv.status], color: '#fff', borderRadius: 10, padding: '2px 9px', fontSize: 12 }}>{inv.status}</span></td>
                  <td style={{ padding: '8px 10px' }}>
                    {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                      selectedId === inv.id
                        ? <span style={{ display: 'flex', gap: 4 }}>
                            <input placeholder="Ref." value={payRef} onChange={e => setPayRef(e.target.value)} style={{ width: 80, padding: '3px 6px', border: '1px solid #ccc', borderRadius: 3, fontSize: 12 }} />
                            <button onClick={() => markPaid(inv.id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>OK</button>
                          </span>
                        : <button onClick={() => setSelectedId(inv.id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create */}
        <div style={{ flex: 1, minWidth: 240, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h4 style={{ marginBottom: 12 }}>New Invoice</h4>
          {[['clinicId', 'Clinic ID (UUID)', 'text'], ['subscriptionId', 'Subscription ID', 'number'], ['amount', 'Amount ($)', 'number'], ['couponCode', 'Coupon code (optional)', 'text']].map(([name, placeholder, type]) => (
            <input key={name} type={type} name={name} placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8, boxSizing: 'border-box' }} />
          ))}
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 2 }}>Due date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 10, boxSizing: 'border-box' }} />
          <button onClick={create} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Create Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default SaasInvoices;

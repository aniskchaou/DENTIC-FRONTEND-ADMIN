import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', expiresAt: '' });
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [validateCode, setValidateCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const load = () => superAdminHTTPService.getCoupons().then(r => setCoupons(r.data));
  useEffect(() => { load(); }, []);

  const notify = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: 'success' }), 3000); };

  const save = () => {
    const payload = { ...form, discountValue: parseFloat(form.discountValue), maxUses: form.maxUses ? parseInt(form.maxUses) : null, expiresAt: form.expiresAt || null };
    superAdminHTTPService.createCoupon(payload).then(() => { notify('Coupon created.'); setForm({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', expiresAt: '' }); load(); }).catch(e => notify(e.message, 'error'));
  };

  const deactivate = (id) => superAdminHTTPService.deactivateCoupon(id).then(() => { notify('Coupon deactivated.'); load(); });

  const validate = () => {
    setValidationResult(null);
    superAdminHTTPService.validateCoupon(validateCode).then(r => setValidationResult({ ok: true, ...r.data })).catch(() => setValidationResult({ ok: false }));
  };

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>Coupon Management</h2>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ffebee' : '#e8f5e9', border: `1px solid ${msg.type === 'error' ? '#ef9a9a' : '#a5d6a7'}`, borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: msg.type === 'error' ? '#c62828' : '#2e7d32' }}>{msg.text}</div>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* List */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead style={{ background: '#1a237e', color: '#fff' }}>
              <tr>{['Code', 'Type', 'Value', 'Used', 'Max', 'Expires', 'Active', ''].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '8px 12px' }}>{c.discountType}</td>
                  <td style={{ padding: '8px 12px' }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                  <td style={{ padding: '8px 12px' }}>{c.usedCount}</td>
                  <td style={{ padding: '8px 12px' }}>{c.maxUses ?? '∞'}</td>
                  <td style={{ padding: '8px 12px' }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '8px 12px' }}><span style={{ color: c.isActive ? '#388e3c' : '#d32f2f' }}>{c.isActive ? 'Yes' : 'No'}</span></td>
                  <td style={{ padding: '8px 12px' }}><button onClick={() => deactivate(c.id)} disabled={!c.isActive} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12, opacity: c.isActive ? 1 : 0.4 }}>Deactivate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div style={{ flex: 1, minWidth: 240 }}>
          {/* Create */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12 }}>Create Coupon</h4>
            {[['code', 'Code (e.g. SAVE20)', 'text'], ['discountValue', 'Discount value', 'number'], ['maxUses', 'Max uses (blank = unlimited)', 'number']].map(([name, placeholder, type]) => (
              <input key={name} type={type} name={name} placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8, boxSizing: 'border-box' }} />
            ))}
            <select name="discountType" value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ($)</option>
            </select>
            <input type="date" name="expiresAt" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 10, boxSizing: 'border-box' }} />
            <button onClick={save} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Create Coupon</button>
          </div>

          {/* Validate */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ marginBottom: 12 }}>Validate Code</h4>
            <input type="text" placeholder="Enter coupon code" value={validateCode} onChange={e => setValidateCode(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8, boxSizing: 'border-box' }} />
            <button onClick={validate} style={{ background: '#f57c00', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Validate</button>
            {validationResult && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: validationResult.ok ? '#e8f5e9' : '#ffebee', color: validationResult.ok ? '#2e7d32' : '#c62828' }}>
                {validationResult.ok ? `✓ ${validationResult.discountType === 'percentage' ? validationResult.discountValue + '%' : '$' + validationResult.discountValue} off` : '✗ Invalid or expired'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;

import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const TABS = ['SMS Providers', 'Payment Gateways', 'Storage', 'AI Integration'];

const field = (label, props) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 3 }}>{label}</label>
    <input {...props} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }} />
  </div>
);

const PlatformSettings = () => {
  const [tab, setTab] = useState(0);
  const [smsProviders, setSmsProviders] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [storage, setStorage] = useState({});
  const [aiConfig, setAiConfig] = useState({ configured: false, keyPreview: '' });
  const [smsForm, setSmsForm] = useState({ name: '', provider: 'twilio', apiKey: '', apiSecret: '', senderNumber: '' });
  const [gwForm, setGwForm] = useState({ name: '', provider: 'stripe', publicKey: '', secretKey: '', currency: 'USD', sandboxMode: true });
  const [storageForm, setStorageForm] = useState({ provider: 'local', bucketName: '', region: '', accessKeyId: '', secretAccessKey: '', localBasePath: '' });
  const [aiKey, setAiKey] = useState('');
  const [msg, setMsg] = useState('');

  const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    superAdminHTTPService.getSmsProviders().then(r => setSmsProviders(r.data)).catch(() => {});
    superAdminHTTPService.getGateways().then(r => setGateways(r.data)).catch(() => {});
    superAdminHTTPService.getStorageConfig().then(r => setStorage(r.data || {})).catch(() => {});
    superAdminHTTPService.getAiConfig().then(r => setAiConfig(r.data)).catch(() => {});
  }, []);

  // SMS
  const saveSms = () => superAdminHTTPService.createSmsProvider(smsForm).then(() => { notify('SMS provider added.'); superAdminHTTPService.getSmsProviders().then(r => setSmsProviders(r.data)); setSmsForm({ name: '', provider: 'twilio', apiKey: '', apiSecret: '', senderNumber: '' }); }).catch(e => notify(e.message));
  const activateSms = (id) => superAdminHTTPService.activateSmsProvider(id).then(() => { notify('SMS provider activated.'); superAdminHTTPService.getSmsProviders().then(r => setSmsProviders(r.data)); });
  const deleteSms = (id) => superAdminHTTPService.deleteSmsProvider(id).then(() => { notify('Deleted.'); superAdminHTTPService.getSmsProviders().then(r => setSmsProviders(r.data)); });

  // Gateways
  const saveGw = () => superAdminHTTPService.createGateway(gwForm).then(() => { notify('Gateway added.'); superAdminHTTPService.getGateways().then(r => setGateways(r.data)); setGwForm({ name: '', provider: 'stripe', publicKey: '', secretKey: '', currency: 'USD', sandboxMode: true }); }).catch(e => notify(e.message));
  const activateGw = (id) => superAdminHTTPService.activateGateway(id).then(() => { notify('Gateway activated.'); superAdminHTTPService.getGateways().then(r => setGateways(r.data)); });
  const deleteGw = (id) => superAdminHTTPService.deleteGateway(id).then(() => { notify('Deleted.'); superAdminHTTPService.getGateways().then(r => setGateways(r.data)); });

  // Storage
  const saveStorage = () => superAdminHTTPService.saveStorageConfig(storageForm).then(() => { notify('Storage config saved.'); superAdminHTTPService.getStorageConfig().then(r => setStorage(r.data || {})); }).catch(e => notify(e.message));

  // AI
  const saveAi = () => superAdminHTTPService.saveAiConfig({ openApiKey: aiKey }).then(() => { notify('AI key saved.'); setAiKey(''); superAdminHTTPService.getAiConfig().then(r => setAiConfig(r.data)); }).catch(e => notify(e.message));

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>Platform Settings</h2>
      {msg && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: '#2e7d32' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e0e0e0', marginBottom: 24 }}>
        {TABS.map((t, i) => <button key={t} onClick={() => setTab(i)} style={{ padding: '9px 20px', border: 'none', borderBottom: tab === i ? '3px solid #1a237e' : '3px solid transparent', background: 'none', cursor: 'pointer', fontWeight: tab === i ? 700 : 400, color: tab === i ? '#1a237e' : '#555', fontSize: 14 }}>{t}</button>)}
      </div>

      {/* SMS Providers */}
      {tab === 0 && (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 300 }}>
            {smsProviders.length === 0 ? <p style={{ color: '#aaa' }}>No SMS providers configured.</p> : smsProviders.map((s, i) => (
              <div key={s.id} style={{ background: '#fff', borderRadius: 8, padding: 14, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{s.name}</strong> <span style={{ fontSize: 12, color: '#888' }}>({s.provider})</span> {s.isActive && <span style={{ background: '#388e3c', color: '#fff', borderRadius: 10, padding: '1px 8px', fontSize: 11 }}>Active</span>}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!s.isActive && <button onClick={() => activateSms(s.id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Activate</button>}
                  <button onClick={() => deleteSms(s.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 240, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ marginBottom: 12 }}>Add SMS Provider</h4>
            {field('Name', { placeholder: 'e.g. My Twilio', value: smsForm.name, onChange: e => setSmsForm(f => ({ ...f, name: e.target.value })) })}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 3 }}>Provider</label>
              <select value={smsForm.provider} onChange={e => setSmsForm(f => ({ ...f, provider: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
                {['twilio', 'vonage', 'aws_sns', 'custom'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {field('API Key', { placeholder: 'API Key', value: smsForm.apiKey, onChange: e => setSmsForm(f => ({ ...f, apiKey: e.target.value })) })}
            {field('API Secret', { placeholder: 'API Secret (optional)', value: smsForm.apiSecret, onChange: e => setSmsForm(f => ({ ...f, apiSecret: e.target.value })) })}
            {field('Sender Number', { placeholder: '+1234567890', value: smsForm.senderNumber, onChange: e => setSmsForm(f => ({ ...f, senderNumber: e.target.value })) })}
            <button onClick={saveSms} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Add Provider</button>
          </div>
        </div>
      )}

      {/* Payment Gateways */}
      {tab === 1 && (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 300 }}>
            {gateways.length === 0 ? <p style={{ color: '#aaa' }}>No gateways configured.</p> : gateways.map((g) => (
              <div key={g.id} style={{ background: '#fff', borderRadius: 8, padding: 14, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{g.name}</strong> <span style={{ fontSize: 12, color: '#888' }}>({g.provider}) {g.sandboxMode ? '🧪 sandbox' : '🔴 live'}</span> {g.isActive && <span style={{ background: '#388e3c', color: '#fff', borderRadius: 10, padding: '1px 8px', fontSize: 11 }}>Active</span>}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!g.isActive && <button onClick={() => activateGw(g.id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Activate</button>}
                  <button onClick={() => deleteGw(g.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 240, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ marginBottom: 12 }}>Add Gateway</h4>
            {field('Name', { placeholder: 'e.g. Stripe Production', value: gwForm.name, onChange: e => setGwForm(f => ({ ...f, name: e.target.value })) })}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 3 }}>Provider</label>
              <select value={gwForm.provider} onChange={e => setGwForm(f => ({ ...f, provider: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
                {['stripe', 'paypal', 'braintree', 'square', 'custom'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {field('Public Key', { placeholder: 'pk_...', value: gwForm.publicKey, onChange: e => setGwForm(f => ({ ...f, publicKey: e.target.value })) })}
            {field('Secret Key', { placeholder: 'sk_...', type: 'password', value: gwForm.secretKey, onChange: e => setGwForm(f => ({ ...f, secretKey: e.target.value })) })}
            {field('Currency', { placeholder: 'USD', value: gwForm.currency, onChange: e => setGwForm(f => ({ ...f, currency: e.target.value })) })}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={gwForm.sandboxMode} onChange={e => setGwForm(f => ({ ...f, sandboxMode: e.target.checked }))} /> Sandbox mode
            </label>
            <button onClick={saveGw} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Add Gateway</button>
          </div>
        </div>
      )}

      {/* Storage */}
      {tab === 2 && (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {storage.id && (
            <div style={{ flex: 2, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <h4>Current Config</h4>
              <p><strong>Provider:</strong> {storage.provider}</p>
              {storage.bucketName && <p><strong>Bucket:</strong> {storage.bucketName}</p>}
              {storage.region && <p><strong>Region:</strong> {storage.region}</p>}
              {storage.localBasePath && <p><strong>Local path:</strong> {storage.localBasePath}</p>}
              <span style={{ background: storage.isActive ? '#388e3c' : '#888', color: '#fff', borderRadius: 10, padding: '2px 10px', fontSize: 12 }}>{storage.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 260, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h4 style={{ marginBottom: 12 }}>Configure Storage</h4>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 3 }}>Provider</label>
              <select value={storageForm.provider} onChange={e => setStorageForm(f => ({ ...f, provider: e.target.value }))} style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
                {['local', 'gcs', 's3', 'azure_blob'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {storageForm.provider !== 'local' && <>
              {field('Bucket Name', { value: storageForm.bucketName, onChange: e => setStorageForm(f => ({ ...f, bucketName: e.target.value })) })}
              {field('Region', { value: storageForm.region, onChange: e => setStorageForm(f => ({ ...f, region: e.target.value })) })}
              {field('Access Key ID', { value: storageForm.accessKeyId, onChange: e => setStorageForm(f => ({ ...f, accessKeyId: e.target.value })) })}
              {field('Secret Access Key', { type: 'password', value: storageForm.secretAccessKey, onChange: e => setStorageForm(f => ({ ...f, secretAccessKey: e.target.value })) })}
            </>}
            {storageForm.provider === 'local' && field('Local Base Path', { placeholder: '/uploads', value: storageForm.localBasePath, onChange: e => setStorageForm(f => ({ ...f, localBasePath: e.target.value })) })}
            <button onClick={saveStorage} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Save Storage Config</button>
          </div>
        </div>
      )}

      {/* AI Integration */}
      {tab === 3 && (
        <div style={{ maxWidth: 480, background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h4 style={{ marginBottom: 12 }}>OpenAI Integration</h4>
          <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
            Status: <strong style={{ color: aiConfig.configured ? '#388e3c' : '#d32f2f' }}>{aiConfig.configured ? 'Configured' : 'Not configured'}</strong>
            {aiConfig.keyPreview && <span style={{ marginLeft: 10, fontSize: 13, color: '#888' }}>Key: {aiConfig.keyPreview}</span>}
          </p>
          {field('New OpenAI API Key', { type: 'password', placeholder: 'sk-...', value: aiKey, onChange: e => setAiKey(e.target.value) })}
          <button onClick={saveAi} style={{ background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer', width: '100%' }}>Save AI Key</button>
        </div>
      )}
    </div>
  );
};

export default PlatformSettings;

import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const badge = (status) => {
  const colors = { Active: '#388e3c', Disabled: '#d32f2f', Suspended: '#f57c00' };
  return <span style={{ background: colors[status] || '#888', color: '#fff', borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>{status || 'Active'}</span>;
};

const PERMISSION_OPTIONS = [
  'view_patients', 'edit_patients', 'edit_appointments', 'perform_operations',
  'view_reports', 'manage_billing', 'manage_staff', 'manage_inventory',
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [perms, setPerms] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  const load = () => superAdminHTTPService.getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const notify = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: 'success' }), 3000); };

  const disable = (id) => superAdminHTTPService.disableUser(id).then(() => { notify('User disabled.'); load(); }).catch(e => notify(e.message, 'error'));
  const enable = (id) => superAdminHTTPService.enableUser(id).then(() => { notify('User enabled.'); load(); }).catch(e => notify(e.message, 'error'));
  const savePerms = () => superAdminHTTPService.assignPermissions(selected.id, { permissions: perms }).then(() => notify('Permissions saved.')).catch(e => notify(e.message, 'error'));
  const resetPwd = () => {
    if (!newPassword) return notify('Enter a new password.', 'error');
    superAdminHTTPService.adminResetPassword(selected.id, { newPassword }).then(() => { notify('Password reset.'); setNewPassword(''); }).catch(e => notify(e.message, 'error'));
  };

  const openUser = (u) => { setSelected(u); setPerms([]); setNewPassword(''); };
  const togglePerm = (p) => setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#1a237e', marginBottom: 20 }}>User Management</h2>
      {msg.text && (
        <div style={{ background: msg.type === 'error' ? '#ffebee' : '#e8f5e9', border: `1px solid ${msg.type === 'error' ? '#ef9a9a' : '#a5d6a7'}`, borderRadius: 6, padding: '8px 16px', marginBottom: 16, color: msg.type === 'error' ? '#c62828' : '#2e7d32' }}>{msg.text}</div>
      )}

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* User list */}
        <div style={{ flex: 2, minWidth: 340 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead style={{ background: '#1a237e', color: '#fff' }}>
              <tr>{['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '9px 14px' }}><button onClick={() => openUser(u)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 600, padding: 0 }}>{u.fullName || u.username}</button></td>
                  <td style={{ padding: '9px 14px' }}>{u.email}</td>
                  <td style={{ padding: '9px 14px' }}>{u.role}</td>
                  <td style={{ padding: '9px 14px' }}>{badge(u.status)}</td>
                  <td style={{ padding: '9px 14px', display: 'flex', gap: 6 }}>
                    {u.status === 'Disabled'
                      ? <button onClick={() => enable(u.id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Enable</button>
                      : <button onClick={() => disable(u.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>Disable</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ flex: 1, minWidth: 260, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <h4 style={{ marginBottom: 4 }}>{selected.fullName || selected.username}</h4>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 14 }}>{selected.role} · {selected.email}</p>

            <hr style={{ margin: '10px 0' }} />
            <h5 style={{ marginBottom: 8 }}>Reset Password</h5>
            <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }} />
            <button onClick={resetPwd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', width: '100%', marginBottom: 16 }}>Reset Password</button>

            <hr style={{ margin: '10px 0' }} />
            <h5 style={{ marginBottom: 8 }}>Assign Permissions</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {PERMISSION_OPTIONS.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} />
                  {p.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
            <button onClick={savePerms} style={{ background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', width: '100%' }}>Save Permissions</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

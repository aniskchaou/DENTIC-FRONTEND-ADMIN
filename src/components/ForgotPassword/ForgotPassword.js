import React, { useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // request | reset | done
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ text: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const notify = (text, type = 'info') => setMsg({ text, type });

  const handleRequest = (e) => {
    e.preventDefault();
    if (!email) return notify('Enter your email.', 'error');
    setLoading(true);
    superAdminHTTPService.forgotPassword({ email })
      .then(r => { notify(r.data.message, 'success'); setStep('reset'); })
      .catch(err => notify(err.response?.data?.message || 'Request failed.', 'error'))
      .finally(() => setLoading(false));
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!token) return notify('Enter your reset token.', 'error');
    if (!newPassword) return notify('Enter a new password.', 'error');
    if (newPassword !== confirm) return notify('Passwords do not match.', 'error');
    setLoading(true);
    superAdminHTTPService.resetPassword({ token, newPassword })
      .then(r => { notify(r.data.message, 'success'); setStep('done'); })
      .catch(err => notify(err.response?.data?.message || 'Reset failed.', 'error'))
      .finally(() => setLoading(false));
  };

  const msgStyle = {
    background: msg.type === 'error' ? '#ffebee' : msg.type === 'success' ? '#e8f5e9' : '#e3f2fd',
    border: `1px solid ${msg.type === 'error' ? '#ef9a9a' : msg.type === 'success' ? '#a5d6a7' : '#90caf9'}`,
    color: msg.type === 'error' ? '#c62828' : msg.type === 'success' ? '#2e7d32' : '#1565c0',
    borderRadius: 6, padding: '10px 16px', marginBottom: 18, fontSize: 14
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 14, fontSize: 14, boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '11px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/images/logo.png" alt="Dentic" style={{ height: 48, marginBottom: 10 }} onError={e => { e.target.style.display = 'none'; }} />
          <h2 style={{ color: '#1a237e', margin: 0, fontSize: 22 }}>Forgot Password</h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
            {step === 'request' && 'Enter your email to receive a reset token.'}
            {step === 'reset' && 'Enter the token you received and your new password.'}
            {step === 'done' && 'Your password has been reset successfully.'}
          </p>
        </div>

        {msg.text && <div style={msgStyle}>{msg.text}</div>}

        {step === 'request' && (
          <form onSubmit={handleRequest}>
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <button type="submit" style={btnStyle} disabled={loading}>{loading ? 'Sending…' : 'Send Reset Token'}</button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset}>
            <input type="text" placeholder="Reset token" value={token} onChange={e => setToken(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} />
            <button type="submit" style={btnStyle} disabled={loading}>{loading ? 'Resetting…' : 'Reset Password'}</button>
          </form>
        )}

        {step === 'done' && (
          <Link to="/login" style={{ display: 'block', textAlign: 'center', ...btnStyle, textDecoration: 'none', padding: 11 }}>Back to Login</Link>
        )}

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/" style={{ color: '#1976d2', fontSize: 13, textDecoration: 'none' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useEffect, useState } from 'react';
import superAdminHTTPService from '../../main/services/superAdminHTTPService';

const card = (label, value, color) => (
  <div style={{ background: '#fff', borderRadius: 10, padding: '20px 28px', flex: 1, minWidth: 160, boxShadow: '0 2px 8px rgba(0,0,0,0.09)', borderLeft: `5px solid ${color}` }}>
    <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
  </div>
);

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [usage, setUsage] = useState([]);
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      superAdminHTTPService.getDashboard(),
      superAdminHTTPService.getMonthlyRevenue(),
      superAdminHTTPService.getAppUsage(),
      superAdminHTTPService.getGrowth(),
    ]).then(([d, r, u, g]) => {
      setStats(d.data);
      setRevenue(r.data);
      setUsage(u.data);
      setGrowth(g.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading dashboard…</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ marginBottom: 24, color: '#1a237e' }}>Super Admin Dashboard</h2>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 32 }}>
        {card('Total Revenue', stats ? `$${Number(stats.totalRevenue).toFixed(2)}` : '—', '#1976d2')}
        {card('Active Clinics', stats?.activeClinics ?? '—', '#388e3c')}
        {card('Total Users', stats?.totalUsers ?? '—', '#7b1fa2')}
        {card('Failed Payments', stats?.failedPayments ?? '—', '#d32f2f')}
        {card('New Clinics (Month)', stats?.newClinicsThisMonth ?? '—', '#f57c00')}
      </div>

      {/* Growth */}
      {growth && (
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h4 style={{ marginBottom: 12 }}>Monthly Growth</h4>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>This month: <strong>{growth.thisMonth}</strong></span>
            <span>Last month: <strong>{growth.lastMonth}</strong></span>
            <span>Growth rate: <strong style={{ color: growth.growthRate && growth.growthRate.startsWith('-') ? '#d32f2f' : '#388e3c' }}>{growth.growthRate}</strong></span>
          </div>
        </div>
      )}

      {/* Monthly Revenue Table */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 280, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h4 style={{ marginBottom: 12 }}>Monthly Revenue</h4>
          {revenue.length === 0 ? <p style={{ color: '#aaa' }}>No paid invoices yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead><tr style={{ background: '#f5f5f5' }}><th style={{ padding: '6px 10px', textAlign: 'left' }}>Month</th><th style={{ padding: '6px 10px', textAlign: 'right' }}>Revenue</th></tr></thead>
              <tbody>
                {revenue.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px 10px' }}>{r.month ? new Date(r.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>${Number(r.revenue).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* App Usage */}
        <div style={{ flex: 1, minWidth: 220, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h4 style={{ marginBottom: 12 }}>Top Modules (30d)</h4>
          {usage.length === 0 ? <p style={{ color: '#aaa' }}>No usage data yet.</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {usage.map((u, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span>{u.module}</span>
                  <strong>{u.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

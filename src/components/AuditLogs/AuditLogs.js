import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ action: '', entity: '', userId: '', from: '', to: '' });
  const [page, setPage] = useState(0);
  const limit = 50;

  const load = () => {
    setLoading(true);
    const params = { limit, offset: page * limit, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    axios.get(`${BASE_URL}/audit-logs`, { params })
      .then(r => { setLogs(r.data.rows || []); setTotal(r.data.count || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, filters]);

  const handlePurge = () => {
    const before = prompt('Delete logs before date (YYYY-MM-DD)? Leave blank to delete ALL.');
    if (before === null) return;
    axios.delete(`${BASE_URL}/audit-logs`, { params: before ? { before } : {} })
      .then(() => load());
  };

  const ACTION_COLORS = { CREATE: 'success', UPDATE: 'info', DELETE: 'danger', LOGIN: 'primary', IMPERSONATE: 'warning' };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Audit Logs</h4>
          <button className="btn btn-sm btn-danger" onClick={handlePurge}>Purge Logs</button>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            {['action','entity','userId','from','to'].map(f => (
              <div className="col-md-2" key={f}>
                <input
                  type={f === 'from' || f === 'to' ? 'date' : 'text'}
                  className="form-control form-control-sm"
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={filters[f]}
                  onChange={e => { setFilters(p => ({ ...p, [f]: e.target.value })); setPage(0); }}
                />
              </div>
            ))}
          </div>
          {loading ? <p>Loading…</p> : (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>IP</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleString()}</td>
                      <td>{l.username}</td>
                      <td><span className="badge badge-secondary">{l.role}</span></td>
                      <td><span className={`badge badge-${ACTION_COLORS[l.action] || 'secondary'}`}>{l.action}</span></td>
                      <td>{l.entity}</td>
                      <td>{l.entityId}</td>
                      <td>{l.ipAddress}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.details ? JSON.stringify(l.details) : '-'}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && <tr><td colSpan={8} className="text-center text-muted">No logs found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span>Total: {total}</span>
            <div>
              <button className="btn btn-sm btn-outline-secondary mr-1" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span> Page {page + 1} </span>
              <button className="btn btn-sm btn-outline-secondary" disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;

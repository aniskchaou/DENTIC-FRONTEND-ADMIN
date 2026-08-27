import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const PatientPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  // Get patient id from session/localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const patientId = userData.patientId || userData.id;

  const load = () => {
    if (!patientId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/patient-portal/payments/${patientId}`)
      .then(r => setPayments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = (p) => {
    setPaying(p.id);
    axios.put(`${BASE_URL}/patient-portal/payments/${p.id}/confirm`, { method: 'online' })
      .then(() => { load(); })
      .catch(() => {})
      .finally(() => setPaying(null));
  };

  const STATUS_BADGE = { pending: 'warning', paid: 'success', cancelled: 'danger', refunded: 'secondary', partial: 'info' };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title"><i className="fa fa-dollar mr-2" />My Payments</h4>
        </div>
        <div className="card-body">
          {loading ? <p>Loading…</p> : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr><th>Invoice #</th><th>Date</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>#{p.invoiceId || p.id}</td>
                      <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                      <td>${parseFloat(p.totalAmount || 0).toFixed(2)}</td>
                      <td>${parseFloat(p.paidAmount || 0).toFixed(2)}</td>
                      <td>${parseFloat((p.totalAmount || 0) - (p.paidAmount || 0)).toFixed(2)}</td>
                      <td><span className={`badge badge-${STATUS_BADGE[p.status] || 'secondary'}`}>{p.status}</span></td>
                      <td>
                        {p.status === 'pending' || p.status === 'partial' ? (
                          <button className="btn btn-sm btn-success" disabled={paying === p.id} onClick={() => handlePay(p)}>
                            {paying === p.id ? 'Processing…' : 'Pay Now'}
                          </button>
                        ) : <span className="text-muted">-</span>}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={7} className="text-center text-muted">No payment records found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPayment;

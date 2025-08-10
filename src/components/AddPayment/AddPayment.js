import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import patientHTTPService from '../../main/services/patientHTTPService';
import paymentHTTPService from '../../main/services/paymentHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';

const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Insurance', 'Other'];
const paymentStatuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
const currencies = ['USD', 'EUR', 'GBP', 'DZD', 'Other'];

const AddPayment = (props) => {
  const initialState = {
    patientId: '',
    appointmentId: '',
    invoiceId: '',
    clinicId: '',
    amount: '',
    currency: 'USD',
    paymentMethod: '',
    transactionId: '',
    insuranceClaimId: '',
    paymentStatus: 'Completed',
    paymentDate: '',
    notes: ''
  };

  const [payment, setPayment] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllPatients();
  }, []);

  const getAllPatients = () => {
    patientHTTPService.getAllPatients()
      .then(response => setPatients(response.data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...payment,
      id: payment.id || Math.random().toString(36).substr(2, 9),
      amount: Number(payment.amount),
      createdAt: now,
      updatedAt: now
    };
    paymentHTTPService.createPayment(data)
      .then(() => {
        setPayment(initialState);
        if (props.closeModal) props.closeModal(data);
        showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success');
      })
      .catch(() => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 500 }}>
      <Stack spacing={2}>
        <TextField
          select
          label="Patient"
          name="patientId"
          value={payment.patientId}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {patients.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.fullName || p.namepatient || p.id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Appointment ID"
          name="appointmentId"
          value={payment.appointmentId}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Invoice ID"
          name="invoiceId"
          value={payment.invoiceId}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Clinic ID"
          name="clinicId"
          value={payment.clinicId}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={payment.amount}
          onChange={handleInputChange}
          required
          fullWidth
        />
        <TextField
          select
          label="Currency"
          name="currency"
          value={payment.currency}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {currencies.map(cur => (
            <MenuItem key={cur} value={cur}>{cur}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Payment Method"
          name="paymentMethod"
          value={payment.paymentMethod}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {paymentMethods.map(method => (
            <MenuItem key={method} value={method}>{method}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Transaction ID"
          name="transactionId"
          value={payment.transactionId}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Insurance Claim ID"
          name="insuranceClaimId"
          value={payment.insuranceClaimId}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          select
          label="Payment Status"
          name="paymentStatus"
          value={payment.paymentStatus}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {paymentStatuses.map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Payment Date"
          name="paymentDate"
          type="datetime-local"
          value={payment.paymentDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label="Notes"
          name="notes"
          value={payment.notes}
          onChange={handleInputChange}
          multiline
          rows={2}
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={() => props.closeModal && props.closeModal()} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddPayment;

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import patientHTTPService from '../../main/services/patientHTTPService';
import paymentHTTPService from '../../main/services/paymentHTTPService';
import showMessage from '../../libraries/messages/messages';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';

const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Insurance', 'Other'];
const paymentStatuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
const currencies = ['USD', 'EUR', 'GBP', 'DZD', 'Other'];

const AddPayment = (props) => {
  const { t } = useTranslation();
  const initialState = {
    patientId: '',
    appointmentId: '',
    invoiceId: '',
    clinicId: '',
    amount: '',
    currency: 'USD',
    paymentMethod: '',
    insuranceClaimId: '',
    paymentStatus: 'Completed',
    paymentDate: '',
    notes: ''
  };

  const [payment, setPayment] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
  getAllPatients();
  getAllAppointments();
  getAllInvoices();
  getAllClinics();
  getAllInsurances();
  }, []);

  const getAllPatients = () => {
    patientHTTPService.getAllPatients()
      .then(response => setPatients(response.data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };
  
  const getAllAppointments = () => {
    fetch(`${BASE_URL}/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };
  
  const getAllInvoices = () => {
    fetch(`${BASE_URL}/invoices`)
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };
  
  const getAllClinics = () => {
    fetch(`${BASE_URL}/clinics`)
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };
  
  const getAllInsurances = () => {
    fetch(`${BASE_URL}/insurances`)
      .then(res => res.json())
      .then(data => setInsurances(data))
      .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      'patientId', 'clinicId', 'amount', 'currency', 'paymentMethod', 'paymentStatus'
    ];
    for (const field of requiredFields) {
      if (!payment[field] || payment[field] === '') {
        showMessage('Error', `${field} is required`, 'warning');
        return;
      }
    }
    setLoading(true);
    const now = new Date().toISOString();
    const data = {
      ...payment,
      amount: Number(payment.amount),
      transactionId: payment.transactionId,
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
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 800 }}>
      <Stack spacing={2}>
        <TextField
          select
          label={t('payment.patient')}
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
          select
          label={t('payment.appointment_id')}
          name="appointmentId"
          value={payment.appointmentId}
          onChange={handleInputChange}
          fullWidth
        >
          {appointments.map((a) => (
            <MenuItem key={a.id || a._id} value={a.id || a._id}>
              {`${a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : ''} | ${a.startTime || ''} - ${a.endTime || ''} ${a.title ? '| ' + a.title : ''}`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('payment.invoice_id')}
          name="invoiceId"
          value={payment.invoiceId}
          onChange={handleInputChange}
          fullWidth
        >
          {invoices.map((inv) => (
            <MenuItem key={inv.id || inv._id} value={inv.id || inv._id}>
              {inv.invoiceNumber || inv.id || inv._id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('payment.clinic_id')}
          name="clinicId"
          value={payment.clinicId}
          onChange={handleInputChange}
          fullWidth
        >
          {clinics.map((c) => (
            <MenuItem key={c.id || c._id} value={c.id || c._id}>
              {c.name || c.clinicName || c.id || c._id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('payment.amount')}
          name="amount"
          type="number"
          value={payment.amount}
          onChange={handleInputChange}
          required
          fullWidth
        />
        <TextField
          select
          label={t('payment.currency')}
          name="currency"
          value={payment.currency}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {currencies.map(cur => (
            <MenuItem key={cur} value={cur}>{t(`payment.currency_${cur.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('payment.payment_method')}
          name="paymentMethod"
          value={payment.paymentMethod}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {paymentMethods.map(method => (
            <MenuItem key={method} value={method}>{t(`payment.method_${method.replace(/\s+/g, '_').toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('payment.insurance_claim_id')}
          name="insuranceClaimId"
          value={payment.insuranceClaimId}
          onChange={handleInputChange}
          fullWidth
        >
          {insurances.map((ins) => (
            <MenuItem key={ins.id || ins._id} value={ins.id || ins._id}>
              {`${ins.providerName ? ins.providerName + ' | ' : ''}${ins.name || ins.insuranceName || ins.id || ins._id}`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t('payment.payment_status')}
          name="paymentStatus"
          value={payment.paymentStatus}
          onChange={handleInputChange}
          required
          fullWidth
        >
          {paymentStatuses.map(status => (
            <MenuItem key={status} value={status}>{t(`payment.status_${status.toLowerCase()}`)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('payment.payment_date')}
          name="paymentDate"
          type="datetime-local"
          value={payment.paymentDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          label={t('payment.notes')}
          name="notes"
          value={payment.notes}
          onChange={handleInputChange}
          multiline
          rows={2}
          fullWidth
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? t('payment.saving') : t('payment.save')}
          </Button>
          <Button variant="outlined" onClick={() => props.closeModal && props.closeModal()} disabled={loading}>
            {t('payment.cancel')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddPayment;

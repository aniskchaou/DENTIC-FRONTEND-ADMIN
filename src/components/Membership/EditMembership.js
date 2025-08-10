import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Stack, Button } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

 // Replace with your API URL

const planOptions = ['Premium', 'Standard', 'Basic'];
const statusOptions = ['Active', 'Inactive', 'Expired', 'Cancelled'];

const EditMembership = ({ membership, closeModal, onSuccess }) => {
  const [form, setForm] = useState({
    membershipPlan: '',
    paymentStatus: '',
    benefits: [],
    validityPeriod: { startDate: '', endDate: '' },
    renewalDate: '',
    lastPaymentAmount: '',
    lastPaymentDate: ''
  });

  useEffect(() => {
    if (membership) {
      setForm({
        membershipPlan: membership.membershipPlan || '',
        paymentStatus: membership.paymentStatus || '',
        benefits: membership.benefits || [],
        validityPeriod: {
          startDate: membership.validityPeriod?.startDate || '',
          endDate: membership.validityPeriod?.endDate || ''
        },
        renewalDate: membership.renewalDate || '',
        lastPaymentAmount: membership.lastPaymentAmount || '',
        lastPaymentDate: membership.lastPaymentDate || ''
      });
    }
  }, [membership]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setForm(f => ({
        ...f,
        validityPeriod: { ...f.validityPeriod, [name]: value }
      }));
    } else if (name === 'benefits') {
      setForm(f => ({
        ...f,
        benefits: value.split(',').map(b => b.trim())
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      ...form,
      id: membership.id,
      validityPeriod: {
        startDate: form.validityPeriod.startDate,
        endDate: form.validityPeriod.endDate
      }
    };
    await axios.put(`${BASE_URL}/memberships/${membership.id}`, data);
    if (onSuccess) onSuccess();
    if (closeModal) closeModal();
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <TextField
        select
        label="Membership Plan"
        name="membershipPlan"
        value={form.membershipPlan}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {planOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Payment Status"
        name="paymentStatus"
        value={form.paymentStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statusOptions.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Benefits (comma separated)"
        name="benefits"
        value={form.benefits.join(', ')}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={form.validityPeriod.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={form.validityPeriod.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Stack>
      <TextField
        label="Renewal Date"
        name="renewalDate"
        type="date"
        value={form.renewalDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Payment Amount"
        name="lastPaymentAmount"
        type="number"
        value={form.lastPaymentAmount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Payment Date"
        name="lastPaymentDate"
        type="date"
        value={form.lastPaymentDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
        <Button variant="outlined" onClick={closeModal}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default EditMembership;
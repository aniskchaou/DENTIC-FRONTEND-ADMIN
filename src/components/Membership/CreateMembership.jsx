import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Chip, Stack, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import BASE_URL from '../../main/urls/urls';

const plans = ['Basic', 'Standard', 'Premium'];
const statuses = ['Active', 'Inactive', 'Expired', 'Cancelled'];
const defaultBenefits = [
  "Free Cleanings",
  "Discounted Treatments",
  "Priority Booking",
  "Emergency Support"
];

 // Adjust as needed

const CreateMembership = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    patientId: '', // Add patientId to form state
    membershipPlan: 'Basic',
    benefits: [],
    validityPeriod: {
      startDate: '',
      endDate: ''
    },
    paymentStatus: 'Active',
    renewalDate: '',
    lastPaymentAmount: 0,
    lastPaymentDate: '',
  });
  const [benefitInput, setBenefitInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('validityPeriod.')) {
      setForm(f => ({
        ...f,
        validityPeriod: {
          ...f.validityPeriod,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput && !form.benefits.includes(benefitInput)) {
      setForm(f => ({ ...f, benefits: [...f.benefits, benefitInput] }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (benefit) => {
    setForm(f => ({ ...f, benefits: f.benefits.filter(b => b !== benefit) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const objToSend = {
      membershipPlan: form.membershipPlan,
      benefits: form.benefits,
      validityPeriod: {
        startDate: form.validityPeriod.startDate,
        endDate: form.validityPeriod.endDate
      },
      paymentStatus: form.paymentStatus,
      renewalDate: form.renewalDate,
      lastPaymentAmount: form.lastPaymentAmount,
      lastPaymentDate: form.lastPaymentDate,
    };
    console.log('Membership object to send:', objToSend); // Show object before sending
    try {
      await axios.post(`${BASE_URL}/memberships`, objToSend);
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
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
      >
        {plans.map(plan => (
          <MenuItem key={plan} value={plan}>{plan}</MenuItem>
        ))}
      </TextField>
      <Box sx={{ my: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {form.benefits.map(b => (
            <Chip
              key={b}
              label={b}
              onDelete={() => handleRemoveBenefit(b)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <TextField
            label="Add Benefit"
            value={benefitInput}
            onChange={e => setBenefitInput(e.target.value)}
            size="small"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
          />
          <Button variant="outlined" onClick={handleAddBenefit} size="small">Add</Button>
          <Button
            variant="text"
            size="small"
            onClick={() => setForm(f => ({ ...f, benefits: [...f.benefits, ...defaultBenefits.filter(db => !f.benefits.includes(db)) ] }))}
          >
            Add Defaults
          </Button>
        </Stack>
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Start Date"
          name="validityPeriod.startDate"
          type="date"
          value={form.validityPeriod.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
        <TextField
          label="End Date"
          name="validityPeriod.endDate"
          type="date"
          value={form.validityPeriod.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />
      </Stack>
      <TextField
        select
        label="Payment Status"
        name="paymentStatus"
        value={form.paymentStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {statuses.map(status => (
          <MenuItem key={status} value={status}>{status}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Renewal Date"
        name="renewalDate"
        type="date"
        value={form.renewalDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Last Payment Amount"
        name="lastPaymentAmount"
        type="number"
        value={form.lastPaymentAmount}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Last Payment Date"
        name="lastPaymentDate"
        type="date"
        value={form.lastPaymentDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="normal"
        fullWidth
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Create'}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default CreateMembership;
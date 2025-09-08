import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Stack,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import BASE_URL from '../../main/urls/urls';

const Register = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [user, setUser] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: '',
    phone: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          fullName: user.fullName,
          email: user.email,
          role: user.role.toLocaleLowerCase(),
          phone: user.phone,
          profilePicture: 'http://example.com/profile.jpg',
          birthday: user.dateOfBirth,
          gender: user.gender,
          status: user.status
        }),
      });
      if (response.ok) {
        alert('Registration successful! You can now log in.');
        history.replace('/login');
      } else {
        alert('Registration failed. Please try a different username.');
      }
    } catch (e) {
      alert('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const goToLogin = () => {
    history.replace('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafdff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("images/login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 380, width: '100%', borderRadius: 3, backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.92)' }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 64, height: 64 }}>
            <PersonAddAltIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="primary">
            Register Account
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
          <TextField label="Username" name="username" fullWidth margin="normal" variant="outlined" value={user.username} onChange={handleInputChange} inputRef={register({ required: true })} error={!!errors?.username} helperText={errors?.username && "Username is required"} autoFocus />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" variant="outlined" value={user.password} onChange={handleInputChange} inputRef={register({ required: true })} error={!!errors?.password} helperText={errors?.password && "Password is required"} />
          <TextField label="Full Name" name="fullName" fullWidth margin="normal" variant="outlined" value={user.fullName} onChange={handleInputChange} />
          <TextField label="Email" name="email" fullWidth margin="normal" variant="outlined" value={user.email} onChange={handleInputChange} />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Role</Typography>
            <select name="role" value={user.role} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}>
              <option value="">Select role</option>
              <option value="doctor">Doctor</option>
              <option value="accountant">Accountant</option>
              <option value="staff">Staff</option>
              <option value="technical">Technical</option>
            </select>
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Gender</Typography>
            <select name="gender" value={user.gender} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Birth Date</Typography>
            <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }} />
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Phone</Typography>
            <input type="tel" name="phone" value={user.phone} onChange={handleInputChange} placeholder="+1 234 567 890" style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }} />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 1, fontWeight: 600 }}
            startIcon={<PersonAddAltIcon />}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Button
            type="button"
            onClick={goToLogin}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Back to Login
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          &copy; {new Date().getFullYear()} Dentic Clinic
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
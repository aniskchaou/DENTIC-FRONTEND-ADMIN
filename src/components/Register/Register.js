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
  const [user, setUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL+'/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password }),
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
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={user.username}
            onChange={handleInputChange}
            inputRef={register({ required: true })}
            error={!!errors?.username}
            helperText={errors?.username && "Username is required"}
            autoFocus
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={user.password}
            onChange={handleInputChange}
            inputRef={register({ required: true })}
            error={!!errors?.password}
            helperText={errors?.password && "Password is required"}
          />
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
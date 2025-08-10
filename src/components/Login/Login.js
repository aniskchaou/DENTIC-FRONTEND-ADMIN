import React, { useEffect, useState } from 'react';
import './Login.css';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CurrentUser from '../../main/config/user';
import userHTTPService from '../../main/services/userHTTPService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

;

const Login = ({ handleClick }) => {
  let history = useHistory();
  var userInit = { username: "admin", password: "admin" };
  const { register, handleSubmit, errors } = useForm();
  const [user, setUser] = useState(userInit);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {}, []);

  const registerPage = () => {
    history.replace("/register");
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        username: user.username,
        password: user.password,
      });
      if (response.data && response.data.id) {
        // Save user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        handleClick(true);
        CurrentUser.USER_DETAIL = response.data;
        localStorage.setItem('connected', CurrentUser.CONNECTED_USER);
        setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
        setTimeout(() => {
          history.push("/dashboard");
        }, 800);
      } else {
        setSnackbar({ open: true, message: 'Login failed. Please check your credentials.', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Login failed. Please check your credentials.', severity: 'error' });
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
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
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="primary">
            Dentic Clinic Login
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
            startIcon={<LockOutlinedIcon />}
          >
            Sign In
          </Button>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Register
            </Button>
          </Link>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ fontWeight: 600 }}
            onClick={() => history.push('/')}
          >
            Back to Website
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          &copy; {new Date().getFullYear()} Dentic Clinic
        </Typography>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
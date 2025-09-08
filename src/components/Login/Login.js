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
import { useTranslation } from 'react-i18next';

const Login = ({ handleClick }) => {
  const { t } = useTranslation();
  let history = useHistory();
  let userInit;
  if (CurrentUser.DEMO_MODE === true) {
    userInit = { username: "admin", password: "admin" };
  } else {
    userInit = { username: "", password: "" };
  }
  const { register, handleSubmit, errors } = useForm();
  const [user, setUser] = useState(userInit);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {}, []);

  const registerPage = () => {
    history.replace("/register");
  };

  const onSubmit = async (data) => {
    try {
      // Always clear localStorage before setting new user info
      localStorage.clear();
      if (CurrentUser.DEMO_MODE === true) {
        const demoUser = { id: 1, username: "admin", role: "admin" };
        // Set CurrentUser first, then localStorage
        CurrentUser.USER_DETAIL = demoUser;
        localStorage.setItem('user', JSON.stringify(CurrentUser.USER_DETAIL));
        localStorage.setItem('connected', CurrentUser.CONNECTED_USER);
        handleClick(true);
        setTimeout(() => {
          history.push("/dashboard");
        }, 800);
        return; // Prevent further execution
      } else {
        const response = await axios.post(`${BASE_URL}/users/login`, {
          username: user.username,
          password: user.password,
        });

        if (response.data && response.data.id) {
          // Set CurrentUser first, then localStorage
          CurrentUser.USER_DETAIL = response.data;
          localStorage.setItem('user', JSON.stringify(CurrentUser.USER_DETAIL));
          localStorage.setItem('connected', CurrentUser.CONNECTED_USER);
          handleClick(true);
          setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
          setTimeout(() => {
            history.push("/dashboard");
          }, 800);
        } else {
          setSnackbar({ open: true, message: 'Login failed. Please check your credentials.', severity: 'error' });
        }
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
            {t('login.title')}
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
          <TextField
            label={t('login.username')}
            name="username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={user.username}
            onChange={handleInputChange}
            inputRef={register({ required: true })}
            error={!!errors?.username}
            helperText={errors?.username && t('login.username_required')}
            autoFocus
          />
          <TextField
            label={t('login.password')}
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={user.password}
            onChange={handleInputChange}
            inputRef={register({ required: true })}
            error={!!errors?.password}
            helperText={errors?.password && t('login.password_required')}
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
            {t('login.sign_in')}
          </Button>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 1, fontWeight: 600 }}
            >
              {t('login.register')}
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
            {t('login.back_to_website')}
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
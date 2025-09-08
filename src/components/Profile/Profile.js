import React from 'react';
import { useState } from 'react';
import { Modal, Box, Button, TextField, Stack } from '@mui/material';
import axios from 'axios';
// import CurrentUser from '../../main/config/user';

const Profile = () => {
  let userInit = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: '',
    phone: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: '',
    status: '',
    id: ''
  };
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      userInit = { ...userInit, ...storedUser };
    }
  } catch {}

  const [user, setUser] = useState(userInit);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/users/${user.id || user._id || 122}`, {
        username: user.username,
        password: user.password,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        birthday: user.dateOfBirth,
        gender: user.gender,
        status: user.status
      });
      setLoading(false);
      setOpen(false);
      // Optionally update localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setLoading(false);
      alert('Failed to update profile');
    }
  };

  return (
    <div
      className="Profile"
      style={{
        width: 100 + '%', // Full width of parent/container
        maxWidth: 520,    // Increased max width for better layout
        minWidth: 320,    // Minimum width for mobile
        margin: '40px auto',
        padding: 0,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
          padding: 36,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: '#e3f2fd',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(25,118,210,0.08)',
            cursor: 'pointer',
          }}
          title="Edit Profile"
          onClick={handleOpen}
        >
          <i className="fas fa-user-edit" style={{ color: '#1976d2', fontSize: 18 }}></i>
        </div>
      {/* Edit Profile Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Username" name="username" value={user.username} onChange={handleChange} fullWidth />
              <TextField label="Password" name="password" type="password" value={user.password} onChange={handleChange} fullWidth />
              <TextField label="Full Name" name="fullName" value={user.fullName} onChange={handleChange} fullWidth />
              <TextField label="Email" name="email" value={user.email} onChange={handleChange} fullWidth />
              <TextField label="Phone" name="phone" value={user.phone} onChange={handleChange} fullWidth />
              <Box>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Birth Date</label>
                <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }} />
              </Box>
              <Box>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Gender</label>
                <select name="gender" value={user.gender} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Box>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              <Button onClick={handleClose} variant="outlined">Cancel</Button>
            </Stack>
          </form>
        </Box>
      </Modal>
        <div style={{ marginBottom: 18 }}>
          <img
            className="rounded-circle"
            alt="Profile"
            src={"images/admin.png"}
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '5px solid #1976d2',
              boxShadow: '0 4px 16px rgba(25,118,210,0.12)',
              marginBottom: 8,
            }}
          />
        </div>
        <h2 style={{ margin: '10px 0 2px', color: '#1976d2', fontWeight: 800, letterSpacing: 0.5 }}>
          {user.fullName || user.username}
        </h2>
        <div
          style={{
            color: '#fff',
            background: '#1976d2',
            display: 'inline-block',
            borderRadius: 8,
            padding: '2px 16px',
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 18,
            marginTop: 4,
            letterSpacing: 0.2,
          }}
        >
          {user.role}
        </div>
        <div
          style={{
            textAlign: 'left',
            margin: '0 auto',
            maxWidth: 320,
            marginTop: 18,
            fontSize: 16,
          }}
        >
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-user" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Username:</span>
            <span style={{ marginLeft: 8 }}>{user.username}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-envelope" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Email:</span>
            <span style={{ marginLeft: 8 }}>{user.email}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-phone" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Phone:</span>
            <span style={{ marginLeft: 8 }}>{user.phone}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-birthday-cake" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Birth date:</span>
            <span style={{ marginLeft: 8 }}>{user.dateOfBirth ? (typeof user.dateOfBirth === 'string' ? user.dateOfBirth.substring(0, 10) : new Date(user.dateOfBirth).toISOString().substring(0, 10)) : '-'}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-venus-mars" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Gender:</span>
            <span style={{ marginLeft: 8 }}>{user.gender}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-user-tag" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Status:</span>
            <span style={{ marginLeft: 8 }}>{user.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
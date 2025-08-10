import React from 'react';
import CurrentUser from '../../main/config/user';

const Profile = () => {
  const user = CurrentUser.USER_DETAIL;

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
        >
          <i className="fas fa-user-edit" style={{ color: '#1976d2', fontSize: 18 }}></i>
        </div>
        <div style={{ marginBottom: 18 }}>
          <img
            className="rounded-circle"
            alt="Profile"
            src="images/admin.png"
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
          {user.name}
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
            <i className="fas fa-birthday-cake" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Birth date:</span>
            <span style={{ marginLeft: 8 }}>{user.birthday?.substring(0, 10) || '-'}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-envelope" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Email:</span>
            <span style={{ marginLeft: 8 }}>{user.email}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-phone" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Telephone:</span>
            <span style={{ marginLeft: 8 }}>{user.telephone}</span>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-map-marker-alt" style={{ color: '#1976d2', marginRight: 10 }}></i>
            <span style={{ fontWeight: 600, color: '#1976d2', minWidth: 90 }}>Address:</span>
            <span style={{ marginLeft: 8 }}>{user.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
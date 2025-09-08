import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress, Rating, Typography, IconButton, Menu, MenuItem, Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, Stack, Skeleton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddDoctor from './AddDoctor';
import EditDoctor from './EditDoctor';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Doctors = () => {
  const { t } = useTranslation();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Profile Matcher AI states
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matcherPatientAge, setMatcherPatientAge] = useState('');
  const [matcherSymptoms, setMatcherSymptoms] = useState('');
  const [matcherDiagnosis, setMatcherDiagnosis] = useState('');
  const [matcherResult, setMatcherResult] = useState(null);

  // Grant Access states
  const [grantAccessOpen, setGrantAccessOpen] = useState(false);
  const [grantAccessDoctor, setGrantAccessDoctor] = useState(null);
  const [grantForm, setGrantForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "DOCTOR",
    phone: "",
    profilePicture: "",
    dateOfBirth: "",
    gender: "",
    status: "Active"
  });

  const roleOptions = ["DOCTOR"];

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/doctors`)
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, []);

    // Refresh doctors list
    const handleRefresh = () => {
      setLoading(true);
      axios.get(`${BASE_URL}/doctors`)
        .then((res) => setDoctors(res.data))
        .finally(() => setLoading(false));
    };

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleActionEdit = () => {
    setEditOpen(true);
    setSelectedDoctor(actionRow);
    handleActionClose();
  };

  const handleActionView = () => {
    setSelectedDoctor(actionRow);
    setViewOpen(true);
    setActionAnchorEl(null);
  };

  const handleActionDelete = () => {
    if (!actionRow || !actionRow.id) {
      handleActionClose();
      return;
    }
    setLoading(true);
    axios.delete(`${BASE_URL}/doctors/${actionRow.id}`)
      .then(() => {
        setDoctors(prev => prev.filter(doc => doc.id !== actionRow.id));
      })
      .finally(() => {
        setLoading(false);
        handleActionClose();
      });
  };

  const columns = [
    { field: 'licenseNumber', headerName: t('doctors.license_number'), width: 150 },
    {
      field: 'specialization',
      headerName: t('doctors.specialization'),
      width: 180,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" variant="outlined" />
      ),
    },
    {
      field: 'experienceYears',
      headerName: t('doctors.experience_years'),
      width: 160,
      type: 'number',
      renderCell: (params) => (
        <Chip label={`${params.value} ${t('doctors.years')}`} color="success" variant="outlined" />
      ),
    },
    {
      field: 'consultationFee',
      headerName: t('doctors.fee'),
      width: 120,
      renderCell: (params) => (
        <Chip label={`$${parseFloat(params.value).toFixed(2)}`} color="info" variant="outlined" />
      ),
    },
    {
      field: 'availableDays',
      headerName: t('doctors.available_days'),
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((day, idx) => (
            <Chip key={idx} label={t(`configuration.days.${day}`)} color="default" size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      field: 'availableTimeSlots',
      headerName: t('doctors.time_slots'),
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((slot, index) => (
            <Chip
              key={index}
              label={`${slot.startTime} - ${slot.endTime}`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'rating',
      headerName: t('doctors.rating'),
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={params.value} precision={0.1} readOnly />
          <Chip label={params.value} color="warning" variant="outlined" />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: t('doctors.actions'),
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={e => handleActionClick(e, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <IconButton
            size="small"
            color="success"
            title="Grant Access"
            onClick={() => handleGrantAccess(params.row)}
          >
            <LockOpenIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Widget summary data
  const totalDoctors = doctors.length;
  const specializations = doctors.reduce((acc, d) => {
    acc[d.specialization] = (acc[d.specialization] || 0) + 1;
    return acc;
  }, {});
  const avgRating = doctors.length ? (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(2) : 0;
  const avgExperience = doctors.length ? (doctors.reduce((sum, d) => sum + (d.experienceYears || 0), 0) / doctors.length).toFixed(1) : 0;

  // Chart data
  const doughnutData = {
    labels: Object.keys(specializations),
    datasets: [{
      data: Object.values(specializations),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(specializations),
    datasets: [{
      label: t('doctors.chart_doctors_per_specialization'),
      data: Object.values(specializations),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(specializations),
    datasets: [
      {
        label: t('doctors.chart_avg_rating'),
        data: Object.keys(specializations).map(spec =>
          doctors.filter(d => d.specialization === spec).reduce((sum, d) => sum + (d.rating || 0), 0) /
          (doctors.filter(d => d.specialization === spec).length || 1)
        ),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: t('doctors.chart_avg_experience'),
        data: Object.keys(specializations).map(spec =>
          doctors.filter(d => d.specialization === spec).reduce((sum, d) => sum + (d.experienceYears || 0), 0) /
          (doctors.filter(d => d.specialization === spec).length || 1)
        ),
        borderColor: '#ffa000',
        fill: false,
      }
    ]
  };

  // Profile Matcher AI function
  const handleProfileMatcher = async () => {
    setMatcherLoading(true);
    setMatcherResult(null);
    try {
      const patientCase = {
        age: Number(matcherPatientAge),
        symptoms: matcherSymptoms.split(',').map(s => s.trim()).filter(Boolean),
        diagnosis: matcherDiagnosis
      };
      const doctorList = doctors.map(d => ({
        id: d.id,
        name: d.fullName,
        specialization: d.specialization
      }));
      const payload = { patientCase, doctorList };
      const res = await axios.post(`${BASE_URL}/ai/profile-matcher`, payload);
      setMatcherResult(res.data || {});
    } catch {
      setMatcherResult({ error: t('doctors.error_matching_doctor') });
    }
    setMatcherLoading(false);
  };

  const generateUsername = (fullName, email, id) => {
    if (email) return email.split('@')[0];
    if (fullName) return fullName.replace(/\s+/g, '').toLowerCase();
    return `doctor${id}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleGrantAccess = (doctor) => {
    setGrantAccessDoctor(doctor);
    setGrantForm({
      username: doctor.username || (doctor.email ? doctor.email.split('@')[0] : `doctor${doctor.id}`),
      password: "",
      fullName: doctor.fullName,
      email: doctor.email,
      role: "DOCTOR",
      phone: doctor.phone,
      profilePicture: doctor.profilePicture || "http://placehold.it/100x100",
      dateOfBirth: doctor.dateOfBirth || "",
      gender: doctor.gender || "",
      status: doctor.status || "Active"
    });
    setGrantAccessOpen(true);
  };

  const handleGrantFormChange = (e) => {
    const { name, value } = e.target;
    setGrantForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGrantFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/users`, {
        ...grantForm,
        createdAt: grantAccessDoctor.createdAt,
        updatedAt: grantAccessDoctor.updatedAt
      });
      alert("Access granted and user created!");
      setGrantAccessOpen(false);
    } catch (err) {
      alert("Failed to grant access.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-user-md"></i> {t('doctors.title')}</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('doctors.total_doctors')}</Typography>
          <Typography variant="h6">{totalDoctors}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">{t('doctors.avg_rating')}</Typography>
          <Typography variant="h6">{avgRating}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">{t('doctors.avg_experience')}</Typography>
          <Typography variant="h6">{avgExperience} {t('doctors.years')}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('doctors.chart_doctors_by_specialization')}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('doctors.chart_doctors_per_specialization')}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('doctors.chart_rating_experience_trends')}</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600 }}
            onClick={() => setAddOpen(true)}
            startIcon={<i className="fas fa-plus"></i>}
          >
            {t('doctors.create_doctor')}
          </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ fontWeight: 600 }}
              onClick={handleRefresh}
              startIcon={<i className="fas fa-sync"></i>}
            >
              {t('common.refresh') || 'Refresh'}
            </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<PersonSearchIcon />}
            sx={{ fontWeight: 600 }}
            onClick={() => setMatcherOpen(true)}
          >
            {t('doctors.ai_profile_matcher')}
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ height: 600, width: '100%' }}>
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={100} sx={{ mb: 2 }} />
            ))}
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={doctors}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
              rowHeight={110}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleActionView}>{t('doctors.view')}</MenuItem>
              <MenuItem onClick={() => {
                setEditOpen(true);
                setSelectedDoctor(actionRow);
                handleActionClose();
              }}>
                {t('doctors.edit')}
              </MenuItem>
              <MenuItem onClick={handleActionDelete}>{t('doctors.delete')}</MenuItem>
            </Menu>
          </Box>
        )}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('doctors.create_doctor')}</DialogTitle>
          <DialogContent>
            <AddDoctor
              closeModal={() => setAddOpen(false)}
              onCreate={() => {
                setAddOpen(false);
                setLoading(true);
                axios.get(`${BASE_URL}/doctors`)
                  .then((res) => setDoctors(res.data))
                  .finally(() => setLoading(false));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">{t('doctors.close')}</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('doctors.edit_doctor')}</DialogTitle>
          <DialogContent>
            <EditDoctor
              doctor={selectedDoctor}
              closeModal={() => setEditOpen(false)}
              onEdit={() => {
                setEditOpen(false);
                setLoading(true);
                axios.get(`${BASE_URL}/doctors`)
                  .then((res) => setDoctors(res.data))
                  .finally(() => setLoading(false));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">{t('doctors.close')}</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                <i className="fas fa-user-md" style={{ fontSize: 32, color: "#fff" }}></i>
              </Avatar>
              <Typography variant="h5" color="primary">
                {selectedDoctor?.fullName || t('doctors.doctor_details')}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedDoctor ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('doctors.general_info')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>{t('doctors.license_number')}:</b> {selectedDoctor.licenseNumber}</Typography>
                    <Typography><b>{t('doctors.specialization')}:</b> <Chip label={selectedDoctor.specialization} color="primary" /></Typography>
                    <Typography><b>{t('doctors.experience')}:</b> <Chip label={`${selectedDoctor.experienceYears} ${t('doctors.years')}`} color="success" /></Typography>
                    <Typography><b>{t('doctors.consultation_fee')}:</b> <Chip label={`$${selectedDoctor.consultationFee}`} color="info" /></Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('doctors.availability')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography><b>{t('doctors.available_days')}:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {(selectedDoctor.availableDays || []).map((day, idx) => (
                        <Chip key={idx} label={t(`configuration.days.${day}`)} variant="outlined" />
                      ))}
                    </Box>
                    <Typography><b>{t('doctors.time_slots')}:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(selectedDoctor.availableTimeSlots || []).map((slot, idx) => (
                        <Chip key={idx} label={`${slot.startTime} - ${slot.endTime}`} color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">{t('doctors.rating')}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={selectedDoctor.rating} precision={0.1} readOnly />
                      <Chip label={selectedDoctor.rating} color="warning" />
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <b>{t('doctors.created_at')}:</b> {selectedDoctor.createdAt ? new Date(selectedDoctor.createdAt).toLocaleString() : '-'}<br />
                      <b>{t('doctors.updated_at')}:</b> {selectedDoctor.updatedAt ? new Date(selectedDoctor.updatedAt).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Typography>{t('doctors.no_doctor_selected')}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary" variant="contained">
              {t('doctors.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Profile Matcher AI Dialog */}
        <Dialog open={matcherOpen} onClose={() => setMatcherOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('doctors.ai_profile_matcher')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t('doctors.profile_matcher_description')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleProfileMatcher();
              }}
              style={{ marginBottom: 16 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">{t('doctors.patient_age')}</Typography>
                  <input
                    type="number"
                    value={matcherPatientAge}
                    onChange={e => setMatcherPatientAge(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder={t('doctors.patient_age_placeholder')}
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('doctors.symptoms')}</Typography>
                  <input
                    type="text"
                    value={matcherSymptoms}
                    onChange={e => setMatcherSymptoms(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder={t('doctors.symptoms_placeholder')}
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2">{t('doctors.diagnosis')}</Typography>
                  <input
                    type="text"
                    value={matcherDiagnosis}
                    onChange={e => setMatcherDiagnosis(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #90caf9', fontSize: 16 }}
                    placeholder={t('doctors.diagnosis_placeholder')}
                    required
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="info"
                  type="submit"
                  disabled={matcherLoading || !matcherPatientAge || !matcherSymptoms || !matcherDiagnosis}
                >
                  {t('doctors.match')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setMatcherOpen(false)}
                >
                  {t('doctors.close')}
                </Button>
              </Box>
            </form>
            {matcherLoading && <LinearProgress sx={{ mt: 2 }} />}
            {matcherResult && (
              <Box sx={{ mt: 3 }}>
                {matcherResult.error ? (
                  <Typography color="error">{matcherResult.error}</Typography>
                ) : (
                  matcherResult.doctorId ? (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('doctors.best_match')}</Typography>
                      <Typography variant="body1">
                        <b>{matcherResult.doctorName}</b> ({matcherResult.specialization})
                      </Typography>
                    </>
                  ) : (
                    <Typography color="warning.main">{t('doctors.no_suitable_doctor')}</Typography>
                  )
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Grant Access Modal */}
        <Dialog open={grantAccessOpen} onClose={() => setGrantAccessOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Grant Access</DialogTitle>
          <DialogContent>
            <form onSubmit={handleGrantFormSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input
                    type="text"
                    name="username"
                    value={grantForm.username}
                    onChange={handleGrantFormChange}
                    placeholder="Username"
                    className="form-control"
                    required
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      setGrantForm(prev => ({
                        ...prev,
                        username: generateUsername(grantForm.fullName, grantForm.email, grantAccessDoctor?.id)
                      }))
                    }
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Generate Username
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input
                    type="password"
                    name="password"
                    value={grantForm.password}
                    onChange={handleGrantFormChange}
                    placeholder="Password"
                    className="form-control"
                    required
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      setGrantForm(prev => ({
                        ...prev,
                        password: generatePassword()
                      }))
                    }
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Generate Password
                  </Button>
                </Box>
                <input
                  type="text"
                  name="fullName"
                  value={grantForm.fullName}
                  onChange={handleGrantFormChange}
                  placeholder="Full Name"
                  className="form-control"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={grantForm.email}
                  onChange={handleGrantFormChange}
                  placeholder="Email"
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={grantForm.phone}
                  onChange={handleGrantFormChange}
                  placeholder="Phone"
                  className="form-control"
                />
                <input
                  type="text"
                  name="profilePicture"
                  value={grantForm.profilePicture}
                  onChange={handleGrantFormChange}
                  placeholder="Profile Picture URL"
                  className="form-control"
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={grantForm.dateOfBirth ? grantForm.dateOfBirth.substring(0,10) : ""}
                  onChange={handleGrantFormChange}
                  className="form-control"
                />
                <select
                  name="gender"
                  value={grantForm.gender}
                  onChange={handleGrantFormChange}
                  className="form-control"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  name="status"
                  value={grantForm.status}
                  onChange={handleGrantFormChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
                <select
                  name="role"
                  value={grantForm.role}
                  onChange={handleGrantFormChange}
                  className="form-control"
                  required
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </Box>
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setGrantAccessOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Grant Access
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Doctors;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, IconButton, Menu, MenuItem, Chip, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // <-- Add Chip import
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddStaff from './AddStaff';
import ViewStaff from './ViewStaff'; // Add this import at the top
import EditStaff from './EditStaff'; // Add this import at the top
import { useTranslation } from 'react-i18next';
import LockOpenIcon from '@mui/icons-material/LockOpen';

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Staff = () => {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false); // Add this state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // Add this state
  const [grantAccessOpen, setGrantAccessOpen] = useState(false);
  const [grantAccessStaff, setGrantAccessStaff] = useState(null);
  const [grantForm, setGrantForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "STAFF",
    phone: "",
    profilePicture: "http://placehold.it/100x100",
    dateOfBirth: "",
    gender: "",
    status: "Active"
  });

  const closeButtonEdit = useRef(null);

  const fetchStaff = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/staff`)
      .then(res => setStaffList(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const refresh = () => {
    fetchStaff();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const staffMember = staffList.find(s => s.id === ids[0]);
      setSelectedStaff(staffMember);
      setSelectedStaffId(ids[0]);
    } else {
      setSelectedStaff(null);
      setSelectedStaffId(null);
    }
  };

  const handleDelete = () => {
    if (selectedStaffId && window.confirm('Are you sure you want to delete this staff member?')) {
      axios.delete(`${BASE_URL}/staff/${selectedStaffId}`)
        .then(() => refresh());
    }
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
    setSelectedStaff(actionRow);
    setSelectedStaffId(actionRow.id);
    setEditOpen(true);
    handleActionClose();
  };

  const handleActionDelete = () => {
    setSelectedStaff(actionRow);
    setSelectedStaffId(actionRow.id);
    handleDelete();
    handleActionClose();
  };

  const handleActionView = () => {
    setSelectedStaff(actionRow);
    setViewOpen(true);
    handleActionClose();
  };

  const handleGrantAccess = (staff) => {
    setGrantAccessStaff(staff);
    setGrantForm({
      username: staff.username || (staff.email ? staff.email.split('@')[0] : `staff${staff.id}`),
      password: "",
      fullName: staff.fullName,
      email: staff.email,
      role: "STAFF",
      phone: staff.phone,
      profilePicture: staff.profilePicture || "http://placehold.it/100x100",
      dateOfBirth: staff.dateOfBirth || "",
      gender: staff.gender || "",
      status: staff.status || "Active"
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
        createdAt: grantAccessStaff.createdAt,
        updatedAt: grantAccessStaff.updatedAt
      });
      alert("Access granted and user created!");
      setGrantAccessOpen(false);
    } catch (err) {
      alert("Failed to grant access.");
    }
  };

  const generateUsername = (fullName, email, id) => {
    if (email) return email.split('@')[0];
    if (fullName) return fullName.replace(/\s+/g, '').toLowerCase();
    return `staff${id}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  // Widget summary data
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'Active').length;
  const onLeaveStaff = staffList.filter(s => s.status === 'On Leave').length;
  const inactiveStaff = staffList.filter(s => s.status === 'Inactive').length;

  // Group by role
  const roleCounts = staffList.reduce((acc, s) => {
    const role = s.role || 'Other';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const doughnutData = {
    labels: Object.keys(roleCounts),
    datasets: [{
      data: Object.values(roleCounts),
      backgroundColor: ['#43a047', '#ffa000', '#1976d2', '#e53935', '#8e24aa', '#00bcd4'],
    }]
  };

  const barData = {
    labels: Object.keys(roleCounts),
    datasets: [{
      label: 'Staff per Role',
      data: Object.values(roleCounts),
      backgroundColor: '#1976d2'
    }]
  };

  const lineData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: 'Active',
        data: Object.keys(roleCounts).map(role => staffList.filter(s => (s.role || 'Other') === role && s.status === 'Active').length),
        borderColor: '#43a047',
        fill: false,
      },
      {
        label: 'On Leave',
        data: Object.keys(roleCounts).map(role => staffList.filter(s => (s.role || 'Other') === role && s.status === 'On Leave').length),
        borderColor: '#ffa000',
        fill: false,
      },
      {
        label: 'Inactive',
        data: Object.keys(roleCounts).map(role => staffList.filter(s => (s.role || 'Other') === role && s.status === 'Inactive').length),
        borderColor: '#e53935',
        fill: false,
      }
    ]
  };

  const columns = [
    { field: 'fullName', headerName: t('staff.full_name'), width: 200 },
    { field: 'role', headerName: t('staff.role'), width: 130 },
    { field: 'email', headerName: t('staff.email'), width: 230 },
    { field: 'phone', headerName: t('staff.phone'), width: 150 },
    {
      field: 'status',
      headerName: t('staff.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`staff.status_${params.value.replace(/\s/g, '_').toLowerCase()}`)}
          color={
            params.value === 'Active'
              ? 'success'
              : params.value === 'Inactive'
              ? 'default'
              : params.value === 'On Leave'
              ? 'warning'
              : 'primary'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('staff.actions'),
      width: 160,
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

  const roleOptions = ["STAFF", "ACCOUNTANT", "TECHNICAL"];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-user-md"></i> {t('staff.title')}</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">{t('staff.total_staff')||'Total staff'}</Typography>
          <Typography variant="h6">{totalStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">{t('staff.active')||'Active'}</Typography>
          <Typography variant="h6">{activeStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">{t('staff.on_leave')||'On leave'}</Typography>
          <Typography variant="h6">{onLeaveStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="error.main">{t('staff.inactive')||'Inactive'}</Typography>
          <Typography variant="h6">{inactiveStaff}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('staff.staff_by_role')||'Staff by role'}</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('staff.staff_per_role')||'Staff per role'}</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">{t('staff.status_trends_by_role')||'Status trends by role'}</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="far fa-plus-square"></i>}
            onClick={() => setAddOpen(true)}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            {t('staff.add')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-edit"></i>}
            onClick={() => setEditOpen(true)}
            disabled={!selectedStaff}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            {t('staff.edit')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-trash-alt"></i>}
            onClick={handleDelete}
            disabled={!selectedStaffId}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            {t('staff.delete')}
          </Button>
          <Button
            variant="outlined"
            color="info"
            startIcon={<i className="fas fa-sync-alt"></i>}
            onClick={refresh}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            {t('staff.refresh')}
          </Button>
        </Box>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 480, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={staffList}
              getRowId={row => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
            <Menu
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleActionView}>{t('staff.view')}</MenuItem>
              <MenuItem onClick={handleActionEdit}>{t('staff.edit')}</MenuItem>
              <MenuItem onClick={handleActionDelete}>{t('staff.delete')}</MenuItem>
            </Menu>
          </div>
        )}

        {/* Add Staff Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('staff.add_new')}</DialogTitle>
          <DialogContent>
            <AddStaff closeModal={() => setAddOpen(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">
              {t('staff.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Staff Modal */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <EditStaff staff={selectedStaff} closeModal={() => setEditOpen(false)} />
        </Dialog>

        {/* View Staff Dialog */}
        <ViewStaff
          staff={selectedStaff}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />

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
                        username: generateUsername(grantForm.fullName, grantForm.email, grantAccessStaff?.id)
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

export default Staff;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, IconButton, Menu, MenuItem, Chip, Box, Typography, Button } from '@mui/material'; // <-- Add Chip import
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import BASE_URL from '../../main/urls/urls';
import AddStaff from './AddStaff';
import ViewStaff from './ViewStaff'; // Add this import at the top
import EditStaff from './EditStaff'; // Add this import at the top

Chart.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false); // Add this state

  const closeButtonAdd = useRef(null);
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
    document.querySelector('[data-target="#editStaffModal"]').click();
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
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
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
      headerName: 'Actions',
      width: 100,
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
        </>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-user-md"></i> Staff</h4>
      </div>

      {/* Widgets row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1, bgcolor: '#e3f2fd', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary">Total Staff</Typography>
          <Typography variant="h6">{totalStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="success.main">Active</Typography>
          <Typography variant="h6">{activeStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#fffde7', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="warning.main">On Leave</Typography>
          <Typography variant="h6">{onLeaveStaff}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="error.main">Inactive</Typography>
          <Typography variant="h6">{inactiveStaff}</Typography>
        </Box>
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Staff by Role</Typography>
          <Doughnut data={doughnutData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Staff per Role</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ minWidth: 320, flex: 1, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" align="center">Status Trends by Role</Typography>
          <Line data={lineData} />
        </Box>
      </Box>

      <div className="card-body">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="far fa-plus-square"></i>}
            onClick={() => document.querySelector('[data-target="#addStaffModal"]').click()}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            Add Staff
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-edit"></i>}
            onClick={() => document.querySelector('[data-target="#editStaffModal"]').click()}
            disabled={!selectedStaff}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<i className="fas fa-trash-alt"></i>}
            onClick={handleDelete}
            disabled={!selectedStaffId}
            sx={{ fontWeight: 600, minWidth: 120 }}
          >
            Delete
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
              <MenuItem onClick={handleActionView}>View</MenuItem>
              <MenuItem onClick={handleActionEdit}>Edit</MenuItem>
              <MenuItem onClick={handleActionDelete}>Delete</MenuItem>
            </Menu>
          </div>
        )}

        {/* Add Staff Modal */}
        <div className="modal fade" id="addStaffModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Staff</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* AddStaff form component here */}
                <AddStaff closeModal={() => closeButtonAdd.current.click()} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Staff Modal */}
        <div className="modal fade" id="editStaffModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Staff</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* EditStaff form component here */}
                <EditStaff staff={selectedStaff} closeModal={() => closeButtonEdit.current.click()} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonEdit}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Staff Dialog */}
        <ViewStaff
          staff={selectedStaff}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />

      </div>
    </div>
  );
};

export default Staff;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Chip, IconButton, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BASE_URL from '../../main/urls/urls';
import AddProcedure from './AddProcedure';
import EditProcedure from './EditProcedure';

const ViewProcedure = ({ procedure, onClose }) => {
  if (!procedure) return null;
  return (
    <Dialog open={!!procedure} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>View Procedure</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div><strong>Name:</strong> {procedure.procedureName}</div>
          <div><strong>Duration:</strong> {procedure.duration} mins</div>
          <div><strong>Anesthesia:</strong> {procedure.anesthesiaType}</div>
          <div><strong>Status:</strong> {procedure.status}</div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedProcedureId, setSelectedProcedureId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Material-UI modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProcedures = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/procedures`)
      .then(res => setProcedures(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const refresh = () => {
    fetchProcedures();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const proc = procedures.find(p => p.id === ids[0]);
      setSelectedProcedure(proc);
      setSelectedProcedureId(ids[0]);
    } else {
      setSelectedProcedure(null);
      setSelectedProcedureId(null);
    }
  };

  const handleDelete = () => {
    if (selectedProcedureId && window.confirm('Delete selected procedure?')) {
      axios.delete(`${BASE_URL}/procedures/${selectedProcedureId}`)
        .then(() => refresh());
    }
  };

  // Actions menu handlers
  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleActionEdit = () => {
    setSelectedProcedure(actionRow);
    setSelectedProcedureId(actionRow.id);
    setEditOpen(true);
    handleActionClose();
  };

  const handleActionDelete = () => {
    setSelectedProcedure(actionRow);
    setSelectedProcedureId(actionRow.id);
    handleDelete();
    handleActionClose();
  };

  const handleActionView = () => {
    setSelectedProcedure(actionRow);
    setViewOpen(true);
    handleActionClose();
  };

  const columns = [
    { field: 'procedureName', headerName: 'Procedure Name', width: 150 },
    { field: 'duration', headerName: 'Duration (mins)', width: 130 },
    { field: 'anesthesiaType', headerName: 'Anesthesia Type', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Completed'
              ? 'success'
              : params.value === 'Scheduled'
              ? 'primary'
              : params.value === 'Cancelled'
              ? 'error'
              : 'default'
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
        <h4><i className="fas fa-procedures"></i> Procedures</h4>
      </div>

      <div className="card-body">
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setAddOpen(true)}
            startIcon={<i className="far fa-plus-square"></i>}
          >
            Add Procedure
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditOpen(true)}
            startIcon={<i className="fas fa-edit"></i>}
            disabled={!selectedProcedure}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDelete}
            startIcon={<i className="fas fa-trash-alt"></i>}
            disabled={!selectedProcedureId}
          >
            Delete
          </Button>
        </Stack>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={procedures}
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
              <MenuItem onClick={handleActionView}>
                <i className="fas fa-eye" style={{ marginRight: 8, color: '#1976d2' }} />
                View Procedure
              </MenuItem>
              <MenuItem onClick={handleActionEdit}>
                <i className="fas fa-edit" style={{ marginRight: 8, color: '#ffa000' }} />
                Edit Procedure
              </MenuItem>
              <MenuItem onClick={handleActionDelete}>
                <i className="fas fa-trash-alt" style={{ marginRight: 8, color: '#e53935' }} />
                Delete Procedure
              </MenuItem>
            </Menu>
          </div>
        )}

        {/* Material-UI Add Procedure Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Procedure</DialogTitle>
          <DialogContent>
            <AddProcedure
              closeModal={() => setAddOpen(false)}
              onCreate={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI Edit Procedure Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Procedure</DialogTitle>
          <DialogContent>
            <EditProcedure
              procedure={selectedProcedure}
              closeModal={() => setEditOpen(false)}
              onSuccess={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI View Procedure Dialog */}
        <ViewProcedure
          procedure={viewOpen ? selectedProcedure : null}
          onClose={() => setViewOpen(false)}
        />
      </div>
    </div>
  );
};

export default Procedures;

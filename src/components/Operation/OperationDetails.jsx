import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Chip, IconButton, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BASE_URL from '../../main/urls/urls';
import AddOperation from './AddOperation'; // Make sure this path is correct
import EditOperation from './EditOperation'; // <-- Import your EditOperation component

const Operations = () => {
  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedOperationId, setSelectedOperationId] = useState(null);
  const [loading, setLoading] = useState(false);

  // For actions menu
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  // Material-UI modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // <-- Add edit modal state

  const fetchOperations = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/operations`)
      .then(res => setOperations(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const refresh = () => {
    fetchOperations();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const op = operations.find(op => op.id === ids[0]);
      setSelectedOperation(op);
      setSelectedOperationId(ids[0]);
    } else {
      setSelectedOperation(null);
      setSelectedOperationId(null);
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
    setSelectedOperation(actionRow);
    setSelectedOperationId(actionRow.id);
    setEditOpen(true); // <-- Open edit modal
    handleActionClose();
  };

  const handleActionDelete = () => {
    setSelectedOperation(actionRow);
    setSelectedOperationId(actionRow.id);
    if (actionRow?.id && window.confirm('Are you sure you want to delete this operation?')) {
      axios.delete(`${BASE_URL}/operations/${actionRow.id}`)
        .then(() => refresh());
    }
    handleActionClose();
  };

  const columns = [
    { field: 'operationType', headerName: 'Type', width: 150 },
    { field: 'procedureName', headerName: 'Procedure', width: 200 },
    {
      field: 'operationDate',
      headerName: 'Date',
      width: 180,
      valueFormatter: params => new Date(params.value).toLocaleString()
    },
    { field: 'duration', headerName: 'Duration (min)', width: 150 },
    { field: 'anesthesiaType', headerName: 'Anesthesia', width: 150 },
    { field: 'complications', headerName: 'Complications', width: 200 },
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
      field: 'followUpRequired',
      headerName: 'Follow-Up Required',
      width: 170
    },
    {
      field: 'followUpDate',
      headerName: 'Follow-Up Date',
      width: 180,
      valueFormatter: params => params.value ? new Date(params.value).toLocaleString() : ''
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
        <h4><i className="fas fa-procedures"></i> Operations</h4>
      </div>

      <div className="card-body">
        {/* Material-UI Add Operation Button */}
        <Button
          variant="outlined"
          color="success"
          sx={{ mb: 2, mr: 2 }}
          onClick={() => setAddOpen(true)}
          startIcon={<i className="far fa-plus-square"></i>}
        >
          Add Operation
        </Button>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={operations}
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
              <MenuItem onClick={handleActionEdit}>Edit</MenuItem>
              <MenuItem onClick={handleActionDelete}>Delete</MenuItem>
            </Menu>
          </div>
        )}

        {/* Material-UI Add Operation Dialog */}
        <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Operation</DialogTitle>
          <DialogContent>
            <AddOperation
              closeModal={() => setAddOpen(false)}
              onCreate={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI Edit Operation Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Operation</DialogTitle>
          <DialogContent>
            <EditOperation
              operation={selectedOperation}
              closeModal={() => setEditOpen(false)}
              onEdit={refresh}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Operations;

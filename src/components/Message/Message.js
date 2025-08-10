import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { LoadJSFiles } from '../init';
import messageHTTPService from '../../main/services/messageHTTPService';
import showMessage from '../../libraries/messages/messages';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
  Divider,
  Stack
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import CurrentUser from '../../main/config/user';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    LoadJSFiles();
    getAllMessages();
  }, []);

  const getAllMessages = () => {
    setLoading(true);
    messageHTTPService.getAllMessage()
      .then(response => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (selectedMessage) {
      messageHTTPService.removeMessage(selectedMessage)
        .then(() => {
          showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success');
          getAllMessages();
        })
        .catch(() => {
          showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        });
    }
    setOpenConfirmDialog(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMessages = messages.filter(message =>
    message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'name', headerName: 'From', width: 200 },
    { field: 'subject', headerName: 'Subject', width: 200 },
    { field: 'message', headerName: 'Message', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedMessage(params.row);
                setOpenViewDialog(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="secondary"
              onClick={() => {
                setSelectedMessage(params.row);
                setOpenConfirmDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> Messages
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={handleSearch}
        />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </div>
        ) : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={filteredMessages}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* View Message Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#fafdff',
              boxShadow: 6,
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', pb: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            View Message
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            {selectedMessage && (
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedMessage.name}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <EmailIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {selectedMessage.email || '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <SubjectIcon color="secondary" />
                  <Typography variant="body2" fontWeight={500}>
                    {selectedMessage.subject}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: 17 }}>
                  {selectedMessage.message}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#f5f5f5', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this message?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

Message.propTypes = {};
Message.defaultProps = {};

export default Message;

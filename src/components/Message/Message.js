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
import SendIcon from '@mui/icons-material/Send';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const Message = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState({
    doctorId: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");
  const [doctors, setDoctors] = useState([]);

  // Get current user info from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isPatient = currentUser.role === "PATIENT";
  const patientEmail = currentUser.email;

  useEffect(() => {
    LoadJSFiles();
    getAllMessages();
  }, []);

  useEffect(() => {
    if (isPatient) {
      axios.get(`${BASE_URL}/doctors`)
        .then(res => setDoctors(Array.isArray(res.data) ? res.data : []));
    }
  }, [isPatient]);

  const getAllMessages = () => {
    setLoading(true);
    messageHTTPService.getAllMessage()
      .then(response => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage(t('message.error'), CurrentUser.ERR_MSG, 'warning');
        setLoading(false);
      });
  };

  const handleDelete = () => {
    console.log(selectedMessage.id)
    if (selectedMessage) {
      messageHTTPService.removeMessage(selectedMessage.id)
        .then(() => {
          showMessage(t('message.confirmation'), CurrentUser.REMOVE_MSG, 'success');
          getAllMessages();
        })
        .catch(() => {
          showMessage(t('message.error'), CurrentUser.ERR_MSG, 'warning');
        });
    }
    setOpenConfirmDialog(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewMessageChange = e => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    setSending(true);
    setSendSuccess("");
    setSendError("");
    try {
      await messageHTTPService.createMessage({
        doctorId: newMessage.doctorId,
        subject: newMessage.subject,
        message: newMessage.message,
        email: patientEmail,
        name: currentUser.fullName || currentUser.username || "Patient"
      });
      setSendSuccess(t('message.sent_success'));
      setTimeout(() => setOpenNewDialog(false), 1200);
      setNewMessage({ doctorId: "", subject: "", message: "" });
      getAllMessages();
    } catch {
      setSendError(t('message.sent_error'));
    } finally {
      setSending(false);
    }
  };

  // Filter messages for patient role
  const filteredMessages = isPatient
    ? messages.filter(message => message.email === patientEmail)
    : messages.filter(message =>
        message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const columns = [
    { field: 'name', headerName: t('message.from'), width: 200 },
    { field: 'subject', headerName: t('message.subject'), width: 200 },
    { field: 'message', headerName: t('message.message'), width: 200 },
    {
      field: 'actions',
      headerName: t('message.actions'),
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('message.view')}>
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
          <Tooltip title={t('message.delete')}>
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
          <i className="menu-icon fa fa-bars"></i> {t('message.title')}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={getAllMessages}
          >
            Refresh
          </Button>
        </Stack>
        <TextField
          label={t('message.search')}
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={handleSearch}
        />

        {isPatient && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            sx={{ mb: 2 }}
            onClick={() => setOpenNewDialog(true)}
          >
            {t('message.new_message_to_doctor')}
          </Button>
        )}

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
            {t('message.view_message')}
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
              {t('message.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>{t('message.confirmation')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('message.confirm_delete')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              {t('message.cancel')}
            </Button>
            <Button onClick={handleDelete} color="secondary">
              {t('message.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Message Dialog (for patient) */}
        {isPatient && (
          <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{t('message.new_message_to_doctor')}</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSendMessage}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <TextField
                    select
                    label={t('message.select_doctor')}
                    name="doctorId"
                    value={newMessage.doctorId}
                    onChange={handleNewMessageChange}
                    required
                  >
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.fullName}</option>
                    ))}
                  </TextField>
                  <TextField
                    label={t('message.subject')}
                    name="subject"
                    value={newMessage.subject}
                    onChange={handleNewMessageChange}
                    required
                  />
                  <TextField
                    label={t('message.message')}
                    name="message"
                    value={newMessage.message}
                    onChange={handleNewMessageChange}
                    multiline
                    minRows={3}
                    required
                  />
                  {sendSuccess && <Typography color="success.main">{sendSuccess}</Typography>}
                  {sendError && <Typography color="error">{sendError}</Typography>}
                </Box>
                <DialogActions sx={{ mt: 2 }}>
                  <Button onClick={() => setOpenNewDialog(false)} color="secondary">
                    {t('message.cancel')}
                  </Button>
                  <Button type="submit" color="primary" variant="contained" disabled={sending}>
                    {t('message.send')}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

Message.propTypes = {};
Message.defaultProps = {};

export default Message;

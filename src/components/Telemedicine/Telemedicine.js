import React, { useRef, useState, useEffect } from 'react';
import {
  Box, Button, Typography, IconButton, TextField, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

const dummyPatient = {
  name: "John Doe",
  avatar: "",
  id: "11111111-aaaa-bbbb-cccc-111111111111"
};

// Dummy call history data
const dummyCallHistory = [
  {
    id: 1,
    patientName: "John Doe",
    patientAvatar: "",
    date: "2025-07-29T15:00:00.000Z",
    type: "video",
    duration: "12:34",
    status: "Completed"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientAvatar: "",
    date: "2025-07-28T10:30:00.000Z",
    type: "audio",
    duration: "08:21",
    status: "Completed"
  },
  {
    id: 3,
    patientName: "John Doe",
    patientAvatar: "",
    date: "2025-07-27T09:15:00.000Z",
    type: "video",
    duration: "15:02",
    status: "Missed"
  }
];

// Helper to generate a random Google Meet code (for demo, not official)
function generateMeetCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const rand = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${rand()}-${rand()}-${rand()}`;
}

const SCOPES = "https://www.googleapis.com/auth/calendar.events"; // keep this constant

const Telemedicine = () => {
  const { t } = useTranslation();
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    doctorId: '',
    sessionDuration: 30,
    start: null,
    end: null,
    meetingLink: '',
    status: 'Scheduled',
    recordedSessionUrl: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const loadScript = src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadScript("https://accounts.google.com/gsi/client");
    loadScript("https://apis.google.com/js/api.js");
    // Fetch Google Meet Client ID from backend
    axios.get(`${BASE_URL}/clinicsettings`)
      .then(res => {
        const key = res.data?.telemedicine?.GOOGLE_MEET_KEY;
        console.log('GOOGLE_MEET_KEY:', key);
        if (key) setClientId(key);
      });
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    fetchClinics();
  }, []);

  const fetchAppointments = async () => {
    setCalendarLoading(true);
    try {
      const res = await axios.get(BASE_URL+'/telemedicines');
      setAppointments(res.data);
    } catch {
      setAppointments([]);
    }
    setCalendarLoading(false);
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(BASE_URL+'/patients');
      setPatients(res.data);
    } catch {
      setPatients([]);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await axios.get(BASE_URL+'/clinics');
      setClinics(res.data);
    } catch {
      setClinics([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(BASE_URL+'/doctors');
      setDoctors(res.data);
    } catch {
      setDoctors([]);
    }
  };

  // Simulate starting a call (replace with real WebRTC logic)
  const startCall = (type) => {
    setInCall(true);
    setVideoEnabled(type === 'video');
    setAudioEnabled(true);
    setShowHistory(false);
    // Here you would initialize WebRTC and attach streams to refs
  };

  const endCall = () => {
    setInCall(false);
    setShowChat(false);
    // Here you would close WebRTC connections
  };

  const toggleVideo = () => setVideoEnabled(v => !v);
  const toggleAudio = () => setAudioEnabled(a => !a);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { sender: 'doctor', text: chatInput }]);
      setChatInput('');
      // Here you would send the message to the patient via signaling server
    }
  };

  // Authenticate and get access token
  const authenticate = async () => {
    return new Promise((resolve, reject) => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            reject("No access token");
          }
        },
      }).requestAccessToken();
    });
  };

  // Create Google Meet event
  const createMeetEvent = async (start, end) => {
    const accessToken = await authenticate();
    return new Promise((resolve) => {
      window.gapi.load("client", async () => {
        await window.gapi.client.init({
          apiKey: "",
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        window.gapi.client.setToken({ access_token: accessToken });
        const event = {
          summary: "Telemedicine Appointment",
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
          conferenceData: {
            createRequest: { requestId: String(Date.now()) }
          }
        };
        const response = await window.gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
          conferenceDataVersion: 1,
        });
        console.error('Google Calendar API response:', response);
        resolve(response.result.hangoutLink); // <-- Use this link only!
      });
    });
  };

  // Calendar event mapping
  const calendarEvents = appointments.map(a => ({
    id: a.id,
    title: `Patient: ${patients.find(p => p.id === a.patientId)?.fullName || a.patientId} | Doctor: ${doctors.find(d => d.id === a.doctorId)?.fullName || a.doctorId}`,
    start: new Date(a.createdAt),
    end: new Date(new Date(a.createdAt).getTime() + (a.sessionDuration || 30) * 60000),
    meetingLink: a.meetingLink,
    status: a.status
  }));

  // Handle new appointment modal open
  const handleOpenModal = () => {
    setNewAppointment({
      patientId: '',
      doctorId: '',
      sessionDuration: 30,
      start: null,
      end: null,
      meetingLink: '',
      status: 'Scheduled',
      recordedSessionUrl: ''
    });
    setOpenModal(true);
  };

  // Handle create appointment
  const handleCreateAppointment = async () => {
    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.start) return;
    const start = new Date(newAppointment.start);
    const end = new Date(start.getTime() + (newAppointment.sessionDuration || 30) * 60000);
    let meetLink = '';
    let errorMsg = '';
    try {
      meetLink = await createMeetEvent(start, end);
      if (!meetLink) {
        errorMsg = t('telemedicine.meet_link_failed') || 'Failed to generate Google Meet link. Please check your API credentials and permissions.';
      }
    } catch (err) {
      errorMsg = t('telemedicine.meet_link_failed') || 'Failed to generate Google Meet link. Please check your API credentials and permissions.';
    }
    if (errorMsg) {
      alert(errorMsg); // Or use a Snackbar/Modal for better UX
      return;
    }
    const payload = {
      patientId: Number(newAppointment.patientId),
      doctorId: Number(newAppointment.doctorId),
      meetingLink: meetLink,
      sessionDuration: newAppointment.sessionDuration,
      status: newAppointment.status,
      createdAt: start.toISOString(),
      updatedAt: start.toISOString()
    };
    await axios.post(BASE_URL + '/telemedicines', payload);
    setOpenModal(false);
    fetchAppointments();
  };

  // Update handleSelectEvent to show modal with details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCopyLink = () => {
    if (meetLink) {
      navigator.clipboard.writeText(meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <VideocamIcon sx={{ mr: 1 }} /> {t('telemedicine.title')}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={handleOpenModal}
        >
          {t('telemedicine.new_appointment')}
        </Button>
        <Typography variant="h6" gutterBottom>
          {t('telemedicine.calendar_title')}
        </Typography>
        <div style={{ height: 500 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            style={{ height: 480 }}
            onSelectEvent={handleSelectEvent}
            tooltipAccessor={event => event.meetingLink ? `Click to join: ${event.meetingLink}` : ''}
            eventPropGetter={event => ({
              style: {
                backgroundColor: event.status === 'Scheduled' ? '#1976d2' : '#43a047',
                color: '#fff',
                borderRadius: 6,
                border: 'none'
              }
            })}
          />
        </div>
      </Paper>

      {/* New Appointment Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('telemedicine.new_appointment')}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label={t('telemedicine.patient')}
            value={newAppointment.patientId}
            onChange={e => setNewAppointment(a => ({ ...a, patientId: e.target.value }))}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.fullName || p.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('telemedicine.doctor')}
            value={newAppointment.doctorId}
            onChange={e => setNewAppointment(a => ({ ...a, doctorId: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          >
            {doctors.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.fullName || d.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('telemedicine.start_datetime')}
            type="datetime-local"
            value={newAppointment.start || ''}
            onChange={e => setNewAppointment(a => ({ ...a, start: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('telemedicine.session_duration')}
            type="number"
            value={newAppointment.sessionDuration}
            onChange={e => setNewAppointment(a => ({ ...a, sessionDuration: Number(e.target.value) }))}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>{t('telemedicine.cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleCreateAppointment}
            disabled={
              !newAppointment.patientId ||
              !newAppointment.doctorId ||
              !newAppointment.start
            }
          >
            {t('telemedicine.create_and_generate_link')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onClose={() => setShowEventModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700 }}>
          {t('telemedicine.details_title')}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                <VideocamIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {t('telemedicine.video_consultation')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  <b>{t('telemedicine.patient')}:</b> {patients.find(p => p.id === selectedEvent.id || p.id === selectedEvent.patientId)?.fullName || selectedEvent.patientId}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  <b>{t('telemedicine.doctor')}:</b> {doctors.find(d => d.id === selectedEvent.id || d.id === selectedEvent.doctorId)?.fullName || selectedEvent.doctorId}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>{t('telemedicine.start')}:</b> {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : '-'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>{t('telemedicine.duration')}:</b> {selectedEvent.sessionDuration || 30} {t('telemedicine.minutes')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>{t('telemedicine.status')}:</b> <span style={{
                    color: selectedEvent.status === 'Scheduled' ? '#1976d2' : '#43a047',
                    fontWeight: 600
                  }}>{selectedEvent.status}</span>
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <b>{t('telemedicine.meeting_link')}:</b>{' '}
                  {selectedEvent.meetingLink ? (
                    <a href={selectedEvent.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', wordBreak: 'break-all' }}>
                      {selectedEvent.meetingLink}
                    </a>
                  ) : (
                    <span style={{ color: '#888' }}>-</span>
                  )}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowEventModal(false)}
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 120, fontWeight: 600, mr: 2 }}
          >
            {t('telemedicine.close')}
          </Button>
          {selectedEvent && selectedEvent.meetingLink && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                minWidth: 220,
                fontWeight: 700,
                fontSize: 20,
                py: 2,
                bgcolor: '#1976d2',
                boxShadow: '0 4px 16px rgba(25,118,210,0.12)',
                '&:hover': { bgcolor: '#115293' }
              }}
              startIcon={<VideocamIcon sx={{ fontSize: 28 }} />}
              onClick={() => window.open(selectedEvent.meetingLink, '_blank')}
            >
              {t('telemedicine.join_call')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

    {/*   <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={dummyPatient.avatar}>{dummyPatient.name[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1">{dummyPatient.name}</Typography>
          <Typography variant="body2" color="text.secondary">Patient ID: {dummyPatient.id}</Typography>
        </Box>
        {!inCall && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VideocamIcon />}
              onClick={() => startCall('video')}
            >
              New Video Call
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CallIcon />}
              onClick={() => startCall('audio')}
            >
              New Audio Call
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<VideoCallOutlinedIcon />}
              onClick={createMeetEvent}
            >
              Create Google Meet
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<HistoryIcon />}
              onClick={() => setShowHistory(h => !h)}
            >
              {showHistory ? "Hide" : "Show"} Last Calls
            </Button>
          </Box>
        )}
        {inCall && (
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <IconButton color={videoEnabled ? "primary" : "default"} onClick={toggleVideo}>
              {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton color={audioEnabled ? "primary" : "default"} onClick={toggleAudio}>
              {audioEnabled ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <IconButton color="error" onClick={endCall}>
              <CallEndIcon />
            </IconButton>
            <IconButton color={showChat ? "primary" : "default"} onClick={() => setShowChat(c => !c)}>
              <ChatIcon />
            </IconButton>
          </Box>
        )}
      </Paper> */}

      {/* Show Google Meet link and invitation actions */}
      {!inCall && meetLink && (
        <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="body1" sx={{ flex: 1 }}>
            Google Meet Link: <a href={meetLink} target="_blank" rel="noopener noreferrer">{meetLink}</a>
          </Typography>
          <Button
            variant="outlined"
            color={copied ? "success" : "primary"}
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </Paper>
      )}

      {/* Last Video Calls List */}
      {!inCall && showHistory && (
        <Paper sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <HistoryIcon sx={{ mr: 1 }} /> Last Video/Audio Calls
          </Typography>
          <List>
            {dummyCallHistory.map(call => (
              <React.Fragment key={call.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={call.patientAvatar}>{call.patientName[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${call.patientName} (${call.type === 'video' ? 'Video' : 'Audio'})`}
                    secondary={
                      <>
                        {new Date(call.date).toLocaleString()} &nbsp;|&nbsp; Duration: {call.duration} &nbsp;|&nbsp; Status: {call.status}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {inCall && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 2, bgcolor: '#222', borderRadius: 2, p: 1, minHeight: 320, position: 'relative' }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: 300, background: '#111', borderRadius: 8 }}
              poster="https://dummyimage.com/640x360/222/fff&text=Remote+Video"
            />
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: 120,
                height: 90,
                position: 'absolute',
                bottom: 16,
                right: 16,
                border: '2px solid #fff',
                borderRadius: 8,
                background: '#333'
              }}
              poster="https://dummyimage.com/120x90/333/fff&text=You"
            />
          </Box>
          {showChat && (
            <Box sx={{ flex: 1, bgcolor: '#fafafa', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', height: 320 }}>
              <Typography variant="subtitle1" gutterBottom>Chat</Typography>
              <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
                {messages.map((msg, idx) => (
                  <Box key={idx} sx={{ mb: 1, textAlign: msg.sender === 'doctor' ? 'right' : 'left' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        bgcolor: msg.sender === 'doctor' ? '#1976d2' : '#e0e0e0',
                        color: msg.sender === 'doctor' ? '#fff' : '#222',
                        px: 1.5, py: 0.5, borderRadius: 2
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <Button variant="contained" onClick={handleSendMessage}>Send</Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

    </Box>
  );
};


export default Telemedicine;
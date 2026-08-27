import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, CircularProgress, Alert, Divider,
  Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';

const QUICK_ACTIONS = [
  { label: 'Prepare for appointment', tab: 1 },
  { label: 'Ask a question', tab: 0 },
  { label: 'Help navigating portal', tab: 3 },
  { label: 'Schedule help', tab: 4 },
];

export default function PatientAIAssistant() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your dental assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // FAQ
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Prepare for appointment
  const [apptForm, setApptForm] = useState({ appointmentType: '', date: '', specialInstructions: '' });
  const [apptGuide, setApptGuide] = useState('');

  // Explain document
  const [docText, setDocText] = useState('');
  const [docExplanation, setDocExplanation] = useState('');

  // Navigate portal
  const [navQuestion, setNavQuestion] = useState('');
  const [navGuide, setNavGuide] = useState('');

  // Schedule help
  const [schedForm, setSchedForm] = useState({ treatmentType: '', urgency: 'routine', preferredDays: '', preferredTime: '' });
  const [schedAdvice, setSchedAdvice] = useState('');

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/ai/patient/chat`, { messages: newMessages });
      setChatMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch (e) { setChatMessages(m => [...m, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]); }
    finally { setLoading(false); }
  };

  const call = async (endpoint, body, setter) => {
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, body);
      const d = res.data;
      setter(d.answer || d.guide || d.explanation || d.advice || '');
    } catch (e) { setError(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  const renderTab = () => {
    switch (tab) {
      case 0: // AI Chat
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 420 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
              <List dense>
                {chatMessages.map((m, i) => (
                  <ListItem key={i} sx={{ alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 1 }}>
                    <ListItemAvatar sx={{ minWidth: 36 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: m.role === 'assistant' ? 'primary.main' : 'grey.400' }}>
                        {m.role === 'assistant' ? <SmartToyIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
                      </Avatar>
                    </ListItemAvatar>
                    <Paper variant="outlined" sx={{ p: 1.5, maxWidth: '75%', bgcolor: m.role === 'user' ? 'primary.50' : 'grey.50' }}>
                      <Typography variant="body2" whiteSpace="pre-wrap">{m.content}</Typography>
                    </Paper>
                  </ListItem>
                ))}
                {loading && (
                  <ListItem>
                    <ListItemAvatar sx={{ minWidth: 36 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><SmartToyIcon sx={{ fontSize: 18 }} /></Avatar>
                    </ListItemAvatar>
                    <CircularProgress size={20} />
                  </ListItem>
                )}
                <div ref={chatEndRef} />
              </List>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
              <TextField size="small" fullWidth placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()} />
              <Button variant="contained" endIcon={<SendIcon />} onClick={sendChat} disabled={loading || !chatInput.trim()}>Send</Button>
            </Box>
          </Box>
        );

      case 1: // Prepare for appointment
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField size="small" fullWidth label="Appointment Type (e.g. Root Canal, Cleaning)" value={apptForm.appointmentType} onChange={e => setApptForm(p => ({ ...p, appointmentType: e.target.value }))} />
            <TextField size="small" fullWidth label="Appointment Date" type="date" value={apptForm.date} onChange={e => setApptForm(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField size="small" fullWidth label="Special Instructions" value={apptForm.specialInstructions} onChange={e => setApptForm(p => ({ ...p, specialInstructions: e.target.value }))} />
            <Button variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <SmartToyIcon />} onClick={() => call('/ai/patient/prepare-for-appointment', apptForm, setApptGuide)} disabled={loading}>Get Preparation Guide</Button>
            {apptGuide && <Paper variant="outlined" sx={{ p: 2 }}><Typography whiteSpace="pre-wrap" variant="body2">{apptGuide}</Typography></Paper>}
          </Box>
        );

      case 2: // Explain document
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField multiline rows={5} fullWidth label="Paste document text here" value={docText} onChange={e => setDocText(e.target.value)} placeholder="Paste your treatment plan, prescription, or any clinic document..." />
            <Button variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <SmartToyIcon />} onClick={() => call('/ai/patient/explain-document', { documentText: docText }, setDocExplanation)} disabled={loading}>Explain in Simple Language</Button>
            {docExplanation && <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}><Typography whiteSpace="pre-wrap" variant="body2">{docExplanation}</Typography></Paper>}
          </Box>
        );

      case 3: // Navigate portal
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField size="small" fullWidth label="What are you trying to find or do?" value={navQuestion} onChange={e => setNavQuestion(e.target.value)} placeholder="e.g. How do I pay my invoice? Where do I see my appointments?" />
            <Button variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <SmartToyIcon />} onClick={() => call('/ai/patient/navigate-portal', { question: navQuestion }, setNavGuide)} disabled={loading}>Get Help</Button>
            {navGuide && <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}><Typography whiteSpace="pre-wrap" variant="body2">{navGuide}</Typography></Paper>}
          </Box>
        );

      case 4: // Schedule help
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField size="small" fullWidth label="What treatment do you need?" value={schedForm.treatmentType} onChange={e => setSchedForm(p => ({ ...p, treatmentType: e.target.value }))} />
            <TextField size="small" fullWidth label="Urgency (routine / urgent / emergency)" value={schedForm.urgency} onChange={e => setSchedForm(p => ({ ...p, urgency: e.target.value }))} />
            <TextField size="small" fullWidth label="Preferred days (e.g. Mon, Wed)" value={schedForm.preferredDays} onChange={e => setSchedForm(p => ({ ...p, preferredDays: e.target.value }))} />
            <TextField size="small" fullWidth label="Preferred time (e.g. morning)" value={schedForm.preferredTime} onChange={e => setSchedForm(p => ({ ...p, preferredTime: e.target.value }))} />
            <Button variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <SmartToyIcon />} onClick={() => call('/ai/patient/schedule-help', schedForm, setSchedAdvice)} disabled={loading}>Get Scheduling Advice</Button>
            {schedAdvice && <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}><Typography whiteSpace="pre-wrap" variant="body2">{schedAdvice}</Typography></Paper>}
          </Box>
        );

      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}><SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />AI Patient Assistant</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Ask questions, get appointment guides, or understand your dental documents.</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {QUICK_ACTIONS.map(a => <Chip key={a.label} label={a.label} clickable onClick={() => setTab(a.tab)} color={tab === a.tab ? 'primary' : 'default'} variant={tab === a.tab ? 'filled' : 'outlined'} />)}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
        <Tab label="AI Chat" icon={<SmartToyIcon />} iconPosition="start" />
        <Tab label="Appointment Prep" />
        <Tab label="Explain Document" />
        <Tab label="Portal Help" />
        <Tab label="Scheduling Help" />
      </Tabs>

      <Paper sx={{ p: 3 }}>
        {renderTab()}
      </Paper>
    </Box>
  );
}

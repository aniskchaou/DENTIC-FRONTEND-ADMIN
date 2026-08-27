import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, TextField, IconButton, Avatar,
  CircularProgress, Chip, Button, Divider, List, ListItem, ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import PublicLayout from '../PublicLayout/PublicLayout';

const SUGGESTED_QUESTIONS = [
  'What dental services do you offer?',
  'How do I book an appointment?',
  'Do you accept my insurance?',
  'How much does teeth whitening cost?',
  'What should I do for a toothache?',
  'Do you offer payment plans?',
  'Are you accepting new patients?',
  'What are your opening hours?',
];

const Message = ({ msg }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
    mb: 2,
    alignItems: 'flex-start',
    gap: 1
  }}>
    {msg.role === 'assistant' && (
      <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>
        <SmartToyIcon fontSize="small" />
      </Avatar>
    )}
    <Paper sx={{
      p: 2, maxWidth: '75%', borderRadius: 3,
      bgcolor: msg.role === 'user' ? '#1976d2' : '#f5f5f5',
      color: msg.role === 'user' ? '#fff' : 'text.primary',
      borderTopRightRadius: msg.role === 'user' ? 0 : 3,
      borderTopLeftRadius: msg.role === 'assistant' ? 0 : 3,
    }}>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{msg.content}</Typography>
    </Paper>
    {msg.role === 'user' && (
      <Avatar sx={{ bgcolor: '#e3f2fd', width: 36, height: 36 }}>
        <PersonIcon color="primary" fontSize="small" />
      </Avatar>
    )}
  </Box>
);

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm the DenticClinic AI Dental Assistant 🦷\n\nI can answer questions about our services, pricing, appointments, insurance, and general dental health.\n\nHow can I help you today?"
};

const PublicAIAssistant = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question) return;
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const r = await axios.post(`${BASE_URL}/ai/clinic-qa`, { question });
      const answer = r.data?.answer || r.data?.response || r.data?.message || "I'm sorry, I couldn't find an answer to that. Please call us directly at +1 (555) 012-3456.";
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please call us at +1 (555) 012-3456 or use the contact form and we'll get back to you shortly."
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1565c0', color: '#fff', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <SmartToyIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h2" fontWeight={800} gutterBottom>AI Dental Assistant</Typography>
          <Typography variant="h6" sx={{ color: '#90caf9' }}>
            Get instant answers about our services, appointments, and dental health — 24/7.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
          {SUGGESTED_QUESTIONS.slice(0, 5).map(q => (
            <Chip
              key={q} label={q} variant="outlined" color="primary"
              onClick={() => sendMessage(q)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#e3f2fd' } }}
            />
          ))}
        </Box>

        {/* Chat window */}
        <Paper sx={{ borderRadius: 3, boxShadow: 4, overflow: 'hidden' }}>
          {/* Chat header */}
          <Box sx={{ bgcolor: '#1976d2', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#fff' }}>
              <SmartToyIcon color="primary" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#fff">DenticClinic AI Assistant</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#69f0ae', borderRadius: '50%' }} />
                <Typography variant="caption" color="#90caf9">Online 24/7</Typography>
              </Box>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ p: 3, minHeight: 380, maxHeight: 480, overflowY: 'auto', bgcolor: '#fafafa' }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 2, borderRadius: 3, borderTopLeftRadius: 0, bgcolor: '#f5f5f5' }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Thinking…</Typography>
                </Paper>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: '#fff' }}>
            <TextField
              fullWidth size="small"
              placeholder="Ask me anything about dental care…"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              multiline maxRows={3}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton
              color="primary" onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              sx={{ bgcolor: '#1976d2', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#1565c0' }, '&:disabled': { bgcolor: '#bbb' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pb: 1 }}>
            <Typography variant="caption" color="text.disabled">
              AI responses are for informational purposes only. For medical advice, please consult our dentists.
            </Typography>
          </Box>
        </Paper>

        {/* More suggestions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>More questions to try:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SUGGESTED_QUESTIONS.slice(5).map(q => (
              <Chip key={q} label={q} variant="outlined" size="small"
                onClick={() => sendMessage(q)} sx={{ cursor: 'pointer' }} />
            ))}
          </Box>
        </Box>

        {/* Human contact fallback */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 1, bgcolor: '#e3f2fd', textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Prefer to talk to a person?</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Our team is available Mon–Fri 8am–6pm, Sat 9am–1pm.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" href="tel:+15550123456" size="large" sx={{ fontWeight: 700 }}>
              Call +1 (555) 012-3456
            </Button>
            <Button variant="outlined" href="/contact" size="large" sx={{ fontWeight: 700 }}>
              Send a Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </PublicLayout>
  );
};

export default PublicAIAssistant;

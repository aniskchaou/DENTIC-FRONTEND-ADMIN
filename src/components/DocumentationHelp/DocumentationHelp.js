import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';

// --- NEW: Import module documentation from JSON/text file ---
import moduleDocs from './moduleDocs.json';

const docItems = [
  {
    icon: <DashboardIcon color="primary" />,
    primary: "Widgets",
    secondary: "Quick stats for patients, appointments, staff, and more. Hover for highlight."
  },
  {
    icon: <BarChartIcon color="secondary" />,
    primary: "Charts",
    secondary: "Visualize clinic data (patients, medicaments, appointments, etc.)"
  },
  {
    icon: <FlashOnIcon sx={{ color: "#fbc02d" }} />,
    primary: "Recent Activities",
    secondary: "Track latest actions and updates in your clinic."
  },
  {
    icon: <ListAltIcon sx={{ color: "#43a047" }} />,
    primary: "Quick Actions",
    secondary: "Use buttons to add patients, schedule appointments, and manage records."
  },
  {
    icon: <ListAltIcon sx={{ color: "#0288d1" }} />,
    primary: "Top 5 Lists",
    secondary: "See top doctors, patients, and medicaments at a glance."
  },
  {
    icon: <MonetizationOnIcon sx={{ color: "#d32f2f" }} />,
    primary: "Financial Summary",
    secondary: "Overview of income, expenses, and profit."
  },
  {
    icon: <SearchIcon sx={{ color: "#8e24aa" }} />,
    primary: "Search & Filter",
    secondary: "Quickly find patients, appointments, or medicaments."
  },
  {
    icon: <SettingsIcon sx={{ color: "#1976d2" }} />,
    primary: "Settings",
    secondary: "Edit your profile or customize your dashboard widgets."
  },
  {
    icon: <ChatIcon sx={{ color: "#009688" }} />,
    primary: "Help",
    secondary: "For support, use the Live Chat or contact your admin."
  }
];

const moduleItems = [
  { label: "Dashboard", desc: "Overview, widgets, charts, and quick stats." },
  { label: "Patient Management", desc: "Add, edit, view, and search patients. Medical history, allergies, blood type, emergency contact." },
  { label: "Doctor Management", desc: "Manage doctor profiles and schedules." },
  { label: "Staff Management", desc: "Manage staff profiles and roles." },
  { label: "Clinic Management", desc: "Clinic info, locations, and working hours." },
  { label: "Appointment Management", desc: "Book, edit, and view appointments. Telemedicine support." },
  { label: "Billing & Invoices", desc: "Create and manage bills, invoices, and payments." },
  { label: "Payments", desc: "Track and manage patient payments." },
  { label: "Expenses", desc: "Record and monitor clinic expenses." },
  { label: "Memberships", desc: "Manage patient memberships and plans." },
  { label: "Prescription Management", desc: "Create, edit, and view prescriptions." },
  { label: "Medicament Management", desc: "Manage medicaments, manufacturers, and stock." },
  { label: "Certificates", desc: "Issue and manage certificates." },
  { label: "Reports & Analytics", desc: "View statistics, summaries, and trends." },
  { label: "Contact & Communication", desc: "Contact section, book visit, and communication tools." },
  { label: "Settings", desc: "Profile and dashboard customization." },
  { label: "Help & Documentation", desc: "Access help center and user guides." }
];

const DocumentationHelp = () => {
  const [openModule, setOpenModule] = useState(null);
  const [moduleContent, setModuleContent] = useState('');

  useEffect(() => {
    if (openModule) {
      setModuleContent(moduleDocs[openModule] || "Documentation coming soon.");
    }
  }, [openModule]);

  return (
    <Box
      sx={{
        maxWidth: 700,
        width: '100%',
        mx: 'auto',
        mt: 4,
        mb: 4,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          bgcolor: '#fafdff',
          boxShadow: '0 4px 24px rgba(25,118,210,0.08)',
          width: '100%',
          minWidth: 320,
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <HelpOutlineIcon sx={{ fontSize: 36, color: '#1976d2', mr: 1 }} />
          <Typography variant="h4" fontWeight={700} color="primary">
            Dashboard Documentation & Help
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          Welcome to your Dentic Clinic dashboard! Here’s a quick guide to help you get the most out of your admin panel.
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
          Main Modules
        </Typography>
        <List sx={{ mb: 2 }}>
          {moduleItems.map((mod, idx) => (
            <ListItem
              key={idx}
              button
              onClick={() => setOpenModule(mod.label)}
              sx={{
                pl: 0,
                mb: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: '#e3f2fd', cursor: 'pointer' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FlashOnIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{mod.label}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{mod.desc}</Typography>}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mb: 2 }} />
        <List>
          {docItems.map((item, idx) => (
            <ListItem key={idx} alignItems="flex-start" sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle1" fontWeight={600}>{item.primary}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{item.secondary}</Typography>}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            For more detailed documentation, please refer to the user manual or contact support.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/help"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Go to Help Center
          </Button>
        </Box>
      </Paper>

      {/* Modal for module documentation */}
      <Dialog
        open={!!openModule}
        onClose={() => setOpenModule(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {openModule} Documentation
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {moduleContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModule(null)} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentationHelp;
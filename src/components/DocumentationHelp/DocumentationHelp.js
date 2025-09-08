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
import { marked } from 'marked';
import patientManagementMd from './modules/patient-management.md';
import doctorManagementMd from './modules/doctor-management.md';
import staffManagementMd from './modules/staff-management.md';
import clinicManagementMd from './modules/clinic-management.md';
import appointmentManagementMd from './modules/appointment-management.md';
import billingInvoicesMd from './modules/billing-invoices.md';
import paymentsMd from './modules/payments.md';
import expensesMd from './modules/expenses.md';
import membershipsMd from './modules/memberships.md';
import prescriptionManagementMd from './modules/prescription-management.md';
import medicamentManagementMd from './modules/medicament-management.md';
import certificatesMd from './modules/certificates.md';
import reportsAnalyticsMd from './modules/reports-analytics.md';
import contactCommunicationMd from './modules/contact-communication.md';
import settingsMd from './modules/settings.md';
import odontogramMd from './modules/odontogram.md';
import labTestMd from './modules/lab-test.md';
import telemedicineMd from './modules/telemedicine.md';
import equipmentMaintenanceMd from './modules/equipment-maintenance.md';
import marketingMd from './modules/marketing.md';
import dicomMd from './modules/dicom.md';

// New imports for Getting Started markdowns
import introductionMd from './getting-started/introduction.md';
import keyFeaturesMd from './getting-started/key-features.md';
import demoMd from './getting-started/demo.md';
import usedTechnologiesMd from './getting-started/used-technologies.md';

// New imports for Installation & Integrations markdowns
import localInstallationMd from './installation-integrations/local-installation.md';
import remoteInstallationMd from './installation-integrations/remote-installation.md';
import changeLogMd from './installation-integrations/change-log.md';
import thirdPartyIntegrationsMd from './installation-integrations/third-party-integrations.md';
import serverRequirementsMd from './installation-integrations/server-requirements.md';

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
  { label: "Help & Documentation", desc: "Access help center and user guides." },
  { label: "Odontogram", desc: "Visual dental charting: record tooth conditions, treatments and history." },
  { label: "Lab Test", desc: "Create, upload and analyze laboratory tests and results." },
  { label: "Telemedicine", desc: "Configure telemedicine, create meetings and manage remote consultations." },
  { label: "Equipment Maintenance", desc: "Track clinic equipment, maintenance schedules and service history." },

  // --- NEW MODULES ---
  { label: "Marketing", desc: "Manage marketing campaigns: create, edit, delete, and view campaign details. Supports target audience selection, scheduling, and performance tracking." },
  { label: "Dicom Viewer", desc: "View and manage dental imaging files (DICOM). Select patient, upload and display multiple images, and use the integrated viewer for analysis." }
];

const DocumentationHelp = () => {
  const [openModule, setOpenModule] = useState(null);
  const [moduleContent, setModuleContent] = useState('');
  const [mdContent, setMdContent] = useState('');

  // --- NEW: Installation & Integrations section definition ---
  const installSection = {
    name: "Installation & Integrations",
    items: [
      { label: "Local Installation", desc: "Instructions to install Dentic on a local machine or local network." },
      { label: "Remote Installation", desc: "Steps for deploying Dentic to a remote server or cloud provider." },
      { label: "Change Log", desc: "Recent releases, changes and migration notes." },
      { label: "Third-Party Integrations", desc: "How to configure integrations (Google Calendar, payment gateways, SMS providers)." },
      { label: "Server Requirements", desc: "Required server specs, dependencies and recommended configuration." }
    ]
  };

  // --- NEW: Getting Started section definition ---
  const gettingStartedSection = {
    name: "Getting Started",
    items: [
      { label: "Introduction", desc: "Brief overview of Dentic and its purpose." },
      { label: "Key Features", desc: "Main features and capabilities you should know." },
      { label: "Demo", desc: "Interactive demo and walkthrough of core flows." },
      { label: "Used Technologies", desc: "Tech stack, libraries and services used by Dentic." }    ]
  };

  useEffect(() => {
    if (openModule === 'Patient Management') {
      fetch(patientManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Doctor Management') {
      fetch(doctorManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Staff Management') {
      fetch(staffManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Clinic Management') {
      fetch(clinicManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Appointment Management') {
      fetch(appointmentManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Billing & Invoices') {
      fetch(billingInvoicesMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Payments') {
      fetch(paymentsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Expenses') {
      fetch(expensesMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Memberships') {
      fetch(membershipsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Prescription Management') {
      fetch(prescriptionManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Medicament Management') {
      fetch(medicamentManagementMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Certificates') {
      fetch(certificatesMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Reports & Analytics') {
      fetch(reportsAnalyticsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Contact & Communication') {
      fetch(contactCommunicationMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Settings') {
      fetch(settingsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Odontogram') {
      fetch(odontogramMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Lab Test') {
      fetch(labTestMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Telemedicine') {
      fetch(telemedicineMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Equipment Maintenance') {
      fetch(equipmentMaintenanceMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    }
    // --- Getting Started section ---
    else if (openModule === 'Introduction') {
      fetch(introductionMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Key Features') {
      fetch(keyFeaturesMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Demo') {
      fetch(demoMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Used Technologies') {
      fetch(usedTechnologiesMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    }
    // --- Installation & Integrations section ---
    else if (openModule === 'Local Installation') {
      fetch(localInstallationMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Remote Installation') {
      fetch(remoteInstallationMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Change Log') {
      fetch(changeLogMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Third-Party Integrations') {
      fetch(thirdPartyIntegrationsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Server Requirements') {
      fetch(serverRequirementsMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    }
    else if (openModule === 'Marketing') {
      fetch(marketingMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    } else if (openModule === 'Dicom Viewer') {
      fetch(dicomMd)
        .then(res => res.text())
        .then(text => setMdContent(marked.parse(text)));
      setModuleContent('');
    }
    else if (openModule) {
      setModuleContent(moduleDocs[openModule] || "Documentation coming soon.");
      setMdContent('');
    }
  }, [openModule]);

  return (
    <Box
      sx={{
        maxWidth: 1600,
        width: '100%',
        minWidth: 1000,
        mx: 'auto',
        mt: 4,
        mb: 4,
        px: { xs: 1, sm: 4 },
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
          minWidth: 800,
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

        {/* --- NEW SECTION: Getting Started (placed above Installation & Integrations) --- */}
        <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
          {gettingStartedSection.name}
        </Typography>
        <List sx={{ mb: 2 }}>
          {gettingStartedSection.items.map((it, idx) => (
            <ListItem
              key={idx}
              button
              onClick={() => setOpenModule(it.label)}
              sx={{
                pl: 0,
                mb: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: '#e8f5e9', cursor: 'pointer' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DashboardIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{it.label}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{it.desc}</Typography>}
              />
            </ListItem>
          ))}
        </List>

        {/* --- NEW SECTION: Installation & Integrations (placed above Main Modules) --- */}
        <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
          {installSection.name}
        </Typography>
        <List sx={{ mb: 2 }}>
          {installSection.items.map((it, idx) => (
            <ListItem
              key={idx}
              button
              onClick={() => setOpenModule(it.label)}
              sx={{
                pl: 0,
                mb: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: '#fff3e0', cursor: 'pointer' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FlashOnIcon sx={{ color: '#fb8c00' }} fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight={600}>{it.label}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{it.desc}</Typography>}
              />
            </ListItem>
          ))}
        </List>

        {/* --- Main Modules header (unchanged) --- */}
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
          {mdContent ? (
            <div dangerouslySetInnerHTML={{ __html: mdContent }} />
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {moduleContent}
            </Typography>
          )}
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
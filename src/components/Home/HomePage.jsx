import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Grid, Container, Card, CardContent, Divider, Avatar,
  AppBar, Toolbar, IconButton, MenuItem, Menu, Chip, Dialog, DialogContent, DialogActions,
  TextField, Select, InputLabel, FormControl, Stack, Snackbar, Alert, LinearProgress,
  Stepper, Step, StepLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import './HomePage.css';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';

// Dentist theme images (royalty-free/unsplash)
const heroImg = "images/1.jpg";
const aboutImg = "images/2.jpg";
const servicesImg = "images/3.jpg";
const contactImg = "images/4.jpg";

const blogPosts = [
  { title: "5 Tips for Healthy Teeth", date: "2025-07-01", excerpt: "Discover essential tips to keep your teeth healthy and strong." },
  { title: "The Importance of Regular Checkups", date: "2025-06-15", excerpt: "Why you shouldn't skip your dental appointments." },
];

const pricing = [
  { service: "Consultation", price: "$30" },
  { service: "Teeth Cleaning", price: "$50" },
  { service: "Whitening", price: "$120" },
  { service: "Braces (per month)", price: "$80" },
];

const openingHours = [
  { day: "Monday - Friday", hours: "08:00 - 18:00" },
  { day: "Saturday", hours: "09:00 - 14:00" },
  { day: "Sunday", hours: "Closed" },
];

const FALLBACK_ABOUT_US = {
  description: 'Dentic Clinic is dedicated to providing the highest quality dental care in a comfortable and friendly environment. Our experienced team uses the latest technology to ensure your smile is always at its best.',
  highlights: [
    'Experienced and caring dentists',
    'Modern equipment & techniques',
    'Flexible appointment scheduling',
    'Family-friendly atmosphere',
    'Emergency dental care',
  ],
};

const FALLBACK_DOCTORS = [
  { id: 1, fullName: 'Dr. Sarah Mitchell', specialization: 'General Dentist' },
  { id: 2, fullName: 'Dr. James Chen',     specialization: 'Orthodontist' },
  { id: 3, fullName: 'Dr. Emily Torres',   specialization: 'Periodontist' },
  { id: 4, fullName: 'Dr. Ahmed Malik',    specialization: 'Endodontist' },
];

const FALLBACK_STAFF = [
  { id: 1, fullName: 'Laura Adams',   role: 'Receptionist' },
  { id: 2, fullName: 'Mark Johnson',  role: 'Assistant' },
  { id: 3, fullName: 'Priya Sharma',  role: 'Admin' },
  { id: 4, fullName: 'Carlos Rivera', role: 'Accountant' },
];

const FALLBACK_MEMBERSHIPS = [
  { id: 1, membershipPlan: 'Basic',     paymentStatus: 'Active', validityPeriod: { startDate: '2025-01-01', endDate: '2025-12-31' }, renewalDate: '2025-12-01', lastPaymentAmount: 29.99,  benefits: ['1 Free Cleaning/year', '10% Off Treatments', 'Priority Booking'] },
  { id: 2, membershipPlan: 'Premium',   paymentStatus: 'Active', validityPeriod: { startDate: '2025-01-01', endDate: '2025-12-31' }, renewalDate: '2025-12-01', lastPaymentAmount: 59.99,  benefits: ['2 Free Cleanings/year', '20% Off Treatments', 'Priority Booking', 'Free X-Ray'] },
  { id: 3, membershipPlan: 'Family',    paymentStatus: 'Active', validityPeriod: { startDate: '2025-01-01', endDate: '2025-12-31' }, renewalDate: '2025-12-01', lastPaymentAmount: 99.99,  benefits: ['3 Free Cleanings/year', '30% Off All Treatments', 'VIP Booking', 'Free X-Rays', 'Emergency Support'] },
  { id: 4, membershipPlan: 'Corporate', paymentStatus: 'Active', validityPeriod: { startDate: '2025-01-01', endDate: '2025-12-31' }, renewalDate: '2025-12-01', lastPaymentAmount: 199.99, benefits: ['Unlimited Cleanings', '40% Off All Treatments', 'Dedicated Coordinator', 'Free X-Rays', '24/7 Emergency Support', 'Whitening Included'] },
];

const languages = [
  { code: 'en', label: 'English', icon: '🇬🇧' },
  { code: 'fr', label: 'Français', icon: '🇫🇷' },
  { code: 'ar', label: 'العربية', icon: '🇸🇦' },
  { code: 'es', label: 'Español', icon: '🇪🇸' },
  { code: 'vi', label: 'Tiếng Việt', icon: '🇻🇳' },
  { code: 'th', label: 'ไทย', icon: '🇹🇭' },
  { code: 'pt', label: 'Português', icon: '🇵🇹' },
  { code: 'hi', label: 'हिन्दी', icon: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', icon: '🇧🇩' },
  { code: 'tr', label: 'Türkçe', icon: '🇹🇷' },
  { code: 'fil', label: 'Filipino', icon: '🇵🇭' },
  { code: 'id', label: 'Bahasa Indonesia', icon: '🇮🇩' }
];

const HomePage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  const morePages = [
    { label: 'Blog',           href: '/blog' },
    { label: 'Reviews',        href: '/reviews' },
    { label: 'FAQ',            href: '/faq' },
    { label: 'Before & After', href: '/before-after' },
    { label: 'Financing',      href: '/financing' },
    { label: 'Emergency',      href: '/emergency' },
    { label: 'New Patient',    href: '/new-patient' },
    { label: 'Careers',        href: '/careers' },
    { label: 'AI Assistant',   href: '/ai' },
    { label: 'Locations',      href: '/locations' },
  ];

  const handleLangClick = (event) => setLangMenuAnchor(event.currentTarget);
  const handleLangClose = () => setLangMenuAnchor(null);
  const handleLangSelect = (code) => {
    setLang(code);
    i18n.changeLanguage(code);
    handleLangClose();
  };

  // Add state for services from backend
  const [services, setServices] = useState([
    "General & Family Dentistry",
    "Cosmetic Dentistry (Whitening, Veneers)",
    "Dental Implants & Restorations",
    "Orthodontics (Braces & Aligners)",
    "Pediatric Dentistry",
    "Emergency Dental Care"
  ]);
  const [loadingServices, setLoadingServices] = useState(true);

  // About Us state
  const [aboutUs, setAboutUs] = useState(FALLBACK_ABOUT_US);
  const [loadingAbout, setLoadingAbout] = useState(true);

  // Contact info state
  const [clinicSettings, setClinicSettings] = useState({
    system: {
      address: '',
      email: '',
      appName: '',
      showLogo: false,
      phone: '',
    },
    openHours: [
      { day: "Monday",    hours: "08:00 - 18:00" },
      { day: "Tuesday",   hours: "08:00 - 18:00" },
      { day: "Wednesday", hours: "08:00 - 18:00" },
      { day: "Thursday",  hours: "08:00 - 18:00" },
      { day: "Friday",    hours: "08:00 - 18:00" },
      { day: "Saturday",  hours: "09:00 - 16:00" },
      { day: "Sunday",    hours: "Closed" },
    ]
  });
  const [editingHours, setEditingHours] = useState(false);
  const [openHoursDraft, setOpenHoursDraft] = useState([]);
  const [savingHours, setSavingHours] = useState(false);

  // Memberships state
  const [memberships, setMemberships] = useState(FALLBACK_MEMBERSHIPS);
  const [loadingMemberships, setLoadingMemberships] = useState(true);

  // Remove static doctors and staffs arrays
  // const doctors = [...]
  // const staffs = [...]

  // Add state for doctors and staffs from backend
  const [doctors, setDoctors] = useState(FALLBACK_DOCTORS);
  const [staffs, setStaffs] = useState(FALLBACK_STAFF);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingStaffs, setLoadingStaffs] = useState(true);

  // Booking stepper state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    insuranceId: '',
    bloodType: '',
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    emergencyContact: { name: '', phone: '', relationship: '' }
  });
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    clinicLocationId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: 'Scheduled',
    appointmentType: 'In-Person',
    reasonForVisit: '',
    notes: ''
  });
  const [doctorsList, setDoctorsList] = useState([]);
  const [clinicsList, setClinicsList] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Add Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatContext, setChatContext] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAnswer, setChatAnswer] = useState('');

  useEffect(() => {
    // Fetch services
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await axios.get(BASE_URL + '/services');
        if (res.data && Array.isArray(res.data.services)) {
          setServices(res.data.services);
        }
      } catch (e) {
        // fallback to default or show error if needed
      }
      setLoadingServices(false);
    };
    fetchServices();

    // Fetch about us
    const fetchAboutUs = async () => {
      setLoadingAbout(true);
      try {
        const res = await axios.get(BASE_URL + '/aboutus');
        if (res.data && res.data.aboutUs && res.data.aboutUs.description) {
          setAboutUs(res.data.aboutUs);
        }
      } catch (e) {
        setAboutUs(FALLBACK_ABOUT_US);
      }
      setLoadingAbout(false);
    };
    fetchAboutUs();

    // Fetch clinic settings for contact info and open hours
    const fetchClinicSettings = async () => {
      try {
        if (CurrentUser.DEMO_MODE) {
          const res = await fetch('/demo/clinicssettings.json');
          const data = await res.json();
          if (data && data.system) {
            setClinicSettings(data);
            setOpenHoursDraft(data.openHours || []);
          }
        } else {
          const res = await axios.get(BASE_URL + '/clinicsettings');
          if (res.data && res.data.system) {
            setClinicSettings(res.data);
            setOpenHoursDraft(res.data.openHours || []);
          }
        }
      } catch (e) {
        // fallback: keep empty/default
      }
    };
    fetchClinicSettings();

    // Fetch memberships
    const fetchMemberships = async () => {
      setLoadingMemberships(true);
      try {
        const res = await axios.get(BASE_URL + '/memberships');
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.memberships) ? res.data.memberships : []);
        setMemberships(data.length > 0 ? data.slice(0, 4) : FALLBACK_MEMBERSHIPS);
      } catch (e) {
        setMemberships(FALLBACK_MEMBERSHIPS);
      }
      setLoadingMemberships(false);
    };
    fetchMemberships();

    // Fetch doctors
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await axios.get(BASE_URL + '/doctors');
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.doctors) ? res.data.doctors : []);
        setDoctors(data.length > 0 ? data.slice(0, 4) : FALLBACK_DOCTORS);
      } catch (e) {
        setDoctors(FALLBACK_DOCTORS);
      }
      setLoadingDoctors(false);
    };
    fetchDoctors();

    // Fetch staffs
    const fetchStaffs = async () => {
      setLoadingStaffs(true);
      try {
        const res = await axios.get(BASE_URL + '/staff');
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.staffs) ? res.data.staffs : []);
        setStaffs(data.length > 0 ? data.slice(0, 4) : FALLBACK_STAFF);
      } catch (e) {
        setStaffs(FALLBACK_STAFF);
      }
      setLoadingStaffs(false);
    };
    fetchStaffs();
  }, []);

  useEffect(() => {
    if (bookingOpen) {
      axios.get(BASE_URL + '/doctors')
        .then(res => setDoctorsList(Array.isArray(res.data) ? res.data : (res.data.doctors || [])))
        .catch(() => {});
      axios.get(BASE_URL + '/clinics')
        .then(res => setClinicsList(Array.isArray(res.data) ? res.data : (res.data.clinics || [])))
        .catch(() => {});
    }
  }, [bookingOpen]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Smooth scroll for menu
  const handleMenuClick = (href) => {
    handleClose();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle open hours edit
  const handleEditOpenHours = () => {
    setOpenHoursDraft(clinicSettings.openHours || []);
    setEditingHours(true);
  };

  const handleOpenHourChange = (idx, value) => {
    setOpenHoursDraft(prev =>
      prev.map((item, i) => (i === idx ? { ...item, hours: value } : item))
    );
  };

  const handleSaveOpenHours = async () => {
    setSavingHours(true);
    try {
      const updatedSettings = { ...clinicSettings, openHours: openHoursDraft };
      await axios.put(BASE_URL + '/clinicsettings', updatedSettings);
      setClinicSettings(updatedSettings);
      setEditingHours(false);
    } catch (e) {
      // Optionally show error
    }
    setSavingHours(false);
  };

  const handleBookVisit = () => {
    setPatientForm({ fullName: '', phone: '', email: '', dateOfBirth: '', medicalRecordNumber: '', insuranceId: '', bloodType: '', allergies: [], medicalHistory: [], currentMedications: [], emergencyContact: { name: '', phone: '', relationship: '' } });
    setAppointmentForm({ doctorId: '', clinicLocationId: '', appointmentDate: '', startTime: '', endTime: '', status: 'Scheduled', appointmentType: 'In-Person', reasonForVisit: '', notes: '' });
    setBookingStep(0);
    setBookingSuccess(false);
    setBookingOpen(true);
  };

  const handleBookingNext = () => setBookingStep(s => s + 1);
  const handleBookingBack = () => setBookingStep(s => s - 1);
  const handleBookingClose = () => { setBookingOpen(false); setBookingSuccess(false); setBookingStep(0); };

  const handleBookingSubmit = async () => {
    setBookingSubmitting(true);
    try {
      const patRes = await axios.post(BASE_URL + '/patients', patientForm);
      await axios.post(BASE_URL + '/appointments', { ...appointmentForm, patientId: patRes.data.id });
      setBookingSuccess(true);
      setSnackbar({ open: true, message: 'Appointment booked successfully!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to book appointment. Please try again.', severity: 'error' });
    }
    setBookingSubmitting(false);
  };

  // Chatbot handler
  const handleSendChat = async () => {
    setChatLoading(true);
    setChatAnswer('');
    try {
      const payload = {
        question: chatQuestion,
        context: chatContext
      };
      const res = await axios.post(`${BASE_URL}/ai/clinic-qa`, payload);
      setChatAnswer(res.data.answer || 'No answer found.');
    } catch {
      setChatAnswer('Error getting answer.');
    }
    setChatLoading(false);
  };

  // Add scroll handlers before return:
  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Move menuLinks inside HomePage component, after you define t from useTranslation:
  const menuLinks = [
    { label: t("home.menu_home"), href: "#hero" },
    { label: t("home.menu_about"), href: "#about" },
    { label: t("home.menu_services"), href: "#services" },
    { label: t("home.menu_doctors"), href: "#doctors" },
    { label: t("home.menu_staff"), href: "#staff" },
    { label: t("home.menu_memberships"), href: "#memberships" },
    { label: t("home.menu_contact"), href: "#contact" },
    { label: t("home.menu_login"), href: "/login" },
  ];

  return (
    <Box className="home-page-root" sx={{ bgcolor: '#fafdff', minHeight: '100vh', fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* AppBar/Menu */}
      <AppBar position="fixed" color="primary" elevation={0} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            <span style={{ color: '#fff' }}>Dentic</span>
            <span style={{ color: '#90caf9' }}>Clinic</span>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link to={link.href} style={{ textDecoration: 'none' }} key={link.label}>
                  <Button
                    variant={link.label === t("home.menu_login") ? "contained" : "text"}
                    color={link.label === t("home.menu_login") ? "secondary" : "inherit"}
                    sx={{ fontWeight: 600, fontSize: 16, textTransform: 'none', px: 3 }}
                  >
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={link.label}
                  color="inherit"
                  sx={{ fontWeight: 500, fontSize: 16, textTransform: 'none' }}
                  onClick={() => handleMenuClick(link.href)}
                >
                  {link.label}
                </Button>
              )
            )}
            {/* More pages dropdown */}
            <Button
              color="inherit"
              sx={{ fontWeight: 500, fontSize: 16, textTransform: 'none' }}
              onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
            >
              More ▾
            </Button>
            <Menu
              anchorEl={moreMenuAnchor}
              open={Boolean(moreMenuAnchor)}
              onClose={() => setMoreMenuAnchor(null)}
              PaperProps={{ sx: { mt: 1, borderRadius: 2, boxShadow: 4, minWidth: 180 } }}
            >
              {morePages.map((p) => (
                <MenuItem key={p.href} onClick={() => setMoreMenuAnchor(null)} sx={{ p: 0 }}>
                  <Link to={p.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%', padding: '8px 16px', display: 'block' }}>
                    {p.label}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
            {/* Fancy Language ComboBox at end of menu */}
            <IconButton
              color="inherit"
              onClick={handleLangClick}
              sx={{
                ml: 2,
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                transition: 'background 0.2s',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            >
              <TranslateIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 20 }}>{languages.find(l => l.code === lang)?.icon}</span>
                <span style={{ fontWeight: 600, color: '#1976d2', fontSize: 16 }}>{languages.find(l => l.code === lang)?.label}</span>
              </Box>
            </IconButton>
            <Menu
              anchorEl={langMenuAnchor}
              open={Boolean(langMenuAnchor)}
              onClose={handleLangClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 160,
                  borderRadius: 2,
                  boxShadow: 4,
                  bgcolor: '#e3f2fd'
                }
              }}
            >
              {languages.map(l => (
                <MenuItem
                  key={l.code}
                  selected={l.code === lang}
                  onClick={() => handleLangSelect(l.code)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: l.code === lang ? 700 : 500,
                    fontSize: 16,
                    bgcolor: l.code === lang ? '#bbdefb' : 'inherit',
                    color: '#1976d2',
                    '&:hover': { bgcolor: '#bbdefb' }
                  }}
                >
                  <span style={{ fontSize: 22 }}>{l.icon}</span>
                  <span>{l.label}</span>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              keepMounted
            >
              {menuLinks.map((link) =>
                link.label === "Login" ? (
                  <MenuItem
                    key={link.label}
                    onClick={() => {
                      handleClose();
                      history.push(link.href);
                    }}
                    sx={{
                      fontWeight: 600,
                      color: 'secondary.main',
                      bgcolor: 'secondary.lighter',
                      borderRadius: 1,
                      my: 1,
                    }}
                  >
                    {link.label}
                  </MenuItem>
                ) : link.label === "Contact" ? (
                  <MenuItem
                    key={link.label}
                    onClick={() => {
                      handleClose();
                      handleContactScroll();
                    }}
                  >
                    {link.label}
                  </MenuItem>
                ) : link.label === "Memberships" ? (
                  <MenuItem
                    key={link.label}
                    onClick={() => {
                      handleClose();
                      handleMenuClick("#memberships");
                    }}
                  >
                    {link.label}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={link.label}
                    onClick={() => {
                      handleClose();
                      if (link.href.startsWith("#")) {
                        handleMenuClick(link.href);
                      } else {
                        window.location.href = link.href;
                      }
                    }}
                  >
                    {link.label}
                  </MenuItem>
                )
              )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleBookVisit();
                }}
                sx={{ fontWeight: 600, color: 'secondary.main', mt: 1 }}
              >
                Book Visit
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 6, md: 10 },
          minHeight: { xs: 400, md: 520 },
          background: `linear-gradient(90deg, rgba(25,118,210,0.85) 60%, rgba(66,165,245,0.85) 100%), url(${heroImg}) center/cover no-repeat`,
          color: '#fff',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={700} gutterBottom sx={{ letterSpacing: 1 }}>
            {t("home.hero_title")}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 400 }}>
            {t("home.hero_subtitle")}
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, fontWeight: 600 }}
              onClick={handleBookVisit}
            >
              {t("home.book_appointment")}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ px: 4, fontWeight: 600 }}
              onClick={handleContactScroll}
            >
              {t("home.contact_us")}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Container id="about" maxWidth="lg" sx={{ mt: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src={aboutImg}
              alt={t("home.about_img_alt")}
              style={{ width: '100%', borderRadius: 16, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
              {t("home.about_title")}
            </Typography>
            <Divider sx={{ mb: 2, width: 60, borderColor: '#1976d2' }} />
            {loadingAbout ? (
              <Typography>{t("home.loading")}</Typography>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {aboutUs.description}
                </Typography>
                <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                  {aboutUs.highlights && aboutUs.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Services Section */}
      <Container id="services" maxWidth="lg" sx={{ mt: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
              {t("home.services_title")}
            </Typography>
            <Divider sx={{ mb: 2, width: 60, borderColor: '#1976d2' }} />
            {loadingServices ? (
              <Typography>{t("home.loading_services")}</Typography>
            ) : (
              <ul style={{ paddingLeft: 18, marginBottom: 0, fontSize: 18 }}>
                {services.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            )}
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <img
              src={servicesImg}
              alt={t("home.services_img_alt")}
              style={{ width: '100%', borderRadius: 16, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)' }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Opening Hours Section */}
      <Container id="opening" maxWidth="sm" sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
          {t("home.opening_hours")}
        </Typography>
        <Divider sx={{ mb: 3, width: 60, mx: 'auto', borderColor: '#1976d2' }} />
        <Box sx={{ textAlign: 'center' }}>
          {(clinicSettings.openHours || []).map((item, idx) => (
            <Box key={item.day} sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ minWidth: 140, textAlign: 'right' }}>
                {item.day}
              </Typography>
              <Chip
                label={item.hours}
                color={item.hours === 'Closed' ? 'error' : 'primary'}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  px: 2,
                  bgcolor: item.hours === t("home.closed") ? '#ffebee' : '#e3f2fd',
                  color: item.hours === t("home.closed") ? 'error.main' : 'primary.main',
                  borderColor: item.hours === t("home.closed") ? '#ffcdd2' : '#90caf9',
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>

      {/* Memberships Section */}
      <Container id="memberships" maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom sx={{ color: '#1976d2', letterSpacing: 1 }}>
          {t("home.memberships_title")}
        </Typography>
        <Divider sx={{ mb: 3, width: 60, mx: 'auto', borderColor: '#1976d2' }} />
        {loadingMemberships ? (
          <Typography align="center">{t("home.loading_memberships")}</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {memberships.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={item.id || idx}>
                <Card
                  elevation={8}
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: { xs: 2, md: 3 },
                    borderRadius: 5,
                    minHeight: 420,
                    width: '100%',
                    background: `linear-gradient(135deg, #e3f2fd 60%, #fff 100%)`,
                    boxShadow: '0 12px 40px rgba(25, 118, 210, 0.13)',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.025)',
                      boxShadow: '0 20px 60px rgba(25, 118, 210, 0.20)',
                    }
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 24, right: 24, zIndex: 2 }}>
                    <Chip
                      label={item.paymentStatus === "Active" ? t("home.active") : t("home.inactive")}
                      color={item.paymentStatus === "Active" ? "success" : "error"}
                      sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        px: 2.5,
                        letterSpacing: 0.5,
                        py: 1,
                      }}
                    />
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: '#1976d2',
                      width: 90,
                      height: 90,
                      mb: 2,
                      fontSize: 40,
                      fontWeight: 700,
                      boxShadow: 3,
                      zIndex: 1,
                      mt: 6,
                    }}
                  >
                    {item.membershipPlan?.[0] || t("home.m")}
                  </Avatar>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#1976d2', mb: 1.5, letterSpacing: 1, mt: 1 }}>
                    {item.membershipPlan}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    <b>{t("home.valid")}:</b> {item.validityPeriod?.startDate ? new Date(item.validityPeriod.startDate).toLocaleDateString() : '-'}
                    {" "}{t("home.to")}{" "}
                    {item.validityPeriod?.endDate ? new Date(item.validityPeriod.endDate).toLocaleDateString() : '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <b>{t("home.renewal")}:</b> {item.renewalDate ? new Date(item.renewalDate).toLocaleDateString() : '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <b>{t("home.last_payment")}:</b> {item.lastPaymentAmount ? (
                      <span style={{ color: "#388e3c", fontWeight: 600 }}>${item.lastPaymentAmount}</span>
                    ) : '-'}
                  </Typography>
                  <Divider sx={{ my: 2.5, borderColor: '#90caf9', width: '100%' }} />
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5, color: '#1976d2' }}>
                    {t("home.benefits")}
                  </Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', width: '100%', maxWidth: 400, mx: 'auto' }}>
                    {(item.benefits || []).map((b, i) => (
                      <Box
                        key={i}
                        component="li"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1.2,
                          fontSize: 17,
                          color: '#333',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#1976d2',
                            mr: 2,
                            flexShrink: 0,
                            mt: '2px'
                          }}
                        />
                        {b}
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
            {memberships.length === 0 && (
              <Typography align="center" sx={{ width: '100%', mt: 2 }}>{t("home.no_memberships")}</Typography>
            )}
          </Grid>
        )}
      </Container>

      {/* Doctors Section */}
      <Container id="doctors" maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
          {t("home.doctors_title")}
        </Typography>
        <Divider sx={{ mb: 3, width: 60, mx: 'auto', borderColor: '#1976d2' }} />
        {loadingDoctors ? (
          <Typography align="center">{t("home.loading_doctors")}</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {doctors.map((doc, idx) => (
              <Grid item xs={12} sm={6} md={3} key={doc.id || idx}>
                <Card elevation={2} sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    src={
                      doc.img
                        ? doc.img
                        : `https://randomuser.me/api/portraits/med/men/${doc.id % 50}.jpg`
                    }
                    alt={doc.fullName}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2, fontSize: 32, bgcolor: '#1976d2' }}
                  >
                    {!doc.img && (doc.fullName?.[0] || t("home.d"))}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>{doc.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">{doc.specialization || doc.specialty}</Typography>
                </Card>
              </Grid>
            ))}
            {doctors.length === 0 && (
              <Typography align="center" sx={{ width: '100%', mt: 2 }}>{t("home.no_doctors")}</Typography>
            )}
          </Grid>
        )}
      </Container>

      {/* Staff Section */}
      <Container id="staff" maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
          {t("home.staff_title")}
        </Typography>
        <Divider sx={{ mb: 3, width: 60, mx: 'auto', borderColor: '#1976d2' }} />
        {loadingStaffs ? (
          <Typography align="center">{t("home.loading_staff")}</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {staffs.map((staff, idx) => (
              <Grid item xs={12} sm={6} md={3} key={staff.id || idx}>
                <Card elevation={1} sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    src={
                      staff.img
                        ? staff.img
                        : `https://randomuser.me/api/portraits/med/women/${staff.id % 50}.jpg`
                    }
                    alt={staff.fullName}
                    sx={{ width: 70, height: 70, mx: 'auto', mb: 2, fontSize: 28, bgcolor: '#1976d2' }}
                  >
                    {!staff.img && (staff.fullName?.[0] || t("home.s"))}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>{staff.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">{staff.role}</Typography>
                </Card>
              </Grid>
            ))}
            {staffs.length === 0 && (
              <Typography align="center" sx={{ width: '100%', mt: 2 }}>{t("home.no_staff")}</Typography>
            )}
          </Grid>
        )}
      </Container>

      {/* Contact Section */}
      <Box
        id="contact"
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          ml: '-50vw',
          mr: '-50vw',
          background: `linear-gradient(rgba(25,118,210,0.85),rgba(25,118,210,0.85)), url(${contactImg}) center/cover no-repeat`,
          py: { xs: 8, md: 10 },
          mt: 10,
          mb: 10,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={4}
            sx={{
              p: { xs: 3, md: 5 },
              bgcolor: 'rgba(255,255,255,0.97)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#1976d2' }}>
              {t("home.contact_title")}
            </Typography>
            <Divider sx={{ mb: 3, width: 60, mx: 'auto', borderColor: '#1976d2', opacity: 0.6 }} />
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t("home.contact_subtitle")}
            </Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mb: 1 }}>
                    <i className="fas fa-envelope" style={{ color: '#fff' }} />
                  </Avatar>
                  <Typography variant="subtitle2" color="text.secondary">{t("home.email")}</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {clinicSettings.system.email || 'info@denticclinic.com'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mb: 1 }}>
                    <i className="fas fa-phone" style={{ color: '#fff' }} />
                  </Avatar>
                  <Typography variant="subtitle2" color="text.secondary">{t("home.phone")}</Typography>
                  <Typography variant="body2">
                    {clinicSettings.system.phone || '+1 234 567 890'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mb: 1 }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#fff' }} />
                  </Avatar>
                  <Typography variant="subtitle2" color="text.secondary">{t("home.address")}</Typography>
                  <Typography variant="body2">
                    {clinicSettings.system.address || '123 Smile Street, Happy City, Country'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, px: 5, fontWeight: 600, borderRadius: 2 }}
              onClick={() => window.location.href = '/send-message'}
            >
              {t("home.send_message")}
            </Button>
          </Card>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: '#1976d2', color: '#fff', py: 6, mt: 10 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            {t("home.cta_title")}
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 5, fontWeight: 600 }}
              onClick={handleBookVisit}
            >
              {t("home.cta_button")}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0d1b2a', color: '#c9d6df', mt: 8 }}>

        {/* Top band */}
        <Box sx={{ background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)', py: 5 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', letterSpacing: 0.5, mb: 1 }}>
                  🦷 DenticClinic
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 420, lineHeight: 1.7 }}>
                  Modern, compassionate dental care for the whole family. We combine cutting-edge technology with a gentle touch to keep your smile at its best.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', mb: 1.5 }}>
                  Ready to book your next visit?
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleBookVisit}
                  sx={{ bgcolor: '#fff', color: '#1565c0', fontWeight: 700, px: 4, borderRadius: 3, fontSize: 15, '&:hover': { bgcolor: '#e3f2fd' } }}
                >
                  Book Appointment
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main footer columns */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={5}>

            {/* Col 1 — Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', mb: 2, letterSpacing: 0.5 }}>
                Contact Us
              </Typography>
              {[
                { icon: '📍', text: clinicSettings.system.address || '123 Smile Street, Happy City' },
                { icon: '📞', text: clinicSettings.system.phone  || '+1 234 567 890' },
                { icon: '✉️', text: clinicSettings.system.email  || 'info@denticclinic.com' },
              ].map(({ icon, text }) => (
                <Box key={text} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, lineHeight: 1.6 }}>{icon}</span>
                  <Typography variant="body2" sx={{ color: '#a8bccf', lineHeight: 1.6 }}>{text}</Typography>
                </Box>
              ))}
            </Grid>

            {/* Col 2 — Quick Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', mb: 2, letterSpacing: 0.5 }}>
                Quick Links
              </Typography>
              {[
                { label: 'About Us',      href: '#about' },
                { label: 'Our Services',  href: '#services' },
                { label: 'Our Doctors',   href: '#doctors' },
                { label: 'Memberships',   href: '#memberships' },
                { label: 'Contact',       href: '#contact' },
                { label: 'Patient Login', href: '/login' },
              ].map(({ label, href }) => (
                <Box key={label} sx={{ mb: 1 }}>
                  <Link
                    to={href.startsWith('/') ? href : undefined}
                    href={href.startsWith('#') ? href : undefined}
                    onClick={href.startsWith('#') ? () => { const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: 'smooth' }); } : undefined}
                    style={{ color: '#a8bccf', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span style={{ color: '#42a5f5', fontSize: 12 }}>▶</span> {label}
                  </Link>
                </Box>
              ))}
            </Grid>

            {/* Col 3 — Opening Hours */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', mb: 2, letterSpacing: 0.5 }}>
                Opening Hours
              </Typography>
              {(clinicSettings.openHours || []).map(({ day, hours }) => (
                <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#a8bccf' }}>{day}</Typography>
                  <Typography variant="body2" sx={{ color: hours === 'Closed' ? '#ef9a9a' : '#81d4fa', fontWeight: 600 }}>{hours}</Typography>
                </Box>
              ))}
            </Grid>

            {/* Col 4 — Services */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', mb: 2, letterSpacing: 0.5 }}>
                Our Services
              </Typography>
              {[
                'General Dentistry',
                'Cosmetic Dentistry',
                'Dental Implants',
                'Orthodontics',
                'Pediatric Dentistry',
                'Emergency Care',
              ].map(s => (
                <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#42a5f5', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: '#a8bccf' }}>{s}</Typography>
                </Box>
              ))}
            </Grid>

          </Grid>
        </Container>

        {/* Bottom bar */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', py: 2.5 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b8a9e', textAlign: { xs: 'center', sm: 'left' } }}>
                &copy; {new Date().getFullYear()} DenticClinic. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(label => (
                  <Typography key={label} variant="body2" sx={{ color: '#6b8a9e', cursor: 'pointer', '&:hover': { color: '#42a5f5' }, transition: 'color 0.2s' }}>
                    {label}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

      </Box>

      {/* Booking Stepper Dialog */}
      <Dialog
        open={bookingOpen}
        onClose={handleBookingClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {bookingSuccess ? (
          /* ── Success screen ── */
          <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 90, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>
              Appointment Booked!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              We will confirm your appointment shortly. Check your email for details.
            </Typography>
            <Button variant="contained" color="primary" size="large" onClick={handleBookingClose} sx={{ px: 6, borderRadius: 3, fontWeight: 700 }}>
              Done
            </Button>
          </Box>
        ) : (
          <>
            {/* Gradient header + stepper */}
            <Box sx={{ background: 'linear-gradient(100deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)', px: 3, pt: 3, pb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: 0.5 }}>
                  🦷 Book an Appointment
                </Typography>
                <IconButton onClick={handleBookingClose} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
                  <span style={{ fontSize: 20, lineHeight: 1, fontWeight: 700 }}>&times;</span>
                </IconButton>
              </Box>
              <Stepper
                activeStep={bookingStep}
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-label':           { color: 'rgba(255,255,255,0.55)', fontSize: 12, mt: '4px' },
                  '& .MuiStepLabel-label.Mui-active':    { color: '#fff', fontWeight: 700 },
                  '& .MuiStepLabel-label.Mui-completed': { color: 'rgba(255,255,255,0.85)' },
                  '& .MuiStepIcon-root':              { color: 'rgba(255,255,255,0.2)' },
                  '& .MuiStepIcon-root.Mui-active':   { color: '#fff' },
                  '& .MuiStepIcon-root.Mui-completed':{ color: '#81c784' },
                  '& .MuiStepIcon-text':              { fill: '#1565c0' },
                  '& .MuiStepConnector-line':         { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {['Personal Info', 'Medical Details', 'Appointment', 'Confirm'].map(label => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
            </Box>

            <DialogContent sx={{ p: { xs: 3, md: 4 }, minHeight: 360 }}>

              {/* ── Step 0: Personal Info ── */}
              {bookingStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', mb: 1 }}>👤 Your Information</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Fields marked * are required to proceed.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Full Name *" value={patientForm.fullName} onChange={e => setPatientForm(f => ({ ...f, fullName: e.target.value }))} fullWidth autoFocus />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Phone Number" value={patientForm.phone} onChange={e => setPatientForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Email Address" value={patientForm.email} onChange={e => setPatientForm(f => ({ ...f, email: e.target.value }))} fullWidth type="email" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Date of Birth" value={patientForm.dateOfBirth} onChange={e => setPatientForm(f => ({ ...f, dateOfBirth: e.target.value }))} fullWidth type="date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Medical Record Number" value={patientForm.medicalRecordNumber} onChange={e => setPatientForm(f => ({ ...f, medicalRecordNumber: e.target.value }))} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Insurance ID" value={patientForm.insuranceId} onChange={e => setPatientForm(f => ({ ...f, insuranceId: e.target.value }))} fullWidth />
                  </Grid>
                </Grid>
              )}

              {/* ── Step 1: Medical Details ── */}
              {bookingStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', mb: 1 }}>🏥 Medical Information</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>All fields are optional — skip if not applicable.</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Blood Type</InputLabel>
                      <Select label="Blood Type" value={patientForm.bloodType} onChange={e => setPatientForm(f => ({ ...f, bloodType: e.target.value }))}>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bt => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Allergies (comma separated)"
                      value={patientForm.allergies.join(', ')}
                      onChange={e => setPatientForm(f => ({ ...f, allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean) }))}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#555', mt: 1, mb: 1 }}>Emergency Contact</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Contact Name" value={patientForm.emergencyContact.name} onChange={e => setPatientForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, name: e.target.value } }))} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Contact Phone" value={patientForm.emergencyContact.phone} onChange={e => setPatientForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, phone: e.target.value } }))} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Relationship" value={patientForm.emergencyContact.relationship} onChange={e => setPatientForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, relationship: e.target.value } }))} fullWidth />
                  </Grid>
                </Grid>
              )}

              {/* ── Step 2: Appointment Details ── */}
              {bookingStep === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', mb: 1 }}>📅 Appointment Details</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Choose your doctor, preferred date, and time.</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Select Doctor *</InputLabel>
                      <Select label="Select Doctor *" value={appointmentForm.doctorId} onChange={e => setAppointmentForm(f => ({ ...f, doctorId: e.target.value }))}>
                        {(doctorsList.length > 0 ? doctorsList : FALLBACK_DOCTORS).map(doc => (
                          <MenuItem key={doc.id} value={doc.id}>
                            {doc.fullName}{doc.specialization ? ` — ${doc.specialization}` : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Appointment Type *</InputLabel>
                      <Select label="Appointment Type *" value={appointmentForm.appointmentType} onChange={e => setAppointmentForm(f => ({ ...f, appointmentType: e.target.value }))}>
                        <MenuItem value="In-Person">🏥 In-Person</MenuItem>
                        <MenuItem value="Telemedicine">💻 Telemedicine</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Appointment Date *"
                      type="date"
                      value={appointmentForm.appointmentDate}
                      onChange={e => setAppointmentForm(f => ({ ...f, appointmentDate: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Start Time *" type="time" value={appointmentForm.startTime} onChange={e => setAppointmentForm(f => ({ ...f, startTime: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="End Time" type="time" value={appointmentForm.endTime} onChange={e => setAppointmentForm(f => ({ ...f, endTime: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Reason for Visit" value={appointmentForm.reasonForVisit} onChange={e => setAppointmentForm(f => ({ ...f, reasonForVisit: e.target.value }))} fullWidth multiline rows={2} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Additional Notes" value={appointmentForm.notes} onChange={e => setAppointmentForm(f => ({ ...f, notes: e.target.value }))} fullWidth multiline rows={2} />
                  </Grid>
                </Grid>
              )}

              {/* ── Step 3: Review & Confirm ── */}
              {bookingStep === 3 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#1976d2', mb: 3 }}>✅ Review your Booking</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: '#90caf9', height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, mb: 1.5, fontSize: 14 }}>Patient Details</Typography>
                        {[
                          ['Name',       patientForm.fullName],
                          ['Phone',      patientForm.phone],
                          ['Email',      patientForm.email],
                          ['DOB',        patientForm.dateOfBirth],
                          ['Blood Type', patientForm.bloodType],
                          ['Allergies',  patientForm.allergies.join(', ')],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <Typography key={k} variant="body2" sx={{ mb: 0.5 }}><b>{k}:</b> {v}</Typography>
                        ))}
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: '#90caf9', height: '100%' }}>
                        <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, mb: 1.5, fontSize: 14 }}>Appointment</Typography>
                        {[
                          ['Doctor', (doctorsList.length > 0 ? doctorsList : FALLBACK_DOCTORS).find(d => String(d.id) === String(appointmentForm.doctorId))?.fullName],
                          ['Type',   appointmentForm.appointmentType],
                          ['Date',   appointmentForm.appointmentDate],
                          ['Time',   appointmentForm.startTime ? `${appointmentForm.startTime}${appointmentForm.endTime ? ' → ' + appointmentForm.endTime : ''}` : null],
                          ['Reason', appointmentForm.reasonForVisit],
                          ['Notes',  appointmentForm.notes],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <Typography key={k} variant="body2" sx={{ mb: 0.5 }}><b>{k}:</b> {v}</Typography>
                        ))}
                      </Card>
                    </Grid>
                  </Grid>
                  <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
                    By confirming, you agree to our booking policy. A confirmation will be sent to your email or phone.
                  </Alert>
                </Box>
              )}

            </DialogContent>

            <DialogActions sx={{ px: { xs: 3, md: 4 }, pb: 3, pt: 1, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBookingClose} variant="text" color="inherit" sx={{ color: '#888' }}>Cancel</Button>
                {bookingStep > 0 && (
                  <Button onClick={handleBookingBack} variant="outlined" color="primary" sx={{ borderRadius: 2 }}>← Back</Button>
                )}
              </Box>
              <Box>
                {bookingStep < 3 ? (
                  <Button
                    onClick={handleBookingNext}
                    variant="contained"
                    color="primary"
                    disabled={bookingStep === 0 && !patientForm.fullName.trim()}
                    sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    onClick={handleBookingSubmit}
                    variant="contained"
                    disabled={bookingSubmitting || !appointmentForm.doctorId || !appointmentForm.appointmentDate || !appointmentForm.startTime}
                    sx={{ px: 5, borderRadius: 2, fontWeight: 700, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, color: '#fff' }}
                  >
                    {bookingSubmitting ? 'Booking…' : '✓ Confirm Booking'}
                  </Button>
                )}
              </Box>
            </DialogActions>
            {bookingSubmitting && <LinearProgress />}
          </>
        )}
      </Dialog>

      {/* Chatbot Box (not modal) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 9999,
          width: 340,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 6,
          p: 2,
          border: '2px solid #90caf9',
          display: chatOpen ? 'block' : 'none'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ChatIcon sx={{ color: '#1976d2', mr: 1 }} />
          <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2', flexGrow: 1 }}>
            Clinic Chatbot
          </Typography>
          <IconButton size="small" onClick={() => setChatOpen(false)}>
            <span style={{ fontSize: 22, color: '#1976d2' }}>&times;</span>
          </IconButton>
        </Box>
        <Typography sx={{ mb: 2, fontSize: 15 }}>
          Ask a question about our clinic, services, or appointments.
        </Typography>
        <TextField
          label="Your Question"
          value={chatQuestion}
          onChange={e => setChatQuestion(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="How do I book an appointment?"
          size="small"
        />
        <TextField
          label="Context (optional)"
          value={chatContext}
          onChange={e => setChatContext(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="e.g. I want to book for next week"
          size="small"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="info"
            onClick={handleSendChat}
            disabled={chatLoading || !chatQuestion}
            size="small"
          >
            Send
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setChatOpen(false)}
            size="small"
          >
            Close
          </Button>
        </Box>
        {chatLoading && <LinearProgress sx={{ mt: 2 }} />}
        {chatAnswer && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Answer:</Typography>
            <Typography variant="body1">{chatAnswer}</Typography>
          </Box>
        )}
      </Box>

      {/* Floating Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: chatOpen ? 390 : 32,
          zIndex: 9998
        }}
      >
        {!chatOpen && (
          <Button
            variant="contained"
            color="info"
            startIcon={<ChatIcon />}
            sx={{
              borderRadius: '50px',
              px: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: 3
            }}
            onClick={() => setChatOpen(true)}
          >
            Chat
          </Button>
        )}
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );

};
export default HomePage;
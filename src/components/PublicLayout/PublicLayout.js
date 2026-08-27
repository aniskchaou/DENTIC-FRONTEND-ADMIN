import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Drawer, List, ListItem, ListItemText, Divider,
  Container, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Dentists', to: '/dentists' },
  { label: 'Services', to: '/services' },
  { label: 'Locations', to: '/locations' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const MORE_LINKS = [
  { label: 'New Patient', to: '/new-patient' },
  { label: 'Patient Information', to: '/patient-information' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Before & After', to: '/before-after' },
  { label: 'Financing', to: '/financing' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Careers', to: '/careers' },
  { label: 'AI Dental Assistant', to: '/ai' },
];

const PublicLayout = ({ children }) => {
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState(null);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ bgcolor: '#1565c0', py: 0.5, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon sx={{ color: '#fff', fontSize: 16 }} />
          <Typography variant="caption" sx={{ color: '#e3f2fd', fontWeight: 500 }}>
            +1 (555) 012-3456 &nbsp;|&nbsp; Mon–Fri 8am–6pm, Sat 9am–1pm
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<LocalHospitalIcon sx={{ fontSize: 14 }} />}
          onClick={() => history.push('/emergency')}
          sx={{ fontSize: 11, py: 0, px: 1.5, borderRadius: 1 }}
        >
          Dental Emergency
        </Button>
      </Box>

      {/* Main AppBar */}
      <AppBar position="sticky" color="primary" elevation={1} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Link to="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#fff' }}>
              Dentic<span style={{ color: '#90caf9' }}>Clinic</span>
            </Typography>
          </Link>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {NAV_LINKS.map(link => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15 }}
              >
                {link.label}
              </Button>
            ))}
            <Button
              sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15 }}
              onClick={e => setMoreAnchor(e.currentTarget)}
            >
              More ▾
            </Button>
            <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
              {MORE_LINKS.map(link => (
                <MenuItem key={link.to} component={Link} to={link.to} onClick={() => setMoreAnchor(null)}>
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
            <Button
              variant="outlined"
              sx={{ ml: 1, color: '#fff', borderColor: '#90caf9', textTransform: 'none', fontWeight: 600 }}
              component={Link}
              to="/login"
            >
              Patient Portal
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: 1, textTransform: 'none', fontWeight: 700 }}
              component={Link}
              to="/book-appointment"
            >
              Book Now
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton color="inherit" sx={{ display: { lg: 'none' } }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>
            {[...NAV_LINKS, ...MORE_LINKS].map(link => (
              <ListItem button key={link.to} component={Link} to={link.to} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem button component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Patient Portal" />
            </ListItem>
            <ListItem button component={Link} to="/book-appointment" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Book Appointment" primaryTypographyProps={{ fontWeight: 700, color: 'secondary.main' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Page content */}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a237e', color: '#fff', pt: 6, pb: 3, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight={800} gutterBottom>DenticClinic</Typography>
              <Typography variant="body2" sx={{ color: '#90caf9', lineHeight: 1.8 }}>
                Providing exceptional dental care for the whole family.
                State-of-the-art technology, compassionate team.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>Quick Links</Typography>
              {NAV_LINKS.slice(0, 5).map(l => (
                <Box key={l.to}><Link to={l.to} style={{ color: '#90caf9', textDecoration: 'none', fontSize: 14 }}>{l.label}</Link></Box>
              ))}
            </Grid>
            <Grid item xs={6} sm={2}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>Patients</Typography>
              {[{ label: 'New Patient', to: '/new-patient' }, { label: 'Patient Info', to: '/patient-information' }, { label: 'Book Now', to: '/book-appointment' }, { label: 'Patient Portal', to: '/login' }, { label: 'Emergency', to: '/emergency' }].map(l => (
                <Box key={l.to}><Link to={l.to} style={{ color: '#90caf9', textDecoration: 'none', fontSize: 14 }}>{l.label}</Link></Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>Contact</Typography>
              <Typography variant="body2" sx={{ color: '#90caf9' }}>123 Dental Ave, Metropolis, MS 12345</Typography>
              <Typography variant="body2" sx={{ color: '#90caf9' }}>Phone: +1 (555) 012-3456</Typography>
              <Typography variant="body2" sx={{ color: '#90caf9' }}>Email: hello@denticclinic.com</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                {['/privacy', '/terms', '/cookies'].map(p => (
                  <Link key={p} to={p} style={{ color: '#64b5f6', fontSize: 12, textDecoration: 'none' }}>
                    {p.slice(1).charAt(0).toUpperCase() + p.slice(2)}
                  </Link>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: '#3949ab', my: 3 }} />
          <Typography variant="body2" align="center" sx={{ color: '#90caf9' }}>
            © {new Date().getFullYear()} DenticClinic. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;

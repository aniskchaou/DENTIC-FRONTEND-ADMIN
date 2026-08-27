import React from 'react';
import { Box, Container, Typography, Divider, Button, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PublicLayout from '../PublicLayout/PublicLayout';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'January 15, 2024',
    sections: [
      {
        heading: '1. Information We Collect',
        body: `We collect information you provide directly to us, including your name, email address, phone number, date of birth, dental and medical history, insurance information, and payment information. We also collect information automatically when you use our website, such as your IP address, browser type, pages visited, and cookies.`
      },
      {
        heading: '2. How We Use Your Information',
        body: `We use the information we collect to:\n• Schedule and manage appointments\n• Provide dental treatment and clinical care\n• Process insurance claims and payments\n• Send appointment reminders and health communications\n• Comply with legal and regulatory obligations (including HIPAA)\n• Improve our website and services`
      },
      {
        heading: '3. HIPAA Compliance',
        body: `As a healthcare provider, we are subject to the Health Insurance Portability and Accountability Act (HIPAA). Your protected health information (PHI) is handled in strict accordance with HIPAA regulations. We maintain appropriate safeguards to protect the privacy and security of your PHI.`
      },
      {
        heading: '4. Sharing Your Information',
        body: `We do not sell your personal information. We may share your information with:\n• Other healthcare providers involved in your care\n• Insurance companies for billing purposes\n• Service providers who assist our operations (under strict data processing agreements)\n• Regulators, law enforcement, or courts when required by law`
      },
      {
        heading: '5. Data Retention',
        body: `We retain your records in accordance with applicable law. Dental records are typically retained for at least 7 years, or 7 years after a minor turns 18.`
      },
      {
        heading: '6. Your Rights',
        body: `You have the right to:\n• Access your personal data and health records\n• Request corrections to inaccurate data\n• Request deletion of personal data (subject to legal retention requirements)\n• Opt out of marketing communications\n• File a complaint with the relevant data protection authority`
      },
      {
        heading: '7. Contact Us',
        body: `For privacy inquiries, contact our Privacy Officer at:\nEmail: privacy@denticclinic.com\nPhone: +1 (555) 012-3456\nAddress: 123 Dental Ave, Metropolis, MS 12345`
      },
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'January 15, 2024',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: `By using DenticClinic's website and services, you agree to these Terms and Conditions. If you do not agree, please do not use our services.`
      },
      {
        heading: '2. Appointment Policy',
        body: `Appointments must be cancelled with at least 24 hours notice. Late cancellations or no-shows may incur a fee. We reserve the right to require a deposit for future bookings after repeated no-shows.`
      },
      {
        heading: '3. Payment',
        body: `Payment is due at the time of service unless alternative arrangements are made in advance. We accept most insurance plans, credit cards, HSA/FSA cards, and offer financing through approved providers.`
      },
      {
        heading: '4. Medical Disclaimer',
        body: `Information on this website is for general educational purposes and does not constitute medical advice. Always consult a qualified dental professional for diagnosis and treatment.`
      },
      {
        heading: '5. Limitation of Liability',
        body: `DenticClinic is not liable for any indirect, incidental, or consequential damages arising from use of our website or services, to the maximum extent permitted by law.`
      },
      {
        heading: '6. Intellectual Property',
        body: `All content on this website, including text, images, and logos, is the property of DenticClinic and protected by copyright. You may not reproduce or distribute content without our written permission.`
      },
      {
        heading: '7. Changes',
        body: `We may update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms.`
      },
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    updated: 'January 15, 2024',
    sections: [
      {
        heading: '1. What Are Cookies',
        body: `Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience and understand how our site is used.`
      },
      {
        heading: '2. Types of Cookies We Use',
        body: `Essential Cookies: Required for the website to function (login sessions, form submissions).\n\nAnalytical Cookies: Help us understand visitor behaviour (e.g., Google Analytics). Anonymous data only.\n\nFunctional Cookies: Remember your preferences (language, location).\n\nMarketing Cookies: Used for targeted advertising when you consent.`
      },
      {
        heading: '3. Managing Cookies',
        body: `You can control cookies through your browser settings. Note that disabling essential cookies may affect site functionality. You can also use our cookie preference centre (banner shown on first visit) to manage consent by category.`
      },
      {
        heading: '4. Third-Party Cookies',
        body: `Some cookies are set by third parties (e.g., Google Analytics, Facebook Pixel) when you interact with embedded content or social share buttons. These third parties have their own privacy policies.`
      },
      {
        heading: '5. Contact',
        body: `For questions about our cookie practices, email: privacy@denticclinic.com`
      },
    ]
  },
  accessibility: {
    title: 'Accessibility Statement',
    updated: 'January 15, 2024',
    sections: [
      {
        heading: 'Our Commitment',
        body: `DenticClinic is committed to ensuring our website and digital services are accessible to all users, including those with disabilities. We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.`
      },
      {
        heading: 'Measures We Take',
        body: `• Alt text on all images\n• Keyboard navigation support throughout the site\n• Sufficient colour contrast ratios\n• Screen reader compatible markup\n• Responsive design for all device sizes\n• Clear and simple language`
      },
      {
        heading: 'Known Limitations',
        body: `Some older PDFs (e.g., forms) may not be fully accessible. We are actively working to improve these. Alternative formats are available on request.`
      },
      {
        heading: 'Requesting Accessible Formats',
        body: `If you need any information in an alternative format, please contact us:\nEmail: accessibility@denticclinic.com\nPhone: +1 (555) 012-3456`
      },
      {
        heading: 'Feedback',
        body: `We welcome feedback on the accessibility of our website. If you encounter any barriers, please let us know and we will address them as quickly as possible.`
      },
    ]
  },
};

const PAGES = [
  { key: 'privacy', label: 'Privacy Policy', path: '/privacy' },
  { key: 'terms', label: 'Terms & Conditions', path: '/terms' },
  { key: 'cookies', label: 'Cookie Policy', path: '/cookies' },
  { key: 'accessibility', label: 'Accessibility', path: '/accessibility' },
];

const PublicLegal = ({ type }) => {
  const location = useLocation();
  const pageKey = type || PAGES.find(p => p.path === location.pathname)?.key || 'privacy';
  const page = LEGAL_CONTENT[pageKey] || LEGAL_CONTENT.privacy;

  return (
    <PublicLayout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1a237e', color: '#fff', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} gutterBottom>{page.title}</Typography>
          <Typography variant="body1" sx={{ color: '#9fa8da' }}>Last updated: {page.updated}</Typography>
        </Container>
      </Box>

      {/* Page selector */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PAGES.map(p => (
              <Chip
                key={p.key} label={p.label}
                component={Link} to={p.path} clickable
                color={p.key === pageKey ? 'primary' : 'default'}
                sx={{ fontWeight: p.key === pageKey ? 700 : 400 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        {page.sections.map((section, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>{section.heading}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, whiteSpace: 'pre-wrap' }}>
              {section.body}
            </Typography>
            {i < page.sections.length - 1 && <Divider sx={{ mt: 4 }} />}
          </Box>
        ))}

        <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2, mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            If you have questions about this policy, please <Link to="/contact" style={{ color: '#1976d2' }}>contact us</Link> or call +1 (555) 012-3456.
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default PublicLegal;

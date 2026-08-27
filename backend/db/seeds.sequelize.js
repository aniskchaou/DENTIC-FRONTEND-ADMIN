// Add getSystemSettings function for SystemSettings seeding
exports.getSystemSettings = () => {
    return {
        appName: 'Dentic',
        version: '1.0.0',
        maintenance: false,
        supportEmail: 'support@dentic.fr',
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

const fs = require('fs');

exports.userSeeds = [
    {
        username: 'admin',
        password: 'admin',
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        phone: '1234567890',
        profilePicture: 'https://example.com/admin.jpg',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'staffuser',
        password: 'staffpass',
        fullName: 'Staff User',
        email: 'staff@example.com',
        role: 'STAFF',
        phone: '1234567891',
        profilePicture: 'https://example.com/staff.jpg',
        dateOfBirth: new Date('1990-02-02'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'doctoruser',
        password: 'doctorpass',
        fullName: 'Doctor User',
        email: 'doctor@example.com',
        role: 'DOCTOR',
        phone: '1234567892',
        profilePicture: 'https://example.com/doctor.jpg',
        dateOfBirth: new Date('1985-03-03'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'accountantuser',
        password: 'accountantpass',
        fullName: 'Accountant User',
        email: 'accountant@example.com',
        role: 'ACCOUNTANT',
        phone: '1234567893',
        profilePicture: 'https://example.com/accountant.jpg',
        dateOfBirth: new Date('1992-04-04'),
        gender: 'Female',
        status: 'Active',
    }
        ,
        {
            username: 'technicaluser',
            password: 'technicalpass',
            fullName: 'Technical User',
            email: 'technical@example.com',
            role: 'TECHNICAL',
            phone: '1234567894',
            profilePicture: 'https://example.com/technical.jpg',
            dateOfBirth: new Date('1993-05-05'),
            gender: 'Male',
            status: 'Active',
        },
        {
            username: 'patient',
            password: 'patient123',
            fullName: 'Patient User',
            email: 'patient@example.com',
            role: 'PATIENT',
            phone: '1234567896',
            profilePicture: 'https://example.com/patient.jpg',
            dateOfBirth: new Date('1995-06-15'),
            gender: 'Female',
            status: 'Active',
        }
];

exports.patientUserSeed = {
    username: 'patientuser',
    password: 'patientpass',
    fullName: 'Patient User',
    email: 'patient@example.com',
    role: 'PATIENT',
    phone: '1234567896',
    profilePicture: 'https://example.com/patient.jpg',
    dateOfBirth: new Date('1995-06-15'),
    gender: 'Female',
    status: 'Active',
};


exports.serviceSeed = [{
    name: 'Popular Use Of The Internet',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's1.jpg'

},
{
    name: 'Protective Preventative',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's2.jpg'

},
{
    name: 'Download Free Songs',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's3.jpg'

},
{
    name: 'A Discount Toner Cartridge',
    description: 'inappropriate behavior is oftenlaug hed off as “boys will be boys,” women face higher conduct women face higher conduct.',
    status: 'active',
    fileName: 's4.jpg'

}]

exports.expenseSeed = {
    nameexpense: '',
    amount: 0,
    datee: new Date(1980, 6, 20),
    note: 'a'
}

exports.patientSeed = {
    namepatient: 'a',
    emailpatient: 'a',
    birth: new Date(1980, 6, 20),
    telephone: 'a',
    gender: 'a',
    address: 'a'
}


exports.servicePageSeed = {
    title: 'Services',
    subtitle: 'What we Offer to our Customers',
    intro: 'Who are in extremely love with eco friendly system.'
}

exports.schedulePageSeed = {
    title: 'Opening Hours',
    subtitle: 'Get ready to cast your vote and select the right one',
    intro: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}

const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPasswordSync(password) {
  return bcrypt.hashSync(password, saltRounds);
}

exports.userSeeds = [
    {
        username: 'admin',
        password: hashPasswordSync('admin'),
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        phone: '1234567890',
        profilePicture: 'https://example.com/admin.jpg',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'staffuser',
        password: hashPasswordSync('staffpass'),
        fullName: 'Staff User',
        email: 'staff@example.com',
        role: 'STAFF',
        phone: '1234567891',
        profilePicture: 'https://example.com/staff.jpg',
        dateOfBirth: new Date('1990-02-02'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'doctoruser',
        password: hashPasswordSync('doctorpass'),
        fullName: 'Doctor User',
        email: 'doctor@example.com',
        role: 'DOCTOR',
        phone: '1234567892',
        profilePicture: 'https://example.com/doctor.jpg',
        dateOfBirth: new Date('1985-03-03'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'accountantuser',
        password: hashPasswordSync('accountantpass'),
        fullName: 'Accountant User',
        email: 'accountant@example.com',
        role: 'ACCOUNTANT',
        phone: '1234567893',
        profilePicture: 'https://example.com/accountant.jpg',
        dateOfBirth: new Date('1988-04-04'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'technicaluser',
        password: hashPasswordSync('technicalpass'),
        fullName: 'Technical User',
        email: 'technical@example.com',
        role: 'TECHNICAL',
        phone: '1234567894',
        profilePicture: 'https://example.com/technical.jpg',
        dateOfBirth: new Date('1992-05-05'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'superadmin',
        password: hashPasswordSync('superadminpass'),
        fullName: 'Super Admin',
        email: 'superadmin@example.com',
        role: 'SUPERADMIN',
        phone: '1234567895',
        profilePicture: 'https://example.com/superadmin.jpg',
        dateOfBirth: new Date('1978-06-06'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'treatmentcoord',
        password: hashPasswordSync('treatmentpass'),
        fullName: 'Treatment Coordinator',
        email: 'treatment@example.com',
        role: 'TREATMENT_COORD',
        phone: '1234567896',
        profilePicture: 'https://example.com/treatment.jpg',
        dateOfBirth: new Date('1991-07-07'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'patientuser',
        password: hashPasswordSync('patientpass'),
        fullName: 'Patient User',
        email: 'patient@example.com',
        role: 'PATIENT',
        phone: '1234567897',
        profilePicture: 'https://example.com/patient.jpg',
        dateOfBirth: new Date('1995-08-08'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'clinicowner',
        password: hashPasswordSync('clinicpass'),
        fullName: 'Clinic Owner',
        email: 'clinicowner@example.com',
        role: 'CLINIC_OWNER',
        phone: '1234567898',
        profilePicture: 'https://example.com/clinicowner.jpg',
        dateOfBirth: new Date('1975-09-09'),
        gender: 'Male',
        status: 'Active',
    },
    {
        username: 'insurancecoord',
        password: hashPasswordSync('insurancepass'),
        fullName: 'Insurance Coordinator',
        email: 'insurance@example.com',
        role: 'INSURANCE_COORD',
        phone: '1234567899',
        profilePicture: 'https://example.com/insurance.jpg',
        dateOfBirth: new Date('1987-10-10'),
        gender: 'Female',
        status: 'Active',
    },
    {
        username: 'dentalassist',
        password: hashPasswordSync('assistpass'),
        fullName: 'Dental Assistant',
        email: 'assistant@example.com',
        role: 'DENTAL_ASSISTANT',
        phone: '1234567800',
        profilePicture: 'https://example.com/assistant.jpg',
        dateOfBirth: new Date('1993-11-11'),
        gender: 'Female',
        status: 'Active',
    },
];


exports.getEmailTemplateSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/email_template.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}


exports.getEmailSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/email.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getFooterSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/footer.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getHeaderSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/header.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getLocalisationSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/localisation.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getNotificationSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/notification.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

exports.getDashboardSettings = () => {
    var rawdata = fs.readFileSync(require('path').join(__dirname, 'settings/dashboard.json'));
    var student = JSON.parse(rawdata);
    console.log(student);
    return student
}

// ── EXTENDED SEED DATA ────────────────────────────────────────────────────

const CLINIC_UUID  = '11111111-0000-0000-0000-000000000001';
const PATIENT_UUID = '22222222-0000-0000-0000-000000000001';
const DOCTOR_UUID  = '33333333-0000-0000-0000-000000000001';

exports.educationalContentSeeds = [
  { title: 'Understanding Tooth Decay', category: 'prevention', contentType: 'article', body: 'Tooth decay (dental caries) occurs when bacteria in your mouth produce acids that erode tooth enamel. Daily brushing and flossing remove the plaque that harbours these bacteria. Fluoride toothpaste strengthens enamel and makes it more resistant to acid attack.', tags: ['cavity','enamel','fluoride'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 5, targetAgeMax: 80 },
  { title: 'Post-Extraction Care', category: 'aftercare', contentType: 'article', body: 'After a tooth extraction bite firmly on the gauze pad for 30–45 minutes. Avoid rinsing, spitting, or using a straw for 24 hours to protect the blood clot. Apply ice packs to reduce swelling and take prescribed pain medication as directed. Soft foods are recommended for the first 24–48 hours.', tags: ['extraction','aftercare','healing'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 16, targetAgeMax: 90 },
  { title: 'How Dental Implants Work', category: 'procedure', contentType: 'article', body: 'A dental implant is a titanium post surgically placed into the jawbone to act as an artificial tooth root. Over several months the bone fuses to the implant (osseointegration). A crown is then attached to the abutment on top. Implants look, feel, and function like natural teeth.', tags: ['implant','prosthetic','surgery'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 18, targetAgeMax: 80 },
  { title: "Children's First Dental Visit", category: 'general', contentType: 'article', body: "The American Academy of Pediatric Dentistry recommends that a child see a dentist by their first birthday or when the first tooth appears. Early visits help establish good habits and allow the dentist to monitor development and prevent early childhood cavities.", tags: ['pediatric','first visit','prevention'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 0, targetAgeMax: 12 },
  { title: 'Gum Disease: Causes & Treatment', category: 'hygiene', contentType: 'article', body: 'Periodontal (gum) disease ranges from simple gum inflammation (gingivitis) to serious disease damaging the bone supporting the teeth. It is primarily caused by plaque. Treatments include professional cleaning, scaling and root planing, antibiotics, and in severe cases surgery.', tags: ['gum','periodontal','hygiene'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 18, targetAgeMax: 90 },
  { title: 'FAQ: Teeth Whitening', category: 'faq', contentType: 'article', body: 'Q: Is whitening safe? A: Yes, when done by a professional. Q: How long does it last? A: 6 months to 2 years with good oral hygiene. Q: Does it work on crowns? A: No, whitening only affects natural enamel. Q: Any side effects? A: Temporary tooth sensitivity is common.', tags: ['whitening','FAQ','cosmetic'], isPublished: true, viewCount: 0, likeCount: 0, targetAgeMin: 18, targetAgeMax: 70 },
];

exports.messagesSeeds = [
  { name: 'Alice Johnson', subject: 'Appointment Inquiry', message: 'Hi, I would like to schedule a cleaning appointment for next Tuesday if possible.' },
  { name: 'Bob Williams', subject: 'Insurance Question', message: 'Does the clinic accept BlueCross BlueShield? Please let me know as soon as possible.' },
  { name: 'Carol Davis',  subject: 'Follow-up after Root Canal', message: 'I am experiencing mild sensitivity on the treated tooth. Is this normal?' },
  { name: 'David Lee',    subject: 'Request for Records', message: 'Could you please send me a copy of my dental records? I am switching providers.' },
  { name: 'Emma Brown',   subject: 'Payment Confirmation', message: 'I made an online payment yesterday but did not receive a receipt. Can you resend it?' },
];

exports.paymentSeeds = [
  { patientId: 1, appointmentId: 1, invoiceId: 1, clinicId: 1, amount: 150.00, currency: 'USD', paymentMethod: 'Credit Card', paymentStatus: 'Completed', paymentDate: new Date('2026-06-10'), notes: 'Consultation fee', isReconciled: false },
  { patientId: 2, appointmentId: 2, invoiceId: 2, clinicId: 1, amount: 450.00, currency: 'USD', paymentMethod: 'Cash',         paymentStatus: 'Completed', paymentDate: new Date('2026-06-15'), notes: 'Root canal procedure', isReconciled: false },
  { patientId: 3, appointmentId: 3, invoiceId: 3, clinicId: 1, amount: 200.00, currency: 'USD', paymentMethod: 'Insurance',    paymentStatus: 'Pending',   paymentDate: new Date('2026-07-01'), notes: 'Awaiting insurance approval', isReconciled: false },
  { patientId: 1, appointmentId: 4, invoiceId: 1, clinicId: 1, amount: 80.00,  currency: 'USD', paymentMethod: 'Online Payment', paymentStatus: 'Completed', paymentDate: new Date('2026-07-20'), notes: 'Follow-up check', isReconciled: false },
  { patientId: 4, appointmentId: null, invoiceId: null, clinicId: 1, amount: 320.00, currency: 'USD', paymentMethod: 'Credit Card', paymentStatus: 'Pending', paymentDate: new Date('2026-08-05'), notes: 'Whitening session deposit', isReconciled: false },
];

exports.caseAcceptanceSeeds = [
  { patientId: 1, treatmentPlanId: 1, coordinatorId: 1, presentedAt: new Date('2026-06-01'), estimatedValue: 2500.00, acceptedValue: 2500.00, status: 'accepted', financingOption: 'in_house', followUpDate: new Date('2026-07-01'), coordinatorNotes: 'Patient agreed to full treatment plan', objections: [], priority: 'normal' },
  { patientId: 2, treatmentPlanId: 2, coordinatorId: 1, presentedAt: new Date('2026-06-10'), estimatedValue: 1800.00, acceptedValue: 0, status: 'pending', financingOption: 'none', followUpDate: new Date('2026-08-01'), coordinatorNotes: 'Patient is considering options', objections: [{ text: 'Cost concern', createdAt: new Date('2026-06-10') }], priority: 'normal' },
  { patientId: 3, treatmentPlanId: 3, coordinatorId: 2, presentedAt: new Date('2026-07-05'), estimatedValue: 5000.00, acceptedValue: 0, status: 'presented', financingOption: 'third_party', followUpDate: new Date('2026-08-20'), coordinatorNotes: 'Full implant plan presented', objections: [], priority: 'high' },
  { patientId: 4, treatmentPlanId: 4, coordinatorId: 1, presentedAt: new Date('2026-05-20'), estimatedValue: 3200.00, acceptedValue: 0, status: 'deferred', financingOption: 'payment_plan', followUpDate: new Date('2026-09-01'), deferralReason: 'Financial constraints', coordinatorNotes: 'Patient postponed due to financial reasons', objections: [{ text: 'No insurance coverage', createdAt: new Date('2026-05-20') }], priority: 'normal' },
];

exports.insuranceClaimSeeds = [
  { patientId: 1, insuranceId: 1, policyNumber: 'HS-2025-0001', serviceDate: '2026-06-10', submittedAt: new Date('2026-06-12'), diagnosisCodes: ['K02.1'], procedureCodes: ['D0150'], claimAmount: 150.00, coveredAmount: 120.00, patientCopay: 30.00, status: 'approved', clinicId: 1, providerName: 'HealthSecure', notes: 'Comprehensive oral evaluation' },
  { patientId: 2, insuranceId: 2, policyNumber: 'DC-2025-0002', serviceDate: '2026-06-15', submittedAt: new Date('2026-06-17'), diagnosisCodes: ['K04.0'], procedureCodes: ['D3310'], claimAmount: 900.00, coveredAmount: 675.00, patientCopay: 225.00, status: 'under_review', clinicId: 1, providerName: 'DentalCare Plus', notes: 'Root canal therapy — molar' },
  { patientId: 3, insuranceId: 3, policyNumber: 'SI-2024-0003', serviceDate: '2026-07-01', submittedAt: new Date('2026-07-03'), diagnosisCodes: ['K05.1'], procedureCodes: ['D4341'], claimAmount: 400.00, coveredAmount: 0, patientCopay: 400.00, status: 'rejected', clinicId: 1, providerName: 'Smile Insurance', rejectionReason: 'Policy expired', notes: 'Patient notified' },
  { patientId: 1, insuranceId: 1, policyNumber: 'HS-2025-0001', serviceDate: '2026-07-20', submittedAt: new Date('2026-07-22'), diagnosisCodes: ['K02.3'], procedureCodes: ['D2140'], claimAmount: 250.00, coveredAmount: 0, patientCopay: 0, status: 'submitted', clinicId: 1, providerName: 'HealthSecure', notes: 'Amalgam restoration awaiting response' },
];

exports.patientRefundSeeds = [
  { clinicId: CLINIC_UUID, patientId: PATIENT_UUID, invoiceId: null, paymentId: null, amount: 50.00, reason: 'Overpayment on consultation invoice', refundMethod: 'card', status: 'approved', notes: 'Refund to original card within 5 business days' },
  { clinicId: CLINIC_UUID, patientId: PATIENT_UUID, invoiceId: null, paymentId: null, amount: 200.00, reason: 'Cancelled implant procedure — deposit refund', refundMethod: 'bank_transfer', status: 'pending', notes: 'Awaiting manager approval' },
];

exports.waitlistSeeds = [
  { clinicId: CLINIC_UUID, patientId: PATIENT_UUID, doctorId: DOCTOR_UUID, preferredDate: '2026-09-01', preferredTime: '09:00', appointmentType: 'Cleaning', reason: 'Regular 6-month cleaning', status: 'waiting', priority: 'normal' },
  { clinicId: CLINIC_UUID, patientId: PATIENT_UUID, doctorId: null, preferredDate: '2026-09-05', preferredTime: '14:00', appointmentType: 'Emergency', reason: 'Severe toothache', status: 'waiting', priority: 'urgent' },
  { clinicId: CLINIC_UUID, patientId: PATIENT_UUID, doctorId: DOCTOR_UUID, preferredDate: '2026-09-10', preferredTime: '10:00', appointmentType: 'Whitening', reason: 'Cosmetic whitening session', status: 'notified', priority: 'low' },
];

exports.patientFormSeeds = [
  { clinicId: 1, patientId: 1, sentBy: 1, formType: 'medical_history', title: 'Medical History Form', fields: [{ name: 'allergies', label: 'Known Allergies', type: 'text' }, { name: 'conditions', label: 'Existing Conditions', type: 'textarea' }], responses: null, status: 'sent', sentVia: 'email', accessToken: 'token-form-001', expiresAt: new Date('2026-09-30'), sentAt: new Date('2026-08-01') },
  { clinicId: 1, patientId: 2, sentBy: 1, formType: 'consent', title: 'Root Canal Consent Form', fields: [{ name: 'consent', label: 'I consent to the procedure', type: 'checkbox' }], responses: { consent: true }, status: 'completed', sentVia: 'sms', accessToken: 'token-form-002', expiresAt: new Date('2026-08-15'), sentAt: new Date('2026-08-05'), completedAt: new Date('2026-08-06') },
  { clinicId: 1, patientId: 3, sentBy: 2, formType: 'hipaa', title: 'HIPAA Acknowledgement', fields: [{ name: 'agree', label: 'I have read and agree to the HIPAA policy', type: 'checkbox' }], responses: null, status: 'viewed', sentVia: 'link', accessToken: 'token-form-003', expiresAt: new Date('2026-09-01'), sentAt: new Date('2026-07-25'), viewedAt: new Date('2026-07-26') },
];

exports.adminDocumentSeeds = [
  { patientId: 1, uploadedBy: 1, clinicId: 1, docType: 'consent', fileName: 'consent_john_doe.pdf', fileUrl: 'https://example.com/docs/consent_john_doe.pdf', fileType: 'application/pdf', fileSize: 45000, description: 'Signed consent for root canal', isVerified: true, verifiedBy: 1, verifiedAt: new Date('2026-07-15'), verificationNote: 'Verified against patient ID' },
  { patientId: 2, uploadedBy: 1, clinicId: 1, docType: 'insurance_card', fileName: 'insurance_jane_smith.jpg', fileUrl: 'https://example.com/docs/insurance_jane_smith.jpg', fileType: 'image/jpeg', fileSize: 120000, description: 'Insurance card front/back', isVerified: false },
  { patientId: 3, uploadedBy: 2, clinicId: 1, docType: 'government_id', fileName: 'id_michael_brown.jpg', fileUrl: 'https://example.com/docs/id_michael_brown.jpg', fileType: 'image/jpeg', fileSize: 95000, description: 'National ID card', isVerified: true, verifiedBy: 2, verifiedAt: new Date('2026-07-20') },
];

exports.clinicLocationSeeds = [
  { clinicId: CLINIC_UUID, name: 'Main Branch', address: '123 Dental Ave', city: 'Metropolis', phone: '+1-555-0100', email: 'main@dentic.com', isMain: true, isActive: true, logoUrl: 'https://example.com/logo-main.png', colorScheme: '#1976d2' },
  { clinicId: CLINIC_UUID, name: 'East Wing Clinic', address: '456 Health Blvd', city: 'Eastside', phone: '+1-555-0101', email: 'east@dentic.com', isMain: false, isActive: true, logoUrl: null, colorScheme: '#388e3c' },
];

exports.holidaySeeds = [
  { clinicId: CLINIC_UUID, name: "New Year's Day",   date: '2026-01-01', isRecurring: true,  closedAllDay: true },
  { clinicId: CLINIC_UUID, name: 'Independence Day', date: '2026-07-04', isRecurring: true,  closedAllDay: true },
  { clinicId: CLINIC_UUID, name: 'Staff Training Day', date: '2026-08-20', isRecurring: false, closedAllDay: false, openTime: '09:00', closeTime: '13:00', note: 'Half-day closure for annual training' },
  { clinicId: CLINIC_UUID, name: 'Christmas Day',    date: '2026-12-25', isRecurring: true,  closedAllDay: true },
];

exports.roomSeeds = [
  { clinicId: CLINIC_UUID, name: 'Chair 1',   type: 'chair',   isActive: true,  color: '#4caf50', notes: 'Standard operatory' },
  { clinicId: CLINIC_UUID, name: 'Chair 2',   type: 'chair',   isActive: true,  color: '#2196f3', notes: 'Standard operatory' },
  { clinicId: CLINIC_UUID, name: 'Chair 3',   type: 'chair',   isActive: false, color: '#9e9e9e', notes: 'Under maintenance' },
  { clinicId: CLINIC_UUID, name: 'X-Ray Room', type: 'xray',  isActive: true,  color: '#ff9800', notes: 'Digital panoramic unit' },
  { clinicId: CLINIC_UUID, name: 'Consult Room', type: 'consult', isActive: true, color: '#9c27b0', notes: 'New patient consultations' },
];

exports.employeeInviteSeeds = [
  { clinicId: CLINIC_UUID, email: 'newdoctor@dentic.com', role: 'DOCTOR', token: 'invite-tok-001', expiresAt: new Date('2026-09-30'), invitedBy: DOCTOR_UUID, status: 'pending' },
  { clinicId: CLINIC_UUID, email: 'frontdesk@dentic.com', role: 'STAFF',  token: 'invite-tok-002', expiresAt: new Date('2026-09-30'), invitedBy: DOCTOR_UUID, status: 'accepted', acceptedAt: new Date('2026-08-01') },
  { clinicId: CLINIC_UUID, email: 'hygienist@dentic.com', role: 'DENTAL_ASSISTANT', token: 'invite-tok-003', expiresAt: new Date('2026-08-10'), invitedBy: DOCTOR_UUID, status: 'expired' },
];

exports.servicePriceSeeds = [
  { clinicId: CLINIC_UUID, name: 'Initial Consultation', category: 'consultation', standardPrice: 100.00, minPrice: 80.00, maxPrice: 120.00, insuranceCovered: true, insuranceRate: 80.00, durationMinutes: 30, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Dental Cleaning',      category: 'procedure',    standardPrice: 150.00, minPrice: 120.00, maxPrice: 180.00, insuranceCovered: true, insuranceRate: 70.00, durationMinutes: 45, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Root Canal – Molar',   category: 'procedure',    standardPrice: 900.00, minPrice: 800.00, maxPrice: 1100.00, insuranceCovered: true, insuranceRate: 60.00, durationMinutes: 90, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Panoramic X-Ray',      category: 'imaging',      standardPrice: 120.00, minPrice: 100.00, maxPrice: 140.00, insuranceCovered: true, insuranceRate: 75.00, durationMinutes: 15, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Tooth Whitening',      category: 'procedure',    standardPrice: 350.00, minPrice: 300.00, maxPrice: 400.00, insuranceCovered: false, insuranceRate: 0, durationMinutes: 60, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Dental Implant',       category: 'procedure',    standardPrice: 3500.00, minPrice: 3000.00, maxPrice: 4500.00, insuranceCovered: false, insuranceRate: 0, durationMinutes: 120, isActive: true },
  { clinicId: CLINIC_UUID, name: 'Blood Test – Basic',   category: 'lab',          standardPrice: 60.00, minPrice: 50.00, maxPrice: 80.00, insuranceCovered: true, insuranceRate: 90.00, durationMinutes: 10, isActive: true },
];

exports.clinicalNoteSeeds = [
  { patientId: 1, doctorId: 1, appointmentId: 1, clinicId: 1, noteType: 'soap', subjective: 'Patient reports dull aching pain in lower left molar for 3 days.', objective: 'Temperature test positive on #19. Periapical radiograph shows periapical lucency.', assessment: 'Irreversible pulpitis — tooth #19.', plan: 'Root canal therapy scheduled for next visit. Prescribed amoxicillin 500mg TID × 7 days.', isSigned: true, signedAt: new Date('2026-07-10'), isDraft: false, aiGenerated: false },
  { patientId: 2, doctorId: 2, appointmentId: 2, clinicId: 1, noteType: 'progress', content: 'Patient attended for whitening session 1 of 3. Good response — shade improved by 3 on Vita scale. No sensitivity reported. Next session in 2 weeks.', isSigned: true, signedAt: new Date('2026-07-15'), isDraft: false, aiGenerated: false },
  { patientId: 3, doctorId: 1, appointmentId: 3, clinicId: 1, noteType: 'consultation', subjective: 'Patient enquiring about dental implants for missing #30 (extracted 6 months ago).', objective: 'CBCT shows adequate bone volume. Healing complete.', assessment: 'Good implant candidate.', plan: 'Implant placement scheduled. Referral for bone density scan sent.', isSigned: false, isDraft: true, aiGenerated: false },
  { patientId: 1, doctorId: 1, appointmentId: 4, clinicId: 1, noteType: 'follow_up', content: 'Post root-canal follow-up. Patient reports no pain. Temporary filling intact. Permanent crown prep to begin next visit.', isSigned: true, signedAt: new Date('2026-08-01'), isDraft: false, aiGenerated: false },
];

exports.clinicalReferralSeeds = [
  { patientId: 1, referringDoctorId: 1, clinicId: 1, toSpecialty: 'Periodontist', toDoctor: 'Dr. Angela Reeves', toClinic: 'City Perio Center', reason: 'Moderate periodontitis requiring specialist management. Patient has pockets of 5–6mm in posterior regions.', urgency: 'routine', clinicalSummary: 'Patient presents with generalised moderate chronic periodontitis. Scaling and root planing completed in-house but requires specialist follow-up.', requestedProcedure: 'Full Mouth Periodontal Assessment', status: 'sent', sentAt: new Date('2026-07-20'), appointmentDate: '2026-08-15' },
  { patientId: 2, referringDoctorId: 2, clinicId: 1, toSpecialty: 'Orthodontist', toDoctor: 'Dr. Mark Helens', toClinic: null, reason: 'Crowding in upper anterior. Patient interested in braces.', urgency: 'routine', clinicalSummary: 'Class II div 1 malocclusion. All permanent teeth present. No active caries.', requestedProcedure: 'Orthodontic Assessment', status: 'draft', appointmentDate: null },
  { patientId: 3, referringDoctorId: 1, clinicId: 1, toSpecialty: 'Oral Surgeon', toDoctor: 'Dr. Sarah Kim', toClinic: 'Metro Oral Surgery', reason: 'Impacted lower wisdom teeth causing recurrent pericoronitis.', urgency: 'urgent', clinicalSummary: 'Partially erupted #17 and #32. Recurrent episodes of pericoronitis. Radiograph shows follicular space widening.', requestedProcedure: 'Surgical extraction × 2', status: 'acknowledged', sentAt: new Date('2026-08-05'), appointmentDate: '2026-08-25' },
];

exports.clinicPaymentMethodSeeds = [
  { clinicId: 1, name: 'Cash',            type: 'cash',          provider: null,    isActive: true,  isDefault: true,  notes: 'Accepted at front desk' },
  { clinicId: 1, name: 'Visa / Mastercard', type: 'card',        provider: 'Stripe', isActive: true, isDefault: false, notes: 'Terminal at reception' },
  { clinicId: 1, name: 'Insurance Billing', type: 'insurance',   provider: null,    isActive: true,  isDefault: false, notes: 'Direct billing to approved insurers' },
  { clinicId: 1, name: 'Bank Transfer',   type: 'bank_transfer', provider: null,    isActive: true,  isDefault: false, notes: 'For large invoices only' },
  { clinicId: 1, name: 'Online (Stripe)',  type: 'online',       provider: 'Stripe', isActive: true, isDefault: false, notes: 'Patient portal payments' },
];

exports.reminderRecallSeeds = [
  { appointmentId: 1, reminderType: 'Recall', recipients: 'patient1@example.com', subject: '6-Month Recall — Time for Your Cleaning!', body: 'Dear John, it has been 6 months since your last cleaning. Please call us to schedule your next visit.', sendAt: new Date('2026-09-01'), status: 'pending' },
  { appointmentId: 2, reminderType: 'Recall', recipients: 'patient2@example.com', subject: 'Annual Dental Check-Up Reminder', body: 'Dear Jane, we have not seen you in a while. Book your annual check-up today!', sendAt: new Date('2026-09-15'), status: 'pending' },
  { appointmentId: 3, reminderType: 'Recall', recipients: 'patient3@example.com', subject: 'Post-Treatment Follow-Up', body: 'Dear Michael, your implant treatment follow-up is due. Please contact us to book.', sendAt: new Date('2026-08-20'), status: 'pending' },
];
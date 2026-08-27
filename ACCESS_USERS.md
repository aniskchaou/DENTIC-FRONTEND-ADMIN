# Dentic — User Access Guide

All default accounts below are seeded automatically when the backend starts for the first time.  
Passwords are bcrypt-hashed in the database; the plain-text values listed here are for first login only.

---

## Default Login Accounts

| # | Full Name | Username | Email | Password | Role |
|---|-----------|----------|-------|----------|------|
| 1 | Admin User | `admin` | admin@example.com | `admin` | ADMIN |
| 2 | Staff User | `staffuser` | staff@example.com | `staffpass` | STAFF |
| 3 | Doctor User | `doctoruser` | doctor@example.com | `doctorpass` | DOCTOR |
| 4 | Accountant User | `accountantuser` | accountant@example.com | `accountantpass` | ACCOUNTANT |
| 5 | Technical User | `technicaluser` | technical@example.com | `technicalpass` | TECHNICAL |
| 6 | Patient User | `patientuser` | patient@example.com | `patientpass` | PATIENT |

> **Tip:** Log in at `http://localhost:3001` using either **Username** or **Email** together with the **Password**.

---

## Role Descriptions & Access

### ADMIN
Full access to every module.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Patients, Appointments, Prescriptions | ✅ |
| Billing, Payments, Invoices, Expenses | ✅ |
| Staff, Doctors, Schedules | ✅ |
| Clinic Settings & Configuration | ✅ |
| Super Admin (clinics, plans, coupons, SaaS) | ✅ |
| User Management (`/superadmin/users`) | ✅ |
| All analytics & reports | ✅ |

---

### DOCTOR
Clinical workflow access.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Odontogram, Appointments | ✅ |
| Prescriptions, Certificates | ✅ |
| Diagnosis, Procedures, Operations | ✅ |
| Dental Imaging (DICOM) | ✅ |
| Clinical Notes, Periodontal Chart | ✅ |
| Patient Timeline, Referrals | ✅ |
| Telemedicine | ✅ |
| Treatment Plans, Medications | ✅ |
| Doctor AI Hub | ✅ |
| Billing / Admin | ❌ |

---

### STAFF (Receptionist / Front Desk)
Patient-facing admin and scheduling.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Appointments (view / add) | ✅ |
| Patient registration | ✅ |
| Check-In Board | ✅ |
| Waitlist | ✅ |
| Patient Forms & Documents | ✅ |
| Communication Center | ✅ |
| Receipt Manager | ✅ |
| Payments, Billing, Invoices | ✅ |
| Clinical tools / Prescriptions | ❌ |

---

### ACCOUNTANT
Financial and insurance access.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Payments, Expenses, Billing, Invoices | ✅ |
| Financial Reports | ✅ |
| Payment Reconciliation | ✅ |
| Insurance Claims | ✅ |
| Sale Analytics, Outstanding Balances | ✅ |
| Patient Refunds | ✅ |
| Clinical / Scheduling tools | ❌ |

---

### TECHNICAL
Equipment and inventory only.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Inventory Items | ✅ |
| Equipment Maintenance | ✅ |
| All other modules | ❌ |

---

### PATIENT (Patient Portal)
Self-service portal — redirected to `/patient/my-appointments` after login.

| Module | Access |
|--------|--------|
| My Appointments (view / request) | ✅ |
| My Invoices | ✅ |
| Educational Content library | ✅ |
| Patient AI Assistant (chat) | ✅ |
| My Payments | ✅ |
| My Prescriptions | ✅ |
| All clinic-internal modules | ❌ |

---

## Adding New Users

### Via the UI (ADMIN only)

1. Log in as `admin` / `admin`.
2. Navigate to **Super Admin → User Management** (`/superadmin/users`).
3. Click **Add User**.
4. Fill in: Full Name, Username, Email, Password, Role, Phone, Gender.
5. Click **Create User** — the user is saved and a welcome email is sent.

### Via the API

```http
POST http://localhost:5000/users
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "username": "jsmith",
  "email": "jane@clinic.com",
  "password": "SecurePass123",
  "role": "DOCTOR",
  "phone": "0600000001",
  "gender": "Female",
  "status": "Active"
}
```

Valid `role` values: `ADMIN`, `DOCTOR`, `STAFF`, `ACCOUNTANT`, `TECHNICAL`, `PATIENT`

---

## Password Management

| Action | How |
|--------|-----|
| Reset your own password | Profile → Change Password |
| Admin resets a user's password | User Management → select user → Reset Password panel |
| Forgot password | `/forgot-password` page → email link |

---

## Running the Application

```bash
# Backend (port 5000)
cd FRONTEND/backend
node server.js

# Frontend (port 3001)
cd FRONTEND
npm run serve
```

Then open: **http://localhost:3001**


---

## Role Descriptions & Access

### ADMIN / SUPERADMIN
Full access to every module — sees **all** navigation sections.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Patients, Appointments, Prescriptions | ✅ |
| Billing, Payments, Invoices, Expenses | ✅ |
| Staff, Doctors, Schedules | ✅ |
| Clinic Settings & Configuration | ✅ |
| Super Admin (clinics, plans, coupons, SaaS) | ✅ |
| User Management (`/superadmin/users`) | ✅ |
| All analytics & reports | ✅ |

---

### DOCTOR
Clinical workflow access.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Odontogram, Appointments | ✅ |
| Prescriptions, Certificates | ✅ |
| Diagnosis, Procedures, Operations | ✅ |
| Dental Imaging (DICOM) | ✅ |
| Clinical Notes, Periodontal Chart | ✅ |
| Patient Timeline, Referrals | ✅ |
| Telemedicine | ✅ |
| Treatment Plans, Medications | ✅ |
| Doctor AI Hub | ✅ |
| Billing / Admin | ❌ |

---

### STAFF (Receptionist / Front Desk)
Patient-facing admin and scheduling.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Appointments (view / add) | ✅ |
| Patient registration | ✅ |
| Check-In Board | ✅ |
| Waitlist | ✅ |
| Patient Forms & Documents | ✅ |
| Communication Center | ✅ |
| Receipt Manager | ✅ |
| Payments, Billing, Invoices | ✅ |
| Clinical tools / Prescriptions | ❌ |

---

### ACCOUNTANT (Billing / Accountant)
Financial and insurance access.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Payments, Expenses, Billing, Invoices | ✅ |
| Financial Reports (`/accountant/financial-reports`) | ✅ |
| Payment Reconciliation | ✅ |
| Insurance Claims | ✅ |
| Insurance AI Hub | ✅ |
| Sale Analytics, Outstanding Balances | ✅ |
| Patient Refunds | ✅ |
| Clinical / Scheduling tools | ❌ |

---

### TECHNICAL
Equipment and inventory only.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Inventory Items | ✅ |
| Equipment Maintenance | ✅ |
| All other modules | ❌ |

---

### TREATMENT_COORD (Treatment Coordinator)
Case acceptance pipeline.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| Treatment Plans | ✅ |
| Case Acceptance | ✅ |
| Treatment Pipeline (Kanban) | ✅ |
| Recall Management | ✅ |
| Messages | ✅ |
| Treatment Coord AI Hub | ✅ |
| Clinical / Billing tools | ❌ |

---

### PATIENT (Patient Portal)
Self-service portal for patients.

| Module | Access |
|--------|--------|
| Dashboard | ✅ |
| My Appointments (view / request / cancel) | ✅ |
| My Invoices | ✅ |
| Educational Content library | ✅ |
| Patient AI Assistant (chat) | ✅ |
| Messages | ✅ |
| All clinic-internal modules | ❌ |

---

## Adding New Users

### Via the UI (ADMIN / SUPERADMIN only)

1. Log in as `admin` / `admin`.
2. Navigate to **Super Admin → User Management** (`/superadmin/users`).
3. Click **Add User**.
4. Fill in: Full Name, Username, Email, Password, Role, Phone, Gender.
5. Click **Create User** — the user is saved and a welcome email is sent.

### Via the API (POST /api/users)

```http
POST https://taila.fr/api/users
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "username": "jsmith",
  "email": "jane@clinic.com",
  "password": "SecurePass123",
  "role": "DOCTOR",
  "phone": "0600000001",
  "gender": "Female",
  "status": "Active"
}
```

Valid `role` values: `ADMIN`, `SUPERADMIN`, `DOCTOR`, `STAFF`, `TECHNICAL`, `ACCOUNTANT`, `TREATMENT_COORD`, `PATIENT`

---

## Password Management

| Action | How |
|--------|-----|
| Reset your own password | Profile → Change Password |
| Admin resets a user's password | User Management → select user → Reset Password panel |
| Forgot password | `/forgot-password` page → email link |
| API change password | `PUT /api/auth/change-password` with `{ oldPassword, newPassword }` |

---

## Running the Application

```bash
# Backend (port 5000)
cd FRONTEND/backend
node server.js

# Frontend (port 3001)
cd FRONTEND
npm run serve
```

Then open: **http://localhost:3001**

# Dentic - Dental Clinic Management System
## Introduction

Dentic is a web application for managing a dental care office. 

## Table of contents
* [Documentation](#general-info)
* [Demo](#demo)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Contact](#contact)
* [License](#license)


## Demo
https://dentic-client.herokuapp.com/


## Technologies
* React.js
* Node.js

## Features
 -  Manage appointments
-   Manage patients
-   Manage medications
-   Manage prescriptions
-   Manage users

# Dentic Backend

Dentic is a comprehensive dental clinic management system backend, built with Node.js, Express, and Sequelize. It supports patient management, appointments, medical imaging, AI analysis, notifications, marketing campaigns, and more.

## Features
- **User & Role Management**: Admin, Staff, Doctor, Accountant roles
- **Patient Records**: CRUD, allergies, insurance, medical history
- **Appointment Scheduling**: Automated reminders, status updates
- **Medical Imaging**: Upload, store, and analyze X-rays and DICOM files
- **AI Endpoints**: X-ray analysis, lab test report analysis, treatment progress, smile simulation
- **Notifications**: Email, SMS (Textbelt/Twilio), push notifications (Firebase)
- **Marketing Campaigns**: Patient matching, campaign scheduling, email delivery
- **Job Scheduling**: node-cron jobs for reminders and marketing
- **Swagger API Docs**: Interactive documentation at `/api-docs`
- **Static File Serving**: Access uploaded files via `/uploads`

## Configuration
- **Database**: Sequelize ORM, SQLite demo included
- **Email**: Gmail App Password, config in `clinic.json`
- **Cron Jobs**: Configurable in `clinic.json`
- **AI Keys**: OpenAI and Google Cloud Vision/VertexAI support

## Key Endpoints
- `/patients` - Patient CRUD
- `/appointments` - Appointment CRUD
- `/dental-imaging` - Imaging CRUD & upload
- `/dental-imaging/upload-dicom` - DICOM upload by MRN
- `/dental-imaging/dicom-files/:mrn` - List DICOM file URLs for MRN
- `/ai/xray-analysis` - AI X-ray analysis
- `/ai/lab-test-report-analysis` - AI lab test analysis
- `/ai/treatment-progress` - Compare before/after X-rays
- `/api-docs` - Swagger documentation

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Configure `clinic.json` for email, cron jobs, and API keys
4. Start the server: `node server.js`

## File Structure
- `controllers/` - API logic
- `models/` - Sequelize models
- `routes/` - Express routes
- `jobs/` - Scheduled jobs
- `utils/` - Helpers (email, reminders)
- `uploads/` - Uploaded files (DICOM, images)
- `db/` - Database setup

## Security
- Use Gmail App Password for email
- Store sensitive keys in environment variables or config files

## License
<a href="license.txt">MIT License</a>

## Authors
- Delta Dev Software

---
For more details, see the Swagger docs or contact the maintainer.

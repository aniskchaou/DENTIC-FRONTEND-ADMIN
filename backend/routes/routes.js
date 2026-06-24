const express = require("express");
const router = express.Router();

// Controllers
// User & Patient
const userController = require("../controllers/api/user.controllers");
const patientController = require("../controllers/api/patient.controllers");

// Clinic & Staff
const clinicController = require("../controllers/api/clinic.controllers");
const staffController = require("../controllers/api/staff.controller");
//const staffScheduleController = require("../controllers/api/staff.controller");

// Doctors
const doctorController = require("../controllers/api/doctor.controller");
//const doctorScheduleController = require("../controllers/api/doctorschedule.controller");
//const doctorAvailabilityController = require("../controllers/api/doctoravailability.controller");

// Appointments & Consultations
const appointementController = require("../controllers/api/appointement.controllers");
const consultationController = require("../controllers/api/consultation.controllers");
//const consultationScheduleController = require("../controllers/api/consultationschedule.controller");
//const consultationHistoryController = require("../controllers/api/consultationhistory.controller");

// Diagnostics & Imaging
const diagnosticController = require("../controllers/api/diagnosis.controller");
const dentalimagingController = require("../controllers/api/dentalimaging.controller");

// Get accessible DICOM file URLs by MRN
router.get('/dental-imaging/dicom-files/:mrn', dentalimagingController.getDicomFilesByMRN);

// Treatment & Procedures
const treatmentPlanController = require("../controllers/api/treatementplan.controller");
const vrTreatmentController = require("../controllers/api/vrtreatement.controller");
const procedureController = require("../controllers/api/procedure.controller");
const operationController = require("../controllers/api/operation.controller");
const medicationController = require("../controllers/api/medication.controller");
const servicePageController = require("../controllers/api/service.controllers");
// Emergency
/*
const emergencyHandlingController = require("../controllers/api/emergencyhandling.controller");
const emergencyCaseController = require("../controllers/api/emergencycase.controller");
const emergencyReferralController = require("../controllers/api/emergencyreferral.controller");

const emergencyCaseHistoryController = require("../controllers/api/emergencycasehistory.controller");
const emergencyReferralHistoryController = require("../controllers/api/emergencyreferralhistory.controller");
const emergencyHandlingHistoryController = require("../controllers/api/emergencyhandlinghistory.controller");

const emergencyCaseReferralController = require("../controllers/api/emergencycasereferral.controller");
const emergencyCaseHandlingController = require("../controllers/api/emergencycasehandling.controller");
const emergencyReferralHandlingController = require("../controllers/api/emergencyreferralhandling.controller");

const emergencyCaseReferralHistoryController = require("../controllers/api/emergencycasereferralhistory.controller");
const emergencyCaseHandlingHistoryController = require("../controllers/api/emergencycasehandlinghistory.controller");
*/

// Insurance & Membership
const insuranceController = require("../controllers/api/insurance.controller");
const membershipController = require("../controllers/api/membership.controller");

// Records & History
const historyController = require("../controllers/api/history.controller");
//const medicalRecordController = require("../controllers/api/medicalrecord.controller");

// Miscellaneous
const equipementController = require("../controllers/api/equipement.controller");
const casestudyController = require("../controllers/api/casestudy.controller");
const legalController = require("../controllers/api/legal.controller");
const loyaltyController = require("../controllers/api/loyalty.controller");
const marketingController = require("../controllers/api/marketing.controller");
const treatementplanController = require("../controllers/api/treatementplan.controller");
const vrtreatementController = require("../controllers/api/vrtreatement.controller");


// Staff Schedule routes
// router.post("/staffschedule", staffScheduleController.create);   
// router.get("/staffschedule", staffScheduleController.findAll);
// router.get("/staffschedule/:id", staffScheduleController.findOne);
// router.put("/staffschedule/:id", staffScheduleController.update);   
// router.delete("/staffschedule/:id", staffScheduleController.delete);
// router.delete("/staffschedule", staffScheduleController.deleteAll);


router.post("/patients", patientController.create);
router.get("/patients", patientController.findAll);
router.get("/patients/:id", patientController.findOne);
router.put("/patients/:id", patientController.update);
router.delete("/patients/:id", patientController.delete);
router.delete("/patients", patientController.deleteAll);

// Emergency routes
const emergencyController = require("../controllers/api/emergency.controller");

// User routes
router.post("/users", userController.create);
router.get("/users", userController.findAll);
router.get("/users/:id", userController.findOne);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
router.delete("/users", userController.deleteAll);
router.post("/users/login", userController.login);

// Appointment/Event routes
//router.get("/appointments/count", appointementController.getCount);
//router.post("/appointments", appointementController.create);
router.post("/appointments", appointementController.create);
router.get("/appointments", appointementController.findAll);
router.get("/appointments/:id", appointementController.findOne);
router.put("/appointments/:id", appointementController.update);
router.delete("/appointments/:id", appointementController.delete);
router.delete("/appointments", appointementController.deleteAll);
router.put("/appointments/:id/archive", appointementController.archive);
router.put("/appointments/:id/completed", appointementController.completed);

// Clinic routes
router.post("/clinics", clinicController.create);
router.get("/clinics", clinicController.findAll);
router.get("/clinics/:id", clinicController.findOne);
router.put("/clinics/:id", clinicController.update);
router.delete("/clinics/:id", clinicController.delete);
router.delete("/clinics", clinicController.deleteAll);

// Doctor routes
router.post("/doctors", doctorController.create);
router.get("/doctors", doctorController.findAll);
router.get("/doctors/:id", doctorController.findOne);
router.put("/doctors/:id", doctorController.update);
router.delete("/doctors/:id", doctorController.delete);
router.delete("/doctors", doctorController.deleteAll);

// Staff routes
router.post("/staff", staffController.create);
router.get("/staff", staffController.findAll);
router.get("/staff/:id", staffController.findOne);
router.put("/staff/:id", staffController.update);
router.delete("/staff/:id", staffController.delete);
router.delete("/staff", staffController.deleteAll);

// Equipment routes
router.post("/equipments", equipementController.create);
router.get("/equipments", equipementController.findAll);
router.get("/equipments/:id", equipementController.findOne);
router.put("/equipments/:id", equipementController.update);
router.delete("/equipments/:id", equipementController.delete);
router.delete("/equipments", equipementController.deleteAll);

// Consultation routes
router.post("/consultations", consultationController.create);
router.get("/consultations", consultationController.findAll);
router.get("/consultations/:id", consultationController.findOne);
router.put("/consultations/:id", consultationController.update);
router.delete("/consultations/:id", consultationController.delete);
router.delete("/consultations", consultationController.deleteAll);

// Diagnostic routes
router.post("/diagnostics", diagnosticController.create);
router.get("/diagnostics", diagnosticController.findAll);
router.get("/diagnostics/:id", diagnosticController.findOne);
router.put("/diagnostics/:id", diagnosticController.update);
router.delete("/diagnostics/:id", diagnosticController.delete);
router.delete("/diagnostics", diagnosticController.deleteAll);

// Medication routes
router.post("/medications", medicationController.create);
router.get("/medications", medicationController.findAll);
router.get("/medications/:id", medicationController.findOne);
router.put("/medications/:id", medicationController.update);
router.delete("/medications/:id", medicationController.delete);
router.delete("/medications", medicationController.deleteAll);

// Procedure routes
router.post("/procedures", procedureController.create);
router.get("/procedures", procedureController.findAll);
router.get("/procedures/:id", procedureController.findOne);
router.put("/procedures/:id", procedureController.update);
router.delete("/procedures/:id", procedureController.delete);
router.delete("/procedures", procedureController.deleteAll);

// Operation routes
router.post("/operations", operationController.create);
router.get("/operations", operationController.findAll);
router.get("/operations/:id", operationController.findOne);
router.put("/operations/:id", operationController.update);
router.delete("/operations/:id", operationController.delete);
router.delete("/operations", operationController.deleteAll);

// Treatment Plan routes
router.post("/treatmentplans", treatementplanController.create);
router.get("/treatmentplans", treatementplanController.findAll);
router.get("/treatmentplans/:id", treatementplanController.findOne);
router.put("/treatmentplans/:id", treatementplanController.update);
router.delete("/treatmentplans/:id", treatementplanController.delete);
router.delete("/treatmentplans", treatementplanController.deleteAll);

// VR Treatment routes
router.post("/vrtreatments", vrtreatementController.create);
router.get("/vrtreatments", vrtreatementController.findAll);
router.get("/vrtreatments/:id", vrtreatementController.findOne);
router.put("/vrtreatments/:id", vrtreatementController.update);
router.delete("/vrtreatments/:id", vrtreatementController.delete);
router.delete("/vrtreatments", vrtreatementController.deleteAll);

// Dental Imaging routes
router.post("/dentalimaging", dentalimagingController.create);
router.get("/dentalimaging", dentalimagingController.findAll);
router.get("/dentalimaging/:id", dentalimagingController.findOne);
router.put("/dentalimaging/:id", dentalimagingController.update);
router.delete("/dentalimaging/:id", dentalimagingController.delete);
router.delete("/dentalimaging", dentalimagingController.deleteAll);

// Insurance routes
router.post("/insurances", insuranceController.create);
router.get("/insurances", insuranceController.findAll);
router.get("/insurances/:id", insuranceController.findOne);
router.put("/insurances/:id", insuranceController.update);
router.delete("/insurances/:id", insuranceController.delete);
router.delete("/insurances", insuranceController.deleteAll);

// Membership routes
router.post("/memberships", membershipController.create);
router.get("/memberships", membershipController.findAll);
router.get("/memberships/:id", membershipController.findOne);
router.put("/memberships/:id", membershipController.update);
router.delete("/memberships/:id", membershipController.delete);
router.delete("/memberships", membershipController.deleteAll);

// Case Study routes
router.post("/casestudies", casestudyController.create);
router.get("/casestudies", casestudyController.findAll);
router.get("/casestudies/:id", casestudyController.findOne);
router.put("/casestudies/:id", casestudyController.update);
router.delete("/casestudies/:id", casestudyController.delete);
router.delete("/casestudies", casestudyController.deleteAll);

// Legal Compliance routes
router.post("/legal", legalController.create);
router.get("/legal", legalController.findAll);
router.get("/legal/:id", legalController.findOne);
router.put("/legal/:id", legalController.update);
router.delete("/legal/:id", legalController.delete);
router.delete("/legal", legalController.deleteAll);

// Loyalty Program routes
router.post("/loyalty", loyaltyController.create);
router.get("/loyalty", loyaltyController.findAll);
router.get("/loyalty/:id", loyaltyController.findOne);
router.put("/loyalty/:id", loyaltyController.update);
router.delete("/loyalty/:id", loyaltyController.delete);
router.delete("/loyalty", loyaltyController.deleteAll);

// Marketing Campaign routes
router.post("/marketing", marketingController.create);
router.get("/marketing", marketingController.findAll);
router.get("/marketing/:id", marketingController.findOne);
router.put("/marketing/:id", marketingController.update);
router.delete("/marketing/:id", marketingController.delete);
router.delete("/marketing", marketingController.deleteAll);

// History routes
router.delete("/history/:id", historyController.delete);
router.delete("/history", historyController.deleteAll);

// Emergency routes
router.post("/emergency/handling", emergencyController.createHandling);
router.get("/emergency/handling", emergencyController.findAllHandlings);
router.get("/emergency/handling/:id", emergencyController.findHandling);
router.put("/emergency/handling/:id", emergencyController.updateHandling);
router.delete("/emergency/handling/:id", emergencyController.deleteHandling);
router.delete("/emergency/handling", emergencyController.deleteAllHandlings);

router.post("/emergency/case", emergencyController.createCase);
router.get("/emergency/case", emergencyController.findAllCases);
router.get("/emergency/case/:id", emergencyController.findCase);
router.put("/emergency/case/:id", emergencyController.updateCase);
router.delete("/emergency/case/:id", emergencyController.deleteCase);
router.delete("/emergency/case", emergencyController.deleteAllCases);

router.post("/emergency/referral", emergencyController.createReferral);
router.get("/emergency/referral", emergencyController.findAllReferrals);
router.get("/emergency/referral/:id", emergencyController.findReferral);
router.put("/emergency/referral/:id", emergencyController.updateReferral);
router.delete("/emergency/referral/:id", emergencyController.deleteReferral);
router.delete("/emergency/referral", emergencyController.deleteAllReferrals);

const certificateController = require("../controllers/api/certificate.controllers");
router.post("/certificates", certificateController.create);
router.get("/certificates", certificateController.findAll);
router.get("/certificates/:id", certificateController.findOne);
router.put("/certificates/:id", certificateController.update);
router.delete("/certificates/:id", certificateController.delete);
router.delete("/certificates", certificateController.deleteAll);
router.get("/certificates/count", certificateController.getCount);
router.get("/certificates/filter/:patient/:template", certificateController.filterCertificate);


const certificateTemplateController = require("../controllers/api/certificate.template.controllers.js");
 router.get("/certificate-templates", certificateTemplateController.findAll);
const medicamentCategoryController = require("../controllers/api/medicament.category.controllers");

router.post("/medicament-categories", medicamentCategoryController.create);
router.get("/medicament-categories", medicamentCategoryController.findAll);
router.get("/medicament-categories/:id", medicamentCategoryController.findOne);
router.put("/medicament-categories/:id", medicamentCategoryController.update);
router.delete("/medicament-categories/:id", medicamentCategoryController.delete);
router.delete("/medicament-categories", medicamentCategoryController.deleteAll);

router.post("/consultations", consultationController.create);
router.get("/consultations", consultationController.findAll);
router.get("/consultations/:id", consultationController.findOne);
router.put("/consultations/:id", consultationController.update);
router.delete("/consultations/:id", consultationController.delete);
router.delete("/consultations", consultationController.deleteAll);

const dentalImagingController = require("../controllers/api/dentalimaging.controller");
const multer = require("multer");
const uploadd = multer();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + ext);
  }
});

const upload = multer({ storage: storage });
const memUpload = multer({ storage: multer.memoryStorage() });
router.post("/dental-imaging", upload.single("image"), dentalImagingController.create);
//router.post("/dental-imaging", dentalImagingController.create);
router.get("/dental-imaging", dentalImagingController.findAll);
router.get("/dental-imaging/:id", dentalImagingController.findOne);
router.put("/dental-imaging/:id", dentalImagingController.update);
router.delete("/dental-imaging/:id", dentalImagingController.delete);
router.delete("/dental-imaging", dentalImagingController.deleteAll);
router.get("/dental-imaging/image/:filename", dentalImagingController.getImage);

router.post('/dental-imaging/upload-dicom', memUpload.single('file'), dentalImagingController.uploadDicom);
const diagnosisController = require("../controllers/api/diagnosis.controller.js");

router.post("/diagnoses", diagnosisController.create);
router.get("/diagnoses", diagnosisController.findAll);
router.get("/diagnoses/:id", diagnosisController.findOne);
router.put("/diagnoses/:id", diagnosisController.update);
router.delete("/diagnoses/:id", diagnosisController.delete);
router.delete("/diagnoses", diagnosisController.deleteAll);


const equipmentController = require("../controllers/api/equipement.controller.js");

router.post("/equipment", equipmentController.create);
router.get("/equipment", equipmentController.findAll);
router.get("/equipment/:id", equipmentController.findOne);
router.put("/equipment/:id", equipmentController.update);
router.delete("/equipment/:id", equipmentController.delete);
router.delete("/equipment", equipmentController.deleteAll);

const incomeController = require("../controllers/api/income.controllers.js");

router.post("/incomes", incomeController.create);
router.get("/incomes", incomeController.findAll);
router.get("/incomes/:id", incomeController.findOne);
router.put("/incomes/:id", incomeController.update);
router.delete("/incomes/:id", incomeController.delete);
router.delete("/incomes", incomeController.deleteAll);

const expenseController = require("../controllers/api/expense.controllers.js");

router.post("/expenses", expenseController.create);
router.get("/expenses", expenseController.findAll);
router.get("/expenses/:id", expenseController.findOne);
router.put("/expenses/:id", expenseController.update);
router.delete("/expenses/:id", expenseController.delete);
router.delete("/expenses", expenseController.deleteAll);

const labTests = require("../controllers/api/labtest.controllers.js");
router.post("/labtests", labTests.create);
router.get("/labtests", labTests.findAll);
router.get("/labtests/:id", labTests.findOne);
router.put("/labtests/:id", labTests.update);
router.delete("/labtests/:id", labTests.delete);
router.delete("/labtests", labTests.deleteAll);

const medicamentController = require('../controllers/api/medicament.controllers.js');

router.get('/medicaments', medicamentController.findAll);
router.get('/medicaments/count', medicamentController.getCount);
router.get('/medicaments/by-date', medicamentController.getMedicamentByDate);
router.post('/medicaments', medicamentController.create);
router.get('/medicaments/:id', medicamentController.findOne);
router.put('/medicaments/:id', medicamentController.update);
router.delete('/medicaments/:id', medicamentController.delete);
router.delete('/medicaments', medicamentController.deleteAll);

const medicamentManufactureController = require('../controllers/api/medicament.manufacture.controllers.js');

router.post('/medicament-manufactures', medicamentManufactureController.create);
router.get('/medicament-manufactures', medicamentManufactureController.findAll);
router.get('/medicament-manufactures/:id', medicamentManufactureController.findOne);
router.put('/medicament-manufactures/:id', medicamentManufactureController.update);
router.delete('/medicament-manufactures/:id', medicamentManufactureController.delete);
router.delete('/medicament-manufactures', medicamentManufactureController.deleteAll);

//const membershipController = require('../controllers/membership.controller');

router.post('/memberships', membershipController.create);
router.get('/memberships', membershipController.findAll);
router.get('/memberships/:id', membershipController.findOne);
router.put('/memberships/:id', membershipController.update);
router.delete('/memberships/:id', membershipController.delete);
router.delete('/memberships', membershipController.deleteAll);


router.post('/operations', operationController.create);
router.get('/operations', operationController.findAll);
router.get('/operations/:id', operationController.findOne);
router.put('/operations/:id', operationController.update);
router.delete('/operations/:id', operationController.delete);
router.delete('/operations', operationController.deleteAll);

router.post('/staff', staffController.create);
router.get('/staff', staffController.findAll);
router.get('/staff/:id', staffController.findOne);
router.put('/staff/:id', staffController.update);
router.delete('/staff/:id', staffController.delete);
router.delete('/staff', staffController.deleteAll);

const prescriptionController = require('../controllers/api/prescription.controllers.js');

//router.post('/prescriptions', prescriptionController.createMedicamentItem);

// Create a new prescription
router.post('/prescriptions', prescriptionController.create);

// Get all prescriptions
router.get('/prescriptions', prescriptionController.findAll);

// Get prescription by ID
router.get('/prescriptions/:id', prescriptionController.findOne);

// Get all medicament prescriptions for a given prescription ID
router.get('/prescriptions/:id/medicaments', prescriptionController.findAllMedicamentPrescriptions);


const messageController = require('../controllers/api/message.controllers.js');

// Get count of messages
router.get('/messages/count', messageController.getCount);

// Create a new message
router.post('/messages', messageController.create);

// Get all messages
router.get('/messages', messageController.findAll);

// Get message by ID
router.get('/messages/:id', messageController.findOne);

// Update message by ID
router.put('/messages/:id', messageController.update);

// Delete message by ID
router.delete('/messages/:id', messageController.delete);

// Delete all messages
router.delete('/messages', messageController.deleteAll);


// Create a new user
router.post('/users', userController.create);

// Retrieve all users (optionally filter by username)
router.get('/users', userController.findAll);

// Retrieve a single user by ID
router.get('/users/:id', userController.findOne);

// Update a user by ID
router.put('/users/:id', userController.update);

// Delete a user by ID
router.delete('/users/:id', userController.delete);

// Delete all users
router.delete('/users', userController.deleteAll);

// Login a user
router.post('/users/login', userController.login);

const telemedicineController = require('../controllers/api/telemedecine.controller.js');


 router.post('/telemedicines', telemedicineController.create);

// Get all sessions
router.get('/telemedicines', telemedicineController.findAll);

// // Get a session by ID
// router.get('/telemedicines/:id', telemedicineController.findOne);

// // Update a session
// router.put('/telemedicines/:id', telemedicineController.update);

// // Delete a session
// router.delete('/telemedicines/:id', telemedicineController.delete);

// // Delete all sessions
// router.delete('/telemedicines', telemedicineController.deleteAll);

// router.post("/medications", medicationController.create);
// router.get("/medications", medicationController.findAll);
// router.get("/medications/:id", medicationController.findOne);
// router.put("/medications/:id", medicationController.update);
// router.delete("/medications/:id", medicationController.delete);
// router.delete("/medications", medicationController.deleteAll);

const paymentController = require("../controllers/api/payment.controllers.js");
// Create a new payment
router.post("/payments", paymentController.create);

// Retrieve all payments
router.get("/payments", paymentController.findAll);

// Retrieve a single payment by ID
router.get("/payments/:id", paymentController.findOne);

// Update a payment by ID
router.put("/payments/:id", paymentController.update);

// Delete a payment by ID
router.delete("/payments/:id", paymentController.delete);

// Delete all payments
router.delete("/payments", paymentController.deleteAll);

// const todoController = require("../controllers/api/todo.controllers.js");

// // Create a new Todo
// router.post("/todos", todoController.create);

// // Retrieve all Todos
// router.get("/todos", todoController.findAll);

// // Retrieve a single Todo by ID
// router.get("/todos/:id", todoController.findOne);

// // Update a Todo by ID
// router.put("/todos/:id", todoController.update);

// // Delete a Todo by ID
// router.delete("/todos/:id", todoController.delete);

// // Delete all Todos
// router.delete("/todos", todoController.deleteAll);

 const invoiceController = require("../controllers/api/invoice.controllers.js");

// // Create a new invoice
router.post("/invoices", invoiceController.create);

// Retrieve all invoices
router.get("/invoices", invoiceController.findAll);

// Retrieve a single invoice by ID
router.get("/invoices/:id", invoiceController.findOne);

// Update an invoice by ID
router.put("/invoices/:id", invoiceController.update);

// Delete an invoice by ID
router.delete("/invoices/:id", invoiceController.delete);

// Delete all invoices
router.delete("/invoices", invoiceController.deleteAll);



const inventoryController = require("../controllers/api/inventory.controllers.js");

// Inventory routes
router.post("/inventory", inventoryController.create);
router.get("/inventory", inventoryController.findAll);
router.get("/inventory/:id", inventoryController.findOne);
router.put("/inventory/:id", inventoryController.update);
router.delete("/inventory/:id", inventoryController.delete);
router.delete("/inventory", inventoryController.deleteAll);

const settingsController = require("../controllers/api/settings.controllers.js");

router.get("/settings", settingsController.loadSettings);
router.put("/settings", settingsController.saveSettings);

router.post('/services', servicePageController.saveBodyToFile);
router.get('/services', servicePageController.readBodyFromFile);

router.post('/aboutus', servicePageController.saveAboutUsToFile);
router.get('/aboutus', servicePageController.readAboutUsFromFile);

router.put('/clinicsettings', settingsController.saveClinicSettings);
router.get('/clinicsettings', settingsController.readClinicSettings);

const ondotogramController = require("../controllers/api/ondotogram.controllers.js");

router.post("/ondotogram", ondotogramController.saveOndotogram);
router.post("/ondotogram/teeth", ondotogramController.getTeeth);


const aiController = require("../controllers/api/ai.controllers.js");


 router.post("/ai/clinic-qa", aiController.clinicQA);

const dentalImagingAI = require("../controllers/api/dentalimaging.controller.js");
 const appointementAI = require("../controllers/api/appointement.controllers.js");
 router.post("/ai/scheduling-assistant", appointementAI.schedulingAssistant);
 router.post("/ai/no-show-prediction", appointementAI.noShowPrediction);
 router.post("/ai/smart-routing", appointementAI.smartRouting);

 router.post("/ai/xray-analysis", uploadd.single("image"), dentalImagingAI.xrayAnalysis);
router.post("/ai/lab-test-report-analysis", uploadd.single("image"), dentalImagingAI.labTestReportAnalysis);
 router.post("/ai/treatment-progress", uploadd.fields([
  { name: "previousXray", maxCount: 1 },
  { name: "currentXray", maxCount: 1 }
]), dentalImagingAI.treatmentProgress);

 const diagnosisAI = require("../controllers/api/diagnosis.controller.js");

// Diagnosis AI endpoints
router.post("/ai/symptom-checker", diagnosisAI.symptomChecker);
router.post("/ai/decision-support", diagnosisAI.decisionSupport);
router.post("/ai/risk-prediction", diagnosisAI.riskPrediction);
const treatmentPlanAI = require("../controllers/api/treatementplan.controller.js");

// AI Treatment Plan endpoints
router.post("/ai/treatment-optimizer", treatmentPlanAI.treatmentOptimizer);
router.post("/ai/treatment-outcome-prediction", treatmentPlanAI.treatmentOutcomePrediction);
router.post("/ai/treatment-explainer", treatmentPlanAI.treatmentExplainer);

const procedureAI = require("../controllers/api/procedure.controller.js");

// AI Procedure endpoints
router.post("/ai/procedure-recommendation", procedureAI.procedureRecommendation);
router.post("/ai/procedure-estimation", procedureAI.procedureEstimation);
router.post("/ai/procedure-outcome-prediction", procedureAI.procedureOutcomePrediction);


const prescriptionAI = require("../controllers/api/prescription.controllers.js");

// AI Prescription endpoints
router.post("/ai/prescription-assistant", prescriptionAI.prescriptionAssistant);
router.post("/ai/prescription-error-detection", prescriptionAI.prescriptionErrorDetection);
router.post("/ai/prescription-explanation", prescriptionAI.prescriptionExplanation);


const patientAI = require("../controllers/api/patient.controllers.js");

// AI Patient endpoints
router.post("/ai/health-profile-summary", patientAI.healthProfileSummary);
router.post("/ai/risk-stratification", patientAI.riskStratification);
router.post("/ai/predictive-recall", patientAI.predictiveRecall);


const ondotogramAI = require("../controllers/api/ondotogram.controllers.js");

// AI Ondotogram endpoints
router.post("/ai/automated-odontogram", ondotogramAI.automatedOdontogram);
router.post("/ai/condition-prediction", ondotogramAI.conditionPrediction);
router.post("/ai/treatment-simulation", ondotogramAI.treatmentSimulation);


const labtestAI = require("../controllers/api/labtest.controllers.js");

// AI LabTest endpoints
router.post("/ai/lab-report-analysis", labtestAI.labReportAnalysis);
router.post("/ai/cross-diagnosis-support", labtestAI.crossDiagnosisSupport);
router.post("/ai/lab-turnaround-prediction", labtestAI.labTurnaroundPrediction);


const doctorAI = require("../controllers/api/doctor.controller.js");

// AI Doctor endpoints
router.post("/ai/profile-matcher", doctorAI.profileMatcher);
router.post("/ai/voice-notes", doctorAI.voiceNotes);
router.post("/ai/performance-insights", doctorAI.performanceInsights);
// --- End AI Routes


const operationAI = require("../controllers/api/operation.controller.js");
router.post("/ai/surgery-assistant", operationAI.surgeryAssistant);

const emailController = require('../controllers/api/email.controllers');
router.post('/send-email-with-attachment', upload.single('attachment'), emailController.sendEmailWithAttachment);

module.exports = router;
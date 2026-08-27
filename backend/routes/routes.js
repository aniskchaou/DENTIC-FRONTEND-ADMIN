const express = require("express");
const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

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
const apptActions = require("../controllers/api/appointment.actions.controllers");
//router.get("/appointments/count", appointementController.getCount);
//router.post("/appointments", appointementController.create);
router.post("/appointments", appointementController.create);
router.get("/appointments", appointementController.findAll);
// specific sub-routes must come before /:id wildcard
router.get("/appointments/today-board", apptActions.todayBoard);
router.get("/appointments/:id", appointementController.findOne);
router.put("/appointments/:id", appointementController.update);
router.delete("/appointments/:id", appointementController.delete);
router.delete("/appointments", appointementController.deleteAll);
router.put("/appointments/:id/archive", appointementController.archive);
router.put("/appointments/:id/completed", appointementController.completed);
router.post("/appointments/:id/confirm", apptActions.confirm);
router.post("/appointments/:id/check-in", apptActions.checkIn);
router.post("/appointments/:id/check-out", apptActions.checkOut);
router.post("/appointments/:id/cancel", apptActions.cancel);
router.put("/appointments/:id/assign-doctor", apptActions.assignDoctor);
router.put("/appointments/:id/assign-room", apptActions.assignRoom);

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

const todoController = require("../controllers/api/todo.controllers.js");

router.post("/todos", todoController.create);
router.get("/todos", todoController.findAll);
router.get("/todos/:id", todoController.findOne);
router.put("/todos/:id", todoController.update);
router.delete("/todos/:id", todoController.delete);
router.delete("/todos", todoController.deleteAll);

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
router.post("/ai/voice-notes", memUpload.single("audio"), doctorAI.voiceNotes);
router.post("/ai/performance-insights", doctorAI.performanceInsights);
// --- End AI Routes


const operationAI = require("../controllers/api/operation.controller.js");
router.post("/ai/surgery-assistant", operationAI.surgeryAssistant);

const emailController = require('../controllers/api/email.controllers');
router.post('/send-email-with-attachment', upload.single('attachment'), emailController.sendEmailWithAttachment);

// ── Super Admin: Authentication ────────────────────────────────────────────
const authController = require("../controllers/api/auth.controllers");
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);
router.put("/auth/change-password", authController.changePassword);

// ── Super Admin: Tenant / Clinic management ────────────────────────────────
router.put("/clinics/:id/suspend", clinicController.suspend);
router.put("/clinics/:id/unsuspend", clinicController.unsuspend);

// ── Super Admin: User management ──────────────────────────────────────────
router.put("/users/:id/disable", userController.disable);
router.put("/users/:id/enable", userController.enable);
router.put("/users/:id/permissions", userController.assignPermissions);
// POST /users/:id/reset-password  –  admin sets a new password without needing the old one
router.post("/users/:id/reset-password", userController.adminResetPassword);

// POST /users/:id/impersonate  –  superadmin impersonates a user (audit-logged)
router.post("/users/:id/impersonate", userController.impersonate);

// ── Super Admin: Subscription plans ───────────────────────────────────────
const subscriptionController = require("../controllers/api/subscription.controllers");
router.get("/subscription-plans", subscriptionController.getAllPlans);
router.post("/subscription-plans", subscriptionController.createPlan);
router.put("/subscription-plans/:id", subscriptionController.updatePlan);
router.delete("/subscription-plans/:id", subscriptionController.deletePlan);

// ── Super Admin: Clinic subscriptions ─────────────────────────────────────
router.get("/clinic-subscriptions/:clinicId", subscriptionController.getClinicSubscription);
router.post("/clinic-subscriptions", subscriptionController.createClinicSubscription);
router.put("/clinic-subscriptions/:clinicId/plan", subscriptionController.changePlan);
router.put("/clinic-subscriptions/:clinicId/trial", subscriptionController.manageTrial);
router.put("/clinic-subscriptions/:clinicId/cancel", subscriptionController.cancelSubscription);

// ── Super Admin: Coupons ───────────────────────────────────────────────────
const couponController = require("../controllers/api/coupon.controllers");
router.get("/coupons", couponController.getAll);
router.get("/coupons/validate/:code", couponController.validate);
router.get("/coupons/:id", couponController.getOne);
router.post("/coupons", couponController.create);
router.put("/coupons/:id", couponController.update);
router.delete("/coupons/:id", couponController.remove);

// ── Super Admin: Refunds ───────────────────────────────────────────────────
const refundController = require("../controllers/api/refund.controllers");
router.get("/refunds", refundController.getAll);
router.get("/refunds/:id", refundController.getOne);
router.post("/refunds", refundController.create);
router.put("/refunds/:id/status", refundController.updateStatus);

// ── Super Admin: SaaS billing invoices ────────────────────────────────────
const saasBillingController = require("../controllers/api/saas.billing.controllers");
router.get("/saas-invoices", saasBillingController.getAll);
router.get("/saas-invoices/:id", saasBillingController.getOne);
router.post("/saas-invoices", saasBillingController.create);
router.put("/saas-invoices/:id/mark-paid", saasBillingController.markPaid);

// ── Super Admin: Platform settings ────────────────────────────────────────
const platformSettings = require("../controllers/api/platform.settings.controllers");
// SMS providers
router.get("/platform/sms-providers", platformSettings.getAllSmsProviders);
router.post("/platform/sms-providers", platformSettings.createSmsProvider);
router.put("/platform/sms-providers/:id", platformSettings.updateSmsProvider);
router.put("/platform/sms-providers/:id/activate", platformSettings.activateSmsProvider);
router.delete("/platform/sms-providers/:id", platformSettings.deleteSmsProvider);
// Payment gateways
router.get("/platform/payment-gateways", platformSettings.getAllGateways);
router.post("/platform/payment-gateways", platformSettings.createGateway);
router.put("/platform/payment-gateways/:id", platformSettings.updateGateway);
router.put("/platform/payment-gateways/:id/activate", platformSettings.activateGateway);
router.delete("/platform/payment-gateways/:id", platformSettings.deleteGateway);
// Storage
router.get("/platform/storage", platformSettings.getStorageConfig);
router.post("/platform/storage", platformSettings.saveStorageConfig);
router.put("/platform/storage/:id", platformSettings.updateStorageConfig);
// AI integrations
router.get("/platform/ai-config", platformSettings.getAiConfig);
router.put("/platform/ai-config", platformSettings.saveAiConfig);

// ── Super Admin: SaaS Analytics ───────────────────────────────────────────
const saasAnalytics = require("../controllers/api/saas.analytics.controllers");
router.get("/saas-analytics/dashboard", saasAnalytics.dashboard);
router.get("/saas-analytics/monthly-revenue", saasAnalytics.monthlyRevenue);
router.get("/saas-analytics/active-clinics", saasAnalytics.activeClinics);
router.get("/saas-analytics/active-users", saasAnalytics.activeUsers);
router.get("/saas-analytics/app-usage", saasAnalytics.appUsage);
router.get("/saas-analytics/failed-payments", saasAnalytics.failedPayments);
router.get("/saas-analytics/growth", saasAnalytics.growth);

// ── Clinic Locations ──────────────────────────────────────────────────────
const clinicLocCtrl = require("../controllers/api/clinic.location.controllers");
router.get("/clinic-locations", clinicLocCtrl.getAll);
router.get("/clinic-locations/:id", clinicLocCtrl.getOne);
router.post("/clinic-locations", clinicLocCtrl.create);
router.put("/clinic-locations/:id", clinicLocCtrl.update);
router.delete("/clinic-locations/:id", clinicLocCtrl.remove);
router.put("/clinic-locations/:id/set-main", clinicLocCtrl.setMain);

// ── Holidays ─────────────────────────────────────────────────────────────
const holidayCtrl = require("../controllers/api/holiday.controllers");
router.get("/holidays", holidayCtrl.getAll);
router.post("/holidays", holidayCtrl.create);
router.put("/holidays/:id", holidayCtrl.update);
router.delete("/holidays/:id", holidayCtrl.remove);

// ── Appointment Rules (booking + cancellation) ────────────────────────────
const apptRuleCtrl = require("../controllers/api/appointment.rule.controllers");
router.get("/appointment-rules", apptRuleCtrl.get);
router.post("/appointment-rules", apptRuleCtrl.save);

// ── Appointment Types ─────────────────────────────────────────────────────
const apptTypeCtrl = require("../controllers/api/appointment.type.controllers");
router.get("/appointment-types", apptTypeCtrl.getAll);
router.post("/appointment-types", apptTypeCtrl.create);
router.put("/appointment-types/:id", apptTypeCtrl.update);
router.delete("/appointment-types/:id", apptTypeCtrl.remove);

// ── Rooms / Chairs ────────────────────────────────────────────────────────
const roomCtrl = require("../controllers/api/room.controllers");
router.get("/rooms", roomCtrl.getAll);
router.post("/rooms", roomCtrl.create);
router.put("/rooms/:id", roomCtrl.update);
router.delete("/rooms/:id", roomCtrl.remove);
router.put("/rooms/:id/toggle", roomCtrl.toggleActive);

// ── Waitlist ──────────────────────────────────────────────────────────────
const waitlistCtrl = require("../controllers/api/waitlist.controllers");
router.get("/waitlist", waitlistCtrl.getAll);
router.post("/waitlist", waitlistCtrl.create);
router.put("/waitlist/:id", waitlistCtrl.update);
router.put("/waitlist/:id/notify", waitlistCtrl.notify);
router.delete("/waitlist/:id", waitlistCtrl.remove);

// ── Employee Invites ──────────────────────────────────────────────────────
const inviteCtrl = require("../controllers/api/employee.invite.controllers");
router.get("/employee-invites", inviteCtrl.getAll);
router.post("/employee-invites", inviteCtrl.invite);
router.get("/employee-invites/accept/:token", inviteCtrl.accept);
router.put("/employee-invites/:id/revoke", inviteCtrl.revoke);

// ── Clinic AI Config ──────────────────────────────────────────────────────
const clinicAICtrl = require("../controllers/api/clinic.ai.config.controllers");
router.get("/clinic-ai-config", clinicAICtrl.get);
router.post("/clinic-ai-config", clinicAICtrl.save);
router.get("/clinic-ai-usage", clinicAICtrl.getUsage);
router.post("/clinic-ai-usage", clinicAICtrl.logUsage);

// ── Patient Refunds ───────────────────────────────────────────────────────
const patientRefundCtrl = require("../controllers/api/patient.refund.controllers");
router.get("/patient-refunds", patientRefundCtrl.getAll);
router.get("/patient-refunds/:id", patientRefundCtrl.getOne);
router.post("/patient-refunds", patientRefundCtrl.create);
router.put("/patient-refunds/:id/status", patientRefundCtrl.updateStatus);

// ── Service Pricing ───────────────────────────────────────────────────────
const spCtrl = require("../controllers/api/service.price.controllers");
router.get("/service-prices", spCtrl.getAll);
router.post("/service-prices", spCtrl.create);
router.put("/service-prices/:id", spCtrl.update);
router.delete("/service-prices/:id", spCtrl.remove);

// ── Clinic Analytics ──────────────────────────────────────────────────────
const clinicAnalytics = require("../controllers/api/clinic.analytics.controllers");
router.get("/clinic-analytics/revenue-by-doctor", clinicAnalytics.revenueByDoctor);
router.get("/clinic-analytics/revenue-by-procedure", clinicAnalytics.revenueByProcedure);
router.get("/clinic-analytics/new-vs-returning", clinicAnalytics.newVsReturning);
router.get("/clinic-analytics/appointment-stats", clinicAnalytics.appointmentStats);
router.get("/clinic-analytics/financial-summary", clinicAnalytics.financialSummary);
router.get("/clinic-analytics/patient-retention", clinicAnalytics.patientRetention);
router.get("/clinic-analytics/outstanding-balances", clinicAnalytics.outstandingBalances);
router.get("/clinic-analytics/operational-dashboard", clinicAnalytics.operationalDashboard);

// ── Clinical Notes ────────────────────────────────────────────────────────
const cnCtrl = require("../controllers/api/clinical.note.controllers");
router.get("/clinical-notes", cnCtrl.getAll);
router.get("/clinical-notes/:id", cnCtrl.getOne);
router.post("/clinical-notes", cnCtrl.create);
router.put("/clinical-notes/:id", cnCtrl.update);
router.post("/clinical-notes/:id/sign", cnCtrl.sign);
router.post("/clinical-notes/:id/amend", cnCtrl.amend);
router.delete("/clinical-notes/:id", cnCtrl.remove);

// ── Periodontal Charts ────────────────────────────────────────────────────
const perio = require("../controllers/api/periodontal.chart.controllers");
router.get("/periodontal-charts/patient/:patientId", perio.getByPatient);
router.get("/periodontal-charts/exam-dates/:patientId", perio.getExamDates);
router.get("/periodontal-charts/exam", perio.getExam);
router.post("/periodontal-charts", perio.saveExam);

// ── Clinical Referrals ────────────────────────────────────────────────────
const crCtrl = require("../controllers/api/clinical.referral.controllers");
router.get("/clinical-referrals", crCtrl.getAll);
router.get("/clinical-referrals/:id", crCtrl.getOne);
router.post("/clinical-referrals", crCtrl.create);
router.put("/clinical-referrals/:id", crCtrl.update);
router.post("/clinical-referrals/:id/send", crCtrl.send);
router.delete("/clinical-referrals/:id", crCtrl.remove);

// ── Clinical Attachments ──────────────────────────────────────────────────
const caCtrl = require("../controllers/api/clinical.attachment.controllers");
const clinicalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = require("path").join(__dirname, "../uploads/clinical");
    require("fs").mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const uploadClinical = multer({ storage: clinicalStorage, limits: { fileSize: 20 * 1024 * 1024 } });
router.get("/clinical-attachments", caCtrl.getAll);
router.post("/clinical-attachments", uploadClinical.single("file"), caCtrl.upload);
router.delete("/clinical-attachments/:id", caCtrl.remove);

// ── Doctor Extended AI ────────────────────────────────────────────────────
const dAI = require("../controllers/api/doctor.ai.extended.controllers");
router.post("/ai/clinical-note-draft", dAI.generateClinicalNoteDraft);
router.post("/ai/soap-draft", dAI.generateSOAPDraft);
router.post("/ai/summarize-visits", dAI.summarizeVisits);
router.post("/ai/suggest-missing-docs", dAI.suggestMissingDocs);
router.post("/ai/patient-friendly-explanation", dAI.patientFriendlyExplanation);
router.post("/ai/post-treatment-instructions", dAI.postTreatmentInstructions);
router.post("/ai/follow-up-message", dAI.generateFollowUpMessage);
router.post("/ai/referral-letter", dAI.generateReferralLetter);
router.post("/ai/extract-document", dAI.extractDocumentInfo);
router.post("/ai/nl-patient-search", dAI.naturalLanguageSearch);

// ── Appointment Actions (check-in/out, confirm, cancel, assign) ───────────
// routes already registered above alongside CRUD to ensure correct ordering

// ── Admin Documents ───────────────────────────────────────────────────────
const adminDocCtrl = require("../controllers/api/admin.document.controllers");
const adminDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = require("path").join(__dirname, "../uploads/admin-docs");
    require("fs").mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const uploadAdminDoc = multer({ storage: adminDocStorage, limits: { fileSize: 20 * 1024 * 1024 } });
router.get("/admin-documents", adminDocCtrl.getAll);
router.get("/admin-documents/:id", adminDocCtrl.getOne);
router.post("/admin-documents", uploadAdminDoc.single("file"), adminDocCtrl.upload);
router.post("/admin-documents/:id/verify", adminDocCtrl.verify);
router.delete("/admin-documents/:id", adminDocCtrl.remove);

// ── Patient Forms ─────────────────────────────────────────────────────────
const pfCtrl = require("../controllers/api/patient.form.controllers");
router.get("/patient-forms", pfCtrl.getAll);
router.get("/patient-forms/:id", pfCtrl.getOne);
router.get("/patient-forms/token/:token", pfCtrl.getByToken);
router.post("/patient-forms", pfCtrl.create);
router.put("/patient-forms/:id", pfCtrl.update);
router.post("/patient-forms/:id/send", pfCtrl.send);
router.post("/patient-forms/submit/:token", pfCtrl.submitResponses);
router.delete("/patient-forms/:id", pfCtrl.remove);

// ── Communication ─────────────────────────────────────────────────────────
const commCtrl = require("../controllers/api/communication.controllers");
router.post("/communications/sms", commCtrl.sendSMS);
router.post("/communications/email", commCtrl.sendEmail);
router.post("/communications/appointment-reminder", commCtrl.sendAppointmentReminder);
router.post("/communications/confirmation", commCtrl.sendConfirmation);
router.post("/communications/recall", commCtrl.sendRecall);
router.post("/communications/payment-reminder", commCtrl.sendPaymentReminder);

// ── Reminders / Recalls ────────────────────────────────────────────────────
const reminderCtrl = require("../controllers/api/reminder.controllers");
router.get("/reminders",        reminderCtrl.getAll);
router.get("/reminders/:id",    reminderCtrl.getOne);
router.post("/reminders",       reminderCtrl.create);
router.put("/reminders/:id",    reminderCtrl.update);
router.delete("/reminders/:id", reminderCtrl.remove);

// ── Receipts ──────────────────────────────────────────────────────────────
const receiptCtrl = require("../controllers/api/receipt.controllers");
router.post("/receipts/generate", receiptCtrl.generateReceipt);
router.post("/receipts/email", receiptCtrl.emailReceipt);

// ── Accounting Reports ────────────────────────────────────────────────────
const acctCtrl = require("../controllers/api/accounting.report.controllers");
router.get("/accounting/daily-collections", acctCtrl.dailyCollections);
router.get("/accounting/monthly-report", acctCtrl.monthlyReport);
router.get("/accounting/production-vs-collections", acctCtrl.productionVsCollections);
router.get("/accounting/tax-report", acctCtrl.taxReport);
router.get("/accounting/payment-methods-breakdown", acctCtrl.paymentMethodsBreakdown);
router.get("/accounting/insurance-receivables", acctCtrl.insuranceReceivables);
router.get("/accounting/export/transactions", acctCtrl.exportTransactions);
router.get("/accounting/reconciliation/unreconciled", acctCtrl.getUnreconciled);
router.put("/accounting/reconciliation/bulk", acctCtrl.bulkReconcile);
router.put("/accounting/reconciliation/:id", acctCtrl.markReconciled);

// ── Insurance Claims ──────────────────────────────────────────────────────
const claimCtrl = require("../controllers/api/insurance.claim.controllers");
router.get("/insurance-claims/analytics", claimCtrl.analytics);
router.get("/insurance-claims", claimCtrl.getAll);
router.get("/insurance-claims/:id", claimCtrl.getOne);
router.post("/insurance-claims", claimCtrl.create);
router.put("/insurance-claims/:id", claimCtrl.update);
router.put("/insurance-claims/:id/status", claimCtrl.updateStatus);
router.post("/insurance-claims/:id/submit", claimCtrl.submit);
router.post("/insurance-claims/:id/resubmit", claimCtrl.resubmit);
router.post("/insurance-claims/:id/document", claimCtrl.addDocument);
router.delete("/insurance-claims/:id", claimCtrl.remove);

// ── Insurance AI ──────────────────────────────────────────────────────────
const insAI = require("../controllers/api/insurance.ai.controllers");
router.post("/ai/insurance/extract-info", insAI.extractInsuranceInfo);
router.post("/ai/insurance/detect-missing", insAI.detectMissingInfo);
router.post("/ai/insurance/draft-narrative", insAI.draftNarrative);
router.post("/ai/insurance/summarize-rejected", insAI.summarizeRejected);
router.post("/ai/insurance/find-incomplete", insAI.findIncomplete);
router.post("/ai/insurance/verify-eligibility", insAI.verifyEligibility);

// ── Case Acceptance ───────────────────────────────────────────────────────
const caseCtrl = require("../controllers/api/case.acceptance.controllers");
router.get("/case-acceptance/pipeline", caseCtrl.getPipeline);
router.get("/case-acceptance/follow-ups", caseCtrl.getFollowUps);
router.get("/case-acceptance", caseCtrl.getAll);
router.get("/case-acceptance/:id", caseCtrl.getOne);
router.post("/case-acceptance", caseCtrl.create);
router.put("/case-acceptance/:id", caseCtrl.update);
router.post("/case-acceptance/:id/present", caseCtrl.markPresented);
router.post("/case-acceptance/:id/accept", caseCtrl.recordAcceptance);
router.post("/case-acceptance/:id/reject", caseCtrl.recordRejection);
router.post("/case-acceptance/:id/defer", caseCtrl.defer);
router.post("/case-acceptance/:id/objection", caseCtrl.addObjection);
router.post("/case-acceptance/:id/call-summary", caseCtrl.addCallSummary);
router.delete("/case-acceptance/:id", caseCtrl.remove);

// ── Treatment Coordinator AI ──────────────────────────────────────────────
const txCoordAI = require("../controllers/api/treatment.coord.ai.controllers");
router.post("/ai/treatment-coord/summarize-objections", txCoordAI.summarizeObjections);
router.post("/ai/treatment-coord/suggest-follow-up-timing", txCoordAI.suggestFollowUpTiming);
router.post("/ai/treatment-coord/financing-explanation", txCoordAI.generateFinancingExplanation);
router.post("/ai/treatment-coord/call-summary", txCoordAI.createCallSummary);
router.post("/ai/treatment-coord/prioritize-follow-ups", txCoordAI.prioritizeFollowUps);

// ── Patient Portal ────────────────────────────────────────────────────────
const ppCtrl = require("../controllers/api/patient.portal.controllers");
router.get("/patient-portal/profile/:id", ppCtrl.getProfile);
router.put("/patient-portal/profile/:id", ppCtrl.updateProfile);
router.get("/patient-portal/appointments/:patientId", ppCtrl.getMyAppointments);
router.post("/patient-portal/appointments/request", ppCtrl.requestAppointment);
router.post("/patient-portal/appointments/:id/cancel", ppCtrl.cancelMyAppointment);
router.get("/patient-portal/invoices/:patientId", ppCtrl.getMyInvoices);
router.get("/patient-portal/treatment-plans/:patientId", ppCtrl.getMyTreatmentPlans);
router.get("/patient-portal/education", ppCtrl.getEducation);
router.get("/patient-portal/education/:id", ppCtrl.getEducationItem);
router.post("/patient-portal/education", ppCtrl.createEducation);
router.put("/patient-portal/education/:id", ppCtrl.updateEducation);
router.delete("/patient-portal/education/:id", ppCtrl.deleteEducation);
router.get("/patient-portal/surveys", ppCtrl.getAllSurveys);
router.post("/patient-portal/surveys/send", ppCtrl.sendSurvey);
router.get("/patient-portal/surveys/token/:token", ppCtrl.getSurveyByToken);
router.post("/patient-portal/surveys/submit/:token", ppCtrl.submitSurvey);

// ── Patient AI ────────────────────────────────────────────────────────────
const patientPortalAI = require("../controllers/api/patient.ai.controllers");
router.post("/ai/patient/faq", patientPortalAI.answerFAQ);
router.post("/ai/patient/prepare-for-appointment", patientPortalAI.prepareForAppointment);
router.post("/ai/patient/explain-document", patientPortalAI.explainDocument);
router.post("/ai/patient/navigate-portal", patientPortalAI.navigatePortal);
router.post("/ai/patient/schedule-help", patientPortalAI.scheduleHelp);
router.post("/ai/patient/chat", patientPortalAI.chat);

// ── Treatment Coordinator AI – extra endpoints ────────────────────────────
router.post("/ai/treatment-coord/patient-friendly-explanation", txCoordAI.patientFriendlyExplanation);
router.post("/ai/treatment-coord/follow-up-message",           txCoordAI.generateFollowUpMessage);

// ── Audit Logs ────────────────────────────────────────────────────────────
const auditLogCtrl = require("../controllers/api/audit.log.controllers");
router.get("/audit-logs",     auditLogCtrl.getAll);
router.get("/audit-logs/:id", auditLogCtrl.getOne);
router.delete("/audit-logs",  auditLogCtrl.purge);

// ── Support Tickets ───────────────────────────────────────────────────────
const ticketCtrl = require("../controllers/api/support.ticket.controllers");
router.get("/support-tickets",           ticketCtrl.getAll);
router.get("/support-tickets/:id",       ticketCtrl.getOne);
router.post("/support-tickets",          ticketCtrl.create);
router.put("/support-tickets/:id",       ticketCtrl.update);
router.put("/support-tickets/:id/status",ticketCtrl.updateStatus);
router.post("/support-tickets/:id/reply",ticketCtrl.reply);
router.delete("/support-tickets/:id",    ticketCtrl.remove);

// ── Vitals ────────────────────────────────────────────────────────────────
const vitalsCtrl = require("../controllers/api/vitals.controllers");
router.get("/vitals",      vitalsCtrl.getAll);
router.get("/vitals/:id",  vitalsCtrl.getOne);
router.post("/vitals",     vitalsCtrl.create);
router.put("/vitals/:id",  vitalsCtrl.update);
router.delete("/vitals/:id", vitalsCtrl.remove);

// ── Clinic Payment Methods ────────────────────────────────────────────────
const pmCtrl = require("../controllers/api/clinic.payment.method.controllers");
router.get("/clinic-payment-methods",              pmCtrl.getAll);
router.get("/clinic-payment-methods/:id",          pmCtrl.getOne);
router.post("/clinic-payment-methods",             pmCtrl.create);
router.put("/clinic-payment-methods/:id",          pmCtrl.update);
router.put("/clinic-payment-methods/:id/default",  pmCtrl.setDefault);
router.delete("/clinic-payment-methods/:id",       pmCtrl.remove);

// ── Notification Templates ────────────────────────────────────────────────
const ntCtrl = require("../controllers/api/notification.template.controllers");
router.get("/notification-templates",      ntCtrl.getAll);
router.get("/notification-templates/:id",  ntCtrl.getOne);
router.post("/notification-templates",     ntCtrl.create);
router.put("/notification-templates/:id",  ntCtrl.update);
router.delete("/notification-templates/:id", ntCtrl.remove);

// ── Patient Portal – new endpoints ───────────────────────────────────────
const ppCtrlExt = require("../controllers/api/patient.portal.controllers");
router.put("/patient-portal/appointments/:id/reschedule",   ppCtrlExt.rescheduleMyAppointment);
router.get("/patient-portal/prescriptions/:patientId",      ppCtrlExt.getMyPrescriptions);
router.get("/patient-portal/waitlist/:patientId",           ppCtrlExt.getMyWaitlist);
router.post("/patient-portal/waitlist",                     ppCtrlExt.joinWaitlist);
router.delete("/patient-portal/waitlist/:id",               ppCtrlExt.leaveWaitlist);
router.get("/patient-portal/payments/:patientId",           ppCtrlExt.getMyPayments);
router.post("/patient-portal/payments",                     ppCtrlExt.initiatePayment);
router.put("/patient-portal/payments/:id/confirm",          ppCtrlExt.confirmPayment);

module.exports = router;
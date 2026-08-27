var User = require("../models/user.models.js")
var sequelize = require("../db/init.sequelize")
var Sequelize = require('sequelize');
var seeds = require("./seeds.sequelize");
const Patient = require("../models/patient.models.js");
const ToDo = require("../models/todo.models.js");
const Appointement = require("../models/appointement.models.js");
const Expense = require("../models/expense.models.js");
const Income = require("../models/income.models.js");
const Medicament = require("../models/medicament.models.js");
const Payment = require("../models/payment.models.js");
const Preferences = require("../models/preference.models.js");
const Prescription = require("../models/prescription.models.js");
const Message = require("../models/message.models.js");
const LabTest = require("../models/labtest.models");
const Invoice = require("../models/invoice.models.js");
const MedicamentCategory = require("../models/medicament.category.models.js");
const MedicamentManufacture = require("../models/medicament.manufactue.models.js");
const Note = require("../models/note.models.js");
const Certificate = require("../models/certificate.models.js");
const CertificateTemplate = require("../models/certificate.template.models.js");
const HomePage = require("../models/home.page.models.js");
const ServicePage = require("../models/service.page.models");
const BlogPage = require("../models/blog.page.models");
const OpeningHoursPage = require("../models/openinghours.page.models");
const ContactPage = require("../models/contact.page.models");
const TestimonialsPage = require("../models/testimonials.page.models");
var SystemSettings = require("../models/settings/system.settings.models.js")
var DashboardSettings = require("../models/settings/dashboard.settings.models.js")
var EmailSettings = require("../models/settings/email.settings.models.js")
var EmailTemplateSettings = require("../models/settings/email.template.settings.models.js")
var FooterSettings = require("../models/settings/footer.settings.models.js")
var HeaderSettings = require("../models/settings/header.settings.models.js")
var LocalisationSettings = require("../models/settings/localisation.settings.models.js")
var NotificationSettings = require("../models/settings/notification.settings.models.js")
var Case = require("../models/case.models.js");
const Clinic = require("../models/clinic.models.js");
const Consultation = require("../models/consultation.models.js");
const DentalImaging = require("../models/dentalimg.models.js");
const Diagnosis = require("../models/diagnostic.models.js");
const Doctor = require("../models/doctor.models.js");
const EquipmentMaintenance = require("../models/equipement.models.js");
const Referral = require("../models/emergency.models.js");
const Insurance = require("../models/insurance.models.js");
const { LoyaltyProgram } = require("../models/loyalty.models.js");
const LegalCompliance = require("../models/legal.models.js");
const MarketingCRM = require("../models/marketing.models.js");
const TreatmentPlan = require("../models/treatementplan.models.js");
const DentalMembership = require("../models/membership.models.js");
const Operation = require("../models/operation.models.js");
const Procedure = require("../models/procedure.models.js");
const Staff = require("../models/staff.models.js");
const InventoryItem = require("../models/inventory.models.js");
const { Settings, addSettingsData } = require("../models/settings.models.js");
const { insertDummyTelemedicine } = require("../models/telemedecine.models.js");

// ── New models (auto-create tables on sync) ───────────────────────────────
require("../models/audit.log.models");
require("../models/support.ticket.models");
require("../models/vitals.models");
require("../models/clinic.payment.method.models");
require("../models/notification.template.models");

const EducationalContent = require("../models/educational.content.models");
const CaseAcceptance     = require("../models/case.acceptance.models");
const InsuranceClaim     = require("../models/insurance.claim.models");
const Waitlist           = require("../models/waitlist.models");
const PatientForm        = require("../models/patient.form.models");
const AdminDocument      = require("../models/admin.document.models");
const ServicePrice       = require("../models/service.price.models");
const ClinicalNote       = require("../models/clinical.note.models");
const ClinicalReferral   = require("../models/clinical.referral.models");
const PatientRefund      = require("../models/patient.refund.models");
const Holiday            = require("../models/holiday.models");
const Room               = require("../models/room.models");
const EmployeeInvite     = require("../models/employee.invite.models");
const ClinicLocation     = require("../models/clinic.location.models");
const Reminder           = require("../models/reminder.models");
const ClinicPaymentMethod = require("../models/clinic.payment.method.models");

sequelize.sync().then(async function () {

    DashboardSettings.create(seeds.getDashboardSettings())
    EmailSettings.create(seeds.getEmailSettings())
    FooterSettings.create(seeds.getFooterSettings())
    HeaderSettings.create(seeds.getHeaderSettings())
    LocalisationSettings.create(seeds.getLocalisationSettings())
    NotificationSettings.create(seeds.getNotificationSettings())
    SystemSettings.create(seeds.getSystemSettings())
    Patient.insertPatients()
    Case.addDummyData()
    Certificate.insertDummyCertificates()
    MedicamentCategory.insertDummyCategories()
    Clinic.insertDummyClinics()
    Consultation.insertDummyConsultations()
    DentalImaging.insertDummyDentalImaging()
    Diagnosis.insertDummyDiagnoses()
    Doctor.insertDummyDoctors()
    EquipmentMaintenance.insertDummyEquipment()
    Referral.insertDummyReferrals()
    Expense.insertDummyExpenses()
    Income.insertDummyIncomes()
    Insurance.insertDummyInsurances()
    LabTest.insertDummyLabTests()
    LoyaltyProgram.insertDummyLoyaltyPrograms()
    LegalCompliance.insertDummyLegalCompliances()
    MarketingCRM.addDummyMarketingData()
    TreatmentPlan.insertDummyTreatmentPlans()
    DentalMembership.insertDummyMemberships()
    Medicament.createDummyMedicament()
    MedicamentManufacture.createDummyMedicamentManufacture()
    Operation.createDummyOperation()
    Procedure.createDummyProcedure()
    HomePage.create(seeds.homePageSeed)
    ServicePage.create(seeds.servicePageSeed)
    BlogPage.create(seeds.blogPageSeed)
    OpeningHoursPage.create(seeds.schedulePageSeed)
    ContactPage.create(seeds.contactPageSeed)
    TestimonialsPage.create(seeds.testimonialsSeed)
    Prescription.insertDummyPrescriptions()
    InventoryItem.insertDummyInventory()
    Clinic.insertDummyClinics()
    await addSettingsData()
    await Appointement.insertRealAppointment()
    Invoice.insertDummyInvoice()
    insertDummyTelemedicine()
    User.addSeedUsers(seeds.userSeeds)

    // ── Extended seed data ────────────────────────────────────────────────
    const bulkInsertIgnore = (Model, rows) =>
        Model.bulkCreate(rows, { ignoreDuplicates: true }).catch(() => {});

    bulkInsertIgnore(Message, seeds.messagesSeeds);
    bulkInsertIgnore(EducationalContent, seeds.educationalContentSeeds);
    bulkInsertIgnore(Payment, seeds.paymentSeeds);
    bulkInsertIgnore(CaseAcceptance, seeds.caseAcceptanceSeeds);
    bulkInsertIgnore(InsuranceClaim, seeds.insuranceClaimSeeds);
    bulkInsertIgnore(PatientRefund, seeds.patientRefundSeeds);
    bulkInsertIgnore(Waitlist, seeds.waitlistSeeds);
    bulkInsertIgnore(PatientForm, seeds.patientFormSeeds);
    bulkInsertIgnore(AdminDocument, seeds.adminDocumentSeeds);
    bulkInsertIgnore(ClinicLocation, seeds.clinicLocationSeeds);
    bulkInsertIgnore(Holiday, seeds.holidaySeeds);
    bulkInsertIgnore(Room, seeds.roomSeeds);
    bulkInsertIgnore(EmployeeInvite, seeds.employeeInviteSeeds);
    bulkInsertIgnore(ServicePrice, seeds.servicePriceSeeds);
    bulkInsertIgnore(ClinicalNote, seeds.clinicalNoteSeeds);
    bulkInsertIgnore(ClinicalReferral, seeds.clinicalReferralSeeds);
    bulkInsertIgnore(ClinicPaymentMethod, seeds.clinicPaymentMethodSeeds);
    bulkInsertIgnore(Reminder, seeds.reminderRecallSeeds);

}).then(function (res) {
    console.log(res);
});


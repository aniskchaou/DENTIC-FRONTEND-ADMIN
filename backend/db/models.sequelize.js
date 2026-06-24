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

}).then(function (res) {
    console.log(res);
});





  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

var EmergencyHandling = sequelize.define("emergency_handling", {

  patientId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "patients", // Assuming patients are stored in a table
    //   key: "id",
    // },
  },
  emergencyType: {
    type: Sequelize.ENUM("Severe Pain", "Trauma", "Infection", "Other"),
    allowNull: false,
  },
  reportedBy: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "users", // Assuming the report is made by a staff member or patient
    //   key: "id",
    // },
  },
  priorityLevel: {
    type: Sequelize.ENUM("High", "Medium", "Low"),
    allowNull: false,
  },
  responseTime: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  assignedDoctorId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "doctors", // Assuming doctors are stored in a table
    //   key: "id",
    // },
  },
  treatmentStatus: {
    type: Sequelize.ENUM("Pending", "In Progress", "Completed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = EmergencyHandling;
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require("sequelize");

var EmergencyCase = sequelize.define("emergency_case", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "patients", // Assuming patients are stored in a table
    //   key: "id",
    // },
  },
  reportedBy: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "users", // Assuming report is made by staff or patient
    //   key: "id",
    // },
  },
  severityLevel: {
    type: Sequelize.ENUM("Mild", "Moderate", "Severe", "Critical"),
    allowNull: false,
  },
  symptoms: {
    type: Sequelize.ARRAY(Sequelize.STRING), // Array of symptoms reported by the patient
    allowNull: true,
  },
  treatmentStatus: {
    type: Sequelize.ENUM("Pending", "In Progress", "Completed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  assignedDoctorId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "doctors", // Assuming doctors are stored in a table
    //   key: "id",
    // },
  },
  arrivalTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  treatmentStartTime: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  treatmentEndTime: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = EmergencyCase;
var sequelize = require("../db/init.sequelize.js");
var Sequelize = require("sequelize");

var Referral = sequelize.define("referral", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "patients", // Assuming patients are stored in a table
    //   key: "id",
    // },
  },
  referredByDoctorId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "doctors", // Referring doctor
    //   key: "id",
    // },
  },
  referredToSpecialistId: {
    type: Sequelize.UUID,
    allowNull: false,
    // references: {
    //   model: "doctors", // Specialist doctor
    //   key: "id",
    // },
  },
  reasonForReferral: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  specialistClinicId: {
    type: Sequelize.UUID,
    allowNull: true,
    // references: {
    //   model: "clinics", // Assuming clinics are stored in a table
    //   key: "id",
    // },
  },
  status: {
    type: Sequelize.ENUM("Pending", "Accepted", "Rejected", "Completed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  appointmentDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  feedbackFromSpecialist: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Referral;

/**
 * Insert dummy emergency handlings for testing/demo purposes.
 */
EmergencyHandling.insertDummyEmergencyHandlings = async function() {
  const dummyHandlings = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      emergencyType: "Severe Pain",
      reportedBy: "22222222-bbbb-cccc-dddd-222222222222",
      priorityLevel: "High",
      responseTime: 15.5,
      assignedDoctorId: "33333333-cccc-dddd-eeee-333333333333",
      treatmentStatus: "Completed"
    },
    {
      patientId: "44444444-dddd-eeee-ffff-444444444444",
      emergencyType: "Infection",
      reportedBy: "55555555-eeee-ffff-aaaa-555555555555",
      priorityLevel: "Medium",
      responseTime: 30.0,
      assignedDoctorId: "66666666-ffff-aaaa-bbbb-666666666666",
      treatmentStatus: "In Progress"
    }
  ];
  return await EmergencyHandling.bulkCreate(dummyHandlings);
};

/**
 * Insert dummy emergency cases for testing/demo purposes.
 */
EmergencyCase.insertDummyEmergencyCases = async function() {
  const dummyCases = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      reportedBy: "22222222-bbbb-cccc-dddd-222222222222",
      severityLevel: "Severe",
      symptoms: ["Swelling", "Fever", "Pain"],
      treatmentStatus: "In Progress",
      assignedDoctorId: "33333333-cccc-dddd-eeee-333333333333",
      arrivalTime: new Date("2025-07-01T08:00:00Z"),
      treatmentStartTime: new Date("2025-07-01T08:30:00Z"),
      treatmentEndTime: null,
      notes: "Patient arrived with severe swelling and fever."
    },
    {
      patientId: "44444444-dddd-eeee-ffff-444444444444",
      reportedBy: "55555555-eeee-ffff-aaaa-555555555555",
      severityLevel: "Critical",
      symptoms: ["Unconscious", "Bleeding"],
      treatmentStatus: "Pending",
      assignedDoctorId: "66666666-ffff-aaaa-bbbb-666666666666",
      arrivalTime: new Date("2025-07-02T10:15:00Z"),
      treatmentStartTime: null,
      treatmentEndTime: null,
      notes: "Patient brought in unconscious after accident."
    }
  ];
  return await EmergencyCase.bulkCreate(dummyCases);
};

/**
 * Insert dummy referrals for testing/demo purposes.
 */
Referral.insertDummyReferrals = async function() {
  const dummyReferrals = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      referredByDoctorId: "33333333-cccc-dddd-eeee-333333333333",
      referredToSpecialistId: "77777777-aaaa-bbbb-cccc-777777777777",
      reasonForReferral: "Suspected oral cancer, needs specialist evaluation.",
      specialistClinicId: "88888888-bbbb-cccc-dddd-888888888888",
      status: "Pending",
      appointmentDate: new Date("2025-07-10T09:00:00Z"),
      feedbackFromSpecialist: null
    },
    {
      patientId: "44444444-dddd-eeee-ffff-444444444444",
      referredByDoctorId: "66666666-ffff-aaaa-bbbb-666666666666",
      referredToSpecialistId: "99999999-cccc-dddd-eeee-999999999999",
      reasonForReferral: "Complex root canal required.",
      specialistClinicId: null,
      status: "Accepted",
      appointmentDate: new Date("2025-07-15T14:00:00Z"),
      feedbackFromSpecialist: "Patient accepted for treatment. Will schedule surgery."
    }
  ];
  return await Referral.bulkCreate(dummyReferrals);
};
module.exports.insertDummyReferrals = Referral.insertDummyReferrals;
module.exports.insertDummyEmergencyCases = EmergencyCase.insertDummyEmergencyCases;
module.exports.insertDummyEmergencyHandlings = EmergencyHandling.insertDummyEmergencyHandlings;

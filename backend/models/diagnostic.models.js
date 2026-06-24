var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Diagnosis = sequelize.define("diagnosis", {

  patientId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Reference to the patient",
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Reference to the doctor who made the diagnosis",
  },
  diagnosisDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "Date of diagnosis",
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Name of the diagnosed condition",
  },
  severity: {
    type: DataTypes.ENUM("Mild", "Moderate", "Severe"),
    allowNull: true,
    comment: "Severity level of the condition",
  },
  recommendedTreatmentPlanId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: "Reference to a recommended treatment plan, if applicable",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Additional details about the diagnosis",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

/**
 * Insert dummy diagnoses for testing/demo purposes.
 */
Diagnosis.insertDummyDiagnoses = async function() {
  const dummyDiagnoses = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      doctorId: "22222222-bbbb-cccc-dddd-222222222222",
      diagnosisDate: new Date("2025-07-01T09:00:00Z"),
      condition: "Dental Caries",
      severity: "Moderate",
      recommendedTreatmentPlanId: "33333333-cccc-dddd-eeee-333333333333",
      notes: "Caries observed on lower left molar. Recommend filling."
    },
    {
      patientId: "44444444-dddd-eeee-ffff-444444444444",
      doctorId: "55555555-eeee-ffff-aaaa-555555555555",
      diagnosisDate: new Date("2025-07-02T14:30:00Z"),
      condition: "Gingivitis",
      severity: "Mild",
      recommendedTreatmentPlanId: null,
      notes: "Mild gum inflammation. Advise improved oral hygiene."
    },
    {
      patientId: "66666666-ffff-aaaa-bbbb-666666666666",
      doctorId: "77777777-aaaa-bbbb-cccc-777777777777",
      diagnosisDate: new Date("2025-07-03T11:15:00Z"),
      condition: "Impacted Wisdom Tooth",
      severity: "Severe",
      recommendedTreatmentPlanId: "88888888-bbbb-cccc-dddd-888888888888",
      notes: "Extraction recommended. Patient experiencing pain and swelling."
    }
  ];
  return await Diagnosis.bulkCreate(dummyDiagnoses);
};

module.exports = Diagnosis;
module.exports.insertDummyDiagnoses = Diagnosis.insertDummyDiagnoses;

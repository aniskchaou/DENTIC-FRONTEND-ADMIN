/* 
var Prescription = sequelize.define('prescription', {
    patient: Sequelize.STRING,
    pression: Sequelize.STRING,
    temperature: Sequelize.STRING,
    problem: Sequelize.STRING,
    note: Sequelize.STRING,

});

{
    "Prescription": {
      "id": "UUID",
      "patientId": "UUID (Ref to Patient)",
      "doctorId": "UUID (Ref to Doctor)",
      "clinicId": "UUID (Ref to Clinic)",
      "medications": [
        {
          "medicationId": "UUID (Ref to Medicament)",
          "medicationName": "string",
          "dosage": "string (e.g., 500mg)",
          "frequency": "string (e.g., Twice a day)",
          "duration": "integer (Days)",
          "instructions": "string (e.g., Take after meals)"
        }
      ],
      "prescriptionDate": "timestamp",
      "validUntil": "timestamp",
      "refillAllowed": "Yes | No",
      "refillCount": "integer (if applicable)",
      "pharmacyId": "UUID (Optional, Ref to Preferred Pharmacy)",
      "digitalSignature": "string (Secure hash for authentication)",
      "status": "Active | Expired | Revoked",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  


module.exports = Prescription;  */


var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');
const Prescription = sequelize.define("prescription", {

  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the patient for whom the prescription is issued",
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the doctor who issued the prescription",
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the clinic where the prescription was issued",
  },
  medications: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: "List of medications prescribed with dosage, frequency, and instructions",
  },
  prescriptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "Timestamp when the prescription was issued",
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "Timestamp when the prescription expires",
  },
  refillAllowed: {
    type: DataTypes.ENUM("Yes", "No"),
    allowNull: false,
    comment: "Indicates if refills are allowed for the prescription",
  },
  refillCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Number of refills allowed (if applicable)",
  },
  digitalSignature: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Secure hash for the authentication of the prescription",
  },
  status: {
    type: DataTypes.ENUM("Active", "Expired", "Revoked"),
    allowNull: false,
    comment: "Status of the prescription",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the prescription was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the prescription was last updated",
  },
});

/* // Define relationships with other models
Prescription.associate = models => {
  // A prescription is associated with a patient, doctor, clinic, and potentially a pharmacy
  Prescription.belongsTo(models.Patient, { foreignKey: "patientId" });
  Prescription.belongsTo(models.Doctor, { foreignKey: "doctorId" });
  Prescription.belongsTo(models.Clinic, { foreignKey: "clinicId" });
  Prescription.belongsTo(models.Pharmacy, { foreignKey: "pharmacyId", allowNull: true });
}; */

/**
 * Insert dummy prescription records for testing/demo purposes.
 */
 insertDummyPrescriptions = async function() {
  const dummyPrescriptions = [
    {
      patientId: 1,
      doctorId: 1,
      clinicId: 1,
      medications: [
        {
          medicationId: 1,
          medicationName: "Amoxicillin",
          dosage: "500mg",
          frequency: "Twice a day",
          duration: 7,
          instructions: "Take after meals"
        }
      ],
      prescriptionDate: new Date("2025-07-01T09:00:00Z"),
      validUntil: new Date("2025-07-14T09:00:00Z"),
      refillAllowed: "Yes",
      refillCount: 1,
      pharmacyId: "55555555-eeee-ffff-aaaa-555555555555",
      digitalSignature: "abc123signature",
      status: "Active"
    },
    {
      patientId: 1,
      doctorId: 1,
      clinicId: 1,
      medications: [
        {
          medicationId: 1,
          medicationName: "Ibuprofen",
          dosage: "200mg",
          frequency: "Three times a day",
          duration: 5,
          instructions: "Take with water"
        }
      ],
      prescriptionDate: new Date("2025-07-02T10:30:00Z"),
      validUntil: new Date("2025-07-10T10:30:00Z"),
      refillAllowed: "No",
      refillCount: 0,
      pharmacyId: null,
      digitalSignature: "def456signature",
      status: "Active"
    }
  ];
  return await Prescription.bulkCreate(dummyPrescriptions);
};

module.exports = Prescription;
module.exports.insertDummyPrescriptions = insertDummyPrescriptions;

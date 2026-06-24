var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Patient = sequelize.define("patient", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Full name of the patient",
  },
  medicalRecordNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    comment: "Unique medical record number for the patient",
  },
  insuranceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Reference to the patient's insurance provider",
  },
  bloodType: {
    type: DataTypes.ENUM("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
    allowNull: true,
    comment: "Blood type of the patient",
  },
  allergies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    comment: "List of allergies the patient has",
  },
  medicalHistory: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Medical history of the patient, including conditions, diagnosis, and notes",
  },
  currentMedications: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Current medications being taken by the patient, including dosage, frequency, and prescribing doctor",
  },
  emergencyContact: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Emergency contact details for the patient",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Patient email address'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the patient record was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the patient record was last updated",
  },
});



async function insertPatients() {
  const patients = [
    {
      fullName: "John Doe",
      medicalRecordNumber: "MRN100015",
      insuranceId: 1,
      bloodType: "A+",
      allergies: ["Penicillin"],
      medicalHistory: [
        { condition: "Diabetes", diagnosedAt: "2018-01-15", notes: "Type 2" },
      ],
      currentMedications: [
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          prescribedBy: "1a2b3c4d-0000-4000-b000-000000000001",
        },
      ],
      emergencyContact: {
        name: "Alice Johnson",
        relationship: "Sister",
        phone: "+11123456701",
      },
      email: "kchaoauanis27@gmail.com",
    },
    {
      fullName: "Jane Smith",
      medicalRecordNumber: "MRN100025",
      insuranceId: null,
      bloodType: "B-",
      allergies: [],
      medicalHistory: [],
      currentMedications: [],
      emergencyContact: {
        name: "Bob Lee",
        relationship: "Father",
        phone: "+11123456702",
      },
      email: "kchaoauanis27@gmail.com",
    },
    {
      fullName: "Michael Brown",
      medicalRecordNumber: "MRN100035",
      insuranceId: 3,
      bloodType: "O+",
      allergies: ["Shellfish", "Dust"],
      medicalHistory: [
        { condition: "Hypertension", diagnosedAt: "2020-06-01", notes: "Stable" },
      ],
      currentMedications: [],
      emergencyContact: {
        name: "Karen Smith",
        relationship: "Mother",
        phone: "+11123456703",
      },
      email: "kchaoauanis27@gmail.com",
    },
    {
      fullName: "Emily Clark",
      medicalRecordNumber: "MRN100045",
      insuranceId: null,
      bloodType: "AB+",
      allergies: ["Pollen"],
      medicalHistory: [],
      currentMedications: [
        {
          name: "Claritin",
          dosage: "10mg",
          frequency: "Once daily",
          prescribedBy: "1a2b3c4d-0000-4000-b000-000000000002",
        },
      ],
      emergencyContact: {
        name: "Tom Blake",
        relationship: "Friend",
        phone: "+11123456704",
      },
      email: "kchaoauanis27@gmail.com",
    },
    {
      fullName: "Olivia White",
      medicalRecordNumber: "MRN100055",
      insuranceId: 5,
      bloodType: "O-",
      allergies: ["Latex"],
      medicalHistory: [
        { condition: "Eczema", diagnosedAt: "2019-09-12", notes: "Mild flare-ups" },
      ],
      currentMedications: [],
      emergencyContact: {
        name: "Lena Duke",
        relationship: "Spouse",
        phone: "+11123456705",
      },
      email: "kchaoauanis27@gmail.com",
    },
  ];

  try {
    await Patient.bulkCreate(patients, { validate: true });
    console.log("5 patients inserted successfully");
  } catch (err) {
    console.error("Error inserting patients:", err);
  }
}

module.exports = {
  Patient,
  insertPatients,
};
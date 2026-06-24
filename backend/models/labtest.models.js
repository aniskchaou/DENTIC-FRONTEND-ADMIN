
var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');
const LabTest = sequelize.define("labTest", {

  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    /* references: {
      model: "patients",
      key: "id",
    }, */
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    /* references: {
      model: "doctors",
      key: "id",
    }, */
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    /* references: {
      model: "clinics",
      key: "id",
    }, */
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sampleType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sampleCollectionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sampleCollectedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    /* references: {
      model: "lab_technicians",
      key: "id",
    }, */
  },
  testStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
  result: {
    type: DataTypes.TEXT, // Store result details dynamically
    allowNull: true,
  },
  laboratoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    /* references: {
      model: "laboratories",
      key: "id",
    }, */
  },
  testCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  insuranceCovered: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
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
 * Insert dummy lab tests for testing/demo purposes.
 */
LabTest.insertDummyLabTests = async function() {
  const dummyLabTests = [
    {
      patientId: 1,
      doctorId: 2,
      clinicId: 3,
      testName: "Dental X-Ray",
      testCategory: "Radiology",
      testDescription: "Panoramic dental X-ray to check for cavities and bone loss.",
      sampleType: "Other",
      sampleCollectionDate: new Date("2025-07-01T09:00:00Z"),
      sampleCollectedBy: 1,
      testStatus: "Completed",
      result: "",
      laboratoryId: 1,
      testCost: 120.00,
      insuranceCovered: "Yes",
      paymentStatus: "Paid"
    },
    {
      patientId: 1,
      doctorId: 2,
      clinicId: 3,
      testName: "Blood Test",
      testCategory: "Hematology",
      testDescription: "CBC to check for infection.",
      sampleType: "Blood",
      sampleCollectionDate: new Date("2025-07-02T10:30:00Z"),
      sampleCollectedBy: 4,
      testStatus: "Completed",
      result: "",
      laboratoryId: 1,
      testCost: 80.00,
      insuranceCovered: "No",
      paymentStatus: "Paid"
    },
    {
      patientId: 1,
      doctorId: 2,
      clinicId: 3,
      testName: "Saliva Test",
      testCategory: "Microbiology",
      testDescription: "Test for bacterial load in saliva.",
      sampleType: "Saliva",
      sampleCollectionDate: new Date("2025-07-03T11:15:00Z"),
      sampleCollectedBy: 1,
      testStatus: "Pending",
      result: null,
      laboratoryId: 1,
      testCost: 60.00,
      insuranceCovered: "Yes",
      paymentStatus: "Pending"
    }
  ];
  return await LabTest.bulkCreate(dummyLabTests);
};

module.exports = LabTest;

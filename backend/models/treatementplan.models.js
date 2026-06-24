
var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require("uuid");

const TreatmentPlan = sequelize.define("treatment_plan", {

  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the patient",
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the doctor",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "General description of the treatment plan",
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Estimated duration in days for the treatment",
  },
  status: {
    type: DataTypes.ENUM("Planned", "In Progress", "Completed", "Canceled"),
    defaultValue: "Planned",
    comment: "Status of the treatment plan",
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

module.exports = TreatmentPlan;

async function insertDummyTreatmentPlans() {
  try {
    const dummyData = [
      {
        patientId: 1,
        doctorId: 1,
        description: "Treatment plan for root canal therapy",
        estimatedDuration: 10,
        status: "Planned",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        patientId: 2,
        doctorId: 2,
        description: "Teeth whitening treatment plan",
        estimatedDuration: 5,
        status: "In Progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        patientId: 3,
        doctorId: 3,
        description: "Dental implant surgery plan",
        estimatedDuration: 30,
        status: "Completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        patientId: 4,
        doctorId: 4,
        description: "Orthodontic braces treatment",
        estimatedDuration: 180,
        status: "Planned",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        patientId: 5,
        doctorId: 5,
        description: "Periodontal disease management",
        estimatedDuration: 15,
        status: "Canceled",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await TreatmentPlan.bulkCreate(dummyData);
    console.log("✅ Dummy treatment plans inserted successfully.");
  } catch (error) {
    console.error("❌ Error inserting dummy treatment plans:", error);
  }
}

module.exports.insertDummyTreatmentPlans = insertDummyTreatmentPlans;
var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');

const MarketingCRM = sequelize.define("marketingCRM", {
  campaignName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  campaignType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ageGroup: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Target age group for campaign'
  },
  treatmentHistory: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Target treatment history for campaign'
  },
  lastVisitDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Target last visit date for campaign'
  },
  messageTemplate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  scheduleDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Scheduled",
    allowNull: true,
  },
  performanceMetrics: {
    type: DataTypes.STRING,  // Changed from JSONB to STRING
    allowNull: true,
    comment: 'Serialized JSON string for openRate, clickThroughRate, conversionRate'
  },
  insuranceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Target insurance ID for campaign'
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Target blood type for campaign'
  },
  allergies: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Target allergies for campaign (comma-separated)'
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

async function addDummyMarketingData() {
  try {


    await MarketingCRM.bulkCreate([
      {
        campaignName: "July Email Blast",
        campaignType: "Email",
        ageGroup: "25-40",
        treatmentHistory: "Orthodontics",
        lastVisitDate: new Date("2024-12-01"),
        insuranceId: 101,
        bloodType: "A+",
        allergies: "penicillin,latex",
        messageTemplate: "Don't miss our summer special!",
        scheduleDate: new Date("2025-07-10"),
        status: "Completed",
        performanceMetrics: JSON.stringify({
          openRate: null,
          clickThroughRate: null,
          conversionRate: null,
        }),
      },
      {
        campaignName: "Loyalty SMS Campaign",
        campaignType: "SMS",
        ageGroup: "30-50",
        treatmentHistory: "Dental Cleaning",
        lastVisitDate: new Date("2025-06-15"),
        insuranceId: 102,
        bloodType: "B-",
        allergies: "none",
        messageTemplate: "Thanks for being with us! Enjoy a 10% discount.",
        scheduleDate: new Date("2025-07-12"),
        status: "Completed",
      },
      {
        campaignName: "Back-to-School In-App Promo",
        campaignType: "In-App Notification",
        ageGroup: "18-30",
        treatmentHistory: "Whitening",
        lastVisitDate: new Date("2025-05-20"),
        insuranceId: 103,
        bloodType: "O+",
        allergies: "aspirin",
        messageTemplate: "Get your smile ready for the semester!",
        scheduleDate: new Date("2025-07-15"),
        status: "Completed",
        performanceMetrics: JSON.stringify({
          openRate: 75.3,
          clickThroughRate: 45.1,
          conversionRate: 12.4,
        }),
      },
      {
        campaignName: "Instagram Whitening Ad",
        campaignType: "Social Media",
        ageGroup: "20-35",
        treatmentHistory: "Cosmetic Dentistry",
        lastVisitDate: new Date("2025-04-10"),
        insuranceId: null,
        bloodType: "AB-",
        allergies: "ibuprofen",
        messageTemplate: "Brighten your smile this season!",
        scheduleDate: new Date("2025-07-08"),
        status: "Completed",
        performanceMetrics: JSON.stringify({
          openRate: null,
          clickThroughRate: 62.7,
          conversionRate: 9.8,
        }),
      },
    ]);

    console.log("Dummy data added successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
}

module.exports = MarketingCRM;
module.exports.addDummyMarketingData = addDummyMarketingData;


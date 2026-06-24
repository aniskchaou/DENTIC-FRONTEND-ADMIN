

  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');
  const Insurance = sequelize.define("insurance", {

    patientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // references: {
      //   model: "patients",
      //   key: "id",
      // },
    },
    providerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    policyNumber: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
    coverageDetails: {
      type: Sequelize.JSONB, // Storing consultation, treatment, and medication coverage as a JSON object
      allowNull: false,
    },
    validFrom: {
      type: Sequelize.DATEONLY, // Start date of coverage
      allowNull: false,
    },
    validUntil: {
      type: Sequelize.DATEONLY, // Expiration date of coverage
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Active", "Expired", "Pending Verification"),
      defaultValue: "Pending Verification",
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
  
  /**
   * Insert dummy insurance records for testing/demo purposes.
   */
  Insurance.insertDummyInsurances = async function() {
    const dummyInsurances = [
      {
        patientId: 1,
        providerName: "HealthSecure",
        policyNumber: "HS-2025-0001",
        coverageDetails: {
          consultationCoverage: 80,
          treatmentCoverage: 70,
          medicationCoverage: 60,
          maxAnnualCoverage: 5000.00
        },
        validFrom: "2025-01-01",
        validUntil: "2025-12-31",
        status: "Active"
      },
      {
        patientId: 2,
        providerName: "DentalCare Plus",
        policyNumber: "DC-2025-0002",
        coverageDetails: {
          consultationCoverage: 90,
          treatmentCoverage: 75,
          medicationCoverage: 65,
          maxAnnualCoverage: 7000.00
        },
        validFrom: "2025-03-15",
        validUntil: "2026-03-14",
        status: "Pending Verification"
      },
      {
        patientId: 3,
        providerName: "Smile Insurance",
        policyNumber: "SI-2024-0003",
        coverageDetails: {
          consultationCoverage: 85,
          treatmentCoverage: 80,
          medicationCoverage: 70,
          maxAnnualCoverage: 6000.00
        },
        validFrom: "2024-05-01",
        validUntil: "2025-04-30",
        status: "Expired"
      }
    ];
    return await Insurance.bulkCreate(dummyInsurances);
  };

  module.exports = Insurance;

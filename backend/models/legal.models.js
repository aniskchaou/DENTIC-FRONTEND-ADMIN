

  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const LegalCompliance = sequelize.define("legalCompliance", {

  patientId: {
    type: DataTypes.UUID,
    allowNull: true,
    // references: {
    //   model: "patients",
    //   key: "id",
    // },
  },
  documentType: {
    type: DataTypes.ENUM("Consent Form", "GDPR Agreement", "HIPAA Agreement"),
    allowNull: true,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  signedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true, // Expiry may not be applicable for all documents
  },
  status: {
    type: DataTypes.ENUM("Signed", "Pending", "Expired"),
    allowNull: true,
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
 * Insert dummy legal compliance records for testing/demo purposes.
 */
LegalCompliance.insertDummyLegalCompliances = async function() {
  const dummyLegalCompliances = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      documentType: "Consent Form",
      documentUrl: "https://example.com/docs/consent1.pdf",
      signedDate: new Date("2025-07-01T09:00:00Z"),
      expiryDate: null,
      status: "Signed"
    },
    {
      patientId: "22222222-bbbb-cccc-dddd-222222222222",
      documentType: "GDPR Agreement",
      documentUrl: "https://example.com/docs/gdpr1.pdf",
      signedDate: new Date("2025-06-15T10:30:00Z"),
      expiryDate: new Date("2026-06-15T10:30:00Z"),
      status: "Signed"
    },
    {
      patientId: "33333333-cccc-dddd-eeee-333333333333",
      documentType: "HIPAA Agreement",
      documentUrl: "https://example.com/docs/hipaa1.pdf",
      signedDate: null,
      expiryDate: null,
      status: "Pending"
    },
    {
      patientId: "44444444-dddd-eeee-ffff-444444444444",
      documentType: "Consent Form",
      documentUrl: "https://example.com/docs/consent2.pdf",
      signedDate: new Date("2024-05-01T08:00:00Z"),
      expiryDate: new Date("2025-05-01T08:00:00Z"),
      status: "Expired"
    }
  ];
  return await LegalCompliance.bulkCreate(dummyLegalCompliances);
};

module.exports = LegalCompliance;

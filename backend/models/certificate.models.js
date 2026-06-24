var sequelize = require("../db/init.sequelize.js");
var Sequelize = require("sequelize");

var Certificate = sequelize.define("certificate", {

  certificateNumber: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  },
  patientId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  clinicId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  certificateType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  issueDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  validUntil: {
    type: Sequelize.DATE,
    allowNull: true, // Optional expiry date
  },
  diagnosis: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  treatmentDetails: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  recommendations: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  attachments: {
    type: Sequelize.ARRAY(Sequelize.STRING), // Storing multiple attachment URLs
    allowNull: true,
  },
  signature: {
    type: Sequelize.TEXT, // Store image base64 string
    allowNull: false, // Digital signature image (base64)
  },
  status: {
    type: Sequelize.ENUM("Draft", "Issued", "Revoked"),
    allowNull: false,
    defaultValue: "Draft",
  },
  notes: {
    type: Sequelize.STRING,
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

/**
 * Insert dummy certificates for testing/demo purposes.
 */
Certificate.insertDummyCertificates = async function() {
  const dummyCertificates = [
    {
      certificateNumber: "CERT-2025001",
      patientId: 1,
      doctorId: 1,
      clinicId: 1,
      certificateType: "Medical Fitness",
      issueDate: new Date("2025-07-01"),
      validUntil: new Date("2025-12-31"),
      diagnosis: "Fit for work",
      treatmentDetails: "Routine checkup, no issues found.",
      recommendations: "Maintain healthy lifestyle.",
      attachments: ["https://example.com/fitness-report.pdf"],
      signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", // Example base64
      status: "Issued",
      notes: "Issued for employment purposes."
    },
    {
      certificateNumber: "CERT-2025002",
      patientId: 1,
      doctorId: 1,
      clinicId: 1,
      certificateType: "Sick Leave",
      issueDate: new Date("2025-07-10"),
      validUntil: new Date("2025-07-15"),
      diagnosis: "Acute dental infection",
      treatmentDetails: "Antibiotics prescribed, rest recommended.",
      recommendations: "Return for follow-up in 1 week.",
      attachments: [],
      signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", // Example base64
      status: "Issued",
      notes: "Patient advised to avoid strenuous activity."
    }
  ];
  return await Certificate.bulkCreate(dummyCertificates);
};

module.exports = Certificate;
module.exports.insertDummyCertificates = Certificate.insertDummyCertificates;

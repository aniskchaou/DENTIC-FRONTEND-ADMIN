var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

var AdminDocument = sequelize.define("admin_document", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  uploadedBy: { type: DataTypes.INTEGER, allowNull: true },
  clinicId: { type: DataTypes.INTEGER, allowNull: true },
  docType: {
    type: DataTypes.ENUM("consent", "insurance_card", "government_id", "referral_letter", "medical_record", "hipaa", "payment_agreement", "other"),
    defaultValue: "other",
  },
  fileName: { type: DataTypes.STRING, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING, allowNull: true },
  fileSize: { type: DataTypes.INTEGER, allowNull: true },
  description: { type: DataTypes.STRING, allowNull: true },
  // Verification workflow
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
  verifiedAt: { type: DataTypes.DATE, allowNull: true },
  verificationNote: { type: DataTypes.STRING, allowNull: true },
});

module.exports = AdminDocument;

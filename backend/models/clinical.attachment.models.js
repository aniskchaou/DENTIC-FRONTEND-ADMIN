var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

var ClinicalAttachment = sequelize.define("clinical_attachment", {
  entityType: {
    type: DataTypes.ENUM("clinical_note", "treatment_plan", "procedure", "referral", "patient"),
    allowNull: false,
  },
  entityId: { type: DataTypes.INTEGER, allowNull: false },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  uploadedBy: { type: DataTypes.INTEGER, allowNull: true },
  fileName: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING, allowNull: true, comment: "MIME type" },
  fileSize: { type: DataTypes.INTEGER, allowNull: true },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  category: {
    type: DataTypes.ENUM("image", "document", "xray", "lab_result", "consent", "other"),
    defaultValue: "document",
  },
  description: { type: DataTypes.STRING, allowNull: true },
});

module.exports = ClinicalAttachment;
